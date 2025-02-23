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

### 1. Setup and Configuration
- Set up development environment
- Configure authentication
- Set up Google Cloud Vision API

### 2. Core Features
- Implement camera functionality
- Integrate Google Cloud Vision for bottle detection
- Create cocktail recipe matching system
- Build user interface for results

### 3. User Experience
- Add loading states and error handling
- Implement smooth navigation
- Add animation and transitions
- Polish UI/UX

### 4. Additional Features
- Save favorite recipes
- Share functionality
- User profiles
- Recipe collections

### 5. Testing and Documentation
- Unit tests with Jest
- Integration tests
- User documentation
- API documentation

## 🔮 Future Enhancements

- **Smart Shopping Lists**: Generate shopping lists based on desired cocktails

---

Made with 🍸 by [Your Team Name] 
