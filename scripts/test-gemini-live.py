import asyncio
import os
from google import genai

# Get API key from environment variable or use a placeholder
api_key = os.getenv("GEMINI_API_KEY", "YOUR_API_KEY_HERE")

if api_key == "YOUR_API_KEY_HERE":
    print("❌ Please set your Gemini API key:")
    print("   1. Set environment variable: export GEMINI_API_KEY='your-actual-key'")
    print("   2. Or replace 'YOUR_API_KEY_HERE' in this script with your actual key")
    print("\nTo get a Gemini API key:")
    print("   1. Go to https://makersuite.google.com/app/apikey")
    print("   2. Create a new API key")
    print("   3. Enable the Gemini API in your Google Cloud project")
    exit(1)

print(f"🔍 Testing Gemini API key: {api_key[:10]}...{api_key[-4:]}")

try:
    client = genai.Client(api_key=api_key)
    model = "gemini-2.0-flash-exp"  # Using the experimental model
    config = {"response_modalities": ["TEXT"]}

    async def test_connection():
        try:
            async with client.aio.live.connect(model=model, config=config) as session:
                print("✅ Session started successfully!")
                print("📊 Connection Details:")
                print(f"   • Model: {model}")
                print("   • Response modalities: TEXT")
                print("   • Status: Connected")
                
                # Send a test message
                await session.send("Hello, this is a test. Please respond with 'Connection verified!'")
                
                # Wait for response
                async for response in session.receive():
                    if response.text:
                        print(f"\n🤖 Gemini Response: {response.text}")
                        break
                
                print("\n✅ Gemini Live API is working correctly!")
                return True
                
        except Exception as e:
            print(f"\n❌ Connection failed: {str(e)}")
            if "API_KEY_INVALID" in str(e):
                print("\n💡 Your API key appears to be invalid.")
            elif "PERMISSION_DENIED" in str(e):
                print("\n💡 Your API key doesn't have permission to use Gemini Live.")
            elif "NOT_FOUND" in str(e):
                print("\n💡 The model 'gemini-2.0-flash-exp' might not be available.")
                print("   Try using 'gemini-1.5-flash' or 'gemini-1.5-pro' instead.")
            return False

    # Run the async test
    success = asyncio.run(test_connection())
    
    if not success:
        print("\n📚 Troubleshooting steps:")
        print("   1. Verify your API key at: https://makersuite.google.com/app/apikey")
        print("   2. Ensure Gemini API is enabled in your Google Cloud project")
        print("   3. Check if you have access to the Gemini 2.0 models")
        print("   4. Try the web-based verification at: /settings/gemini-key-verification")

except Exception as e:
    print(f"\n❌ Error initializing client: {str(e)}")
    print("\n💡 Make sure you have the google-genai package installed:")
    print("   pip install google-genai") 