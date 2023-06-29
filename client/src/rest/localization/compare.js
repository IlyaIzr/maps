// const fs = require('fs');
// const path = require('path');
// const { enLocale } = require('./enLocale.js');
// const { ruLocale } = require('./ruLocale.js');
import fs from 'fs'
import path from 'path'
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


const filesPath = path.join(process.cwd(), '../../');

function searchAndCompareKeys() {
  const missingKeys = [];

  // Traverse files in the 'src' directory
  traverseDirectory(filesPath, (filePath) => {
    const fileContents = fs.readFileSync(filePath, 'utf8');

    // Search for occurrences of TEXT.<something>
    const regex = /TEXT\.([^\s.;'"<>{}(),]+)/g;

    let match;
    while ((match = regex.exec(fileContents)) !== null) {
      const key = match[1];

      // Check if the key exists in enLocale
      if (!(key in enLocale)) {
        missingKeys.push(`Key '${key}' missing in the en localization`);
      }

      // Check if the key exists in ruLocale
      if (!(key in ruLocale)) {
        missingKeys.push(`Key '${key}' missing in the ru localization`);
      }
    }
  });

  if (!missingKeys.length) {
    console.log('No particular keys from code are missing! Well done 4 sure ✅✅✅✅');
  } else {
    missingKeys.forEach((missingKey) => {
      console.log(missingKey);
    });
  }
}

function traverseDirectory(directoryPath, callback) {
  fs.readdirSync(directoryPath).forEach((file) => {
    const filePath = path.join(directoryPath, file);
    const stats = fs.statSync(filePath);
    if (stats.isDirectory()) {
      traverseDirectory(filePath, callback);
    } else {
      callback(filePath);
    }
  });
}

searchAndCompareKeys();
