const User = require('../models/User');

/**
 * Register a new peer
 * @route POST /api/peers/register
 */
const registerPeer = async (req, res) => {
  try {
    const { username, deviceName, ipAddress } = req.body;
    
    if (!username || !deviceName || !ipAddress) {
      return res.status(400).json({
        success: false,
        message: 'Username, device name, and IP address are required'
      });
    }
    
    // Check if the peer already exists
    let peer = await User.findOne({ ipAddress });
    
    if (peer) {
      // Update existing peer
      peer.username = username;
      peer.deviceName = deviceName;
      peer.lastSeen = Date.now();
      peer.isOnline = true;
      await peer.save();
    } else {
      // Create new peer
      peer = await User.create({
        username,
        deviceName,
        ipAddress,
        lastSeen: Date.now(),
        isOnline: true
      });
    }
    
    res.status(201).json({
      success: true,
      data: peer
    });
  } catch (error) {
    console.error('Error registering peer:', error.message);
    res.status(500).json({
      success: false,
      message: 'Error registering peer',
      error: error.message
    });
  }
};

/**
 * Get all active peers
 * @route GET /api/peers
 */
const getAllPeers = async (req, res) => {
  try {
    // Cleanup peers that haven't been seen in the last 5 minutes
    const fiveMinutesAgo = new Date(Date.now() - 5 * 60 * 1000);
    await User.updateMany(
      { lastSeen: { $lt: fiveMinutesAgo } },
      { isOnline: false }
    );
    
    // Get all online peers
    const peers = await User.find({ isOnline: true });
    console.log(`API: Found ${peers.length} online peers:`, peers.map(p => ({ id: p._id, username: p.username })));
    
    res.status(200).json({
      success: true,
      count: peers.length,
      data: peers
    });
  } catch (error) {
    console.error('Error fetching peers:', error.message);
    res.status(500).json({
      success: false,
      message: 'Error fetching peers',
      error: error.message
    });
  }
};

/**
 * Update peer's last seen timestamp
 * @route PUT /api/peers/:id/ping
 */
const pingPeer = async (req, res) => {
  try {
    const peer = await User.findById(req.params.id);
    
    if (!peer) {
      return res.status(404).json({
        success: false,
        message: 'Peer not found'
      });
    }
    
    peer.lastSeen = Date.now();
    peer.isOnline = true;
    await peer.save();
    
    res.status(200).json({
      success: true,
      data: peer
    });
  } catch (error) {
    console.error('Error pinging peer:', error.message);
    res.status(500).json({
      success: false,
      message: 'Error pinging peer',
      error: error.message
    });
  }
};

/**
 * Remove a peer when disconnecting
 * @route DELETE /api/peers/:id
 */
const disconnectPeer = async (req, res) => {
  try {
    const peer = await User.findById(req.params.id);
    
    if (!peer) {
      return res.status(404).json({
        success: false,
        message: 'Peer not found'
      });
    }
    
    peer.isOnline = false;
    await peer.save();
    
    res.status(200).json({
      success: true,
      message: 'Peer disconnected successfully'
    });
  } catch (error) {
    console.error('Error disconnecting peer:', error.message);
    res.status(500).json({
      success: false,
      message: 'Error disconnecting peer',
      error: error.message
    });
  }
};

module.exports = {
  registerPeer,
  getAllPeers,
  pingPeer,
  disconnectPeer
}; 