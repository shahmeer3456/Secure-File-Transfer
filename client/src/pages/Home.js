import React from 'react';
import { Link } from 'react-router-dom';
import { FaUpload, FaDownload, FaHistory, FaLock, FaShieldAlt, FaNetworkWired } from 'react-icons/fa';
import { useSocket } from '../contexts/SocketContext';

const Home = () => {
  const { isConnected } = useSocket();

  return (
    <div>
      <div className="card" style={{ marginBottom: '30px' }}>
        <div style={{ textAlign: 'center', marginBottom: '20px' }}>
          <FaLock size={40} color="#1e88e5" />
          <h1 style={{ fontSize: '28px', marginTop: '10px' }}>
            Secure File Transfer
          </h1>
          <p style={{ color: '#666', marginTop: '5px' }}>
            Transfer files securely over a shared WiFi network with dynamic encryption
          </p>
        </div>

        {!isConnected && (
          <div className="alert alert-warning">
            <strong>Not connected to the server!</strong> Make sure the server is running and you are connected to the same network.
          </div>
        )}

        <div className="features" style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: '20px', marginTop: '20px' }}>
          <Link to="/send" className="card" style={{ flex: '1 1 300px', textDecoration: 'none', color: 'inherit', textAlign: 'center', padding: '30px 20px' }}>
            <FaUpload size={30} color="#1e88e5" style={{ marginBottom: '10px' }} />
            <h2 style={{ fontSize: '18px' }}>Send Files</h2>
            <p style={{ color: '#666', marginTop: '10px' }}>Encrypt and send files to peers on your network</p>
          </Link>

          <Link to="/receive" className="card" style={{ flex: '1 1 300px', textDecoration: 'none', color: 'inherit', textAlign: 'center', padding: '30px 20px' }}>
            <FaDownload size={30} color="#00c853" style={{ marginBottom: '10px' }} />
            <h2 style={{ fontSize: '18px' }}>Receive Files</h2>
            <p style={{ color: '#666', marginTop: '10px' }}>Accept incoming files and decrypt them automatically</p>
          </Link>

          <Link to="/history" className="card" style={{ flex: '1 1 300px', textDecoration: 'none', color: 'inherit', textAlign: 'center', padding: '30px 20px' }}>
            <FaHistory size={30} color="#f57c00" style={{ marginBottom: '10px' }} />
            <h2 style={{ fontSize: '18px' }}>Transfer History</h2>
            <p style={{ color: '#666', marginTop: '10px' }}>View your file transfer history and details</p>
          </Link>
        </div>
      </div>

      <div className="card">
        <h2 style={{ fontSize: '20px', marginBottom: '15px' }}>How It Works</h2>
        
        <div style={{ marginBottom: '20px' }}>
          <div style={{ display: 'flex', alignItems: 'center', marginBottom: '10px' }}>
            <FaNetworkWired size={20} style={{ marginRight: '10px', color: '#1e88e5' }} />
            <h3 style={{ fontSize: '16px' }}>Peer Discovery</h3>
          </div>
          <p>The application automatically discovers other devices running the same app on your WiFi network.</p>
        </div>
        
        <div style={{ marginBottom: '20px' }}>
          <div style={{ display: 'flex', alignItems: 'center', marginBottom: '10px' }}>
            <FaLock size={20} style={{ marginRight: '10px', color: '#1e88e5' }} />
            <h3 style={{ fontSize: '16px' }}>Dynamic Encryption</h3>
          </div>
          <p>Files are encrypted using one of six different classical cryptographic algorithms selected randomly for each transfer.</p>
        </div>
        
        <div>
          <div style={{ display: 'flex', alignItems: 'center', marginBottom: '10px' }}>
            <FaShieldAlt size={20} style={{ marginRight: '10px', color: '#1e88e5' }} />
            <h3 style={{ fontSize: '16px' }}>Secure Transfer</h3>
          </div>
          <p>Encrypted files are transferred directly between devices using WebRTC for peer-to-peer communication.</p>
        </div>
      </div>
    </div>
  );
};

export default Home; 