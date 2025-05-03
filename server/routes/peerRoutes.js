const express = require('express');
const router = express.Router();
const peerController = require('../controllers/peerController');

// Register a new peer
router.post('/register', peerController.registerPeer);

// Get all active peers
router.get('/', peerController.getAllPeers);

// Ping a peer (update last seen timestamp)
router.put('/:id/ping', peerController.pingPeer);

// Disconnect a peer
router.delete('/:id', peerController.disconnectPeer);

module.exports = router; 