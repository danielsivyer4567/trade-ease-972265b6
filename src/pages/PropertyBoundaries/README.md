# Property Boundary Visualization

This feature allows users to search for property boundaries by address, visualize them, and save them to their account.

## Features

- Search for property boundaries by address
- Visualize property boundaries with measurements
- Save property boundaries to your account
- Upload GeoJSON files with property boundaries
- Manage saved property boundaries

## Setup

1. Install the required dependencies:

```bash
npm install @esri/arcgis-rest-auth @esri/arcgis-rest-feature-layer @esri/arcgis-rest-geocoding @esri/arcgis-rest-request
```

2. Create a `.env` file in the root of your project with the following variables:

```
NEXT_PUBLIC_ARCGIS_API_KEY=your-arcgis-api-key
```

You'll need to sign up for an ArcGIS Developer account to get an API key.

## Usage

### Searching for Property Boundaries

1. Navigate to the Property Boundaries page
2. Enter a full address in the search box (e.g., "300 Annerley Rd, Annerley, QLD")
3. Click "Search Address"
4. The property boundary will be displayed on the map if found

### Uploading GeoJSON Files

1. Click the upload button in the Property List section
2. Select a GeoJSON file containing property boundaries
3. The properties will be added to your list and saved to your account (if logged in)

### Visualizing Property Boundaries

The property boundary visualization shows:
- The property outline
- Measurements for each side of the property
- Address information

### Saving Property Boundaries

Property boundaries are automatically saved to your Supabase database when:
- You search for an address and find a boundary
- You upload a GeoJSON file with boundaries

You must be logged in to save property boundaries to your account.

## Development Notes

- Property boundaries are fetched from ArcGIS services
- The visualization uses HTML Canvas for rendering
- Property data is stored in Supabase

## Troubleshooting

- If property boundaries don't appear when searching, check that your ArcGIS API key is valid
- Make sure the address is complete and includes city/state information
- The service may not have data for all properties or regions 