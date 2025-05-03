/**
 * Rail Fence Cipher Implementation
 * A transposition cipher that gets its name from the way the message is encoded
 */

const encryptRailFence = (text, rails) => {
  // Remove spaces and non-alphanumeric characters
  text = text.replace(/\s/g, '');
  
  if (rails < 2) return text;
  
  // Create rails
  const fence = Array(rails).fill().map(() => []);
  
  // Direction: 1 for down, -1 for up
  let dir = -1;
  let row = 0;
  
  // Fill the rails
  for (let i = 0; i < text.length; i++) {
    // Change direction when we hit the top or bottom rail
    if (row === 0 || row === rails - 1) {
      dir *= -1;
    }
    
    // Add character to current rail
    fence[row].push(text[i]);
    
    // Move to next rail
    row += dir;
  }
  
  // Read off the rails
  let result = '';
  for (let i = 0; i < rails; i++) {
    result += fence[i].join('');
  }
  
  return result;
};

const decryptRailFence = (encryptedText, rails) => {
  if (rails < 2) return encryptedText;
  
  // Calculate positions first
  const positions = [];
  let dir = -1;
  let row = 0;
  
  // Mark positions for each rail
  for (let i = 0; i < encryptedText.length; i++) {
    if (row === 0 || row === rails - 1) {
      dir *= -1;
    }
    
    positions.push(row);
    row += dir;
  }
  
  // Create the fence with empty strings
  const fence = Array(rails).fill().map(() => []);
  
  // Count characters in each rail
  const railLengths = Array(rails).fill(0);
  for (let pos of positions) {
    railLengths[pos]++;
  }
  
  // Fill the fence with the encrypted text
  let index = 0;
  for (let i = 0; i < rails; i++) {
    fence[i] = encryptedText.substring(index, index + railLengths[i]).split('');
    index += railLengths[i];
  }
  
  // Read off the fence in zig-zag order
  let result = '';
  for (let pos of positions) {
    result += fence[pos].shift();
  }
  
  return result;
};

// Generate a random number of rails between 2 and 7
const generateRailFenceKey = () => {
  return Math.floor(Math.random() * 6) + 2; // 2 to 7 rails
};

module.exports = {
  encrypt: encryptRailFence,
  decrypt: decryptRailFence,
  generateKey: generateRailFenceKey
}; 