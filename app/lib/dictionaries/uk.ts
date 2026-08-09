/**
 * Interface copy. Ukrainian is the source of truth: its shape defines the
 * Dictionary type, so a string added here becomes a compile error in the two
 * other files until it is translated. Forgetting a translation is not
 * something worth discovering in production.
 *
 * Only chrome lives here — anything the chef edits in the panel comes from
 * the database instead.
 */
export const uk = {
  nav: {
    about: "Про шефа",
    contact: "Контакти",
  },
  header: {
    home: "Anatolii Lukianchuk — головна",
    openCart: "Відкрити кошик",
    reserve: "Забронювати вечерю",
    openMenu: "Відкрити меню",
    close: "Закрити",
    language: "Мова",
  },
  hero: {
    role: "Приватний шеф",
    tagline: "Створюю незабутні вечері в Барселоні.",
    scroll: "Гортати",
    photoAlt: "Анатолій Лукʼянчук зі свіжоспеченим хлібом",
  },
  menuSection: {
    eyebrow: "Меню",
    heading: "Два способи накрити стіл",
    body: "Кожне меню складається під подію. Оберіть формат — страви підберемо навколо нього.",
    viewMenu: "Дивитися меню",
  },
  about: {
    eyebrow: "Про шефа",
    photoAlt: "Анатолій Лукʼянчук на кухні",
    specialities: "Спеціалізації",
    facts: [
      {
        term: "Приватні події",
        description: "Вечері, святкування та тихі вечори вдома.",
      },
      {
        term: "Персональні меню",
        description: "Складені під клієнта й під сезон.",
      },
      {
        term: "Барселона",
        description: "І всюди, де накритий стіл.",
      },
      {
        term: "Сезонні продукти",
        description: "Обрані на ринку, а не з каталогу.",
      },
    ],
  },
  contact: {
    eyebrow: "Контакти",
    elsewhere: "Ще тут",
    phone: "Телефон",
    email: "Пошта",
    location: "Місто",
    reserve: "Забронювати вечерю",
  },
  menuPage: {
    eyebrow: "Меню",
    categories: "Категорії меню",
    updating: "Це меню зараз оновлюється.",
    readyHeading: "Готові спланувати подію?",
    readyBody:
      "Напишіть дату, формат і кількість гостей — я складу меню навколо них.",
    reserve: "Забронювати вечерю",
  },
  dish: {
    addToOrder: "Додати до замовлення",
    enlarge: "Збільшити фото",
    addOne: "Додати одну порцію",
    removeOne: "Прибрати одну порцію",
  },
  cart: {
    title: "Кошик",
    close: "Закрити",
    empty: "Кошик порожній.",
    total: "Разом",
    send: "Надіслати замовлення",
    clear: "Очистити кошик",
    remove: "Прибрати",
    details: "Ваші дані",
    thanksTitle: "Дякуємо.",
    thanksBody:
      "Замовлення надіслано. Я передзвоню найближчим часом, щоб узгодити деталі.",
  },
  checkout: {
    name: "Імʼя",
    phone: "Телефон",
    date: "Дата",
    guests: "Гостей",
    comment: "Коментар",
    submit: "Надіслати замовлення",
    sending: "Надсилаємо",
    back: "Назад до кошика",
    networkError: "Помилка мережі. Спробуйте ще раз.",
    unknownError: "Щось пішло не так. Спробуйте ще раз.",
  },
  footer: {
    role: "Приватний шеф",
    city: "Барселона, Іспанія",
  },
};

/**
 * The shape every other language has to satisfy.
 *
 * Deliberately without `as const`: that would freeze each value into a literal
 * type and demand the Ukrainian wording from the Spanish file. What has to
 * match is the set of keys, not the text.
 */
export type Dictionary = typeof uk;
