/**
 * Hill Cipher Implementation
 * Uses linear algebra to encrypt text using a key matrix
 */

// Helper functions for matrix operations
const matrixMultiply = (matrix, vector) => {
  const result = [];
  for (let i = 0; i < matrix.length; i++) {
    let sum = 0;
    for (let j = 0; j < matrix[0].length; j++) {
      sum += matrix[i][j] * vector[j];
    }
    result.push(sum % 26);
  }
  return result;
};

const determinant2x2 = (matrix) => {
  return (matrix[0][0] * matrix[1][1] - matrix[0][1] * matrix[1][0]) % 26;
};

const inverseMatrix2x2 = (matrix) => {
  const det = determinant2x2(matrix);
  let detInverse = 0;
  
  // Find modular multiplicative inverse of determinant
  for (let i = 0; i < 26; i++) {
    if ((det * i) % 26 === 1) {
      detInverse = i;
      break;
    }
  }
  
  if (detInverse === 0) {
    throw new Error("Matrix is not invertible");
  }
  
  const adjugate = [
    [matrix[1][1], -matrix[0][1]],
    [-matrix[1][0], matrix[0][0]]
  ];
  
  const inverse = adjugate.map(row => 
    row.map(val => {
      let modVal = (val * detInverse) % 26;
      return modVal < 0 ? modVal + 26 : modVal;
    })
  );
  
  return inverse;
};

// Convert text to numbers (A=0, B=1, ..., Z=25)
const textToNumbers = (text) => {
  return text.toUpperCase().split('')
    .filter(char => /[A-Z]/.test(char))
    .map(char => char.charCodeAt(0) - 65);
};

// Convert numbers back to text
const numbersToText = (numbers) => {
  return numbers.map(num => String.fromCharCode((num % 26) + 65)).join('');
};

const encryptHill = (text, keyMatrix) => {
  // Remove non-alphabetic characters and convert to uppercase
  const cleanText = text.replace(/[^A-Za-z]/g, '').toUpperCase();
  
  // Convert text to array of numbers
  const numbers = textToNumbers(cleanText);
  
  // If odd number of characters, pad with 'X'
  if (numbers.length % 2 !== 0) {
    numbers.push('X'.charCodeAt(0) - 65);
  }
  
  let result = '';
  
  // Process text in 2-character blocks
  for (let i = 0; i < numbers.length; i += 2) {
    const block = [numbers[i], numbers[i + 1]];
    const encrypted = matrixMultiply(keyMatrix, block);
    result += numbersToText(encrypted);
  }
  
  return result;
};

const decryptHill = (encryptedText, keyMatrix) => {
  try {
    const inverseKey = inverseMatrix2x2(keyMatrix);
    return encryptHill(encryptedText, inverseKey);
  } catch (error) {
    throw new Error("Decryption failed: " + error.message);
  }
};

// Generate a random invertible 2x2 matrix for Hill cipher
const generateHillKey = () => {
  let matrix;
  let det;
  
  do {
    matrix = [
      [Math.floor(Math.random() * 26), Math.floor(Math.random() * 26)],
      [Math.floor(Math.random() * 26), Math.floor(Math.random() * 26)]
    ];
    
    det = determinant2x2(matrix);
    // Check if the determinant has a modular multiplicative inverse
    let hasInverse = false;
    for (let i = 0; i < 26; i++) {
      if ((det * i) % 26 === 1) {
        hasInverse = true;
        break;
      }
    }
    
    if (det !== 0 && det % 2 !== 0 && det % 13 !== 0 && hasInverse) {
      break;
    }
  } while (true);
  
  return matrix;
};

module.exports = {
  encrypt: encryptHill,
  decrypt: decryptHill,
  generateKey: generateHillKey
}; 