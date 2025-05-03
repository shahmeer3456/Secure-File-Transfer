import React, { useState, useRef } from 'react';
import { FaUpload, FaFileAlt, FaFileCode, FaFilePdf, FaFileWord, FaTrash } from 'react-icons/fa';
import { toast } from 'react-toastify';

const FileUploader = ({ onFileSelect }) => {
  const [file, setFile] = useState(null);
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef(null);

  const handleFileDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      validateAndSetFile(e.dataTransfer.files[0]);
    }
  };

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files.length > 0) {
      validateAndSetFile(e.target.files[0]);
    }
  };

  const validateAndSetFile = (file) => {
    // Check if the file is a text file
    if (file.type === 'text/plain') {
      setFile(file);
      if (onFileSelect) {
        onFileSelect(file);
      }
    } else {
      toast.error('Only plain text (.txt) files are supported');
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleRemoveFile = () => {
    setFile(null);
    if (onFileSelect) {
      onFileSelect(null);
    }
    
    // Reset file input
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  // Get file icon based on file type
  const getFileIcon = () => {
    if (!file) return <FaFileAlt />;
    
    switch (file.type) {
      case 'text/plain':
        return <FaFileAlt />;
      case 'application/pdf':
        return <FaFilePdf />;
      case 'application/msword':
      case 'application/vnd.openxmlformats-officedocument.wordprocessingml.document':
        return <FaFileWord />;
      case 'text/javascript':
      case 'application/json':
      case 'text/html':
      case 'text/css':
        return <FaFileCode />;
      default:
        return <FaFileAlt />;
    }
  };

  return (
    <div className="card">
      <h2 style={{ fontSize: '18px', marginBottom: '15px' }}>Select a File</h2>

      {file ? (
        <div className="file-item">
          <div className="file-icon">
            {getFileIcon()}
          </div>
          <div className="file-info">
            <div className="file-name">{file.name}</div>
            <div className="file-meta">{(file.size / 1024).toFixed(2)} KB</div>
          </div>
          <button 
            className="btn btn-danger" 
            style={{ padding: '5px 10px' }}
            onClick={handleRemoveFile}
          >
            <FaTrash />
          </button>
        </div>
      ) : (
        <div
          onDrop={handleFileDrop}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          style={{
            border: `2px dashed ${isDragging ? '#1e88e5' : '#ccc'}`,
            borderRadius: '8px',
            padding: '30px 20px',
            textAlign: 'center',
            cursor: 'pointer',
            backgroundColor: isDragging ? '#e3f2fd' : 'transparent',
            transition: 'all 0.3s ease'
          }}
          onClick={() => fileInputRef.current.click()}
        >
          <FaUpload size={30} color="#1e88e5" style={{ marginBottom: '10px' }} />
          <p>Drag and drop a text file here, or click to browse</p>
          <p style={{ fontSize: '12px', color: '#666', marginTop: '10px' }}>
            Only plain text (.txt) files are supported
          </p>
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileChange}
            style={{ display: 'none' }}
            accept=".txt,text/plain"
          />
        </div>
      )}
    </div>
  );
};

export default FileUploader; 