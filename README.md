# Secure File Transfer System with Dynamic Encryption

A secure peer-to-peer file transfer system that uses dynamically selected classical cryptography algorithms for encrypting files transferred over a shared WiFi network.

## Features

- Peer-to-peer file transfer over a shared WiFi network
- Automatic encryption using one of multiple classical cryptographic algorithms:
  - Hill Cipher
  - Caesar Cipher
  - Rail Fence Cipher
  - Row Transposition Cipher
  - Affine Cipher
  - Playfair Cipher
- Web-based UI built with React/Next.js
- Auto-discovery of peers on the same WiFi
- Automatic decryption of files upon download
- Support for plain text files

## Setup

### Prerequisites

- Node.js (v14 or higher)
- MongoDB
- Devices connected to the same WiFi network

### Server Setup

1. Navigate to the server directory:
   ```
   cd secure-file-transfer/server
   ```

2. Install dependencies:
   ```
   npm install
   ```

3. Create a `.env` file in the server directory with the following content:
   ```
   PORT=5000
   MONGO_URI=mongodb://localhost:27017/secure-file-transfer
   NODE_ENV=development
   ```

4. Start the server:
   ```
   npm run dev
   ```

### Client Setup

1. Navigate to the client directory:
   ```
   cd secure-file-transfer/client
   ```

2. Install dependencies:
   ```
   npm install
   ```

3. Start the client:
   ```
   npm run dev
   ```

## Usage

1. Open the application in your browser (usually at http://localhost:3000)
2. The application will automatically discover other peers on the network
3. Select a text file you want to send
4. Choose a recipient from the discovered peers
5. The file will be automatically encrypted using a randomly selected algorithm
6. The recipient will receive a notification about the incoming file
7. Upon acceptance, the file will be transferred, decrypted, and saved

## Security Considerations

This system uses classical ciphers for educational purposes. For production environments requiring high security, modern cryptographic standards like AES or RSA should be used instead.

## License

ISC 