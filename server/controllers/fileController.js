const FileTransfer = require('../models/FileTransfer');
const User = require('../models/User');
const encryptionManager = require('../utils/encryptionManager');

/**
 * Initiate a file transfer
 * @route POST /api/files/transfer
 */
const initiateFileTransfer = async (req, res) => {
  try {
    const { fileName, receiverId, fileSize, fileContent } = req.body;
    const senderId = req.body.senderId;
    
    // Validate inputs
    if (!fileName || !senderId || !receiverId || !fileSize || !fileContent) {
      return res.status(400).json({
        success: false,
        message: 'Missing required parameters'
      });
    }
    
    // Verify that sender and receiver exist
    const sender = await User.findById(senderId);
    const receiver = await User.findById(receiverId);
    
    if (!sender || !receiver) {
      return res.status(404).json({
        success: false,
        message: 'Sender or receiver not found'
      });
    }
    
    // Choose a random encryption algorithm
    const encryptionAlgorithm = encryptionManager.selectRandomCipher();
    
    // Generate encryption key for the chosen algorithm
    const encryptionKey = encryptionManager.generateKey(encryptionAlgorithm);
    
    // Encrypt the file content
    const encryptedContent = encryptionManager.encrypt(fileContent, encryptionAlgorithm, encryptionKey);
    
    // Create encryption metadata
    const encryptionMetadata = encryptionManager.createEncryptionMetadata(encryptionAlgorithm, encryptionKey);
    
    // Create a new file transfer record
    const fileTransfer = await FileTransfer.create({
      fileName,
      senderId,
      receiverId,
      encryptionAlgorithm,
      encryptionParams: encryptionKey,
      fileSize,
      status: 'pending'
    });
    
    // Return the encrypted file and transfer details
    res.status(201).json({
      success: true,
      data: {
        fileTransferId: fileTransfer._id,
        encryptedContent,
        encryptionMetadata
      }
    });
  } catch (error) {
    console.error('Error initiating file transfer:', error.message);
    res.status(500).json({
      success: false,
      message: 'Error initiating file transfer',
      error: error.message
    });
  }
};

/**
 * Update file transfer status
 * @route PUT /api/files/transfer/:id
 */
const updateTransferStatus = async (req, res) => {
  try {
    const { status } = req.body;
    
    if (!status || !['pending', 'completed', 'failed'].includes(status)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid status'
      });
    }
    
    const fileTransfer = await FileTransfer.findById(req.params.id);
    
    if (!fileTransfer) {
      return res.status(404).json({
        success: false,
        message: 'File transfer not found'
      });
    }
    
    fileTransfer.status = status;
    await fileTransfer.save();
    
    res.status(200).json({
      success: true,
      data: fileTransfer
    });
  } catch (error) {
    console.error('Error updating transfer status:', error.message);
    res.status(500).json({
      success: false,
      message: 'Error updating transfer status',
      error: error.message
    });
  }
};

/**
 * Get all file transfers for a user
 * @route GET /api/files/transfers/:userId
 */
const getUserTransfers = async (req, res) => {
  try {
    const userId = req.params.userId;
    
    // Get all transfers where user is either sender or receiver
    const transfers = await FileTransfer.find({
      $or: [
        { senderId: userId },
        { receiverId: userId }
      ]
    }).populate('senderId receiverId');
    
    res.status(200).json({
      success: true,
      count: transfers.length,
      data: transfers
    });
  } catch (error) {
    console.error('Error fetching user transfers:', error.message);
    res.status(500).json({
      success: false,
      message: 'Error fetching user transfers',
      error: error.message
    });
  }
};

/**
 * Decrypt a file
 * @route POST /api/files/decrypt
 */
const decryptFile = async (req, res) => {
  try {
    const { encryptedContent, encryptionMetadata } = req.body;
    
    if (!encryptedContent || !encryptionMetadata) {
      return res.status(400).json({
        success: false,
        message: 'Missing required parameters'
      });
    }
    
    const { algorithm, params } = encryptionMetadata;
    
    // Decrypt the file content
    const decryptedContent = encryptionManager.decrypt(encryptedContent, algorithm, params);
    
    res.status(200).json({
      success: true,
      data: {
        decryptedContent
      }
    });
  } catch (error) {
    console.error('Error decrypting file:', error.message);
    res.status(500).json({
      success: false,
      message: 'Error decrypting file',
      error: error.message
    });
  }
};

module.exports = {
  initiateFileTransfer,
  updateTransferStatus,
  getUserTransfers,
  decryptFile
}; 