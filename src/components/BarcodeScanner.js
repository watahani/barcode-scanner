import React, { useState, useRef, useEffect } from 'react';
import styled, { keyframes, css } from 'styled-components';
import { useBarcodeDetector } from '../hooks/useBarcodeDetector';

const fadeIn = keyframes`
  from { opacity: 0; }
  to { opacity: 1; }
`;

const fadeOut = keyframes`
  from { opacity: 1; }
  to { opacity: 0; }
`;

const pulse = keyframes`
  0% { transform: scale(1); }
  50% { transform: scale(1.05); }
  100% { transform: scale(1); }
`;

const ScannerContainer = styled.div`
  position: relative;
  width: 100%;
  max-width: 500px;
  margin: 0 auto 30px;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
`;

const VideoContainer = styled.div`
  position: relative;
  width: 100%;
  height: 0;
  padding-bottom: 75%; /* 4:3 aspect ratio */
  background-color: #000;
  border-radius: 8px;
  overflow: hidden;
`;

const Video = styled.video`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
  transform: ${props => props.mirrored ? 'scaleX(-1)' : 'none'};
`;

const ScanArea = styled.div`
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 70%;
  height: 40%;
  border: 2px solid rgba(255, 255, 255, 0.5);
  border-radius: 8px;
  box-shadow: 0 0 0 9999px rgba(0, 0, 0, 0.5);
  z-index: 1;
`;

const ScannerOverlay = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: ${props => props.success ? 'rgba(40, 167, 69, 0.3)' : 'transparent'};
  transition: background-color 0.3s;
  z-index: 2;
`;

const ControlsContainer = styled.div`
  display: flex;
  justify-content: center;
  margin-top: 15px;
  gap: 10px;
