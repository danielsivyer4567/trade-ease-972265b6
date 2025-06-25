// Simple script to test Google Maps API key
// Run with: node test-maps-key.cjs

const fs = require('fs');
const path = require('path');

// Read .env file
const envPath = path.join(__dirname, '.env');
let envContent = '';

try {
  envContent = fs.readFileSync(envPath, 'utf8');
} catch (error) {
  console.error('❌ Could not read .env file');
  process.exit(1);
}

// Extract Google Maps API key
const apiKeyMatch = envContent.match(/VITE_GOOGLE_MAPS_API_KEY=(.+)/);
const apiKey = apiKeyMatch ? apiKeyMatch[1].trim() : null;

if (!apiKey || apiKey === 'your-restricted-google-maps-api-key') {
  console.log('❌ Google Maps API key not configured');
  console.log('');
  console.log('📝 To configure your Google Maps API key:');
  console.log('1. Go to https://console.cloud.google.com/');
  console.log('2. Create a new project or select existing one');
  console.log('3. Enable billing (required even for free tier)');
  console.log('4. Enable these APIs:');
  console.log('   - Maps JavaScript API');
  console.log('   - Geocoding API');
  console.log('   - Places API');
  console.log('5. Create an API key in Credentials');
  console.log('6. Edit your .env file and replace:');
  console.log('   VITE_GOOGLE_MAPS_API_KEY=your-restricted-google-maps-api-key');
  console.log('   with your actual API key');
  console.log('');
  console.log('🔒 Recommended: Restrict the API key to localhost domains');
} else {
  console.log('✅ Google Maps API key found:', apiKey.substring(0, 10) + '...');
  console.log('');
  console.log('🧪 Testing API key...');
  
  // Test the API key using https module instead of fetch
  const https = require('https');
  const testUrl = `https://maps.googleapis.com/maps/api/geocode/json?address=Sydney,Australia&key=${apiKey}`;
  
  https.get(testUrl, (res) => {
    let data = '';
    
    res.on('data', (chunk) => {
      data += chunk;
    });
    
    res.on('end', () => {
      try {
        const result = JSON.parse(data);
        if (result.status === 'OK') {
          console.log('✅ API key is working correctly!');
          console.log('📍 Test geocoding successful for Sydney, Australia');
        } else {
          console.log('❌ API key test failed:', result.status);
          if (result.error_message) {
            console.log('Error message:', result.error_message);
          }
        }
      } catch (error) {
        console.log('❌ Error parsing response:', error.message);
      }
    });
  }).on('error', (error) => {
    console.log('❌ Network error testing API key:', error.message);
  });
} 