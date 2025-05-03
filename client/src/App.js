import React, { useState, useEffect } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

// Pages
import Home from './pages/Home';
import SendFile from './pages/SendFile';
import ReceiveFile from './pages/ReceiveFile';
import TransferHistory from './pages/TransferHistory';

// Components
import Navbar from './components/Navbar';
import PeerRegistration from './components/PeerRegistration';

// Contexts
import { SocketProvider } from './contexts/SocketContext';
import { PeerProvider } from './contexts/PeerContext';

function App() {
  const [isRegistered, setIsRegistered] = useState(false);
  const [userId, setUserId] = useState(null);

  // Check if user is registered (has a userId in localStorage)
  useEffect(() => {
    const storedUserId = localStorage.getItem('userId');
    if (storedUserId) {
      setUserId(storedUserId);
      setIsRegistered(true);
    }
  }, []);

  // Handle successful registration
  const handleRegistrationSuccess = (registeredUserId) => {
    setUserId(registeredUserId);
    setIsRegistered(true);
    localStorage.setItem('userId', registeredUserId);
  };

  return (
    <SocketProvider>
      <PeerProvider userId={userId}>
        <div className="App">
          <ToastContainer position="top-right" autoClose={5000} />
          
          {!isRegistered ? (
            <PeerRegistration onRegisterSuccess={handleRegistrationSuccess} />
          ) : (
            <>
              <Navbar />
              <div className="container">
                <Routes>
                  <Route path="/" element={<Home />} />
                  <Route path="/send" element={<SendFile userId={userId} />} />
                  <Route path="/receive" element={<ReceiveFile userId={userId} />} />
                  <Route path="/history" element={<TransferHistory userId={userId} />} />
                  <Route path="*" element={<Navigate to="/" />} />
                </Routes>
              </div>
            </>
          )}
        </div>
      </PeerProvider>
    </SocketProvider>
  );
}

export default App; 