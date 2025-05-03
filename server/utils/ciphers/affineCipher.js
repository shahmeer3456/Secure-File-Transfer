/**
 * Affine Cipher Implementation
 * Each letter is mapped to its numeric equivalent, encrypted using a linear function,
 * and converted back to a letter.
 */

// Helper function to find the modular multiplicative inverse
const findModInverse = (a, m) => {
  a = ((a % m) + m) % m; // Ensure a is positive
  
  for (let x = 1; x < m; x++) {
    if ((a * x) % m === 1) {
      return x;
    }
  }
  return 1; // Default value, but this shouldn't happen for valid 'a' values
};

// Greatest Common Divisor
const gcd = (a, b) => {
  if (b === 0) return a;
  return gcd(b, a % b);
};

const encryptAffine = (text, key) => {
  const { a, b } = key;
  let result = '';
  
  for (let i = 0; i < text.length; i++) {
    const char = text[i];
    
    if (char.match(/[A-Z]/)) {
      // For uppercase letters
      const code = text.charCodeAt(i) - 65;
      const encryptedCode = ((a * code + b) % 26 + 26) % 26;
      result += String.fromCharCode(encryptedCode + 65);
    } else if (char.match(/[a-z]/)) {
      // For lowercase letters
      const code = text.charCodeAt(i) - 97;
      const encryptedCode = ((a * code + b) % 26 + 26) % 26;
      result += String.fromCharCode(encryptedCode + 97);
    } else {
      // Keep non-alphabetic characters as is
      result += char;
    }
  }
  
  return result;
};

const decryptAffine = (encryptedText, key) => {
  const { a, b } = key;
  const aInverse = findModInverse(a, 26);
  let result = '';
  
  for (let i = 0; i < encryptedText.length; i++) {
    const char = encryptedText[i];
    
    if (char.match(/[A-Z]/)) {
      // For uppercase letters
      const code = encryptedText.charCodeAt(i) - 65;
      const decryptedCode = ((aInverse * (code - b)) % 26 + 26) % 26;
      result += String.fromCharCode(decryptedCode + 65);
    } else if (char.match(/[a-z]/)) {
      // For lowercase letters
      const code = encryptedText.charCodeAt(i) - 97;
      const decryptedCode = ((aInverse * (code - b)) % 26 + 26) % 26;
      result += String.fromCharCode(decryptedCode + 97);
    } else {
      // Keep non-alphabetic characters as is
      result += char;
    }
  }
  
  return result;
};

// Generate a valid affine cipher key
const generateAffineKey = () => {
  // 'a' must be coprime with 26, so can be 1, 3, 5, 7, 9, 11, 15, 17, 19, 21, 23, or 25
  const validA = [1, 3, 5, 7, 9, 11, 15, 17, 19, 21, 23, 25];
  const a = validA[Math.floor(Math.random() * validA.length)];
  const b = Math.floor(Math.random() * 26); // any value from 0 to 25 is valid for b
  
  return { a, b };
};

module.exports = {
  encrypt: encryptAffine,
  decrypt: decryptAffine,
  generateKey: generateAffineKey
}; 