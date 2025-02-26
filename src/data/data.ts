import type { Product, Category, Tag } from '../lib/database.types';

export const products: Omit<Product, 'created_at' | 'updated_at'>[] = [
  // ... existing products ...
  // Классические торты
  {
    id: "classic-chocolate-001",
    name: "Шоколадный торт",
    description: "Классический шоколадный торт с насыщенным вкусом какао и нежным кремом",
    composition: "Шоколадный бисквит\nШоколадный ганаш\nШоколадный крем\nШоколадная стружка\nВишня для украшения",
    price: 35.0,
    image_url: "https://images.unsplash.com/photo-1578985545062-69928b1d9587?q=80&w=1089&auto=format&fit=crop",
    slice_image_url: "https://images.unsplash.com/photo-1588195538326-c5b1e9f80a1b?q=80&w=1050&auto=format&fit=crop",
    additional_images: [
      "https://images.unsplash.com/photo-1578985545062-69928b1d9587?q=80&w=1089&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1588195538326-c5b1e9f80a1b?q=80&w=1050&auto=format&fit=crop"
    ],
    category_id: "classic-cakes",
    tags: ["шоколад", "торт", "классический"],
    is_custom_order: false,
    weight_kg: 1.5
  },
  {
    id: "classic-vanilla-001",
    name: "Ванильный торт",
    description: "Нежный ванильный торт с легким кремом и свежими ягодами",
    composition: "Ванильный бисквит\nСливочный крем\nСвежие ягоды\nВанильный сироп\nБелый шоколад",
    price: 32.0,
    image_url: "https://images.unsplash.com/photo-1464349095431-e9a21285b5f3?q=80&w=936&auto=format&fit=crop",
    slice_image_url: "https://images.unsplash.com/photo-1542826438-bd32f43d626f?q=80&w=992&auto=format&fit=crop",
    additional_images: [
      "https://images.unsplash.com/photo-1464349095431-e9a21285b5f3?q=80&w=936&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1542826438-bd32f43d626f?q=80&w=992&auto=format&fit=crop"
    ],
    category_id: "classic-cakes",
    tags: ["ваниль", "торт", "ягоды", "классический"],
    is_custom_order: false,
    weight_kg: 1.2
  },
  {
    id: "classic-redvelvet-001",
    name: "Красный бархат",
    description: "Знаменитый торт 'Красный бархат' с сырным кремом и нежной текстурой",
    composition: "Красный бархатный бисквит\nСливочно-сырный крем\nВанильный экстракт\nКакао\nКрасный пищевой краситель",
    price: 38.0,
    image_url: "https://images.unsplash.com/photo-1586788224331-947f68671cf1?q=80&w=987&auto=format&fit=crop",
    slice_image_url: "https://images.unsplash.com/photo-1616541823729-00fe0aacd32c?q=80&w=978&auto=format&fit=crop",
    additional_images: [
      "https://images.unsplash.com/photo-1586788224331-947f68671cf1?q=80&w=987&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1616541823729-00fe0aacd32c?q=80&w=978&auto=format&fit=crop"
    ],
    category_id: "classic-cakes",
    tags: ["красный бархат", "сырный крем", "торт", "классический"],
    is_custom_order: false,
    weight_kg: 1.4
  },
  {
    id: "classic-carrot-001",
    name: "Морковный торт",
    description: "Ароматный морковный торт с орехами и кремом из сливочного сыра",
    composition: "Морковный бисквит\nГрецкие орехи\nКрем из сливочного сыра\nКорица\nМускатный орех\nЦедра апельсина",
    price: 34.0,
    image_url: "https://images.unsplash.com/photo-1622926421334-6ac589744f64?q=80&w=1065&auto=format&fit=crop",
    slice_image_url: "https://images.unsplash.com/photo-1621303837174-89787a7d4729?q=80&w=936&auto=format&fit=crop",
    additional_images: [
      "https://images.unsplash.com/photo-1622926421334-6ac589744f64?q=80&w=1065&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1621303837174-89787a7d4729?q=80&w=936&auto=format&fit=crop"
    ],
    category_id: "classic-cakes",
    tags: ["морковь", "орехи", "торт", "классический"],
    is_custom_order: false,
    weight_kg: 1.3
  },
  {
    id: "classic-lemon-001",
    name: "Лимонный торт",
    description: "Освежающий лимонный торт с цитрусовым кремом и меренгой",
    composition: "Лимонный бисквит\nЛимонный курд\nСливочный крем\nМеренга\nЦедра лимона\nСвежие ягоды",
    price: 33.0,
    image_url: "https://images.unsplash.com/photo-1519869325930-281384150729?q=80&w=946&auto=format&fit=crop",
    slice_image_url: "https://images.unsplash.com/photo-1598373187432-c1ff06874ce8?q=80&w=987&auto=format&fit=crop",
    additional_images: [
      "https://images.unsplash.com/photo-1519869325930-281384150729?q=80&w=946&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1598373187432-c1ff06874ce8?q=80&w=987&auto=format&fit=crop"
    ],
    category_id: "classic-cakes",
    tags: ["лимон", "цитрус", "торт", "классический"],
    is_custom_order: false,
    weight_kg: 1.2
  },
  // Фирменные торты
  {
    id: "specialty-blackforest-001",
    name: "Черный лес",
    description: "Изысканный шоколадный торт с вишневой начинкой и взбитыми сливками",
    composition: "Шоколадный бисквит\nВишневый конфитюр\nВзбитые сливки\nТертый шоколад\nСвежая вишня\nКоньяк",
    price: 42.0,
    image_url: "https://images.unsplash.com/photo-1625584500461-1b1a8e5ecdb6?q=80&w=952&auto=format&fit=crop",
    slice_image_url: "https://images.unsplash.com/photo-1621303837174-89787a7d4729?q=80&w=936&auto=format&fit=crop",
    additional_images: [
      "https://images.unsplash.com/photo-1625584500461-1b1a8e5ecdb6?q=80&w=952&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1621303837174-89787a7d4729?q=80&w=936&auto=format&fit=crop"
    ],
    category_id: "specialty-cakes",
    tags: ["шоколад", "вишня", "торт", "фирменный"],
    is_custom_order: false,
    weight_kg: 1.8
  },
  {
    id: "specialty-tiramisu-001",
    name: "Тирамису торт",
    description: "Итальянский десерт на основе маскарпоне с кофейным пропитанным бисквитом",
    composition: "Бисквит савоярди\nКрем из маскарпоне\nЭспрессо\nКакао-порошок\nМарсала\nТемный шоколад",
    price: 45.0,
    image_url: "https://images.unsplash.com/photo-1571115177098-24ec42ed204d?q=80&w=1000&auto=format&fit=crop",
    slice_image_url: "https://images.unsplash.com/photo-1516043827470-d52c543c438f?q=80&w=944&auto=format&fit=crop",
    additional_images: [
      "https://images.unsplash.com/photo-1571115177098-24ec42ed204d?q=80&w=1000&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1516043827470-d52c543c438f?q=80&w=944&auto=format&fit=crop"
    ],
    category_id: "specialty-cakes",
    tags: ["тирамису", "кофе", "маскарпоне", "торт", "фирменный"],
    is_custom_order: false,
    weight_kg: 1.6
  },
  {
    id: "specialty-mocha-001",
    name: "Мокко шоколадный торт",
    description: "Насыщенный шоколадный торт с кофейным кремом и ганашем",
    composition: "Шоколадный бисквит\nКофейный крем\nШоколадный ганаш\nКофейные зерна в карамели\nШоколадная стружка",
    price: 40.0,
    image_url: "https://images.unsplash.com/photo-1574085733277-851d9d856a3a?q=80&w=876&auto=format&fit=crop",
    slice_image_url: "https://images.unsplash.com/photo-1606313564200-e75d1f3aae37?q=80&w=987&auto=format&fit=crop",
    additional_images: [
      "https://images.unsplash.com/photo-1574085733277-851d9d856a3a?q=80&w=876&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1606313564200-e75d1f3aae37?q=80&w=987&auto=format&fit=crop"
    ],
    category_id: "specialty-cakes",
    tags: ["шоколад", "кофе", "мокко", "торт", "фирменный"],
    is_custom_order: false,
    weight_kg: 1.7
  },
  {
    id: "specialty-pistachio-001",
    name: "Фисташковый торт с розой",
    description: "Нежный фисташковый бисквит с кремом из розовой воды и фисташками",
    composition: "Фисташковый бисквит\nРозовый крем\nФисташковая паста\nБелый шоколад\nЛепестки роз\nФисташки",
    price: 48.0,
    image_url: "https://images.unsplash.com/photo-1535141192574-5d4897c12636?q=80&w=988&auto=format&fit=crop",
    slice_image_url: "https://images.unsplash.com/photo-1615837197154-2e801f4bd294?q=80&w=987&auto=format&fit=crop",
    additional_images: [
      "https://images.unsplash.com/photo-1535141192574-5d4897c12636?q=80&w=988&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1615837197154-2e801f4bd294?q=80&w=987&auto=format&fit=crop"
    ],
    category_id: "specialty-cakes",
    tags: ["фисташки", "роза", "торт", "фирменный"],
    is_custom_order: false,
    weight_kg: 1.5
  },
  {
    id: "specialty-matcha-001",
    name: "Матча торт с белым шоколадом",
    description: "Торт с зеленым чаем матча и слоями белого шоколада",
    composition: "Бисквит с матча\nКрем из белого шоколада\nГанаш из белого шоколада и матча\nПорошок матча\nБелый шоколад",
    price: 47.0,
    image_url: "https://images.unsplash.com/photo-1583350229701-700bdcb09058?q=80&w=987&auto=format&fit=crop",
    slice_image_url: "https://images.unsplash.com/photo-1583350207337-5f0accacc5f1?q=80&w=987&auto=format&fit=crop",
    additional_images: [
      "https://images.unsplash.com/photo-1583350229701-700bdcb09058?q=80&w=987&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1583350207337-5f0accacc5f1?q=80&w=987&auto=format&fit=crop"
    ],
    category_id: "specialty-cakes",
    tags: ["матча", "белый шоколад", "торт", "фирменный"],
    is_custom_order: false,
    weight_kg: 1.6
  },
  // Рулеты
  {
    id: "roll-vanilla-001",
    name: "Ванильный рулет",
    description: "Классический бисквитный рулет с ванильным кремом и свежими ягодами",
    composition: "Ванильный бисквит\nСливочный крем\nСвежие ягоды\nСахарная пудра\nВанильный экстракт",
    price: 25.0,
    image_url: "https://images.unsplash.com/photo-1615937657715-bc7b4b7962c1?q=80&w=1170&auto=format&fit=crop",
    slice_image_url: "https://images.unsplash.com/photo-1602351447937-745cb720612f?q=80&w=986&auto=format&fit=crop",
    additional_images: [
      "https://images.unsplash.com/photo-1615937657715-bc7b4b7962c1?q=80&w=1170&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1602351447937-745cb720612f?q=80&w=986&auto=format&fit=crop"
    ],
    category_id: "cake-rolls",
    tags: ["ваниль", "рулет", "ягоды"],
    is_custom_order: false,
    weight_kg: 0.8
  },
  {
    id: "roll-chocolate-001",
    name: "Шоколадный рулет",
    description: "Нежный шоколадный бисквит с кремом из маскарпоне и шоколадными чипсами",
    composition: "Шоколадный бисквит\nКрем из маскарпоне\nШоколадные чипсы\nКакао-порошок\nСахарная пудра",
    price: 28.0,
    image_url: "https://images.unsplash.com/photo-1614142132602-dea9e8536d67?q=80&w=987&auto=format&fit=crop",
    slice_image_url: "https://images.unsplash.com/photo-1602351447937-745cb720612f?q=80&w=986&auto=format&fit=crop",
    additional_images: [
      "https://images.unsplash.com/photo-1614142132602-dea9e8536d67?q=80&w=987&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1602351447937-745cb720612f?q=80&w=986&auto=format&fit=crop"
    ],
    category_id: "cake-rolls",
    tags: ["шоколад", "рулет", "маскарпоне"],
    is_custom_order: false,
    weight_kg: 0.85
  },
  {
    id: "roll-matcha-001",
    name: "Матча рулет",
    description: "Бисквитный рулет с зеленым чаем и кремом из белого шоколада",
    composition: "Бисквит с матча\nКрем из белого шоколада\nПорошок матча\nМиндальные лепестки\nСахарная пудра",
    price: 30.0,
    image_url: "https://images.unsplash.com/photo-1519869491172-75b143d4e36b?q=80&w=987&auto=format&fit=crop",
    slice_image_url: "https://images.unsplash.com/photo-1488477181946-6428a0291777?q=80&w=987&auto=format&fit=crop",
    additional_images: [
      "https://images.unsplash.com/photo-1519869491172-75b143d4e36b?q=80&w=987&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1488477181946-6428a0291777?q=80&w=987&auto=format&fit=crop"
    ],
    category_id: "cake-rolls",
    tags: ["матча", "рулет", "белый шоколад"],
    is_custom_order: false,
    weight_kg: 0.8
  },
  {
    id: "roll-coffee-001",
    name: "Кофейный рулет",
    description: "Ароматный кофейный бисквит с кремом из взбитых сливок и карамельным соусом",
    composition: "Кофейный бисквит\nКрем из взбитых сливок\nКарамельный соус\nКофейные зерна\nКакао-порошок",
    price: 27.0,
    image_url: "https://images.unsplash.com/photo-1612198790700-0ff08cb726e5?q=80&w=987&auto=format&fit=crop",
    slice_image_url: "https://images.unsplash.com/photo-1515467837787-bc281c2b6a3a?q=80&w=987&auto=format&fit=crop",
    additional_images: [
      "https://images.unsplash.com/photo-1612198790700-0ff08cb726e5?q=80&w=987&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1515467837787-bc281c2b6a3a?q=80&w=987&auto=format&fit=crop"
    ],
    category_id: "cake-rolls",
    tags: ["кофе", "рулет", "карамель"],
    is_custom_order: false,
    weight_kg: 0.8
  },
  {
    id: "roll-fruity-001",
    name: "Радужный фруктовый рулет",
    description: "Красочный рулет с разноцветными слоями и фруктовым кремом",
    composition: "Цветной бисквит\nФруктовый крем\nСвежие фрукты\nСахарная пудра\nПищевые красители",
    price: 32.0,
    image_url: "https://images.unsplash.com/photo-1535920527002-b35e96722eb9?q=80&w=987&auto=format&fit=crop",
    slice_image_url: "https://images.unsplash.com/photo-1597895139270-a5dee112943f?q=80&w=987&auto=format&fit=crop",
    additional_images: [
      "https://images.unsplash.com/photo-1535920527002-b35e96722eb9?q=80&w=987&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1597895139270-a5dee112943f?q=80&w=987&auto=format&fit=crop"
    ],
    category_id: "cake-rolls",
    tags: ["фрукты", "рулет", "цветной"],
    is_custom_order: false,
    weight_kg: 0.9
  },
  // Чизкейки
  {
    id: "cheesecake-newyork-001",
    name: "Классический Нью-Йорк чизкейк",
    description: "Традиционный чизкейк в нью-йоркском стиле с плотной и кремовой текстурой",
    composition: "Песочная основа из печенья\nСливочный сыр\nСливки\nВанильный экстракт\nЯйца\nСахар",
    price: 35.0,
    image_url: "https://images.unsplash.com/photo-1533134242443-d4fd215305ad?q=80&w=1470&auto=format&fit=crop",
    slice_image_url: "https://images.unsplash.com/photo-1524351199678-941a58a3df50?q=80&w=987&auto=format&fit=crop",
    additional_images: [
      "https://images.unsplash.com/photo-1533134242443-d4fd215305ad?q=80&w=1470&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1524351199678-941a58a3df50?q=80&w=987&auto=format&fit=crop"
    ],
    category_id: "cheesecakes",
    tags: ["чизкейк", "классический", "нью-йорк"],
    is_custom_order: false,
    weight_kg: 1.2
  },
  {
    id: "cheesecake-berry-001",
    name: "Ягодный чизкейк",
    description: "Нежный чизкейк с миксом из свежих сезонных ягод и ягодным соусом",
    composition: "Печенье для основы\nСливочный сыр\nСвежие ягоды\nЯгодный соус\nСливки\nЖелатин",
    price: 38.0,
    image_url: "https://images.unsplash.com/photo-1611293388250-580b08c4a145?q=80&w=1480&auto=format&fit=crop",
    slice_image_url: "https://images.unsplash.com/photo-1567327613485-fbc7bf196198?q=80&w=987&auto=format&fit=crop",
    additional_images: [
      "https://images.unsplash.com/photo-1611293388250-580b08c4a145?q=80&w=1480&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1567327613485-fbc7bf196198?q=80&w=987&auto=format&fit=crop"
    ],
    category_id: "cheesecakes",
    tags: ["чизкейк", "ягоды", "свежий"],
    is_custom_order: false,
    weight_kg: 1.3
  },
  {
    id: "cheesecake-chocolate-001",
    name: "Шоколадный чизкейк",
    description: "Сочетание нежного чизкейка и насыщенного шоколадного вкуса",
    composition: "Шоколадное печенье для основы\nСливочный сыр\nТемный шоколад\nКакао-порошок\nСливки\nСахар",
    price: 40.0,
    image_url: "https://images.unsplash.com/photo-1619985632461-f0d773fbcda9?q=80&w=987&auto=format&fit=crop",
    slice_image_url: "https://images.unsplash.com/photo-1631206743828-f0b90ff0a8a8?q=80&w=1470&auto=format&fit=crop",
    additional_images: [
      "https://images.unsplash.com/photo-1619985632461-f0d773fbcda9?q=80&w=987&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1631206743828-f0b90ff0a8a8?q=80&w=1470&auto=format&fit=crop"
    ],
    category_id: "cheesecakes",
    tags: ["чизкейк", "шоколад", "какао"],
    is_custom_order: false,
    weight_kg: 1.4
  },
  {
    id: "cheesecake-caramel-001",
    name: "Солёная карамель чизкейк",
    description: "Чизкейк с прослойкой соленой карамели и карамельным соусом",
    composition: "Печенье для основы\nСливочный сыр\nСолёная карамель\nКарамельный соус\nМорская соль\nСливки",
    price: 42.0,
    image_url: "https://images.unsplash.com/photo-1626803775151-61d756612f97?q=80&w=987&auto=format&fit=crop",
    slice_image_url: "https://images.unsplash.com/photo-1632768567397-c6a1ef4bd453?q=80&w=987&auto=format&fit=crop",
    additional_images: [
      "https://images.unsplash.com/photo-1626803775151-61d756612f97?q=80&w=987&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1632768567397-c6a1ef4bd453?q=80&w=987&auto=format&fit=crop"
    ],
    category_id: "cheesecakes",
    tags: ["чизкейк", "карамель", "соленый"],
    is_custom_order: false,
    weight_kg: 1.3
  },
  {
    id: "cheesecake-matcha-001",
    name: "Матча чизкейк",
    description: "Нежный чизкейк с японским зеленым чаем матча",
    composition: "Печенье для основы\nСливочный сыр\nПорошок матча\nБелый шоколад\nСливки\nСахар",
    price: 44.0,
    image_url: "https://images.unsplash.com/photo-1577003833619-76bbd7f82948?q=80&w=2070&auto=format&fit=crop",
    slice_image_url: "https://images.unsplash.com/photo-1505253468034-514d2507d914?q=80&w=987&auto=format&fit=crop",
    additional_images: [
      "https://images.unsplash.com/photo-1577003833619-76bbd7f82948?q=80&w=2070&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1505253468034-514d2507d914?q=80&w=987&auto=format&fit=crop"
    ],
    category_id: "cheesecakes",
    tags: ["чизкейк", "матча", "зеленый чай"],
    is_custom_order: false,
    weight_kg: 1.2
  },
  // Пирожные
  {
    id: "pastry-eclair-001",
    name: "Шоколадные эклеры",
    description: "Классические эклеры из заварного теста с ванильным кремом и шоколадной глазурью",
    composition: "Заварное тесто\nВанильный крем\nШоколадная глазурь\nЗолотая пудра\nСъедобные цветы",
    price: 4.5,
    image_url: "https://images.unsplash.com/photo-1603532648955-039310d9ed75?q=80&w=987&auto=format&fit=crop",
    slice_image_url: "https://images.unsplash.com/photo-1514517604298-cf80e0fb7f1e?q=80&w=987&auto=format&fit=crop",
    additional_images: [
      "https://images.unsplash.com/photo-1603532648955-039310d9ed75?q=80&w=987&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1514517604298-cf80e0fb7f1e?q=80&w=987&auto=format&fit=crop"
    ],
    category_id: "pastries",
    tags: ["эклер", "заварное тесто", "крем", "шоколад"],
    is_custom_order: false,
    weight_kg: 0.1
  },
  {
    id: "pastry-macaron-001",
    name: "Ассорти макарон",
    description: "Нежные миндальные печенья с различными начинками и вкусами",
    composition: "Миндальная мука\nБелки\nСахарная пудра\nГанаш\nНатуральные красители\nФруктовые пюре",
    price: 3.5,
    image_url: "https://images.unsplash.com/photo-1569864358642-9d1684040f43?q=80&w=987&auto=format&fit=crop",
    slice_image_url: "https://images.unsplash.com/photo-1558326567-98166e5b7d52?q=80&w=1476&auto=format&fit=crop",
    additional_images: [
      "https://images.unsplash.com/photo-1569864358642-9d1684040f43?q=80&w=987&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1558326567-98166e5b7d52?q=80&w=1476&auto=format&fit=crop"
    ],
    category_id: "pastries",
    tags: ["макарон", "миндаль", "безе", "ганаш"],
    is_custom_order: false,
    weight_kg: 0.05
  },
  {
    id: "pastry-tart-001",
    name: "Фруктовые тарталетки",
    description: "Песочные корзинки с заварным кремом и свежими фруктами",
    composition: "Песочное тесто\nЗаварной крем\nСвежие сезонные фрукты\nАбрикосовый гель\nМята",
    price: 5.5,
    image_url: "https://images.unsplash.com/photo-1616359916731-8f080c487cc1?q=80&w=987&auto=format&fit=crop",
    slice_image_url: "https://images.unsplash.com/photo-1548811256-1627d99047c4?q=80&w=987&auto=format&fit=crop",
    additional_images: [
      "https://images.unsplash.com/photo-1616359916731-8f080c487cc1?q=80&w=987&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1548811256-1627d99047c4?q=80&w=987&auto=format&fit=crop"
    ],
    category_id: "pastries",
    tags: ["тарталетка", "фрукты", "песочное"],
    is_custom_order: false,
    weight_kg: 0.15
  },
  {
    id: "pastry-profiterole-001",
    name: "Шоколадные профитроли",
    description: "Маленькие шарики из заварного теста с кремом и шоколадной глазурью",
    composition: "Заварное тесто\nВанильный крем\nШоколадный соус\nСахарная пудра\nШоколадная стружка",
    price: 4.0,
    image_url: "https://images.unsplash.com/photo-1612809076015-6a284cc31be8?q=80&w=988&auto=format&fit=crop",
    slice_image_url: "https://images.unsplash.com/photo-1654439089556-ec99d8547c43?q=80&w=987&auto=format&fit=crop",
    additional_images: [
      "https://images.unsplash.com/photo-1612809076015-6a284cc31be8?q=80&w=988&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1654439089556-ec99d8547c43?q=80&w=987&auto=format&fit=crop"
    ],
    category_id: "pastries",
    tags: ["профитроли", "заварное тесто", "крем", "шоколад"],
    is_custom_order: false,
    weight_kg: 0.1
  },
  {
    id: "pastry-mille-feuille-001",
    name: "Мильфей",
    description: "Слоеный десерт с хрустящим слоеным тестом и нежным кремом",
    composition: "Слоеное тесто\nЗаварной крем\nЯгоды\nСахарная пудра\nВанильный сироп",
    price: 6.0,
    image_url: "https://images.unsplash.com/photo-1516684669134-de6f7c473a2a?q=80&w=987&auto=format&fit=crop",
    slice_image_url: "https://images.unsplash.com/photo-1621955964441-c173e01c6871?q=80&w=987&auto=format&fit=crop",
    additional_images: [
      "https://images.unsplash.com/photo-1516684669134-de6f7c473a2a?q=80&w=987&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1621955964441-c173e01c6871?q=80&w=987&auto=format&fit=crop"
    ],
    category_id: "pastries",
    tags: ["мильфей", "слоеное тесто", "крем", "ягоды"],
    is_custom_order: false,
    weight_kg: 0.2
  },
  // ... existing products ...
];

