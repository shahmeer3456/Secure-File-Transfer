import React, { createContext, useContext, useEffect, useState } from 'react';
import { useSocket } from './SocketContext';
import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

// Create context
const PeerContext = createContext();

// Custom hook to use PeerContext
export const usePeer = () => useContext(PeerContext);

export const PeerProvider = ({ children, userId }) => {
  const { socket, isConnected } = useSocket();
  const [peers, setPeers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedPeer, setSelectedPeer] = useState(null);

  // Fetch all online peers
  const fetchPeers = async () => {
    if (!userId) return;

    setLoading(true);
    try {
      // Use both REST API and socket for peer discovery
      const response = await axios.get(`${API_URL}/peers`);
      
      // Also emit socket event for real-time peer discovery
      if (socket && isConnected) {
        console.log('Emitting discover_peers event');
        socket.emit('discover_peers');
      }
      
      // Display all peers for debugging
      console.log('Peers from API:', response.data.data);
      setPeers(response.data.data);
      
      // Previously:
      // Filter out the current user
      // const filteredPeers = response.data.data.filter(peer => peer._id !== userId);
      // console.log('Peers from API:', filteredPeers);
      // setPeers(filteredPeers);
    } catch (error) {
      console.error('Error fetching peers:', error);
    } finally {
      setLoading(false);
    }
  };

  // Initialize peer discovery when socket is connected
  useEffect(() => {
    if (isConnected && socket && userId) {
      console.log('PeerContext initialized with userId:', userId);
      
      // Fetch initial list of peers
      fetchPeers();

      // Register with socket
      console.log('Registering peer with socket', {
        userId,
        username: localStorage.getItem('username') || 'Anonymous',
        deviceName: localStorage.getItem('deviceName') || 'Unknown Device',
        ipAddress: localStorage.getItem('ipAddress') || '0.0.0.0'
      });
      
      socket.emit('register_peer', {
        userId,
        username: localStorage.getItem('username') || 'Anonymous',
        deviceName: localStorage.getItem('deviceName') || 'Unknown Device',
        ipAddress: localStorage.getItem('ipAddress') || '0.0.0.0'
      });

      // Instead of requesting peers immediately after registration, 
      // we'll rely on the server to send the peers list after registration

      // Listen for new peers
      socket.on('peer_connected', (data) => {
        console.log('New peer connected:', data);
        if (data.userId !== userId) {
          setPeers(prevPeers => {
            // Check if the peer already exists
            const exists = prevPeers.some(peer => peer._id === data.userId);
            if (!exists) {
              return [...prevPeers, {
                _id: data.userId,
                username: data.username,
                deviceName: data.deviceName,
                ipAddress: data.ipAddress,
                isOnline: true
              }];
            }
            return prevPeers;
          });
        }
      });

      // Listen for peer list updates
      socket.on('peers_list', (data) => {
        console.log('Received peers_list event:', data);
        if (data && data.peers) {
          // Don't filter out peers - display all of them for debugging
          console.log('All peers from socket:', data.peers);
          setPeers(data.peers);
          
          // Previously: We were filtering out the current user
          // const filteredPeers = data.peers.filter(peer => peer._id !== userId);
          // console.log('Filtered peers from socket:', filteredPeers);
          // setPeers(filteredPeers);
        }
      });

      // Listen for peer disconnections
      socket.on('peer_disconnected', (data) => {
        setPeers(prevPeers => 
          prevPeers.map(peer => 
            peer._id === data.userId 
              ? { ...peer, isOnline: false } 
              : peer
          )
        );

        // Clear selected peer if they disconnected
        if (selectedPeer && selectedPeer._id === data.userId) {
          setSelectedPeer(null);
        }
      });

      // Remove interval refresh to prevent constant polling
      // const interval = setInterval(fetchPeers, 30000); // Refresh every 30 seconds

      return () => {
        // Clean up event listeners
        socket.off('peer_connected');
        socket.off('peers_list');
        socket.off('peer_disconnected');
        // clearInterval(interval);
      };
    }
  }, [isConnected, socket, userId]);

  // Select a peer for file transfer
  const selectPeer = (peer) => {
    setSelectedPeer(peer);
  };

  // Send ping to keep connection alive
  const pingPeer = async () => {
    if (userId) {
      try {
        await axios.put(`${API_URL}/peers/${userId}/ping`);
      } catch (error) {
        console.error('Error pinging server:', error);
      }
    }
  };

  // Set up interval to ping server
  useEffect(() => {
    if (userId) {
      // Ping immediately
      pingPeer();
      
      // Set up interval
      const interval = setInterval(pingPeer, 60000); // Every minute
      
      return () => clearInterval(interval);
    }
  }, [userId]);

  // Disconnect when leaving the application
  const disconnectPeer = async () => {
    if (userId) {
      try {
        await axios.delete(`${API_URL}/peers/${userId}`);
        localStorage.removeItem('userId');
      } catch (error) {
        console.error('Error disconnecting peer:', error);
      }
    }
  };

  // Provide context values
  const value = {
    peers,
    loading,
    selectedPeer,
    selectPeer,
    fetchPeers,
    disconnectPeer
  };

  return (
    <PeerContext.Provider value={value}>
      {children}
    </PeerContext.Provider>
  );
}; 