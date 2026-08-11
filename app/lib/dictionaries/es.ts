import type { Dictionary } from "./uk";

/**
 * Machine-assisted, awaiting a native review — the client asked for a first
 * pass now and corrections later. Menu content is not affected: that comes
 * from the panel.
 */
export const es: Dictionary = {
  nav: {
    about: "Sobre el chef",
    contact: "Contacto",
  },
  header: {
    home: "Anatolii Lukianchuk — inicio",
    openCart: "Abrir el carrito",
    reserve: "Reservar una cena",
    openMenu: "Abrir el menú",
    close: "Cerrar",
    language: "Idioma",
  },
  hero: {
    role: "Chef privado",
    tagline: "Creo cenas inolvidables en Barcelona.",
    scroll: "Desplazar",
    photoAlt: "Anatolii Lukianchuk con pan recién horneado",
  },
  menuSection: {
    eyebrow: "Menú",
    heading: "Dos maneras de poner la mesa",
    body: "Cada menú se compone para la ocasión. Elija el formato y los platos se ajustarán a él.",
    viewMenu: "Ver el menú",
  },
  about: {
    eyebrow: "Sobre el chef",
    photoAlt: "Anatolii Lukianchuk en su cocina",
    specialities: "Especialidades",
    facts: [
      {
        term: "Eventos privados",
        description: "Cenas, celebraciones y veladas tranquilas en casa.",
      },
      {
        term: "Menús personales",
        description: "Compuestos para cada cliente y cada temporada.",
      },
      {
        term: "Barcelona",
        description: "Y allí donde se ponga la mesa.",
      },
      {
        term: "Producto de temporada",
        description: "Elegido en el mercado, nunca de un catálogo.",
      },
    ],
  },
  contact: {
    eyebrow: "Contacto",
    elsewhere: "En otras redes",
    phone: "Teléfono",
    email: "Correo",
    location: "Ciudad",
    reserve: "Reservar una cena",
  },
  menuPage: {
    eyebrow: "Menú",
    categories: "Categorías del menú",
    updating: "Este menú se está actualizando.",
    readyHeading: "¿Listo para planear su evento?",
    readyBody:
      "Dígame la fecha, el formato y el número de invitados: compondré el menú a su alrededor.",
    reserve: "Reservar una cena",
  },
  dish: {
    addToOrder: "Añadir al pedido",
    enlarge: "Ampliar la foto",
    addOne: "Añadir una ración",
    removeOne: "Quitar una ración",
  },
  cart: {
    title: "Carrito",
    close: "Cerrar",
    empty: "El carrito está vacío.",
    total: "Total",
    send: "Enviar el pedido",
    clear: "Vaciar el carrito",
    remove: "Quitar",
    details: "Sus datos",
    thanksTitle: "Gracias.",
    thanksBody:
      "Su pedido ha sido enviado. Le llamaré en breve para concretar los detalles.",
  },
  booking: {
    title: "Solicitud de cena",
    intro:
      "Cuéntenos cuándo y para cuántos invitados: el chef se pondrá en contacto y le ayudará a componer el menú.",
    submit: "Enviar la solicitud",
    thanksTitle: "Gracias, hemos recibido su solicitud.",
    thanksBody: "El chef se pondrá en contacto con usted en breve.",
    close: "Cerrar",
  },
  checkout: {
    name: "Nombre",
    phone: "Teléfono",
    date: "Fecha",
    guests: "Invitados",
    comment: "Comentario",
    submit: "Enviar el pedido",
    sending: "Enviando",
    back: "Volver al carrito",
    networkError: "Error de red. Inténtelo de nuevo.",
    unknownError: "Algo ha fallado. Inténtelo de nuevo.",
  },
  footer: {
    role: "Chef privado",
    city: "Barcelona, España",
  },
};
