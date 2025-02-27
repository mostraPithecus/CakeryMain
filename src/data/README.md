# Управление данными магазина

## Структура файлов

Все данные магазина хранятся в JSON файлах в директории `src/data/`:

1. `products.json` - товары (торты)
2. `categories.json` - категории товаров
3. `tags.json` - теги для фильтрации товаров

## Как добавить новый торт

1. Откройте `products.json`
2. Добавьте новый объект в массив `products`:
```json
{
  "id": "unique-cake-id",          // Уникальный ID (например, "chocolate-cake-0004")
  "name": "Название торта",        // Название торта
  "description": "Описание",       // Описание торта
  "price": 199,                    // Цена в долларах
  "image_url": "URL картинки",     // URL картинки (лучше использовать unsplash.com)
  "category_id": "ID категории",   // ID категории из categories.json
  "tags": ["tag-id-1", "tag-id-2"] // Массив ID тегов из tags.json
}
```

## Как добавить новую категорию

1. Откройте `categories.json`
2. Добавьте новый объект в массив `categories`:
```json
{
  "id": "unique-category-id",    // Уникальный ID (например, "special-cakes-0001")
  "name": "Название категории",  // Отображаемое название
  "description": "Описание"      // Описание категории
}
```

## Как добавить новый тег

1. Откройте `tags.json`
2. Добавьте новый объект в массив `tags`:
```json
{
  "id": "unique-tag-id",       // Уникальный ID (например, "vegan-0001")
  "name": "Название тега",     // Отображаемое название
  "description": "Описание"    // Описание тега
}
```

## Правила именования ID

- Используйте формат: `тип-подтип-номер`
- Примеры:
  - Товары: `chocolate-cake-0001`
  - Категории: `wedding-cakes-0001`
  - Теги: `vegan-0001`

## Изображения

- Используйте качественные фотографии с unsplash.com
- Добавляйте параметры к URL для оптимизации:
  - `w=1170` - ширина
  - `q=80` - качество
  - `fit=crop` - обрезка
  - Пример: `https://images.unsplash.com/photo-xxx?w=1170&q=80&fit=crop`

## После изменений

1. Проверьте валидность JSON файлов
2. Перезапустите сервер разработки командой `npm run dev`
3. Проверьте, что все отображается корректно
