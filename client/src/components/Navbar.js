import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { FaLock, FaHistory, FaUpload, FaDownload } from 'react-icons/fa';
import { usePeer } from '../contexts/PeerContext';
import { useSocket } from '../contexts/SocketContext';

const Navbar = () => {
  const location = useLocation();
  const { isConnected } = useSocket();
  const { disconnectPeer } = usePeer();

  const handleLogout = () => {
    disconnectPeer();
    localStorage.removeItem('userId');
    localStorage.removeItem('deviceName');
    window.location.reload();
  };

  // Check if route is active
  const isActive = (path) => {
    return location.pathname === path;
  };

  return (
    <nav className="navbar">
      <div className="container nav-container">
        <Link to="/" className="nav-logo">
          <FaLock style={{ display: 'inline', marginRight: '8px' }} />
          Secure File Transfer
        </Link>

        <div style={{ display: 'flex', alignItems: 'center' }}>
          <div 
            className={`connection-status ${isConnected ? 'connected' : 'disconnected'}`}
            style={{ 
              width: '10px', 
              height: '10px', 
              borderRadius: '50%', 
              backgroundColor: isConnected ? '#00c853' : '#e53935',
              marginRight: '8px'
            }}
          />
          <span style={{ fontSize: '14px', marginRight: '20px' }}>
            {isConnected ? 'Connected' : 'Disconnected'}
          </span>
        </div>

        <ul className="nav-menu">
          <li className="nav-item">
            <Link 
              to="/" 
              className={`nav-link ${isActive('/') ? 'active' : ''}`}
            >
              Home
            </Link>
          </li>
          <li className="nav-item">
            <Link 
              to="/send" 
              className={`nav-link ${isActive('/send') ? 'active' : ''}`}
            >
              <FaUpload style={{ marginRight: '5px' }} />
              Send File
            </Link>
          </li>
          <li className="nav-item">
            <Link 
              to="/receive" 
              className={`nav-link ${isActive('/receive') ? 'active' : ''}`}
            >
              <FaDownload style={{ marginRight: '5px' }} />
              Receive
            </Link>
          </li>
          <li className="nav-item">
            <Link 
              to="/history" 
              className={`nav-link ${isActive('/history') ? 'active' : ''}`}
            >
              <FaHistory style={{ marginRight: '5px' }} />
              History
            </Link>
          </li>
          <li className="nav-item">
            <button 
              onClick={handleLogout} 
              className="btn btn-outline"
              style={{ marginLeft: '10px' }}
            >
              Logout
            </button>
          </li>
        </ul>
      </div>
    </nav>
  );
};

export default Navbar; 