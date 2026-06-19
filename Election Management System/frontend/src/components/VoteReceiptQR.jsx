// frontend/src/components/VoteReceiptQR.jsx
import { useEffect, useState } from 'react';
import QRCode from 'qrcode';
import Button from './Button';

export default function VoteReceiptQR({ electionId, voteToken, timestamp }) {
  const [qrCode, setQrCode] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const generateQR = async () => {
      try {
        const receiptData = {
          election_id: electionId,
          vote_token: voteToken,
          timestamp: timestamp,
          verified: true
        };

        const qrDataUrl = await QRCode.toDataURL(JSON.stringify(receiptData), {
          errorCorrectionLevel: 'H',
          type: 'image/png',
          width: 250,
          margin: 2
        });
        setQrCode(qrDataUrl);
      } catch (error) {
        console.error('Failed to generate QR code:', error);
      } finally {
        setLoading(false);
      }
    };

    generateQR();
  }, [electionId, voteToken, timestamp]);

  const handleDownload = () => {
    const link = document.createElement('a');
    link.href = qrCode;
    link.download = `vote-receipt-${electionId}-${Date.now()}.png`;
    link.click();
  };

  const handlePrint = () => {
    const printWindow = window.open();
    printWindow.document.write(`
      <html>
        <head>
          <title>Vote Receipt</title>
          <style>
            body { text-align: center; padding: 20px; font-family: Arial; }
            h1 { color: #333; }
            img { margin: 20px 0; }
            p { color: #666; }
          </style>
        </head>
        <body>
          <h1>🗳️ Vote Receipt</h1>
          <p>Your vote has been successfully cast and recorded.</p>
          <img src="${qrCode}" alt="Vote Receipt QR" />
          <p><strong>Election ID:</strong> ${electionId}</p>
          <p><strong>Time:</strong> ${new Date(timestamp).toLocaleString()}</p>
          <p style="font-size: 12px; color: #999;">Keep this receipt for your records</p>
        </body>
      </html>
    `);
    printWindow.document.close();
    printWindow.print();
  };

  return (
    <div className="flex flex-col items-center gap-4">
      <div className="text-center">
        <h3 className="text-lg font-semibold text-white mb-2">📋 Vote Receipt</h3>
        <p className="text-sm text-gray-400">Save this QR code for your records</p>
      </div>

      {loading ? (
        <div className="flex justify-center py-8">
          <div className="inline-block animate-spin w-6 h-6 border-3 border-blue-500 border-t-transparent rounded-full" />
        </div>
      ) : qrCode ? (
        <>
          <div className="bg-white p-4 rounded-xl">
            <img src={qrCode} alt="Vote Receipt QR" className="w-48 h-48" />
          </div>

          <div className="text-sm text-gray-400 space-y-1">
            <p><strong>Election:</strong> {electionId}</p>
            <p><strong>Time:</strong> {new Date(timestamp).toLocaleString()}</p>
            <p><strong>Status:</strong> ✅ Verified & Anonymous</p>
          </div>

          <div className="flex gap-2 w-full">
            <Button
              onClick={handleDownload}
              variant="secondary"
              className="flex-1"
            >
              📥 Download
            </Button>
            <Button
              onClick={handlePrint}
              variant="secondary"
              className="flex-1"
            >
              🖨️ Print
            </Button>
          </div>
        </>
      ) : (
        <div className="text-red-400 text-sm">Failed to generate QR code</div>
      )}
    </div>
  );
}
