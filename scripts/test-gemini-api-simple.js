#!/usr/bin/env node

/**
 * Simple Gemini API test using fetch
 */

const API_KEY = process.argv[2] || process.env.VITE_GEMINI_API_KEY || process.env.GOOGLE_API_KEY;

if (!API_KEY) {
  console.error('❌ No API key provided');
  console.log('Usage: node scripts/test-gemini-api-simple.js [API_KEY]');
  process.exit(1);
}

console.log(`🔍 Testing API key: ${API_KEY.substring(0, 10)}...${API_KEY.substring(API_KEY.length - 4)}`);

// Test with different models
const models = [
  { name: 'Gemini 1.5 Flash', id: 'gemini-1.5-flash' },
  { name: 'Gemini 1.5 Pro', id: 'gemini-1.5-pro' },
  { name: 'Gemini Pro', id: 'gemini-pro' },
  { name: 'Gemini 2.0 Flash', id: 'gemini-2.0-flash-exp' }
];

async function testModel(modelName, modelId) {
  try {
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/${modelId}:generateContent?key=${API_KEY}`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          contents: [{
            parts: [{
              text: "Say 'Hello, API is working!' and nothing else."
            }]
          }]
        })
      }
    );

    const data = await response.json();
    
    if (response.ok && data.candidates) {
      const responseText = data.candidates[0]?.content?.parts?.[0]?.text || 'No response';
      console.log(`\n✅ ${modelName}: Working`);
      console.log(`   Response: ${responseText.trim()}`);
      return true;
    } else {
      console.log(`\n❌ ${modelName}: Not available`);
      if (data.error) {
        console.log(`   Error: ${data.error.message}`);
      }
      return false;
    }
  } catch (error) {
    console.log(`\n❌ ${modelName}: Error`);
    console.log(`   ${error.message}`);
    return false;
  }
}

async function main() {
  console.log('\n🧪 Testing Gemini API models...\n');
  
  let anyWorking = false;
  
  for (const model of models) {
    const works = await testModel(model.name, model.id);
    if (works) anyWorking = true;
    // Small delay between requests
    await new Promise(resolve => setTimeout(resolve, 1000));
  }
  
  if (anyWorking) {
    console.log('\n✅ Your API key is valid and working!');
    console.log('\n📚 Next steps:');
    console.log('   • Use the key in your Trade Ease app');
    console.log('   • Visit /settings/gemini-key-verification for detailed testing');
    console.log('   • Try the n8n assistant at /n8n-assistant');
  } else {
    console.log('\n❌ No models are accessible with this API key');
    console.log('\n💡 Possible issues:');
    console.log('   • API key might be invalid');
    console.log('   • Gemini API not enabled in your Google Cloud project');
    console.log('   • Rate limits or quota exceeded');
    console.log('\nGet a new key at: https://makersuite.google.com/app/apikey');
  }
}

main().catch(console.error); 