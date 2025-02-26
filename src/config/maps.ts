// Тестовый ключ API для разработки
// Замените этот ключ на ваш реальный API ключ Google Maps
export const GOOGLE_MAPS_API_KEY = import.meta.env.VITE_GOOGLE_MAPS_API_KEY || '';

if (!GOOGLE_MAPS_API_KEY) {
  console.error('Google Maps API key is missing! Check your .env file');
}

/*
Инструкция по получению своего API ключа:

1. Перейдите на Google Cloud Console: https://console.cloud.google.com/
2. Создайте новый проект или выберите существующий
3. Включите следующие API:
   - Maps JavaScript API
   - Places API
   - Geocoding API
4. Создайте учетные данные (API ключ)
5. Добавьте ключ в файл .env:
   VITE_GOOGLE_MAPS_API_KEY=your_api_key_here
*/
