/**
 * Caesar Cipher Implementation
 * Simple substitution cipher where each letter is shifted by a fixed number of positions
 */

const encryptCaesar = (text, shift) => {
  // Ensure shift is between 0 and 25
  shift = ((shift % 26) + 26) % 26;
  
  let result = '';
  
  for (let i = 0; i < text.length; i++) {
    let char = text[i];
    
    // Handle uppercase letters
    if (char.match(/[A-Z]/)) {
      const code = text.charCodeAt(i);
      char = String.fromCharCode(((code - 65 + shift) % 26) + 65);
    }
    // Handle lowercase letters
    else if (char.match(/[a-z]/)) {
      const code = text.charCodeAt(i);
      char = String.fromCharCode(((code - 97 + shift) % 26) + 97);
    }
    // Other characters remain unchanged
    
    result += char;
  }
  
  return result;
};

const decryptCaesar = (encryptedText, shift) => {
  // To decrypt, we shift in the opposite direction
  return encryptCaesar(encryptedText, 26 - shift);
};

// Generate a random shift value between 1 and 25
const generateCaesarKey = () => {
  return Math.floor(Math.random() * 25) + 1;
};

module.exports = {
  encrypt: encryptCaesar,
  decrypt: decryptCaesar,
  generateKey: generateCaesarKey
}; 