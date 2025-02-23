import { ENV } from '../config/env';

type AnalyzeImageResponse = {
  bottles: string[];
  error?: string;
};

interface DetectedBottle {
  name: string;
  confidence: number;
  text?: string[];
}

export async function analyzeImage(base64Image: string): Promise<AnalyzeImageResponse> {
  try {
    const requestBody = {
      requests: [{
        image: {
          content: base64Image
        },
        features: [
          {
            type: 'LABEL_DETECTION',
            maxResults: 10
          },
          {
            type: 'OBJECT_LOCALIZATION',
            maxResults: 10
          },
          {
            type: 'TEXT_DETECTION',
            maxResults: 10
          },
          {
            type: 'LOGO_DETECTION',
            maxResults: 10
          }
        ],
        imageContext: {
          languageHints: ['en']
        }
      }]
    };

    console.log('Making request to Google Cloud Vision API...');
    
    const response = await fetch(
      `https://vision.googleapis.com/v1/images:annotate?key=${ENV.GOOGLE_CLOUD_API_KEY}`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(requestBody)
      }
    );

    if (!response.ok) {
      const errorText = await response.text();
      console.error('API Error:', errorText);
      throw new Error(`API request failed: ${response.status}`);
    }

    const data = await response.json();
    const result = data.responses[0];
    
    // Combine different detection methods to identify bottles
    const detectedBottles: DetectedBottle[] = [];
    
    // Check object localization
    if (result.localizedObjectAnnotations) {
      result.localizedObjectAnnotations.forEach(obj => {
        if (obj.name?.toLowerCase().includes('bottle')) {
          detectedBottles.push({
            name: obj.name,
            confidence: obj.score || 0
          });
        }
      });
    }

    // Check text detection to identify brand names
    if (result.textAnnotations && result.textAnnotations[0]) {
      const allText = result.textAnnotations[0].description.split('\n');
      const knownBrands = ['BOMBAY', 'MARTINI', 'MCGUINNESS'];
      
      allText.forEach(text => {
        const upperText = text.toUpperCase();
        knownBrands.forEach(brand => {
          if (upperText.includes(brand)) {
            const existingBottle = detectedBottles.find(b => 
              b.name.toUpperCase().includes(brand)
            );
            
            if (existingBottle) {
              existingBottle.text = existingBottle.text || [];
              existingBottle.text.push(text);
            } else {
              detectedBottles.push({
                name: text,
                confidence: 0.9,
                text: [text]
              });
            }
          }
        });
      });
    }

    // Check logo detection
    if (result.logoAnnotations) {
      result.logoAnnotations.forEach(logo => {
        const existingBottle = detectedBottles.find(b => 
          b.name.toUpperCase().includes(logo.description.toUpperCase())
        );
        
        if (!existingBottle) {
          detectedBottles.push({
            name: logo.description,
            confidence: logo.score || 0
          });
        }
      });
    }

    // Format the results
    const bottles = detectedBottles.map(bottle => {
      const name = bottle.text ? bottle.text.join(' ') : bottle.name;
      return `Detected: ${name} (${Math.round(bottle.confidence * 100)}% confidence)`;
    });

    console.log('Detected bottles:', bottles);
    return { bottles };
  } catch (error) {
    console.error('Error analyzing image:', error);
    return {
      bottles: [],
      error: error instanceof Error ? error.message : 'An error occurred analyzing the image'
    };
  }
} 