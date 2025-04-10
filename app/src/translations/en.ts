import { timeStamp } from "node:console";

export const en = {
  common: {
    welcome: 'Welcome',
    loading: 'Loading...',
    error: 'An error occurred',
    save: 'Save',
    cancel: 'Cancel',
    logout: 'Logout',
    born: 'Born',
  },
  auth: {
    login: 'Login',
    signup: 'Sign Up',
    email: 'Email',
    password: 'Password',
    loginTitle: 'Login',
    emailLabel: 'Email',
    passwordLabel: 'Password',
    loginButton: 'Login',
    errors: {
      credentialsRequired: 'Email and password are required',
      invalidCredentials: 'Invalid credentials'
    },
    signupPrompt: "Don't have an account?"
  },
  dashboard: {
    title: 'My Babies',
    addBaby: 'Add Baby',
    noBabies: 'No babies added yet.',
  },
  tracking: {
    when: 'When',
    type: 'Type',
    notes: 'Notes',
    notesPlaceholder: 'Add any additional notes...',
    elimination: {
      title: 'Elimination',
      weight: 'Weight (g)',
      types: {
        wet: 'Wet',
        dirty: 'Dirty',
        both: 'Both'
      }
    },
    feeding: {
      title: 'Feeding',
      amount: 'Amount (ml)',
      types: {
        breast: 'Breast',
        bottle: 'Bottle',
        formula: 'Formula'
      }
    },
    sleep: {
      title: 'Sleep',
      startTime: 'Start Time',
      endTime: 'End Time',
      how: 'How',
      whereFellAsleep: 'Where Baby Fell Asleep',
      whereSlept: 'Where Baby Slept',
      quality: 'Quality',
      types: {
        nap: 'Nap',
        night: 'Night Sleep'
      }
    }
  },
  baby: {
    settings: 'Settings',
    caregivers: 'Caregivers',
    recent: {
      eliminations: 'Recent Eliminations',
      feedings: 'Recent Feedings',
      sleeps: 'Recent Sleep',
      viewAll: 'View All',
      photos: 'Recent Photos',
      noData: {
        eliminations: 'No eliminations recorded',
        feedings: 'No feedings recorded',
        sleeps: 'No sleep sessions recorded',
        photos: 'No photos uploaded'
      }
    },
    details: {
      weight: 'Weight',
      amount: 'Amount',
      quality: 'Quality',
      caption: 'Caption',
    }
  },
  newBaby: {
    title: 'Add New Baby',
    fields: {
      firstName: 'First Name',
      lastName: 'Last Name',
      dateOfBirth: 'Date of Birth',
      gender: 'Gender'
    },
    genderOptions: {
      girl: 'Girl',
      boy: 'Boy'
    },
    submit: 'Add Baby',
    errors: {
      allFieldsRequired: 'All fields are required'
    }
  },
  register: {
    title: 'Create your account',
    fields: {
      firstName: 'First Name',
      lastName: 'Last Name',
      email: 'Email address',
      password: 'Password',
      phone: 'Phone',
      optional: '(optional)'
    },
    placeholders: {
      firstName: 'Enter your first name',
      lastName: 'Enter your last name',
      email: 'Enter your email',
      password: 'Enter your password',
      phone: 'Enter your phone number'
    },
    submit: 'Sign up',
    errors: {
      requiredFields: 'Please fill in all required fields',
      emailExists: 'An account with this email already exists',
      generic: 'Something went wrong. Please try again.'
    }
  },
  modal: {
    track: 'Track',
    addCaregiver: 'Add caregiver',
    email: 'Email',
    confirmation: 'An email invite will be send to:',
    actions: {
      cancel: 'Cancel',
      save: 'Save',
      next: 'Next',
      back: 'Back',
      confirm: 'Confirm'
    },
    close: 'cerrar'
  },
  settings: {
    language: "Language"
  },
  // Add more translation categories as needed
};

export type TranslationKeys = typeof en; 
