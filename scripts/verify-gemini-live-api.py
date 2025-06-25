#!/usr/bin/env python3
"""
Simple Gemini Live API verification script
Tests if your API key can access the Gemini 2.0 Flash Live model
"""

import os
import asyncio
from google import genai

# Model name from the official example
MODEL = "models/gemini-2.0-flash-live-001"

async def verify_api_key():
    # Get API key from environment
    api_key = os.getenv("GOOGLE_API_KEY") or os.getenv("GEMINI_API_KEY")
    
    if not api_key:
        print("❌ No API key found!")
        print("\nPlease set your API key using one of these methods:")
        print("1. Set environment variable:")
        print("   Windows: set GOOGLE_API_KEY=your-api-key-here")
        print("   Linux/Mac: export GOOGLE_API_KEY=your-api-key-here")
        print("\n2. Or create a .env file with:")
        print("   GOOGLE_API_KEY=your-api-key-here")
        return False
    
    print(f"🔍 Testing API key: {api_key[:10]}...{api_key[-4:]}")
    print(f"📡 Model: {MODEL}")
    
    try:
        # Create client with v1beta API version (required for Live API)
        client = genai.Client(
            api_key=api_key,
            http_options={"api_version": "v1beta"}
        )
        
        # Test configuration
        config = {
            "response_modalities": ["TEXT"]  # Start with text only for testing
        }
        
        print("\n🔄 Attempting to connect to Gemini Live API...")
        
        async with client.aio.live.connect(model=MODEL, config=config) as session:
            print("✅ Successfully connected to Gemini Live API!")
            
            # Send a test message
            await session.send(input="Hello, please respond with 'Connection successful!'", end_of_turn=True)
            
            # Receive response
            response_received = False
            async for response in session.receive():
                if response.text:
                    print(f"\n🤖 Gemini Response: {response.text}")
                    response_received = True
                    break
            
            if response_received:
                print("\n✅ API Key Verification Complete!")
                print("\n📊 Your API key has access to:")
                print("   • Gemini 2.0 Flash Live model")
                print("   • Text generation")
                print("   • Real-time streaming")
                print("\n🎯 You can now run the full Gemini Live demo with:")
                print("   • Audio input/output")
                print("   • Camera video streaming")
                print("   • Screen sharing")
                return True
            else:
                print("\n⚠️ Connected but no response received")
                return False
                
    except Exception as e:
        print(f"\n❌ Error: {str(e)}")
        
        if "404" in str(e) or "NOT_FOUND" in str(e):
            print("\n💡 The Gemini Live API model might not be available yet.")
            print("   This is a new feature that may require:")
            print("   • Waitlist access")
            print("   • Specific API permissions")
            print("   • Regional availability")
        elif "403" in str(e) or "PERMISSION_DENIED" in str(e):
            print("\n💡 Your API key doesn't have permission to use Gemini Live.")
            print("   Please check:")
            print("   • Your API key is valid")
            print("   • Gemini API is enabled in your Google Cloud project")
            print("   • You have access to the v1beta API")
        elif "API_KEY_INVALID" in str(e):
            print("\n💡 Your API key appears to be invalid.")
            print("   Get a new key at: https://makersuite.google.com/app/apikey")
        
        return False

async def test_audio_capabilities():
    """Test if the system has audio capabilities for the full demo"""
    try:
        import pyaudio # type: ignore
        p = pyaudio.PyAudio()
        
        # Check for audio devices
        input_device = p.get_default_input_device_info()
        output_device = p.get_default_output_device_info()
        
        print("\n🎤 Audio Devices:")
        print(f"   • Input: {input_device['name']}")
        print(f"   • Output: {output_device['name']}")
        
        p.terminate()
        return True
    except Exception as e:
        print(f"\n⚠️ Audio not available: {str(e)}")
        return False

async def test_video_capabilities():
    """Test if the system has video capabilities for the full demo"""
    try:
        import cv2 # type: ignore
        
        # Test camera
        cap = cv2.VideoCapture(0)
        if cap.isOpened():
            print("\n📹 Camera: Available")
            cap.release()
        else:
            print("\n📹 Camera: Not available")
            
        # Test screen capture
        try:
            print("🖥️ Screen capture: Available")
        except ImportError:
            print("🖥️ Screen capture: Not available (install mss)")
            
        return True
    except Exception as e:
        print(f"\n⚠️ Video not available: {str(e)}")
        return False

async def main():
    print("🚀 Gemini Live API Verification Tool")
    print("=" * 50)
    
    # Test API key
    api_valid = await verify_api_key()
    
    if api_valid:
        print("\n" + "=" * 50)
        print("📦 Checking system capabilities for full demo...")
        
        # Test additional capabilities
        await test_audio_capabilities()
        await test_video_capabilities()
        
        print("\n" + "=" * 50)
        print("📚 Next Steps:")
        print("\n1. Install all dependencies:")
        print("   pip install google-genai opencv-python pyaudio pillow mss")
        
        print("\n2. Run the full demo:")
        print("   python Get_started_LiveAPI.py")
        print("   python Get_started_LiveAPI.py --mode screen  # for screen sharing")
        print("   python Get_started_LiveAPI.py --mode none    # audio only")
        
        print("\n⚠️ Important: Use headphones to prevent echo!")
    else:
        print("\n" + "=" * 50)
        print("❌ Please fix the API key issue before running the full demo")

if __name__ == "__main__":
    asyncio.run(main()) 