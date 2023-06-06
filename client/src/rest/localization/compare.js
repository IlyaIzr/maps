import { enLocale } from "./enLocale.js";
import { ruLocale } from "./ruLocale.js";

function compareLocales() {
  const missingKeys = [];

  // Compare enLocale keys with ruLocale
  for (const key in enLocale) {
    if (!(key in ruLocale)) {
      missingKeys.push(`Missing key in ruLocale: ${key}`);
    }
  }

  // Compare ruLocale keys with enLocale
  for (const key in ruLocale) {
    if (!(key in enLocale)) {
      missingKeys.push(`Missing key in enLocale: ${key}`);
    }
  }

  if (!missingKeys.length) return console.log('No keys are missing! Well done ✅✅✅')
  // Log the missing keys
  missingKeys.forEach((missingKey) => {
    console.log(missingKey);
  });
}

compareLocales();
