const express = require('express');
const router = express.Router();
const fileController = require('../controllers/fileController');

// Initiate a file transfer
router.post('/transfer', fileController.initiateFileTransfer);

// Update file transfer status
router.put('/transfer/:id', fileController.updateTransferStatus);

// Get all file transfers for a user
router.get('/transfers/:userId', fileController.getUserTransfers);

// Decrypt a file
router.post('/decrypt', fileController.decryptFile);

module.exports = router; 