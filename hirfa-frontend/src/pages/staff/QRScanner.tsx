import React, { useState, useEffect, useRef } from 'react';
import { Html5Qrcode } from 'html5-qrcode';
import { motion, AnimatePresence } from 'framer-motion';
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

      if (html5QrCodeRef.current.isScanning) return;

      await html5QrCodeRef.current.start(
        { facingMode: 'environment' },
        {
          fps: 10,
          qrbox: { width: 250, height: 250 },
        },
        async (decodedText) => {
          if (isScanningCooldownRef.current) return;
          isScanningCooldownRef.current = true;

          if (html5QrCodeRef.current) {
            try {
              html5QrCodeRef.current.pause(true);
            } catch (e) {
              console.warn('Pause engine note:', e);
            }
          }

          setInputVal(decodedText);
          await processValidation(decodedText, TicketValidationMethod.QR_SCAN);

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
        () => {}
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

  useEffect(() => {
    let isCancelled = false;

    if (activeTab === 'qr') {
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
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="max-w-xl mx-auto space-y-6"
    >
      <div>
        <h1 className="text-2xl font-extrabold tracking-tight text-slate-900">Staff Gate Check-In</h1>
        <p className="text-sm text-slate-500">
          Validate attendee access pass via live camera scan or manual ID.
        </p>
      </div>

      {/* Navigation Tabs */}
      <div className="flex border-b border-slate-200/80 relative">
        <button
          type="button"
          onClick={() => handleTabChange('qr')}
          className={`flex-1 py-3 text-center text-sm font-semibold relative transition-colors ${
            activeTab === 'qr' ? 'text-emerald-700' : 'text-slate-500 hover:text-slate-800'
          }`}
        >
          📷 Live Camera Scan
          {activeTab === 'qr' && (
            <motion.div
              layoutId="activeTabUnderline"
              className="absolute bottom-0 left-0 right-0 h-0.5 bg-emerald-600 rounded-full"
            />
          )}
        </button>
        <button
          type="button"
          onClick={() => handleTabChange('manual')}
          className={`flex-1 py-3 text-center text-sm font-semibold relative transition-colors ${
            activeTab === 'manual' ? 'text-emerald-700' : 'text-slate-500 hover:text-slate-800'
          }`}
        >
          Manual Ticket ID
          {activeTab === 'manual' && (
            <motion.div
              layoutId="activeTabUnderline"
              className="absolute bottom-0 left-0 right-0 h-0.5 bg-emerald-600 rounded-full"
            />
          )}
        </button>
      </div>

      {/* Camera / Manual Input Card */}
      <Card className="border border-slate-200/80 shadow-xs rounded-2xl bg-white p-5">
        {activeTab === 'qr' ? (
          <div className="space-y-4 text-center">
            <div
              id="qr-reader"
              className="w-full overflow-hidden rounded-xl bg-slate-900 min-h-[280px]"
            />

            {cameraError && (
              <p className="text-xs font-semibold text-rose-700 bg-rose-50 p-3 rounded-xl border border-rose-200">
                {cameraError}
              </p>
            )}

            <div className="flex justify-between items-center text-xs text-slate-500 pt-2">
              <span className="font-medium">
                Status: {isCameraActive ? '🟢 Camera Active' : '🔴 Camera Offline'}
              </span>
              {!isCameraActive && (
                <Button
                  onClick={startCamera}
                  className="bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs py-1.5"
                >
                  Re-open Camera
                </Button>
              )}
            </div>
          </div>
        ) : (
          <form onSubmit={handleManualSubmit} className="space-y-4">
            <div className="space-y-2">
              <label className="text-xs font-extrabold uppercase tracking-wider text-slate-500">
                Ticket UUID
              </label>
              <Input
                placeholder="e.g. 9a6d171a-24c1-4952-8c07-0473336e8808"
                value={inputVal}
                onChange={(e) => setInputVal(e.target.value)}
                autoFocus
              />
            </div>
            <Button
              type="submit"
              className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-semibold py-2.5"
              isLoading={isSubmitting}
            >
              Verify Pass Access
            </Button>
          </form>
        )}
      </Card>

      {/* Result Status Display Banner */}
      <AnimatePresence>
        {result && (
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.25 }}
          >
            <Card
              className={`border-l-4 rounded-2xl p-5 shadow-xs transition-all ${
                result.status === TicketValidationEnum.VALID
                  ? 'border-l-emerald-500 bg-emerald-50/70 border border-emerald-200/80'
                  : 'border-l-rose-500 bg-rose-50/70 border border-rose-200/80'
              }`}
            >
              <div className="flex items-start gap-4">
                <span className="text-3xl">
                  {result.status === TicketValidationEnum.VALID ? '✅' : '❌'}
                </span>
                <div className="space-y-1">
                  <h3
                    className={`font-extrabold text-lg tracking-tight ${
                      result.status === TicketValidationEnum.VALID
                        ? 'text-emerald-900'
                        : 'text-rose-900'
                    }`}
                  >
                    {result.status === TicketValidationEnum.VALID
                      ? 'ACCESS GRANTED'
                      : 'ACCESS DENIED'}
                  </h3>

                  <p className="text-xs text-slate-600 font-mono">
                    Scanned ID: {result.ticketId || inputVal}
                  </p>

                  {errorMessage && (
                    <p className="text-xs font-semibold text-rose-700 mt-1">
                      Reason: {errorMessage}
                    </p>
                  )}
                </div>
              </div>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};