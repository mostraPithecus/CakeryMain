# Sweet Creations - Cake Shop

A modern web application for a cake shop with delivery functionality.

## Product Management Guide

### Adding New Products

1. **Image Preparation**
   - **Image Size**: 
     - Recommended size: 800x600 pixels
     - Maximum file size: 2MB
   - **Image Processing**:
     - Use any of these tools:
       - [Photoshop](https://www.adobe.com/products/photoshop.html): Professional option
       - [GIMP](https://www.gimp.org/): Free alternative
       - [Squoosh](https://squoosh.app/): Quick online tool
   - **Image Processing Steps**:
     1. Resize to 800x600px
     2. Optimize for web:
        - Format: JPEG/PNG
        - Quality: 80-85%
        - Enable sRGB color profile
     3. Save with descriptive name (e.g., "chocolate-truffle-cake.jpg")
     4. Upload to [Imgur](https://imgur.com/)
     5. Copy the direct image URL (ends with .jpg/.png)

2. **Adding Product Data**
   Location: `src/data/data.ts`
   ```typescript
   export const products = [
     {
       id: "unique-id", // Use UUID v4
       name: "Product Name",
       description: "Product Description",
       price: 29.99,
       image: "imgur-direct-url",
       category: "cakes", // or other category
       tags: ["chocolate", "birthday"] // relevant tags
     }
   ];
   ```

3. **Categories and Tags**
   - Categories are defined in: `src/data/data.ts`
   - Add new categories to the `categories` array
   - Add new tags to the `tags` array

### File Structure
```
src/
├── components/
│   ├── ProductGrid.tsx    # Product display grid
│   └── ProductCard.tsx    # Individual product card
├── data/
│   └── data.ts           # Product database
└── lib/
    └── database.types.ts  # Type definitions
```

## Security Setup

1. **Environment Variables**
   Create a `.env` file in the root directory:
   ```
   VITE_TELEGRAM_BOT_TOKEN=your_telegram_bot_token
   VITE_TELEGRAM_CHAT_ID=your_telegram_chat_id
   VITE_GOOGLE_MAPS_API_KEY=your_google_maps_api_key
   ```

2. **Google Maps Setup**
   1. Go to [Google Cloud Console](https://console.cloud.google.com/)
   2. Create a new project
   3. Enable required APIs:
      - Maps JavaScript API
      - Places API
      - Geocoding API
   4. Create API key with restrictions:
      - HTTP referrers only
      - Restrict to your domain
      - Enable only necessary APIs

3. **Security Checklist**
   - [ ] Add `.env` to `.gitignore`
   - [ ] Never commit API keys to Git
   - [ ] Set up API key restrictions in Google Cloud Console
   - [ ] Use environment variables for all sensitive data
   - [ ] Set up proper CORS and CSP headers

## Development

1. **Install Dependencies**
   ```bash
   npm install
   ```

2. **Start Development Server**
   ```bash
   npm run dev
   ```

3. **Build for Production**
   ```bash
   npm run build
   ```

## Deployment

1. **Before Deployment**
   - Ensure all API keys are properly restricted
   - Update environment variables on hosting platform
   - Test all functionality in production mode

2. **Deploy**
   - Build the project
   - Upload to your hosting service
   - Set up proper environment variables

## Support

For any questions or issues, please refer to:
- Documentation in `/docs`
- Issue tracker on GitHub
- Contact development team
