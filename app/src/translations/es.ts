import type { TranslationKeys } from "./types";

export const es: TranslationKeys = {
  common: {
    welcome: "Bienvenido",
    loading: "Cargando...",
    error: "Se produjo un error",
    save: "Guardar",
    cancel: "Cancelar",
    logout: "Cerrar sesión",
    born: "Nacido",
  },
  auth: {
    login: "Iniciar sesión",
    signup: "Registrarse",
    email: "Correo electrónico",
    password: "Contraseña",
    loginTitle: "Iniciar sesión",
    emailLabel: "Correo electrónico",
    passwordLabel: "Contraseña",
    loginButton: "Iniciar sesión",
    errors: {
      credentialsRequired:
        "El correo electrónico y la contraseña son requeridos",
      invalidCredentials: "Credenciales inválidas",
    },
    signupPrompt: "¿No tienes una cuenta?",
  },
  dashboard: {
    title: "Mis Bebés",
    addBaby: "Agregar Bebé",
    noBabies: "Aún no hay bebés agregados.",
  },
  tracking: {
    edit: {
      elimination: "Editar Eliminación",
      feeding: "Editar Alimentación",
      sleep: "Editar Sueño",
      photo: "Editar Foto",
    },
    when: "Cuándo",
    type: "Tipo",
    notes: "Notas",
    notesPlaceholder: "Agregar notas adicionales...",
    chooseFile: "Elegir archivo",
    dragAndDrop: "O arrastra y suelta tu foto aquí",
    noFileSelected: "Ningún archivo seleccionado",
    elimination: {
      title: "Eliminación",
      type: "Tipo",
      time: "Hora",
      weight: "Peso (g)",
      location: "Ubicación",
      notes: "Notas",
      types: {
        wet: "Mojado",
        dirty: "Sucio",
        mixed: "Mixto",
        both: "Ambos",
      },
    },
    feeding: {
      title: "Alimentación",
      type: "Tipo",
      startTime: "Hora de inicio",
      endTime: "Hora de fin",
      side: "Lado",
      amount: "Cantidad (ml)",
      food: "Alimento",
      notes: "Notas",
      types: {
        breast: "Pecho",
        bottle: "Biberón",
        formula: "Fórmula",
        solid: "Sólido",
      },
      sides: {
        left: "Izquierdo",
        right: "Derecho",
      },
    },
    sleep: {
      title: "Sueño",
      type: "Tipo",
      notes: "Notas",
      startTime: "Inicio",
      endTime: "Fin",
      how: "Cómo",
      whereFellAsleep: "Dónde se quedó dormido",
      whereSlept: "Dónde durmió",
      quality: "Calidad",
      types: {
        nap: "Siesta",
        night: "Sueño Nocturno",
      },
    },
    photo: {
      uploaded: 'Subido el',
      caption: 'Título',
      captionPlaceholder: 'Agregar un título...',
      sort: {
        newest: 'Más Reciente',
        oldest: 'Más Antiguo'
      }
    }
  },
  baby: {
    settings: "Configuración",
    caregivers: "Cuidadores",
    recent: {
      eliminations: "Eliminaciones Recientes",
      feedings: "Alimentaciones Recientes",
      sleeps: "Sueño Reciente",
      viewAll: "Ver Todo",
      photos: "Fotos Recientes",
      noData: {
        eliminations: "No hay eliminaciones registradas",
        feedings: "No hay alimentaciones registradas",
        sleeps: "No hay sesiones de sueño registradas",
        photos: "No hay fotos subidas",
      },
    },
    details: {
      weight: "Peso",
      amount: "Cantidad",
      quality: "Calidad",
      caption: "Título",
    },
  },
  newBaby: {
    title: "Agregar Nuevo Bebé",
    fields: {
      firstName: "Nombre",
      lastName: "Apellido",
      dateOfBirth: "Fecha de Nacimiento",
      gender: "Género",
    },
    genderOptions: {
      girl: "Niña",
      boy: "Niño",
    },
    submit: "Agregar Bebé",
    errors: {
      allFieldsRequired: "Todos los campos son requeridos",
    },
  },
  register: {
    title: "Crear tu cuenta",
    fields: {
      firstName: "Nombre",
      lastName: "Apellido",
      email: "Correo electrónico",
      password: "Contraseña",
      phone: "Teléfono",
      optional: "(opcional)",
    },
    placeholders: {
      firstName: "Ingresa tu nombre",
      lastName: "Ingresa tu apellido",
      email: "Ingresa tu correo electrónico",
      password: "Ingresa tu contraseña",
      phone: "Ingresa tu número de teléfono",
    },
    submit: "Registrarse",
    errors: {
      requiredFields: "Por favor completa todos los campos requeridos",
      emailExists: "Ya existe una cuenta con este correo electrónico",
      generic: "Algo salió mal. Por favor intenta de nuevo.",
    },
  },
  modal: {
    track: "Registrar",
    addCaregiver: "Agregar cuidador",
    email: "Correo electrónico",
    confirmation: "Se enviará una invitación al siguiente correo:",
    actions: {
      cancel: "Cancelar",
      save: "Guardar",
      next: "Siguiente",
      back: "Cancelar",
      confirm: "Confirmar",
    },
    close: "cerrar",
  },
  settings: {
    language: "Idioma",
  },
  photoModal: {
    uploaded: 'Subido:',
    caption: 'Título:',
    edit: 'Editar',
    delete: 'Eliminar',
    deleteConfirmation: '¿Estás seguro de querer eliminar esta foto?',
  },
  form: {
    errors: {
      required: "Por favor, completa este campo.",
    },
  },
  // Add more translation categories as needed
};
