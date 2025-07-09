# Free Australian TTS Setup Guide

## Best Options for Realistic Australian Voices

### Option 1: Azure Cognitive Services (RECOMMENDED - FREE)

Azure offers the **best quality Australian voices** with a generous free tier:

**Free Tier Benefits:**
- 5 hours of TTS per month (500,000 characters)
- Premium neural voices including authentic Australian accents
- No credit card required for free tier

**Australian Voices Available:**
- `en-AU-NatashaNeural` - Natural Australian female voice
- `en-AU-WilliamNeural` - Natural Australian male voice

**Setup Steps:**
1. Go to https://azure.microsoft.com/free/cognitive-services/
2. Click "Start free" and create a Microsoft account (if needed)
3. Create a Speech resource:
   - Go to https://portal.azure.com
   - Search for "Speech Services"
   - Click "Create" 
   - Choose "Free F0" pricing tier
   - Select "Australia East" region
4. Get your API key:
   - Go to your Speech resource
   - Click "Keys and Endpoint"
   - Copy Key 1
5. Add to your `.env.local`:
   ```
   VITE_AZURE_TTS_KEY=your_actual_azure_key_here
   VITE_AZURE_TTS_REGION=australiaeast
   VITE_USE_FREE_TTS=true
   ```

### Option 2: OpenAI TTS (PAID - High Quality)

If you already have OpenAI credits:
- Very natural voices (Nova for female, Onyx for male)
- $15 per 1 million characters
- Add to `.env.local`:
  ```
  VITE_OPENAI_API_KEY=your_openai_key_here
  VITE_USE_FREE_TTS=true
  ```

### Option 3: Enhanced Browser TTS (FREE - Fallback)

The app automatically falls back to enhanced browser speech synthesis:
- Looks for Australian voices in your system
- Falls back to British English (closer accent)
- Optimized speech parameters for natural sound
- No setup required

## Testing Your Setup

1. Start the development server: `npm run dev`
2. Navigate to any customer portfolio page
3. Click the play button on a call recording
4. You should hear natural Australian accents

## Voice Quality Comparison

1. **Azure Neural Voices** - Excellent, very natural Australian accents
2. **OpenAI TTS** - Excellent, but not specifically Australian
3. **Browser TTS** - Good, depends on your system voices
4. **ElevenLabs** - Excellent, but requires paid subscription

## Troubleshooting

**No Australian accent heard?**
- Check browser console for API errors
- Verify your API keys are correct
- Make sure `VITE_USE_FREE_TTS=true` is set
- Try refreshing the page to reload voices

**Azure TTS not working?**
- Ensure you're in the correct region (australiaeast)
- Check your free tier quota hasn't been exceeded
- Verify the Speech Service is enabled in Azure portal

**Want to test different voices?**
- Modify the voice names in the code
- Azure has multiple Australian voices: NatashaNeural, WilliamNeural, AnnetteNeural, CarlyNeural 