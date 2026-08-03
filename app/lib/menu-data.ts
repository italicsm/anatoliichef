import type { Category, Dish, MenuType, Placement } from "./types";

/**
 * Temporary in-memory source, shaped exactly like the future Supabase rows.
 * Replacing it means rewriting the queries in menu.ts and nothing else.
 *
 * Note how "dish-tartare" appears in both menus at two different prices and
 * two different categories — one dish row, two placement rows.
 */

export const menuTypes: MenuType[] = [
  {
    id: "menu-furshet",
    slug: "furshet",
    title: { uk: "Фуршет", en: "Фуршет" },
    description: {
      en: "Canapés and small bites for standing receptions, presentations and celebrations without a seating plan.",
      uk: "Канапе та дрібні закуски для прийомів, презентацій і свят без розсадки.",
    },
    photo: "/photo/340845283_535135425228599_8845032591361743684_n.jpg",
    position: 1,
  },
  {
    id: "menu-banquet",
    slug: "banquet",
    title: { uk: "Банкет", en: "Банкет" },
    description: {
      en: "Composed courses served at the table, for weddings, anniversaries and formal dinners.",
      uk: "Страви, подані до столу, — для весіль, ювілеїв і офіційних вечер.",
    },
    photo: "/photo/405926522_7104475096271096_3953933040856888595_n.jpg",
    position: 2,
  },
];

export const categories: Category[] = [
  {
    id: "cat-furshet-cold",
    menuTypeId: "menu-furshet",
    title: { en: "Cold appetizers", uk: "Холодні закуски" },
    position: 1,
  },
  {
    id: "cat-furshet-hot",
    menuTypeId: "menu-furshet",
    title: { en: "Hot appetizers", uk: "Гарячі закуски" },
    position: 2,
  },
  {
    id: "cat-furshet-desserts",
    menuTypeId: "menu-furshet",
    title: { en: "Desserts", uk: "Десерти" },
    position: 3,
  },
  {
    id: "cat-banquet-cold",
    menuTypeId: "menu-banquet",
    title: { en: "Cold appetizers", uk: "Холодні закуски" },
    position: 1,
  },
  {
    id: "cat-banquet-main",
    menuTypeId: "menu-banquet",
    title: { en: "Main courses", uk: "Основні страви" },
    position: 2,
  },
  {
    id: "cat-banquet-desserts",
    menuTypeId: "menu-banquet",
    title: { en: "Desserts", uk: "Десерти" },
    position: 3,
  },
];

export const dishes: Dish[] = [
  {
    id: "dish-tartare",
    title: { en: "Beef tartare", uk: "Тартар з яловичини" },
    description: {
      en: "Hand-cut beef, capers, egg yolk, toasted sourdough.",
      uk: "Яловичина ручного зрізу, каперси, жовток, підсмажений хліб на заквасці.",
    },
    photos: [
      {
        id: "photo-tartare-1",
        url: "/photo/405926522_7104475096271096_3953933040856888595_n.jpg",
        alt: { en: "Beef tartare", uk: "Тартар з яловичини" },
        position: 1,
      },
    ],
    isActive: true,
  },
  {
    id: "dish-salmon-canape",
    title: { en: "Salmon canapé", uk: "Канапе з лососем" },
    description: {
      en: "Cured salmon, crème fraîche, dill, rye crisp.",
      uk: "Слабосолений лосось, крем-фреш, кріп, житній хрусткий хліб.",
    },
    photos: [
      {
        id: "photo-salmon-1",
        url: "/photo/391749683_6945419922176615_5378591818517958663_n.jpg",
        alt: { en: "Salmon canapé", uk: "Канапе з лососем" },
        position: 1,
      },
    ],
    isActive: true,
  },
  {
    id: "dish-lamb",
    title: { en: "Slow-cooked lamb", uk: "Томлена баранина" },
    description: {
      en: "Shoulder braised for six hours, celeriac purée, jus.",
      uk: "Лопатка, томлена шість годин, пюре з селери, соус.",
    },
    photos: [
      {
        id: "photo-lamb-1",
        url: "/photo/242601968_4579572215428076_9110900407639068836_n.jpg",
        alt: { en: "Slow-cooked lamb", uk: "Томлена баранина" },
        position: 1,
      },
    ],
    isActive: true,
  },
  {
    id: "dish-panna-cotta",
    title: { en: "Panna cotta", uk: "Панакота" },
    description: {
      en: "Vanilla cream, seasonal berries.",
      uk: "Вершки з ваніллю, сезонні ягоди.",
    },
    photos: [
      {
        id: "photo-panna-1",
        url: "/photo/340845283_535135425228599_8845032591361743684_n.jpg",
        alt: { en: "Panna cotta", uk: "Панакота" },
        position: 1,
      },
    ],
    isActive: true,
  },
  {
    id: "dish-bruschetta",
    title: { en: "Mushroom bruschetta", uk: "Брускета з грибами" },
    description: {
      en: "Roasted mushrooms, thyme, aged cheese on toasted sourdough.",
      uk: "Печені гриби, чебрець, витриманий сир на підсмаженій заквасці.",
    },
    photos: [
      {
        id: "photo-bruschetta-1",
        url: "/photo/311778332_5745341902184429_6099583531181056864_n.jpg",
        alt: { en: "Mushroom bruschetta", uk: "Брускета з грибами" },
        position: 1,
      },
    ],
    isActive: true,
  },
  {
    id: "dish-shrimp-skewer",
    title: { en: "Prawn skewer", uk: "Шпажка з креветкою" },
    description: {
      en: "Grilled prawn, lemon zest, herb oil.",
      uk: "Креветка на грилі, цедра лимона, трав'яна олія.",
    },
    photos: [
      {
        id: "photo-shrimp-1",
        url: "/photo/273831926_5059868067398486_6296733565879236204_n.jpg",
        alt: { en: "Prawn skewer", uk: "Шпажка з креветкою" },
        position: 1,
      },
    ],
    isActive: true,
  },
  {
    id: "dish-profiteroles",
    title: { en: "Profiteroles", uk: "Профітролі" },
    description: {
      en: "Choux pastry, vanilla cream, dark chocolate.",
      uk: "Заварне тісто, ванільний крем, чорний шоколад.",
    },
    photos: [
      {
        id: "photo-profiteroles-1",
        url: "/photo/271314426_4917171355001492_7229037114222721819_n.jpg",
        alt: { en: "Profiteroles", uk: "Профітролі" },
        position: 1,
      },
    ],
    isActive: true,
  },
  {
    id: "dish-carpaccio",
    title: { en: "Beef carpaccio", uk: "Карпачо з яловичини" },
    description: {
      en: "Thinly sliced beef, rocket, parmesan, lemon.",
      uk: "Тонко нарізана яловичина, рукола, пармезан, лимон.",
    },
    photos: [
      {
        id: "photo-carpaccio-1",
        url: "/photo/318538134_5908192102566074_7651453671171471328_n.jpg",
        alt: { en: "Beef carpaccio", uk: "Карпачо з яловичини" },
        position: 1,
      },
    ],
    isActive: true,
  },
  {
    id: "dish-sea-bass",
    title: { en: "Sea bass", uk: "Сібас" },
    description: {
      en: "Fillet on the grill, young potato, green asparagus.",
      uk: "Філе на грилі, молода картопля, зелена спаржа.",
    },
    photos: [
      {
        id: "photo-sea-bass-1",
        url: "/photo/340746862_1171182390247699_451647443759496078_n.jpg",
        alt: { en: "Sea bass", uk: "Сібас" },
        position: 1,
      },
    ],
    isActive: true,
  },
];

