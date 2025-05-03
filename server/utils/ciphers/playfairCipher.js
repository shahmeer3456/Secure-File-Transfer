/**
 * Playfair Cipher Implementation
 * Uses a 5x5 key square to encrypt pairs of letters at a time
 */

// Create the 5x5 Playfair matrix from a key
const createPlayfairMatrix = (key) => {
  // Convert key to uppercase and remove non-alphabetic characters
  key = key.toUpperCase().replace(/[^A-Z]/g, '');
  
  // Replace J with I
  key = key.replace(/J/g, 'I');
  
  // Create the alphabet without duplicating letters from the key
  const alphabet = 'ABCDEFGHIKLMNOPQRSTUVWXYZ'; // Note: 'J' is omitted
  
  let matrix = '';
  
  // Add the key first (without duplicates)
  for (let i = 0; i < key.length; i++) {
    if (!matrix.includes(key[i])) {
      matrix += key[i];
    }
  }
  
  // Add the remaining alphabet
  for (let i = 0; i < alphabet.length; i++) {
    if (!matrix.includes(alphabet[i])) {
      matrix += alphabet[i];
    }
  }
  
  // Convert to 5x5 grid
  const grid = [];
  for (let i = 0; i < 5; i++) {
    grid.push(matrix.substring(i * 5, (i + 1) * 5).split(''));
  }
  
  return grid;
};

// Find a character's position in the matrix
const findPosition = (matrix, char) => {
  char = char === 'J' ? 'I' : char; // Convert J to I
  
  for (let row = 0; row < 5; row++) {
    for (let col = 0; col < 5; col++) {
      if (matrix[row][col] === char) {
        return { row, col };
      }
    }
  }
  return null;
};

// Prepare text for encryption (handle digraphs, etc.)
const prepareText = (text) => {
  // Convert to uppercase, remove non-alphabetic characters
  text = text.toUpperCase().replace(/[^A-Z]/g, '');
  
  // Replace J with I
  text = text.replace(/J/g, 'I');
  
  // Handle digraphs (same letter pairs)
  let result = '';
  for (let i = 0; i < text.length; i++) {
    result += text[i];
    if (i < text.length - 1) {
      if (text[i] === text[i + 1]) {
        result += 'X';
      }
    }
  }
  
  // If the length is odd, append 'X'
  if (result.length % 2 !== 0) {
    result += 'X';
  }
  
  return result;
};

const encryptPlayfair = (text, keyPhrase) => {
  const matrix = createPlayfairMatrix(keyPhrase);
  const preparedText = prepareText(text);
  let result = '';
  
  // Process pairs of characters
  for (let i = 0; i < preparedText.length; i += 2) {
    const char1 = preparedText[i];
    const char2 = preparedText[i + 1];
    
    const pos1 = findPosition(matrix, char1);
    const pos2 = findPosition(matrix, char2);
    
    let newChar1, newChar2;
    
    // Same row
    if (pos1.row === pos2.row) {
      newChar1 = matrix[pos1.row][(pos1.col + 1) % 5];
      newChar2 = matrix[pos2.row][(pos2.col + 1) % 5];
    } 
    // Same column
    else if (pos1.col === pos2.col) {
      newChar1 = matrix[(pos1.row + 1) % 5][pos1.col];
      newChar2 = matrix[(pos2.row + 1) % 5][pos2.col];
    } 
    // Rectangle case
    else {
      newChar1 = matrix[pos1.row][pos2.col];
      newChar2 = matrix[pos2.row][pos1.col];
    }
    
    result += newChar1 + newChar2;
  }
  
  return result;
};

const decryptPlayfair = (encryptedText, keyPhrase) => {
  const matrix = createPlayfairMatrix(keyPhrase);
  let result = '';
  
  // Process pairs of characters
  for (let i = 0; i < encryptedText.length; i += 2) {
    const char1 = encryptedText[i];
    const char2 = encryptedText[i + 1];
    
    const pos1 = findPosition(matrix, char1);
    const pos2 = findPosition(matrix, char2);
    
    let newChar1, newChar2;
    
    // Same row
    if (pos1.row === pos2.row) {
      newChar1 = matrix[pos1.row][(pos1.col - 1 + 5) % 5];
      newChar2 = matrix[pos2.row][(pos2.col - 1 + 5) % 5];
    } 
    // Same column
    else if (pos1.col === pos2.col) {
      newChar1 = matrix[(pos1.row - 1 + 5) % 5][pos1.col];
      newChar2 = matrix[(pos2.row - 1 + 5) % 5][pos2.col];
    } 
    // Rectangle case
    else {
      newChar1 = matrix[pos1.row][pos2.col];
      newChar2 = matrix[pos2.row][pos1.col];
    }
    
    result += newChar1 + newChar2;
  }
  
  // Remove padding 'X' characters that may have been added
  result = result.replace(/X(?=.)/g, '');
  if (result.endsWith('X')) {
    result = result.slice(0, -1);
  }
  
  return result;
};

// Generate a random key phrase for Playfair cipher
const generatePlayfairKey = () => {
  const words = [
    'SECURITY', 'NETWORK', 'CIPHER', 'CRYPTOGRAPHY', 'ENCRYPTION',
    'PROTOCOL', 'SECRECY', 'PRIVACY', 'CONFIDENTIAL', 'CLASSIFIED',
    'KEYBOARD', 'QUANTUM', 'ALGORITHM'
  ];
  
  return words[Math.floor(Math.random() * words.length)];
};

module.exports = {
  encrypt: encryptPlayfair,
  decrypt: decryptPlayfair,
  generateKey: generatePlayfairKey
}; 