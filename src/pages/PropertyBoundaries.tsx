import React, { useEffect, useRef } from 'react'
import mapboxgl from 'mapbox-gl'
import MapboxGeocoder from '@mapbox/mapbox-gl-geocoder'
import { bbox } from '@turf/bbox'
import { area as turfArea } from '@turf/turf'
import '@mapbox/mapbox-gl-geocoder/dist/mapbox-gl-geocoder.css'


mapboxgl.accessToken = 'pk.eyJ1IjoiZGFuaWVsc2l2eWVyIiwiYSI6ImNtYzFjNjVmbzBiOGwybW9oZ203cXdxZGMifQ.heFI2tJzQDKcGNLwgGH2Kw'

const PropertyBoundaries: React.FC = () => {
  const mapRef = useRef<mapboxgl.Map | null>(null)
  const allFeaturesRef = useRef<any[]>([])
  const tileCache = useRef(new Set<string>())
  const searchMarker = useRef<mapboxgl.Marker | null>(null)

  useEffect(() => {
    const map = new mapboxgl.Map({
      container: 'map',
      style: 'mapbox://styles/mapbox/satellite-streets-v12',
      center: [153.405, -28.005],
      zoom: 14
    })
    mapRef.current = map

    const geocoder = new MapboxGeocoder({
      accessToken: mapboxgl.accessToken,
      mapboxgl,
      marker: false,
      placeholder: 'Search for an address...'
    })
    map.addControl(geocoder, 'top-left')

    geocoder.on('result', (e) => {
      const coords = e.result.geometry.coordinates
      if (searchMarker.current) {
        searchMarker.current.setLngLat(coords)
      } else {
        searchMarker.current = new mapboxgl.Marker({ color: '#ff0000' })
          .setLngLat(coords)
          .addTo(map)
      }
      map.flyTo({ center: coords, zoom: 17 })
    })

    map.on('load', () => {
      map.addSource('parcels', {
        type: 'geojson',
        data: { type: 'FeatureCollection', features: [] }
      })

      map.addLayer({
        id: 'parcels-fill',
        type: 'fill',
        source: 'parcels',
        paint: {
          'fill-color': [
            'case',
            ['boolean', ['feature-state', 'selected'], false],
            '#ff9900',
            '#0080ff'
          ],
          'fill-opacity': 0.4
        }
      })

      map.addLayer({
        id: 'parcels-outline',
        type: 'line',
        source: 'parcels',
        paint: {
          'line-color': '#ffffff',
          'line-width': 1.2
        }
      })

      map.addSource('selected-points', {
        type: 'geojson',
        data: { type: 'FeatureCollection', features: [] }
      })

      map.addLayer({
        id: 'selected-points-layer',
        type: 'circle',
        source: 'selected-points',
        paint: {
          'circle-radius': 4,
          'circle-color': '#ff0000'
        }
      })

      const selectedFeatures = new Set<string>()
      const edgePopups = new Map<string, mapboxgl.Popup[]>()

      const updateTiles = async () => {
        const z = Math.floor(map.getZoom())
        const bounds = map.getBounds()

        const minX = long2tile(bounds.getWest(), z)
        const maxX = long2tile(bounds.getEast(), z)
        const minY = lat2tile(bounds.getNorth(), z)
        const maxY = lat2tile(bounds.getSouth(), z)

        const newFeatures: any[] = []

        for (let x = minX; x <= maxX; x++) {
          for (let y = minY; y <= maxY; y++) {
            const key = `${z}/${x}/${y}`
            if (tileCache.current.has(key)) continue
            tileCache.current.add(key)

            try {
              const res = await fetch(`/tiles/${z}/${x}/${y}/tile.geojson`)
              if (res.ok) {
                const tile = await res.json()
                newFeatures.push(...tile.features)
              }
            } catch (err) {
              console.warn(`Tile ${key} failed:`, err)
            }
          }
        }

        if (newFeatures.length > 0) {
          allFeaturesRef.current.push(...newFeatures)
          const src = map.getSource('parcels') as mapboxgl.GeoJSONSource
          src.setData({
            type: 'FeatureCollection',
            features: allFeaturesRef.current
          })
        }
      }

      map.on('moveend', updateTiles)
      updateTiles()

      map.on('click', 'parcels-fill', (e) => {
        const feature = e.features?.[0]
        if (!feature) return

        const id = feature.id || feature.properties?.objectid || JSON.stringify(feature.geometry)
        const bounds = bbox(feature)
        const width = bounds[2] - bounds[0]
        const height = bounds[3] - bounds[1]

        if (width > 0.005 || height > 0.005) {
          map.fitBounds(bounds as [number, number, number, number], { padding: 40, duration: 600 })
        }

        let rings: [number, number][][] = []
        if (feature.geometry.type === 'Polygon') {
          rings = feature.geometry.coordinates as [number, number][][]
        } else if (feature.geometry.type === 'MultiPolygon') {
          for (const poly of feature.geometry.coordinates as [number, number][][][]) {
            rings.push(...poly)
          }
        }

        const isSelected = selectedFeatures.has(id)
        map.setFeatureState({ source: 'parcels', id }, { selected: !isSelected })

        const pts = map.getSource('selected-points') as mapboxgl.GeoJSONSource

        if (isSelected) {
          selectedFeatures.delete(id)
          edgePopups.get(id)?.forEach(p => p.remove())
          edgePopups.delete(id)
          pts.setData({ type: 'FeatureCollection', features: [] })
          const info = document.getElementById('parcel-info')
          if (info) info.innerHTML = 'Click a parcel to see details.'
        } else {
          selectedFeatures.add(id)
          const popups: mapboxgl.Popup[] = []
          let edgeLengths: number[] = []
          let totalLength = 0
          const vertexPoints = []

          for (const ring of rings) {
            for (let i = 0; i < ring.length - 1; i++) {
              const [lng1, lat1] = ring[i]
              const [lng2, lat2] = ring[i + 1]
              const midpoint: [number, number] = [(lng1 + lng2) / 2, (lat1 + lat2) / 2]
              const dist = haversine(lat1, lng1, lat2, lng2)
              edgeLengths.push(dist)
              totalLength += dist

              vertexPoints.push({
                type: 'Feature',
                geometry: { type: 'Point', coordinates: [lng1, lat1] },
                properties: {}
              })

              const popup = new mapboxgl.Popup({
                closeButton: false,
                closeOnClick: false,
                className: 'edge-label'
              })
                .setLngLat(midpoint)
                .setHTML(`<span style="font-size:11px; color: #FF0000;">${dist.toFixed(1)} m</span>`)
                .addTo(map)

              popups.push(popup)
            }
          }

          pts.setData({ type: 'FeatureCollection', features: vertexPoints })
          edgePopups.set(id, popups)

          const polygonArea = turfArea(feature)
          const sidebar = document.getElementById('parcel-info')
          if (sidebar) {
            sidebar.innerHTML = `
              <p><strong>Area:</strong> ${polygonArea.toFixed(2)} m²</p>
              <p><strong>Perimeter:</strong> ${totalLength.toFixed(2)} m</p>
              <p><strong>Edges:</strong></p>
              <ul>
                ${edgeLengths.map((d, i) => `<li>Side ${i + 1}: ${d.toFixed(1)} m</li>`).join('')}
              </ul>
            `
          }
        }
      })
    })

    return () => map.remove()
  }, [])

  return (
    <div className="relative w-screen h-screen flex">
      <div className="w-64 bg-white text-black shadow-md p-4 overflow-y-auto text-sm" id="sidebar">
        <h2 className="text-lg font-bold mb-2">Parcel Info</h2>
        <div id="parcel-info">Click a parcel to see details.</div>
      </div>
      <div id="map" className="flex-1" />
    </div>
  )
}

function long2tile(lon: number, zoom: number): number {
  return Math.floor((lon + 180) / 360 * Math.pow(2, zoom))
}

function lat2tile(lat: number, zoom: number): number {
  const rad = lat * Math.PI / 180
  return Math.floor((1 - Math.log(Math.tan(rad) + 1 / Math.cos(rad)) / Math.PI) / 2 * Math.pow(2, zoom))
}

function haversine(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const R = 6371000
  const toRad = (d: number) => d * Math.PI / 180
  const dLat = toRad(lat2 - lat1)
  const dLon = toRad(lon2 - lon1)
  const a = Math.sin(dLat / 2) ** 2 +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) *
    Math.sin(dLon / 2) ** 2
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
}

export default PropertyBoundaries
