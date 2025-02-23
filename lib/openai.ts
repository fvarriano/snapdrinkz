import { ENV } from '../config/env';

type AnalyzeImageResponse = {
  bottles: string[];
  error?: string;
};

export async function analyzeImage(base64Image: string): Promise<AnalyzeImageResponse> {
  try {
    console.log('Making API request to OpenAI...');
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${ENV.OPENAI_API_KEY}`,
      },
      body: JSON.stringify({
        model: "gpt-4-1106-vision-preview",
        messages: [
          {
            role: "user",
            content: [
              { 
                type: "text", 
                text: "What alcohol bottles or beverages can you see in this image? Please list them." 
              },
              {
                type: "image_url",
                image_url: {
                  url: `data:image/jpeg;base64,${base64Image}`
                }
              }
            ]
          }
        ],
        max_tokens: 300
      })
    });

    // Log the full request for debugging
    console.log('Request details:', {
      url: 'https://api.openai.com/v1/chat/completions',
      model: 'gpt-4-1106-vision-preview',
      hasApiKey: !!ENV.OPENAI_API_KEY,
      apiKeyPrefix: ENV.OPENAI_API_KEY?.substring(0, 10) + '...',
      imageSize: base64Image.length
    });

    console.log('Response status:', response.status);
    const responseText = await response.text();
    console.log('Response text:', responseText);

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}, body: ${responseText}`);
    }

    const data = JSON.parse(responseText);
    const content = data.choices?.[0]?.message?.content;

    if (!content) {
      return { bottles: [], error: 'No response from API' };
    }

    // If no bottles were detected
    if (content.toLowerCase().includes('no bottles') || content.toLowerCase().includes('cannot identify')) {
      return { bottles: [] };
    }

    // Split the response into individual bottle names
    const bottles = content
      .split(/[\n,]/)
      .map((line: string) => line.trim())
      .filter((line: string) => 
        line.length > 0 && 
        !line.toLowerCase().includes('i see') &&
        !line.toLowerCase().includes('i can see') &&
        !line.toLowerCase().includes('in the image')
      )
      .map((line: string) => line.replace(/^[-•\d.*)\s]+/, '').trim());

    return { bottles };
  } catch (error) {
    console.error('Error analyzing image:', error);
    return {
      bottles: [],
      error: error instanceof Error ? error.message : 'An error occurred analyzing the image'
    };
  }
} 