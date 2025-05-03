import React, { useState, useEffect } from 'react';
import { FaHistory, FaUpload, FaDownload, FaCheck, FaTimes, FaClock, FaKey } from 'react-icons/fa';
import { fileAPI } from '../utils/api';

const TransferHistory = ({ userId }) => {
  const [transfers, setTransfers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (userId) {
      fetchTransferHistory();
    }
  }, [userId]);

  const fetchTransferHistory = async () => {
    setLoading(true);
    try {
      const response = await fileAPI.getUserTransfers(userId);
      // Sort by most recent first
      const sortedTransfers = response.data.data.sort((a, b) => 
        new Date(b.createdAt) - new Date(a.createdAt)
      );
      setTransfers(sortedTransfers);
      setError(null);
    } catch (error) {
      console.error('Error fetching transfer history:', error);
      setError('Failed to fetch transfer history. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  // Function to determine if the user was the sender
  const isSender = (transfer) => {
    return transfer.senderId._id === userId;
  };

  // Format date
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleString();
  };

  // Get status icon based on transfer status
  const getStatusIcon = (status) => {
    switch (status) {
      case 'completed':
        return <FaCheck style={{ color: '#00c853' }} />;
      case 'pending':
        return <FaClock style={{ color: '#f57c00' }} />;
      case 'failed':
        return <FaTimes style={{ color: '#e53935' }} />;
      default:
        return <FaClock style={{ color: '#f57c00' }} />;
    }
  };

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        <h1 style={{ fontSize: '24px', margin: 0 }}>Transfer History</h1>
        <button 
          className="btn btn-outline"
          onClick={fetchTransferHistory}
          disabled={loading}
        >
          {loading ? 'Refreshing...' : 'Refresh'}
        </button>
      </div>

      {error && (
        <div className="alert alert-danger" style={{ marginBottom: '20px' }}>
          {error}
        </div>
      )}

      <div className="card">
        {loading ? (
          <div style={{ display: 'flex', justifyContent: 'center', padding: '40px' }}>
            <div className="spinner"></div>
          </div>
        ) : transfers.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '40px 20px', color: '#666' }}>
            <FaHistory size={30} color="#1e88e5" style={{ marginBottom: '15px' }} />
            <p>No transfer history found</p>
            <p style={{ fontSize: '12px', marginTop: '10px' }}>
              Start sending or receiving files to see your transfer history here.
            </p>
          </div>
        ) : (
          <div>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ borderBottom: '1px solid #eee' }}>
                  <th style={{ padding: '10px', textAlign: 'left' }}>Type</th>
                  <th style={{ padding: '10px', textAlign: 'left' }}>File</th>
                  <th style={{ padding: '10px', textAlign: 'left' }}>With</th>
                  <th style={{ padding: '10px', textAlign: 'left' }}>Encryption</th>
                  <th style={{ padding: '10px', textAlign: 'left' }}>Date</th>
                  <th style={{ padding: '10px', textAlign: 'left' }}>Status</th>
                </tr>
              </thead>
              <tbody>
                {transfers.map((transfer) => {
                  const sender = isSender(transfer);
                  const otherParty = sender ? transfer.receiverId : transfer.senderId;
                  
                  return (
                    <tr key={transfer._id} style={{ borderBottom: '1px solid #eee' }}>
                      <td style={{ padding: '10px' }}>
                        {sender ? (
                          <FaUpload style={{ color: '#1e88e5' }} />
                        ) : (
                          <FaDownload style={{ color: '#00c853' }} />
                        )}
                      </td>
                      <td style={{ padding: '10px' }}>{transfer.fileName}</td>
                      <td style={{ padding: '10px' }}>
                        {otherParty ? otherParty.deviceName : 'Unknown'}
                      </td>
                      <td style={{ padding: '10px' }}>
                        <div style={{ display: 'flex', alignItems: 'center' }}>
                          <FaKey style={{ marginRight: '5px', color: '#1e88e5', fontSize: '12px' }} />
                          {transfer.encryptionAlgorithm}
                        </div>
                      </td>
                      <td style={{ padding: '10px' }}>{formatDate(transfer.createdAt)}</td>
                      <td style={{ padding: '10px' }}>
                        <div style={{ display: 'flex', alignItems: 'center' }}>
                          {getStatusIcon(transfer.status)}
                          <span style={{ marginLeft: '5px' }}>
                            {transfer.status.charAt(0).toUpperCase() + transfer.status.slice(1)}
                          </span>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default TransferHistory; 