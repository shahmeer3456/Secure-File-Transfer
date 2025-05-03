import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

// Create axios instance with default config
const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Peer API endpoints
export const peerAPI = {
  // Register a new peer
  register: (username, deviceName, ipAddress) => {
    return api.post('/peers/register', { username, deviceName, ipAddress });
  },
  
  // Get all online peers
  getAllPeers: () => {
    return api.get('/peers');
  },
  
  // Ping to keep connection alive
  ping: (peerId) => {
    return api.put(`/peers/${peerId}/ping`);
  },
  
  // Disconnect peer
  disconnect: (peerId) => {
    return api.delete(`/peers/${peerId}`);
  }
};

// File transfer API endpoints
export const fileAPI = {
  // Initiate a file transfer
  initiateTransfer: (data) => {
    return api.post('/files/transfer', data);
  },
  
  // Update transfer status
  updateTransferStatus: (transferId, status) => {
    return api.put(`/files/transfer/${transferId}`, { status });
  },
  
  // Get all transfers for a user
  getUserTransfers: (userId) => {
    return api.get(`/files/transfers/${userId}`);
  },
  
  // Decrypt a file
  decryptFile: (encryptedContent, encryptionMetadata) => {
    return api.post('/files/decrypt', { encryptedContent, encryptionMetadata });
  }
};

export default {
  peerAPI,
  fileAPI
}; 