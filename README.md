# SnapDrinkz

A mobile application that helps users discover and create cocktails through AI-powered image recognition and recipe generation.

## Development Philosophy

- **Simplicity First**: Each feature is implemented methodically and thoroughly before moving to the next
- **Step-by-Step Development**: Clear progression from basic functionality to advanced features
- **Quality Over Quantity**: Focus on perfecting core features rather than implementing many features partially

## Core Features (Implementation Order)

1. **Basic Setup & Authentication**
   - Expo + Next.js environment
   - Supabase authentication
   - Basic user profile

2. **Image Capture & Analysis**
   - Camera integration
   - Image capture functionality
   - Google Cloud Vision API integration for ingredient recognition

3. **Recipe Generation**
   - Recipe matching based on detected ingredients
   - Basic recipe display
   - Save functionality

4. **User Features**
   - Save favorite recipes
   - View history
   - Share recipes

## Technical Requirements

### API Keys Required
1. **Supabase**
   - Database and authentication
   - Create project at: https://supabase.com
   - Required keys:
     - SUPABASE_URL
     - SUPABASE_ANON_KEY

2. **Google Cloud**
   - Image analysis for bottle detection
   - Get API key at: https://console.cloud.google.com
   - Required key:
     - GOOGLE_CLOUD_API_KEY

## Environment Setup

1. Create a `.env` file in the root directory:
```env
EXPO_PUBLIC_SUPABASE_URL=your_supabase_url
EXPO_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
EXPO_PUBLIC_GOOGLE_CLOUD_API_KEY=your_google_cloud_api_key
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run start
```

## Development Status
- [x] Basic Expo + Next.js setup
- [ ] Environment configuration
- [ ] API integration
- [ ] Core features implementation

## Contributing
Please follow the step-by-step implementation approach. Each feature should be fully functional before moving to the next.

# 🍸 Snapdrinks

Turn your bottle collection into endless cocktail possibilities with AI-powered drink suggestions.

## 📱 About

Snapdrinks is an innovative mobile application that revolutionizes the home bartending experience. Simply snap a picture of your alcohol bottles, and let our AI identify them to suggest delicious cocktail combinations you can make right now.

## ✨ Features

- 📸 **Instant Bottle Recognition**: Take a photo or upload an image of your bottles
- 🤖 **AI-Powered Analysis**: Advanced image recognition to identify alcohol types and brands
- 🍹 **Smart Cocktail Suggestions**: Get personalized drink recommendations based on your available ingredients
- ⭐ **Favorites & Custom Recipes**: Save your preferred drinks and create your own recipes
- 🌟 **Social Sharing**: Connect with friends and share your mixology creations
- 📱 **Cross-Platform**: Available on both iOS and Android through Expo

## 🛠️ Tech Stack

- **Frontend**: Next.js
- **Mobile Framework**: Expo
- **Image Recognition**: Google Cloud Vision API
- **Authentication**: Supabase
- **Database**: Supabase

## 🎯 Roadmap

### 3. Integration with OpenAI

#### Step 1: Set Up OpenAI API Key
- Sign up at [OpenAI](https://www.openai.com/) and create an API key if you haven't done so already.
- Create a `.env` file in your project root and add your API key:
  ```plaintext
  OPENAI_API_KEY=your_openai_api_key
  ```

#### Step 2: Install Axios
- OpenAI API calls can be made using Axios. Install it running:
  ```bash
  npm install axios
  ```

#### Step 3: Create API Call Functions
1. Create a new file for API functions (e.g., `api.js`) in the `src` folder.
2. Write functions to interact with OpenAI's API.

Example code snippet for the API call:
```javascript
import axios from 'axios';

const fetchOpenAIResponse = async (prompt) => {
    const response = await axios.post('https://api.openai.com/v1/engines/text-davinci-003/completions', {
        prompt: prompt,
        max_tokens: 50
    }, {
        headers: {
            'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`,
            'Content-Type': 'application/json'
        }
    });
    return response.data.choices[0].text;
};
```

### 4. Additional Suggestions

- **Testing**: Set up a testing framework like Jest or Mocha for unit tests.
- **Linting**: Consider integrating ESLint for code quality and consistency.
- **Documentation**: Ensure your code is well-documented, and consider using tools like Storybook for UI components.
- **Environment Configuration**: Verify environment variables and ensure local setups match production configurations.

## 🔮 Future Enhancements

- **Smart Shopping Lists**: Generate shopping lists based on desired cocktails

---

Made with 🍸 by [Your Team Name] 