export const categories: Omit<Category, 'created_at' | 'updated_at'>[] = [
  {
    id: "classic-cakes",
    name: "Классические торты",
    description: "Традиционные торты с классическими вкусами"
  },
  {
    id: "specialty-cakes",
    name: "Фирменные торты",
    description: "Эксклюзивные торты с уникальными вкусовыми сочетаниями"
  },
  {
    id: "cake-rolls",
    name: "Рулеты",
    description: "Нежные бисквитные рулеты с различными начинками"
  },
  {
    id: "cheesecakes",
    name: "Чизкейки",
    description: "Изысканные чизкейки на любой вкус"
  },
  {
    id: "pastries",
    name: "Пирожные",
    description: "Разнообразные пирожные и десерты для особых случаев"
  }
];

export const tags: Omit<Tag, 'created_at' | 'updated_at'>[] = [
  // ... existing tags ...
  {
    id: "eclair",
    name: "Eclair",
    description: "Contains eclair"
  },
  {
    id: "macaron",
    name: "Macaron",
    description: "Contains macaron"
  },
  {
    id: "tart",
    name: "Tart",
    description: "Contains tart"
  },
  {
    id: "profiterole",
    name: "Profiterole",
    description: "Contains profiterole"
  },
  {
    id: "mille-feuille",
    name: "Mille-Feuille",
    description: "Contains mille-feuille"
  },
  {
    id: "panna cotta",
    name: "Panna Cotta",
    description: "Contains panna cotta"
  },
  {
    id: "creme brulee",
    name: "Crème Brûlée",
    description: "Contains crème brûlée"
  },
  {
    id: "mousse",
    name: "Mousse",
    description: "Contains mousse"
  },
  {
    id: "tiramisu",
    name: "Tiramisu",
    description: "Contains tiramisu"
  },
  {
    id: "parfait",
    name: "Parfait",
    description: "Contains parfait"
  }
];
