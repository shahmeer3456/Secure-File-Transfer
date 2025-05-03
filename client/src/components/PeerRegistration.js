import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import { FaLock } from 'react-icons/fa';
import { peerAPI } from '../utils/api';

const PeerRegistration = ({ onRegisterSuccess }) => {
  const [username, setUsername] = useState('');
  const [deviceName, setDeviceName] = useState('');
  const [ipAddress, setIpAddress] = useState('');
  const [loading, setLoading] = useState(false);

  // Try to get IP address on component mount
  useEffect(() => {
    // Get the user's IP address
    const getIPAddress = async () => {
      try {
        // This is a public API that returns the user's IP address
        const response = await fetch('https://api.ipify.org?format=json');
        const data = await response.json();
        setIpAddress(data.ip);
      } catch (error) {
        console.error('Error getting IP address:', error);
        // Set a fallback IP
        setIpAddress('127.0.0.1');
      }
    };

    getIPAddress();

    // Try to get saved values from localStorage
    const savedUsername = localStorage.getItem('username');
    const savedDeviceName = localStorage.getItem('deviceName');
    
    if (savedUsername) {
      setUsername(savedUsername);
    }
    
    if (savedDeviceName) {
      setDeviceName(savedDeviceName);
    } else {
      // Generate a device name based on browser and OS
      const browserInfo = navigator.userAgent;
      let generatedName = 'Unknown Device';
      
      if (browserInfo.includes('Windows')) {
        generatedName = 'Windows Device';
      } else if (browserInfo.includes('Mac')) {
        generatedName = 'Mac Device';
      } else if (browserInfo.includes('Linux')) {
        generatedName = 'Linux Device';
      } else if (browserInfo.includes('Android')) {
        generatedName = 'Android Device';
      } else if (browserInfo.includes('iPhone') || browserInfo.includes('iPad')) {
        generatedName = 'iOS Device';
      }
      
      setDeviceName(generatedName);
    }
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!username.trim() || !deviceName.trim() || !ipAddress.trim()) {
      toast.error('Please fill in all fields');
      return;
    }
    
    setLoading(true);
    
    try {
      const response = await peerAPI.register(username.trim(), deviceName.trim(), ipAddress.trim());
      
      // Save user info to localStorage
      localStorage.setItem('username', username.trim());
      localStorage.setItem('deviceName', deviceName.trim());
      localStorage.setItem('ipAddress', ipAddress.trim());
      
      // Notify parent component of successful registration
      onRegisterSuccess(response.data.data._id);
      
      toast.success('Successfully registered!');
    } catch (error) {
      console.error('Registration error:', error);
      toast.error('Failed to register. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ 
      display: 'flex', 
      justifyContent: 'center', 
      alignItems: 'center', 
      minHeight: '100vh',
      backgroundColor: '#f5f8fa' 
    }}>
      <div className="card" style={{ maxWidth: '400px', width: '100%' }}>
        <div style={{ textAlign: 'center', marginBottom: '20px' }}>
          <FaLock size={40} color="#1e88e5" />
          <h1 style={{ fontSize: '24px', marginTop: '10px' }}>Secure File Transfer</h1>
          <p style={{ color: '#666', marginTop: '5px' }}>Register your device to get started</p>
        </div>
        
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label" htmlFor="username">Username</label>
            <input
              type="text"
              id="username"
              className="form-control"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Enter your username"
              required
            />
          </div>
          
          <div className="form-group">
            <label className="form-label" htmlFor="deviceName">Device Name</label>
            <input
              type="text"
              id="deviceName"
              className="form-control"
              value={deviceName}
              onChange={(e) => setDeviceName(e.target.value)}
              placeholder="Enter a name for your device"
              required
            />
          </div>
          
          <div className="form-group">
            <label className="form-label" htmlFor="ipAddress">IP Address</label>
            <input
              type="text"
              id="ipAddress"
              className="form-control"
              value={ipAddress}
              onChange={(e) => setIpAddress(e.target.value)}
              placeholder="Your IP address"
              required
            />
          </div>
          
          <button 
            type="submit" 
            className="btn btn-primary" 
            style={{ width: '100%', marginTop: '10px' }}
            disabled={loading}
          >
            {loading ? (
              <span className="spinner" style={{ width: '20px', height: '20px', marginRight: '10px' }}></span>
            ) : null}
            Register
          </button>
        </form>
      </div>
    </div>
  );
};

export default PeerRegistration; 