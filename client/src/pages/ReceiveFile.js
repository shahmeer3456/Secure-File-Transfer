import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import { FaDownload, FaCheck, FaTimes, FaKey, FaLock, FaUnlock } from 'react-icons/fa';
import { useSocket } from '../contexts/SocketContext';
import { fileAPI } from '../utils/api';

const ReceiveFile = ({ userId }) => {
  const { socket, isConnected } = useSocket();
  const [incomingFiles, setIncomingFiles] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (socket && isConnected) {
      // Listen for incoming file transfers
      socket.on('incoming_file', (data) => {
        // Add file to the list with status 'pending'
        setIncomingFiles(prev => [
          ...prev, 
          { 
            ...data, 
            status: 'pending',
            timestamp: new Date().toLocaleString()
          }
        ]);
        
        // Show notification
        toast.info(`New file received: ${data.fileName}`, {
          position: "bottom-right",
          autoClose: 5000
        });
      });

      // Clean up event listener on unmount
      return () => {
        socket.off('incoming_file');
      };
    }
  }, [socket, isConnected]);

  const handleAcceptFile = async (file, index) => {
    setLoading(true);
    
    try {
      // Update file status to 'accepted'
      updateFileStatus(index, 'accepted');
      
      // Decrypt the file
      const response = await fileAPI.decryptFile(
        file.encryptedContent, 
        file.encryptionMetadata
      );
      
      const decryptedContent = response.data.data.decryptedContent;
      
      // Trigger file download
      downloadFile(file.fileName, decryptedContent);
      
      // Update transfer status via API
      await fileAPI.updateTransferStatus(file.transferId, 'completed');
      
      // Update file status to 'completed'
      updateFileStatus(index, 'completed');
      
      // Notify sender that file was accepted
      socket.emit('transfer_response', {
        senderId: file.senderId,
        transferId: file.transferId,
        accepted: true
      });
      
      toast.success('File decrypted and downloaded successfully!');
    } catch (error) {
      console.error('Error accepting file:', error);
      updateFileStatus(index, 'failed');
      toast.error('Failed to decrypt or download the file');
      
      // Update transfer status to failed
      await fileAPI.updateTransferStatus(file.transferId, 'failed');
    } finally {
      setLoading(false);
    }
  };

  const handleRejectFile = async (file, index) => {
    try {
      // Update file status to 'rejected'
      updateFileStatus(index, 'rejected');
      
      // Update transfer status via API
      await fileAPI.updateTransferStatus(file.transferId, 'failed');
      
      // Notify sender that file was rejected
      socket.emit('transfer_response', {
        senderId: file.senderId,
        transferId: file.transferId,
        accepted: false
      });
      
    } catch (error) {
      console.error('Error rejecting file:', error);
    }
  };

  // Helper to update file status in state
  const updateFileStatus = (index, status) => {
    setIncomingFiles(prev => {
      const updatedFiles = [...prev];
      updatedFiles[index] = {
        ...updatedFiles[index],
        status
      };
      return updatedFiles;
    });
  };

  // Helper to download file
  const downloadFile = (fileName, content) => {
    const element = document.createElement('a');
    const file = new Blob([content], { type: 'text/plain' });
    element.href = URL.createObjectURL(file);
    element.download = fileName;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  return (
    <div>
      <h1 style={{ fontSize: '24px', marginBottom: '20px' }}>Receive Files</h1>

      {!isConnected && (
        <div className="alert alert-warning" style={{ marginBottom: '20px' }}>
          <strong>Not connected to the server!</strong> Make sure the server is running and you are connected to the same network.
        </div>
      )}

      <div className="card">
        <h2 style={{ fontSize: '18px', marginBottom: '15px' }}>Incoming Files</h2>

        {incomingFiles.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '30px 20px', color: '#666' }}>
            <FaDownload size={30} color="#1e88e5" style={{ marginBottom: '10px' }} />
            <p>No incoming files</p>
            <p style={{ fontSize: '12px', marginTop: '10px' }}>
              When someone sends you a file, it will appear here for you to accept or reject.
            </p>
          </div>
        ) : (
          incomingFiles.map((file, index) => (
            <div 
              key={`${file.transferId}-${index}`} 
              className="card" 
              style={{ marginBottom: '15px', padding: '15px' }}
            >
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <div style={{ display: 'flex', alignItems: 'center' }}>
                  {file.status === 'pending' ? (
                    <FaLock style={{ marginRight: '10px', color: '#f57c00' }} />
                  ) : file.status === 'completed' ? (
                    <FaUnlock style={{ marginRight: '10px', color: '#00c853' }} />
                  ) : (
                    <FaLock style={{ marginRight: '10px', color: '#e53935' }} />
                  )}
                  <div>
                    <div style={{ fontWeight: 'bold' }}>{file.fileName}</div>
                    <div style={{ fontSize: '12px', color: '#666' }}>
                      From: {file.senderName}
                    </div>
                    <div style={{ fontSize: '12px', color: '#666' }}>
                      Time: {file.timestamp}
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', marginTop: '5px' }}>
                      <FaKey size={12} style={{ marginRight: '5px', color: '#1e88e5' }} />
                      <span style={{ fontSize: '12px' }}>
                        Encrypted with {file.encryptionMetadata.algorithm}
                      </span>
                    </div>
                  </div>
                </div>

                {file.status === 'pending' && (
                  <div>
                    <button 
                      className="btn btn-secondary" 
                      style={{ marginRight: '5px' }}
                      onClick={() => handleAcceptFile(file, index)}
                      disabled={loading}
                    >
                      {loading ? (
                        <span className="spinner" style={{ width: '20px', height: '20px' }}></span>
                      ) : (
                        <>
                          <FaCheck style={{ marginRight: '5px' }} />
                          Accept
                        </>
                      )}
                    </button>
                    <button 
                      className="btn btn-danger"
                      onClick={() => handleRejectFile(file, index)}
                      disabled={loading}
                    >
                      <FaTimes style={{ marginRight: '5px' }} />
                      Reject
                    </button>
                  </div>
                )}

                {file.status === 'completed' && (
                  <div className="alert alert-success" style={{ marginBottom: 0, padding: '5px 10px' }}>
                    <FaCheck style={{ marginRight: '5px' }} />
                    Decrypted & Downloaded
                  </div>
                )}

                {file.status === 'rejected' && (
                  <div className="alert alert-danger" style={{ marginBottom: 0, padding: '5px 10px' }}>
                    <FaTimes style={{ marginRight: '5px' }} />
                    Rejected
                  </div>
                )}

                {file.status === 'failed' && (
                  <div className="alert alert-danger" style={{ marginBottom: 0, padding: '5px 10px' }}>
                    <FaTimes style={{ marginRight: '5px' }} />
                    Failed
                  </div>
                )}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default ReceiveFile; 