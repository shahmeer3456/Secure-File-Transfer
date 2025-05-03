/**
 * Encryption Manager
 * Handles selecting and using encryption algorithms
 */

// Import all cipher implementations
const caesarCipher = require('./ciphers/caesarCipher');
const hillCipher = require('./ciphers/hillCipher');
const railFenceCipher = require('./ciphers/railFenceCipher');
const rowTranspositionCipher = require('./ciphers/rowTranspositionCipher');
const affineCipher = require('./ciphers/affineCipher');
const playfairCipher = require('./ciphers/playfairCipher');

// Map of available ciphers
const CIPHERS = {
  CAESAR: 'Caesar',
  HILL: 'Hill',
  RAIL_FENCE: 'RailFence',
  ROW_TRANSPOSITION: 'RowTransposition',
  AFFINE: 'Affine',
  PLAYFAIR: 'Playfair'
};

// Implementation map
const cipherImplementations = {
  [CIPHERS.CAESAR]: caesarCipher,
  [CIPHERS.HILL]: hillCipher,
  [CIPHERS.RAIL_FENCE]: railFenceCipher,
  [CIPHERS.ROW_TRANSPOSITION]: rowTranspositionCipher,
  [CIPHERS.AFFINE]: affineCipher,
  [CIPHERS.PLAYFAIR]: playfairCipher
};

/**
 * Select a random cipher and return its name
 * @returns {string} Name of the selected cipher
 */
const selectRandomCipher = () => {
  const cipherNames = Object.values(CIPHERS);
  const randomIndex = Math.floor(Math.random() * cipherNames.length);
  return cipherNames[randomIndex];
};

/**
 * Generate a key for the specified cipher
 * @param {string} cipherName Name of the cipher
 * @returns {any} The generated key for the cipher
 */
const generateKey = (cipherName) => {
  const implementation = cipherImplementations[cipherName];
  
  if (!implementation) {
    throw new Error(`Cipher ${cipherName} not supported`);
  }
  
  return implementation.generateKey();
};

/**
 * Encrypt text using the specified cipher and key
 * @param {string} text Text to encrypt
 * @param {string} cipherName Name of the cipher to use
 * @param {any} key Key for the cipher
 * @returns {string} Encrypted text
 */
const encrypt = (text, cipherName, key) => {
  const implementation = cipherImplementations[cipherName];
  
  if (!implementation) {
    throw new Error(`Cipher ${cipherName} not supported`);
  }
  
  return implementation.encrypt(text, key);
};

/**
 * Decrypt text using the specified cipher and key
 * @param {string} encryptedText Text to decrypt
 * @param {string} cipherName Name of the cipher used for encryption
 * @param {any} key Key for the cipher
 * @returns {string} Decrypted text
 */
const decrypt = (encryptedText, cipherName, key) => {
  const implementation = cipherImplementations[cipherName];
  
  if (!implementation) {
    throw new Error(`Cipher ${cipherName} not supported`);
  }
  
  return implementation.decrypt(encryptedText, key);
};

/**
 * Create metadata for the encrypted file
 * @param {string} cipherName Name of the cipher used
 * @param {any} key The encryption key
 * @returns {Object} Metadata object
 */
const createEncryptionMetadata = (cipherName, key) => {
  return {
    algorithm: cipherName,
    params: key,
    timestamp: Date.now()
  };
};

module.exports = {
  CIPHERS,
  selectRandomCipher,
  generateKey,
  encrypt,
  decrypt,
  createEncryptionMetadata
}; 