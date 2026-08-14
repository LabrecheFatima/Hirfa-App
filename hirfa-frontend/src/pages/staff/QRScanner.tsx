import React, { useState, useEffect, useRef } from 'react';
import { Html5Qrcode } from 'html5-qrcode';
import { validationService } from '../../services/validationService';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import {
  TicketValidationMethod,
  TicketValidationEnum,
  type TicketValidationResponseDto,
} from '../../types';

export const QRScanner: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'qr' | 'manual'>('qr');
  const [inputVal, setInputVal] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [result, setResult] = useState<TicketValidationResponseDto | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Camera state & refs
  const [isCameraActive, setIsCameraActive] = useState(false);
  const [cameraError, setCameraError] = useState<string | null>(null);
  const html5QrCodeRef = useRef<Html5Qrcode | null>(null);
  const isScanningCooldownRef = useRef(false);

  // Core validation API call
  const processValidation = async (payloadId: string, method: TicketValidationMethod) => {
    setIsSubmitting(true);
    setResult(null);
    setErrorMessage(null);

    try {
      const res = await validationService.validateTicket({
        id: payloadId,
        method: method,
      });
      setResult(res);
    } catch (err: any) {
      const backendError =
        err?.response?.data?.message ||
        err?.message ||
        'Validation failed. Pass ID not found or invalid.';

      setErrorMessage(backendError);
      setResult({
        ticketId: payloadId,
        status: TicketValidationEnum.INVALID,
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  // Manual Form Submission
  const handleManualSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputVal.trim()) return;
    processValidation(inputVal.trim(), TicketValidationMethod.MANUAL);
  };

  // Camera Controls
  const startCamera = async () => {
    const element = document.getElementById('qr-reader');
    if (!element) return;

    try {
      if (!html5QrCodeRef.current) {
        html5QrCodeRef.current = new Html5Qrcode('qr-reader');
      }

      // Avoid restarting if already scanning
      if (html5QrCodeRef.current.isScanning) return;

      await html5QrCodeRef.current.start(
        { facingMode: 'environment' }, // Prefers rear camera on mobile devices
        {
          fps: 10,
          qrbox: { width: 250, height: 250 },
        },
        async (decodedText) => {
          // Cooldown check to prevent duplicate triggers
          if (isScanningCooldownRef.current) return;
          isScanningCooldownRef.current = true;

          // 1. Immediately pause video stream processing to prevent spamming backend calls
          if (html5QrCodeRef.current) {
            try {
              html5QrCodeRef.current.pause(true);
            } catch (e) {
              console.warn('Pause engine note:', e);
            }
          }

          setInputVal(decodedText);
          await processValidation(decodedText, TicketValidationMethod.QR_SCAN);

          // 2. Automatically unfreeze/resume camera scanner after 2.5 seconds
          setTimeout(() => {
            isScanningCooldownRef.current = false;
            if (html5QrCodeRef.current) {
              try {
                html5QrCodeRef.current.resume();
              } catch (e) {
                console.warn('Resume engine note:', e);
              }
            }
          }, 2500);
        },
        () => {
          // Frame callback on non-QR frame (can be safely ignored)
        }
      );

      setIsCameraActive(true);
      setCameraError(null);
    } catch (err: any) {
      console.error('Camera initialization error:', err);
      setCameraError(
        'Unable to access camera. Please grant camera permissions in your browser or enter the ID manually.'
      );
      setIsCameraActive(false);
    }
  };

  const stopCamera = async () => {
    if (html5QrCodeRef.current && html5QrCodeRef.current.isScanning) {
      try {
        await html5QrCodeRef.current.stop();
        setIsCameraActive(false);
      } catch (err) {
        console.error('Failed to stop camera stream:', err);
      }
    }
  };

  // Safe asynchronous camera lifecycle management
  useEffect(() => {
    let isCancelled = false;

    if (activeTab === 'qr') {
      // Defer camera initialization to the next tick after DOM render completes
      const timer = setTimeout(() => {
        if (!isCancelled) {
          startCamera();
        }
      }, 50);

      return () => {
        isCancelled = true;
        clearTimeout(timer);
        stopCamera();
      };
    } else {
      stopCamera();
    }
  }, [activeTab]);

  const handleTabChange = (tab: 'qr' | 'manual') => {
    setActiveTab(tab);
    setInputVal('');
    setResult(null);
    setErrorMessage(null);
    setCameraError(null);
  };

  return (
    <div className="max-w-xl mx-auto space-y-6 p-4">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Staff Gate Check-In</h1>
        <p className="text-sm text-gray-500">
          Validate attendee access pass via live camera scan or manual ID.
        </p>
      </div>

      {/* Navigation Tabs */}
      <div className="flex border-b border-gray-200">
        <button
          type="button"
          onClick={() => handleTabChange('qr')}
          className={`flex-1 py-2.5 text-center text-sm font-medium border-b-2 transition-colors ${
            activeTab === 'qr'
              ? 'border-indigo-600 text-indigo-600'
              : 'border-transparent text-gray-500 hover:text-gray-700'
          }`}
        >
          📷 Live Camera Scan
        </button>
        <button
          type="button"
          onClick={() => handleTabChange('manual')}
          className={`flex-1 py-2.5 text-center text-sm font-medium border-b-2 transition-colors ${
            activeTab === 'manual'
              ? 'border-indigo-600 text-indigo-600'
              : 'border-transparent text-gray-500 hover:text-gray-700'
          }`}
        >
          ⌨️ Manual Ticket ID
        </button>
      </div>

      {/* Camera / Manual Input Card */}
      <Card>
        {activeTab === 'qr' ? (
          <div className="space-y-4 text-center">
            {/* Camera Viewport Container */}
            <div
              id="qr-reader"
              className="w-full overflow-hidden rounded-lg bg-gray-900 min-h-[280px]"
            />

            {cameraError && (
              <p className="text-xs text-red-600 bg-red-50 p-2 rounded border border-red-200">
                {cameraError}
              </p>
            )}

            <div className="flex justify-between items-center text-xs text-gray-500 pt-2">
              <span>Status: {isCameraActive ? '🟢 Camera Active' : '🔴 Camera Offline'}</span>
              {!isCameraActive && (
                <Button onClick={startCamera}>
                  Re-open Camera
                </Button>
              )}
            </div>
          </div>
        ) : (
          <form onSubmit={handleManualSubmit} className="space-y-4">
            <div className="space-y-2">
              <label className="text-xs font-semibold text-gray-700">
                Ticket UUID
              </label>
              <Input
                placeholder="e.g. 9a6d171a-24c1-4952-8c07-0473336e8808"
                value={inputVal}
                onChange={(e) => setInputVal(e.target.value)}
                autoFocus
              />
            </div>
            <Button type="submit" className="w-full" isLoading={isSubmitting}>
              Verify Pass Access
            </Button>
          </form>
        )}
      </Card>

      {/* Result Status Display Banner */}
      {result && (
        <Card
          className={`border-l-4 transition-all ${
            result.status === TicketValidationEnum.VALID
              ? 'border-l-green-500 bg-green-50'
              : 'border-l-red-500 bg-red-50'
          }`}
        >
          <div className="flex items-start gap-3">
            <span className="text-3xl">
              {result.status === TicketValidationEnum.VALID ? '✅' : '❌'}
            </span>
            <div className="space-y-1">
              <h3
                className={`font-bold text-lg ${
                  result.status === TicketValidationEnum.VALID
                    ? 'text-green-800'
                    : 'text-red-800'
                }`}
              >
                {result.status === TicketValidationEnum.VALID
                  ? 'ACCESS GRANTED'
                  : 'ACCESS DENIED'}
              </h3>

              <p className="text-xs text-gray-600 font-mono">
                Scanned ID: {result.ticketId || inputVal}
              </p>

              {errorMessage && (
                <p className="text-xs text-red-600 font-medium mt-1">
                  Reason: {errorMessage}
                </p>
              )}
            </div>
          </div>
        </Card>
      )}
    </div>
  );
};