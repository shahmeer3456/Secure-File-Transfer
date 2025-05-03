/**
 * Socket.io Manager for Real-time Communication
 */
const User = require('../models/User');
const mongoose = require('mongoose');

let io;

// Initialize Socket.io with the HTTP server
const initialize = (server) => {
  io = require('socket.io')(server, {
    cors: {
      origin: '*',
      methods: ['GET', 'POST']
    }
  });
  
  setupSocketEventHandlers();
  
  return io;
};

// Set up socket event handlers
const setupSocketEventHandlers = () => {
  io.on('connection', (socket) => {
    console.log(`New socket connection: ${socket.id}`);
    
    // Handle user registration
    socket.on('register_peer', async (data) => {
      try {
        console.log('Received register_peer event with data:', data);
        const { userId, username, deviceName, ipAddress } = data;
        
        // Generate a username based on deviceName if not provided
        const finalUsername = username || `user_${deviceName.replace(/\s+/g, '_').toLowerCase()}_${Math.floor(Math.random() * 1000)}`;
        
        let user;
        
        // If userId is provided and valid, try to find the user by ID first
        if (userId && mongoose.Types.ObjectId.isValid(userId)) {
          user = await User.findById(userId);
          console.log('Looked up user by ID:', userId, user ? 'found' : 'not found');
        }
        
        // If no user found by ID, try to find by deviceName and ipAddress
        if (!user) {
          user = await User.findOne({ deviceName, ipAddress });
          console.log('Looked up user by deviceName and ipAddress:', user ? 'found' : 'not found');
        }
        
        if (user) {
          // Update existing user
          user.username = finalUsername;
          user.isOnline = true;
          user.lastSeen = new Date();
          await user.save();
          console.log('Updated existing user:', user._id.toString());
        } else {
          // Create new user
          user = await User.create({
            username: finalUsername,
            deviceName,
            ipAddress,
            isOnline: true
          });
          console.log('Created new user:', user._id.toString());
        }
        
        // Store socket ID with user
        socket.userId = user._id.toString();
        
        // Join a room for this user
        socket.join(socket.userId);
        
        // Notify all other peers about new peer
        socket.broadcast.emit('peer_connected', {
          userId: socket.userId,
          username: user.username,
          deviceName,
          ipAddress
        });
        
        // Emit peers_list event immediately after registration
        // Find all online peers including the requesting user
        const peers = await User.find({ isOnline: true }).select('_id username deviceName ipAddress isOnline lastSeen');
        
        // Log the peers we're sending to the newly registered user
        console.log(`Sending initial peer list to ${user.username}:`, 
          peers.map(p => ({ 
            id: p._id, 
            username: p.username,
            deviceName: p.deviceName
          }))
        );
        
        // Send the peer list
        socket.emit('peers_list', { peers });
        
        console.log(`Peer registered: ${user.username} (${deviceName}) with ID ${socket.userId}`);
      } catch (error) {
        console.error('Error registering peer:', error.message);
      }
    });
    
    // Handle peer discovery request (manually triggered by refresh button)
    socket.on('discover_peers', async () => {
      try {
        console.log(`Peer ${socket.userId} manually requested peer discovery`);
        
        // Find all online peers including the requesting user
        const peers = await User.find({ isOnline: true }).select('_id username deviceName ipAddress isOnline lastSeen');
        
        // Log detailed peer information for debugging
        console.log(`Found ${peers.length} online peers for manual request:`, 
          peers.map(p => ({ 
            id: p._id, 
            username: p.username, 
            deviceName: p.deviceName,
            isCurrentUser: p._id.toString() === socket.userId
          }))
        );
        
        // Send peers list to the requesting socket
        socket.emit('peers_list', { peers });
        console.log('Sent peers_list event for manual refresh');
      } catch (error) {
        console.error('Error in discover_peers event:', error.message);
      }
    });
    
    // Handle file transfer initiation
    socket.on('initiate_transfer', (data) => {
      try {
        const { receiverId, transferData } = data;
        
        // Notify the receiver about incoming file
        io.to(receiverId).emit('incoming_file', transferData);
      } catch (error) {
        console.error('Error in initiate_transfer event:', error.message);
      }
    });
    
    // Handle file transfer response (accept/reject)
    socket.on('transfer_response', (data) => {
      try {
        const { senderId, transferId, accepted } = data;
        
        // Notify the sender about receiver's response
        io.to(senderId).emit('transfer_response', {
          transferId,
          accepted
        });
      } catch (error) {
        console.error('Error in transfer_response event:', error.message);
      }
    });
    
    // Handle WebRTC signaling
    socket.on('webrtc_signal', (data) => {
      try {
        const { targetId, signal } = data;
        
        // Forward the signal to the target peer
        io.to(targetId).emit('webrtc_signal', {
          senderId: socket.userId,
          signal
        });
      } catch (error) {
        console.error('Error in webrtc_signal event:', error.message);
      }
    });
    
    // Handle disconnection
    socket.on('disconnect', async () => {
      try {
        if (socket.userId) {
          // Update user status in database
          await User.findByIdAndUpdate(
            socket.userId,
            { isOnline: false, lastSeen: new Date() },
            { new: true }
          );
          
          // Notify other peers
          socket.broadcast.emit('peer_disconnected', {
            userId: socket.userId
          });
          
          console.log(`Peer disconnected: ${socket.userId}`);
        }
      } catch (error) {
        console.error('Error handling disconnection:', error.message);
      }
    });
  });
};

// Send a message to a specific user
const sendToUser = (userId, event, data) => {
  if (io) {
    io.to(userId).emit(event, data);
  }
};

// Broadcast a message to all connected users
const broadcastToAll = (event, data) => {
  if (io) {
    io.emit(event, data);
  }
};

module.exports = {
  initialize,
  sendToUser,
  broadcastToAll
}; 