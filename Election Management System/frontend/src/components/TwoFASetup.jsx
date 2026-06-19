// frontend/src/components/TwoFASetup.jsx
import { useState } from 'react';
import { useMutation, useQuery } from '@tanstack/react-query';
import api from '../services/api';
import Modal from './Modal';
import Button from './Button';
import QRCode from 'qrcode';

export default function TwoFASetup({ isOpen, onClose }) {
  const [step, setStep] = useState(1); // 1: Generate, 2: Verify, 3: Success
  const [secret, setSecret] = useState(null);
  const [qrCode, setQrCode] = useState(null);
  const [code, setCode] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const { data: status } = useQuery({
    queryKey: ['2fa-status'],
    queryFn: async () => {
      const response = await api.get('/2fa/status');
      return response.data;
    }
  });

  const generateMutation = useMutation({
    mutationFn: async () => {
      const response = await api.post('/2fa/generate-secret');
      return response.data;
    },
    onSuccess: async (data) => {
      setSecret(data.secret);
      
      // Generate QR code
      const qrDataUrl = await QRCode.toDataURL(data.otpauth_url, {
        errorCorrectionLevel: 'H',
        type: 'image/png',
        width: 300,
        margin: 2
      });
      setQrCode(qrDataUrl);
      setStep(2);
    },
    onError: (error) => {
      setError(error.response?.data?.message || 'Failed to generate secret');
    }
  });

  const enableMutation = useMutation({
    mutationFn: async (verificationCode) => {
      const response = await api.post('/2fa/enable', { code: verificationCode });
      return response.data;
    },
    onSuccess: () => {
      setStep(3);
      setCode('');
      setSecret(null);
    },
    onError: (error) => {
      setError(error.response?.data?.message || 'Invalid code. Please try again.');
    }
  });

  const handleGenerateSecret = () => {
    setError('');
    generateMutation.mutate();
  };

  const handleVerifyCode = () => {
    if (code.length !== 6) {
      setError('Please enter a 6-digit code');
      return;
    }
    enableMutation.mutate(code);
  };

  const handleClose = () => {
    setStep(1);
    setSecret(null);
    setQrCode(null);
    setCode('');
    setError('');
    onClose();
  };

  if (status?.data?.two_fa_enabled) {
    return (
      <Modal isOpen={isOpen} onClose={handleClose}>
        <div className="text-center py-8">
          <div className="text-5xl mb-4">✅</div>
          <h2 className="text-2xl font-bold text-white mb-2">2FA Enabled</h2>
          <p className="text-gray-400">
            Two-factor authentication is already enabled on your account.
          </p>
          <Button onClick={handleClose} variant="primary" className="mt-6">
            Close
          </Button>
        </div>
      </Modal>
    );
  }

  return (
    <Modal isOpen={isOpen} onClose={handleClose}>
      <div className="w-full max-w-md">
        {/* Step 1: Generate Secret */}
        {step === 1 && (
          <div className="text-center py-8">
            <div className="text-5xl mb-4">🔐</div>
            <h2 className="text-2xl font-bold text-white mb-2">Enable Two-Factor Authentication</h2>
            <p className="text-gray-400 mb-6">
              Secure your account with an authentication app like Google Authenticator or Authy.
            </p>
            {error && (
              <div className="bg-red-500/10 border border-red-500/30 text-red-400 p-3 rounded-lg mb-4">
                {error}
              </div>
            )}
            <Button
              onClick={handleGenerateSecret}
              variant="primary"
              loading={generateMutation.isPending}
              className="w-full"
            >
              Generate Secret
            </Button>
          </div>
        )}

        {/* Step 2: Verify with QR Code */}
        {step === 2 && (
          <div className="text-center py-8">
            <h2 className="text-2xl font-bold text-white mb-2">Scan QR Code</h2>
            <p className="text-gray-400 mb-6 text-sm">
              Scan this QR code with your authenticator app
            </p>
            
            {qrCode && (
              <div className="flex justify-center mb-6">
                <img src={qrCode} alt="2FA QR Code" className="w-48 h-48 border border-white/20 rounded-lg p-2" />
              </div>
            )}

            <div className="bg-white/5 border border-white/10 p-4 rounded-lg mb-6">
              <p className="text-xs text-gray-400 mb-2">Or enter manually:</p>
              <p className="font-mono text-white break-all text-sm">{secret}</p>
            </div>

            <div className="mb-6">
              <label className="text-white text-sm font-semibold mb-2 block">
                Enter 6-digit code
              </label>
              <input
                type="text"
                maxLength="6"
                value={code}
                onChange={(e) => setCode(e.target.value.replace(/\D/g, ''))}
                placeholder="000000"
                className="w-full bg-white/10 border border-white/20 text-white text-center text-2xl py-3 rounded-lg focus:outline-none focus:border-blue-500 placeholder-gray-600"
              />
            </div>

            {error && (
              <div className="bg-red-500/10 border border-red-500/30 text-red-400 p-3 rounded-lg mb-4">
                {error}
              </div>
            )}

            <Button
              onClick={handleVerifyCode}
              variant="primary"
              loading={enableMutation.isPending}
              className="w-full"
            >
              Verify & Enable
            </Button>
          </div>
        )}

        {/* Step 3: Success */}
        {step === 3 && (
          <div className="text-center py-8">
            <div className="text-5xl mb-4">🎉</div>
            <h2 className="text-2xl font-bold text-white mb-2">2FA Enabled!</h2>
            <p className="text-gray-400 mb-6">
              Your account is now protected with two-factor authentication. You'll be asked for a code when logging in.
            </p>
            <Button onClick={handleClose} variant="primary" className="w-full">
              Done
            </Button>
          </div>
        )}
      </div>
    </Modal>
  );
}
