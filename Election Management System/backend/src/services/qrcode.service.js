// backend/src/services/qrcode.service.js
import QRCode from 'qrcode';

/**
 * Generate QR code for vote confirmation
 */
export const generateVoteQRCode = async (voteData) => {
  try {
    const dataString = JSON.stringify({
      type: 'election_vote',
      election_id: voteData.election_id,
      candidate_id: voteData.candidate_id,
      timestamp: voteData.timestamp,
      hash: voteData.vote_hash
    });

    // Generate QR code as data URL
    const qrCode = await QRCode.toDataURL(dataString, {
      errorCorrectionLevel: 'H',
      type: 'image/png',
      quality: 0.95,
      margin: 1,
      width: 300
    });

    return qrCode;
  } catch (error) {
    console.error('Generate QR code error:', error);
    throw error;
  }
};

/**
 * Generate QR code for election access
 */
export const generateElectionQRCode = async (electionId, electionTitle) => {
  try {
    const dataString = JSON.stringify({
      type: 'election_access',
      election_id: electionId,
      title: electionTitle,
      timestamp: new Date().toISOString()
    });

    const qrCode = await QRCode.toDataURL(dataString, {
      errorCorrectionLevel: 'H',
      type: 'image/png',
      quality: 0.95,
      margin: 1,
      width: 300
    });

    return qrCode;
  } catch (error) {
    console.error('Generate election QR code error:', error);
    throw error;
  }
};

/**
 * Generate QR code for sharing election link
 */
export const generateShareQRCode = async (electionUrl) => {
  try {
    const qrCode = await QRCode.toDataURL(electionUrl, {
      errorCorrectionLevel: 'H',
      type: 'image/png',
      quality: 0.95,
      margin: 1,
      width: 300
    });

    return qrCode;
  } catch (error) {
    console.error('Generate share QR code error:', error);
    throw error;
  }
};
