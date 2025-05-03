const mongoose = require('mongoose');

const FileTransferSchema = new mongoose.Schema({
  fileName: {
    type: String,
    required: true
  },
  senderId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  receiverId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  encryptionAlgorithm: {
    type: String,
    required: true,
    enum: ['Hill', 'Caesar', 'RailFence', 'RowTransposition', 'Affine', 'Playfair']
  },
  encryptionParams: {
    type: Object,
    required: true
  },
  status: {
    type: String,
    enum: ['pending', 'completed', 'failed'],
    default: 'pending'
  },
  fileSize: {
    type: Number,
    required: true
  }
}, { timestamps: true });

module.exports = mongoose.model('FileTransfer', FileTransferSchema); 