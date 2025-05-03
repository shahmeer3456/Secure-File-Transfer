import React, { useEffect, useState } from 'react';
import { FaUser, FaRedoAlt } from 'react-icons/fa';
import { usePeer } from '../contexts/PeerContext';

const PeerList = ({ onSelectPeer }) => {
  const { peers, loading, selectedPeer, selectPeer, fetchPeers } = usePeer();
  const [initialFetchDone, setInitialFetchDone] = useState(false);

  // Fetch peers only on component mount
  useEffect(() => {
    console.log('PeerList component mounted');
    
    // Only fetch peers if we haven't fetched them before
    if (!initialFetchDone && peers.length === 0) {
      fetchPeers();
      setInitialFetchDone(true);
    }
    
    // No interval polling - only fetch on mount and manual refresh
  }, [fetchPeers, initialFetchDone, peers.length]);

  // Add debugging for peers
  useEffect(() => {
    console.log('PeerList peers updated:', peers);
    
    // Mark initial fetch as done if we got some peers
    if (peers.length > 0 && !initialFetchDone) {
      setInitialFetchDone(true);
    }
  }, [peers, initialFetchDone]);

  const handleSelectPeer = (peer) => {
    selectPeer(peer);
    if (onSelectPeer) {
      onSelectPeer(peer);
    }
  };

  // Debug function to show peer data in console and refresh peers manually
  const refreshPeers = () => {
    console.log('Manual refresh requested');
    console.log('Current peers:', peers);
    console.log('Selected peer:', selectedPeer);
    fetchPeers();
  };

  return (
    <div className="card">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '15px' }}>
        <h2 style={{ fontSize: '18px', margin: 0 }}>
          Available Peers ({peers.length})
        </h2>
        <button 
          className="btn btn-outline" 
          style={{ padding: '5px 10px' }}
          onClick={refreshPeers}
          disabled={loading}
        >
          <FaRedoAlt style={{ marginRight: loading ? '5px' : 0 }} />
          {loading ? ' Refreshing...' : ' Refresh Peers'}
        </button>
      </div>

      {loading ? (
        <div style={{ display: 'flex', justifyContent: 'center', padding: '20px' }}>
          <div className="spinner"></div>
        </div>
      ) : peers && peers.length > 0 ? (
        <ul className="peer-list">
          {peers.map((peer) => (
            <li 
              key={peer._id} 
              className={`peer-item ${selectedPeer && selectedPeer._id === peer._id ? 'selected' : ''}`}
              onClick={() => handleSelectPeer(peer)}
            >
              <div className={`peer-status ${peer.isOnline ? 'online' : 'offline'}`}></div>
              <FaUser style={{ marginRight: '10px', color: '#555' }} />
              <div className="peer-info">
                <div className="peer-name">{peer.username || 'Anonymous'}</div>
                <div className="peer-device">{peer.deviceName}</div>
                <div className="peer-address">{peer.ipAddress}</div>
                <div className="peer-id" style={{ fontSize: '10px', color: '#999' }}>ID: {peer._id}</div>
              </div>
            </li>
          ))}
        </ul>
      ) : (
        <div style={{ textAlign: 'center', padding: '20px', color: '#666' }}>
          <p>No peers found on your network</p>
          <p style={{ fontSize: '12px', marginTop: '10px' }}>
            Make sure other devices are connected to the same WiFi network and have the application running.
          </p>
        </div>
      )}
    </div>
  );
};

export default PeerList; 