export const placements: Placement[] = [
  // One dish, two menus, two prices and two portions.
  {
    id: "place-tartare-furshet",
    dishId: "dish-tartare",
    categoryId: "cat-furshet-cold",
    price: 450,
    portion: "1 pc",
    position: 1,
  },
  {
    id: "place-tartare-banquet",
    dishId: "dish-tartare",
    categoryId: "cat-banquet-cold",
    price: 1600,
    portion: "120 g",
    position: 1,
  },

  {
    id: "place-salmon-furshet",
    dishId: "dish-salmon-canape",
    categoryId: "cat-furshet-cold",
    price: 380,
    portion: "1 pc",
    position: 2,
  },
  {
    id: "place-carpaccio-furshet",
    dishId: "dish-carpaccio",
    categoryId: "cat-furshet-cold",
    price: 420,
    portion: "1 pc",
    position: 3,
  },

  {
    id: "place-bruschetta-furshet",
    dishId: "dish-bruschetta",
    categoryId: "cat-furshet-hot",
    price: 390,
    portion: "1 pc",
    position: 1,
  },
  {
    id: "place-shrimp-furshet",
    dishId: "dish-shrimp-skewer",
    categoryId: "cat-furshet-hot",
    price: 480,
    portion: "1 pc",
    position: 2,
  },
  {
    id: "place-sea-bass-furshet",
    dishId: "dish-sea-bass",
    categoryId: "cat-furshet-hot",
    price: 520,
    portion: "1 pc",
    position: 3,
  },

  {
    id: "place-panna-furshet",
    dishId: "dish-panna-cotta",
    categoryId: "cat-furshet-desserts",
    price: 350,
    portion: "80 g",
    position: 1,
  },
  {
    id: "place-profiteroles-furshet",
    dishId: "dish-profiteroles",
    categoryId: "cat-furshet-desserts",
    price: 320,
    portion: "2 pcs",
    position: 2,
  },

  {
    id: "place-carpaccio-banquet",
    dishId: "dish-carpaccio",
    categoryId: "cat-banquet-cold",
    price: 1400,
    portion: "140 g",
    position: 2,
  },
  {
    id: "place-salmon-banquet",
    dishId: "dish-salmon-canape",
    categoryId: "cat-banquet-cold",
    price: 1500,
    portion: "130 g",
    position: 3,
  },

  {
    id: "place-lamb-banquet",
    dishId: "dish-lamb",
    categoryId: "cat-banquet-main",
    price: 2400,
    portion: "250 g",
    position: 1,
  },
  {
    id: "place-sea-bass-banquet",
    dishId: "dish-sea-bass",
    categoryId: "cat-banquet-main",
    price: 2200,
    portion: "220 g",
    position: 2,
  },
  {
    id: "place-bruschetta-banquet",
    dishId: "dish-bruschetta",
    categoryId: "cat-banquet-main",
    price: 1200,
    portion: "180 g",
    position: 3,
  },

  {
    id: "place-panna-banquet",
    dishId: "dish-panna-cotta",
    categoryId: "cat-banquet-desserts",
    price: 700,
    portion: "150 g",
    position: 1,
  },
  {
    id: "place-profiteroles-banquet",
    dishId: "dish-profiteroles",
    categoryId: "cat-banquet-desserts",
    price: 650,
    portion: "3 pcs",
    position: 2,
  },
];
