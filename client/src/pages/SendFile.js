import React, { useState } from 'react';
import { toast } from 'react-toastify';
import { FaPaperPlane, FaKey } from 'react-icons/fa';
import { useSocket } from '../contexts/SocketContext';
import FileUploader from '../components/FileUploader';
import PeerList from '../components/PeerList';
import { fileAPI } from '../utils/api';

const SendFile = ({ userId }) => {
  const { socket, isConnected } = useSocket();
  const [selectedFile, setSelectedFile] = useState(null);
  const [recipient, setRecipient] = useState(null);
  const [loading, setLoading] = useState(false);
  const [transferInfo, setTransferInfo] = useState(null);

  const handleFileSelect = (file) => {
    setSelectedFile(file);
    setTransferInfo(null);
  };

  const handlePeerSelect = (peer) => {
    setRecipient(peer);
    setTransferInfo(null);
  };

  const handleSendFile = async () => {
    if (!selectedFile || !recipient || !userId || !isConnected || !socket) {
      toast.error('File, recipient, and connection are required');
      return;
    }

    setLoading(true);

    try {
      // Read file content
      const fileContent = await readFileContent(selectedFile);

      // Prepare data for file transfer
      const transferData = {
        fileName: selectedFile.name,
        senderId: userId,
        receiverId: recipient._id,
        fileSize: selectedFile.size,
        fileContent
      };

      // Initiate file transfer via API
      const response = await fileAPI.initiateTransfer(transferData);

      // Get transfer info from response
      const { fileTransferId, encryptedContent, encryptionMetadata } = response.data.data;

      // Set transfer info for display
      setTransferInfo({
        fileTransferId,
        fileName: selectedFile.name,
        recipientName: recipient.deviceName,
        encryptionAlgorithm: encryptionMetadata.algorithm,
        timestamp: new Date().toLocaleString()
      });

      // Emit socket event to notify recipient
      socket.emit('initiate_transfer', {
        receiverId: recipient._id,
        transferData: {
          transferId: fileTransferId,
          fileName: selectedFile.name,
          senderId: userId,
          senderName: localStorage.getItem('deviceName') || 'Unknown Device',
          encryptedContent,
          encryptionMetadata
        }
      });

      toast.success('File sent successfully!');

      // Set transfer status to completed
      await fileAPI.updateTransferStatus(fileTransferId, 'completed');

    } catch (error) {
      console.error('Error sending file:', error);
      toast.error('Failed to send file. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Helper function to read file content as text
  const readFileContent = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (event) => resolve(event.target.result);
      reader.onerror = (error) => reject(error);
      reader.readAsText(file);
    });
  };

  return (
    <div>
      <h1 style={{ fontSize: '24px', marginBottom: '20px' }}>Send Encrypted File</h1>

      {!isConnected && (
        <div className="alert alert-warning" style={{ marginBottom: '20px' }}>
          <strong>Not connected to the server!</strong> Make sure the server is running and you are connected to the same network.
        </div>
      )}

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
        <div>
          <FileUploader onFileSelect={handleFileSelect} />
        </div>
        <div>
          <PeerList onSelectPeer={handlePeerSelect} />
        </div>
      </div>

      <div className="card" style={{ marginTop: '20px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <h2 style={{ fontSize: '18px', margin: 0 }}>File Transfer</h2>
          <button
            className="btn btn-primary"
            disabled={!selectedFile || !recipient || loading || !isConnected}
            onClick={handleSendFile}
          >
            {loading ? (
              <span className="spinner" style={{ width: '20px', height: '20px', marginRight: '10px' }}></span>
            ) : (
              <FaPaperPlane style={{ marginRight: '5px' }} />
            )}
            Send File
          </button>
        </div>

        {transferInfo ? (
          <div style={{ marginTop: '20px' }}>
            <div className="alert alert-success">
              <strong>File sent successfully!</strong>
            </div>
            <div style={{ marginTop: '15px' }}>
              <div style={{ display: 'flex', alignItems: 'center', marginBottom: '10px' }}>
                <FaKey style={{ marginRight: '10px', color: '#1e88e5' }} />
                <div>
                  <p><strong>Encryption Algorithm:</strong> {transferInfo.encryptionAlgorithm}</p>
                  <p><strong>Recipient:</strong> {transferInfo.recipientName}</p>
                  <p><strong>File:</strong> {transferInfo.fileName}</p>
                  <p><strong>Time:</strong> {transferInfo.timestamp}</p>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div style={{ marginTop: '20px', textAlign: 'center', color: '#666' }}>
            <p>Select a file and recipient to send an encrypted file.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default SendFile; 