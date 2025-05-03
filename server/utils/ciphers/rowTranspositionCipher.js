/**
 * Row Transposition Cipher Implementation
 * Rearranges the characters of a message according to a key
 */

const encryptRowTransposition = (text, key) => {
  // Key is an array that defines the column order
  // e.g., [3, 1, 4, 2] means column 3 goes first, then 1, then 4, then 2
  
  // Calculate number of rows needed
  const numCols = key.length;
  const numRows = Math.ceil(text.length / numCols);
  
  // Create grid and fill with characters
  const grid = Array(numRows).fill().map(() => Array(numCols).fill(''));
  
  let charIndex = 0;
  for (let row = 0; row < numRows; row++) {
    for (let col = 0; col < numCols; col++) {
      if (charIndex < text.length) {
        grid[row][col] = text[charIndex++];
      } else {
        // Pad with 'X' if needed
        grid[row][col] = 'X';
      }
    }
  }
  
  // Read off columns according to the key
  let result = '';
  for (let i = 0; i < key.length; i++) {
    const col = key.indexOf(i + 1); // Convert key value to 0-based index
    for (let row = 0; row < numRows; row++) {
      result += grid[row][col];
    }
  }
  
  return result;
};

const decryptRowTransposition = (encryptedText, key) => {
  // Calculate grid dimensions
  const numCols = key.length;
  const numRows = Math.ceil(encryptedText.length / numCols);
  const totalCells = numRows * numCols;
  
  // Create empty grid
  const grid = Array(numRows).fill().map(() => Array(numCols).fill(''));
  
  // Fill the columns according to the key
  let charIndex = 0;
  for (let i = 0; i < key.length; i++) {
    const col = key.indexOf(i + 1); // Convert key value to 0-based index
    for (let row = 0; row < numRows; row++) {
      if (charIndex < encryptedText.length) {
        grid[row][col] = encryptedText[charIndex++];
      }
    }
  }
  
  // Read the grid row by row
  let result = '';
  for (let row = 0; row < numRows; row++) {
    for (let col = 0; col < numCols; col++) {
      // Skip padding characters
      if (grid[row][col] !== 'X') {
        result += grid[row][col];
      }
    }
  }
  
  return result;
};

// Generate a random key (permutation of columns)
const generateRowTranspositionKey = (length = 5) => {
  // Create an array [1, 2, ..., length]
  const key = Array.from({ length }, (_, i) => i + 1);
  
  // Shuffle the array using Fisher-Yates algorithm
  for (let i = key.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [key[i], key[j]] = [key[j], key[i]];
  }
  
  return key;
};

module.exports = {
  encrypt: encryptRowTransposition,
  decrypt: decryptRowTransposition,
  generateKey: generateRowTranspositionKey
}; 