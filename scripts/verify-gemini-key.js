#!/usr/bin/env node

/**
 * Script to verify Gemini API key credentials
 * Usage: node scripts/verify-gemini-key.js [API_KEY]
 * 
 * If no API key is provided, it will look for VITE_GEMINI_API_KEY in .env
 */

import https from 'https';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Get API key from command line or environment
let apiKey = process.argv[2];

// If no API key provided, try to read from .env
if (!apiKey) {
  try {
    const envPath = path.join(__dirname, '..', '.env');
    const envContent = fs.readFileSync(envPath, 'utf8');
    const match = envContent.match(/VITE_GEMINI_API_KEY=(.+)/);
    if (match) {
      apiKey = match[1].trim();
    }
  } catch (error) {
    // .env file not found or couldn't be read
  }
}

if (!apiKey) {
  console.error('❌ No API key provided');
  console.log('\nUsage: node scripts/verify-gemini-key.js [API_KEY]');
  console.log('Or add VITE_GEMINI_API_KEY to your .env file');
  process.exit(1);
}

console.log('🔍 Verifying Gemini API Key...');
console.log(`📝 API Key: ${apiKey.substring(0, 10)}...${apiKey.substring(apiKey.length - 4)}`);

// Test the API key with a simple request
const testData = JSON.stringify({
  contents: [{
    parts: [{
      text: "Hello, this is a test. Reply with 'API key verified successfully.'"
    }]
  }]
});

const options = {
  hostname: 'generativelanguage.googleapis.com',
  path: `/v1beta/models/gemini-pro:generateContent?key=${apiKey}`,
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Content-Length': testData.length
  }
};

const req = https.request(options, (res) => {
  let data = '';

  res.on('data', (chunk) => {
    data += chunk;
  });

  res.on('end', () => {
    try {
      const response = JSON.parse(data);
      
      if (res.statusCode === 200 && response.candidates) {
        console.log('\n✅ API Key is VALID!');
        console.log('\n📊 Key Details:');
        console.log('   • Status: Active');
        console.log('   • Model Access: Gemini Pro ✓');
        
        // Test additional models
        testAdditionalModels(apiKey);
      } else if (response.error) {
        console.error('\n❌ API Key is INVALID');
        console.error(`   Error: ${response.error.message}`);
        
        if (response.error.code === 403) {
          console.log('\n💡 Common issues:');
          console.log('   • API key might be invalid or revoked');
          console.log('   • Gemini API might not be enabled in your Google Cloud project');
          console.log('   • Check if the key has proper permissions');
        }
      } else {
        console.error('\n❌ Unexpected response:', response);
      }
    } catch (error) {
      console.error('\n❌ Failed to parse response:', error.message);
      console.error('Raw response:', data);
    }
  });
});

req.on('error', (error) => {
  console.error('\n❌ Connection error:', error.message);
  console.log('\n💡 Check your internet connection and try again');
});

req.write(testData);
req.end();

// Test additional models
function testAdditionalModels(apiKey) {
  const models = [
    { name: 'Gemini Pro Vision', model: 'gemini-pro-vision' },
    { name: 'Gemini 2.0 Flash', model: 'gemini-2.0-flash-exp' }
  ];
  
  console.log('\n🔍 Testing additional models...');
  
  models.forEach((modelInfo, index) => {
    setTimeout(() => {
      testModel(apiKey, modelInfo.name, modelInfo.model);
    }, (index + 1) * 1000); // Delay to avoid rate limiting
  });
}

function testModel(apiKey, modelName, modelId) {
  const testData = JSON.stringify({
    contents: [{
      parts: [{
        text: "Test"
      }]
    }]
  });

  const options = {
    hostname: 'generativelanguage.googleapis.com',
    path: `/v1beta/models/${modelId}:generateContent?key=${apiKey}`,
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Content-Length': testData.length
    }
  };

  const req = https.request(options, (res) => {
    let data = '';

    res.on('data', (chunk) => {
      data += chunk;
    });

    res.on('end', () => {
      try {
        const response = JSON.parse(data);
        if (res.statusCode === 200 && response.candidates) {
          console.log(`   • ${modelName}: ✓ Available`);
        } else {
          console.log(`   • ${modelName}: ✗ Not available`);
        }
      } catch (error) {
        console.log(`   • ${modelName}: ✗ Error checking`);
      }
    });
  });

  req.on('error', () => {
    console.log(`   • ${modelName}: ✗ Connection error`);
  });

  req.write(testData);
  req.end();
}

// Add instructions at the end
setTimeout(() => {
  console.log('\n📚 Next Steps:');
  console.log('   1. If the key is invalid, get a new one at: https://makersuite.google.com/app/apikey');
  console.log('   2. Add it to your .env file as: VITE_GEMINI_API_KEY=your_key_here');
  console.log('   3. Or visit /settings/gemini-key-verification in the app for a detailed test');
}, 5000); 