`;

const Button = styled.button`
  padding: 10px 20px;
  background-color: ${props => props.active ? '#4dabf7' : '#f1f3f5'};
  color: ${props => props.active ? 'white' : '#495057'};
  border: none;
  border-radius: 4px;
  font-size: 16px;
  transition: all 0.3s;

  &:hover {
    background-color: ${props => props.active ? '#339af0' : '#e9ecef'};
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

const LogContainer = styled.div`
  margin-top: 20px;
  padding: 10px;
  background-color: #f8f9fa;
  border-radius: 4px;
  max-height: 150px;
  overflow-y: auto;
`;

const LogEntry = styled.div`
  padding: 5px 0;
  border-bottom: 1px solid #e9ecef;
  font-size: 14px;
  color: #495057;

  &:last-child {
    border-bottom: none;
  }
`;

const SuccessIndicator = styled.div`
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  font-size: 48px;
  color: white;
  z-index: 3;
  animation: ${props => props.show ? css`${fadeIn} 0.3s, ${pulse} 0.5s, ${fadeOut} 0.3s 1s forwards` : 'none'};
`;

const BarcodeScanner = ({ onBarcodeDetected }) => {
  const [isScanning, setIsScanning] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [scanSuccess, setScanSuccess] = useState(false);
  const [logs, setLogs] = useState([]);
  const [facingMode, setFacingMode] = useState('environment'); // 'environment' for back camera, 'user' for front
  
  const videoRef = useRef(null);
  const streamRef = useRef(null);
  const scanIntervalRef = useRef(null);
  
  const { isBarcodeDetectorSupported, detectBarcodes } = useBarcodeDetector();

  const addLog = (message) => {
    setLogs(prevLogs => {
      const newLogs = [...prevLogs, { id: Date.now(), message }];
      return newLogs.slice(-10); // Keep only the last 10 logs
    });
  };

  const playSuccessSound = () => {
    try {
      const audioContext = new (window.AudioContext || window.webkitAudioContext)();
      const oscillator = audioContext.createOscillator();
      const gainNode = audioContext.createGain();
      
      oscillator.type = 'sine';
      oscillator.frequency.setValueAtTime(880, audioContext.currentTime); // A5 note
      
      gainNode.gain.setValueAtTime(0.5, audioContext.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.5);
      
      oscillator.connect(gainNode);
      gainNode.connect(audioContext.destination);
      
      oscillator.start();
      oscillator.stop(audioContext.currentTime + 0.5);
    } catch (error) {
      console.error('Error playing success sound:', error);
    }
  };

  const handleSuccess = (barcode, matchedBook) => {
    setScanSuccess(true);
    setShowSuccess(true);
    
    // Play success sound
    playSuccessSound();
    
    if (matchedBook) {
      addLog(`Scanned: ${barcode} - Matched: ${matchedBook.title}`);
    } else {
      addLog(`Scanned: ${barcode} - No match found`);
    }
    
    setTimeout(() => {
      setScanSuccess(false);
      setShowSuccess(false);
    }, 1500);
  };

  const startScanning = async () => {
    if (!isBarcodeDetectorSupported) {
      addLog('BarcodeDetector API is not supported in this browser');
      return;
    }
    
    try {
      const constraints = {
        video: { facingMode }
      };
      
      const stream = await navigator.mediaDevices.getUserMedia(constraints);
      streamRef.current = stream;
      
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.play();
      }
      
      setIsScanning(true);
      addLog('Scanning started');
      
      scanIntervalRef.current = setInterval(async () => {
        if (videoRef.current && videoRef.current.readyState === 4) {
          try {
            const barcodes = await detectBarcodes(videoRef.current);
            
            if (barcodes && barcodes.length > 0) {
              const barcode = barcodes[0].rawValue;
              const matchedBook = onBarcodeDetected(barcode);
              handleSuccess(barcode, matchedBook);
            }
          } catch (error) {
            console.error('Error detecting barcode:', error);
            addLog(`Error: ${error.message}`);
          }
        }
      }, 500);
    } catch (error) {
      console.error('Error accessing camera:', error);
      addLog(`Camera error: ${error.message}`);
    }
  };

  const stopScanning = () => {
    if (scanIntervalRef.current) {
      clearInterval(scanIntervalRef.current);
      scanIntervalRef.current = null;
    }
    
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }
    
    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }
    
    setIsScanning(false);
    addLog('Scanning stopped');
  };

  const toggleCamera = () => {
    const newFacingMode = facingMode === 'environment' ? 'user' : 'environment';
    setFacingMode(newFacingMode);
    
    if (isScanning) {
      stopScanning();
      setTimeout(() => {
        setFacingMode(newFacingMode);
      }, 300);
    }
  };

  useEffect(() => {
    return () => {
      if (scanIntervalRef.current) {
        clearInterval(scanIntervalRef.current);
      }
      
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => track.stop());
      }
    };
  }, []);

  useEffect(() => {
    if (isScanning) {
      startScanning();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [facingMode]);

  return (
    <div>
      <ScannerContainer>
        <VideoContainer>
          <Video 
            ref={videoRef} 
            autoPlay 
            playsInline 
            muted 
            mirrored={facingMode === 'user'}
          />
          {isScanning && <ScanArea />}
          <ScannerOverlay success={scanSuccess} />
          <SuccessIndicator show={showSuccess}>👍</SuccessIndicator>
        </VideoContainer>
        
        <ControlsContainer>
          <Button 
            onClick={isScanning ? stopScanning : startScanning}
            active={isScanning}
            disabled={!isBarcodeDetectorSupported}
            aria-label={isScanning ? "Stop scanning" : "Start scanning"}
          >
            {isScanning ? 'Stop Scanning' : 'Start Scanning'}
          </Button>
          <Button 
            onClick={toggleCamera}
            disabled={!isBarcodeDetectorSupported}
            aria-label="Switch camera"
          >
            Switch Camera
          </Button>
        </ControlsContainer>
      </ScannerContainer>
      
      <LogContainer>
        {logs.map(log => (
          <LogEntry key={log.id}>{log.message}</LogEntry>
        ))}
      </LogContainer>
    </div>
  );
};

export default BarcodeScanner;