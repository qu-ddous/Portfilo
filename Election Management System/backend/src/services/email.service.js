// src/services/email.service.js
import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

/**
 * Send approval email to creator
 */
export const sendApprovalEmail = async (email, name) => {
  try {
    await resend.emails.send({
      from: process.env.FROM_EMAIL,
      to: email,
      subject: '✅ Your Election Creator Request has been Approved!',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #10b981;">Congratulations ${name}!</h2>
          <p>Your request to become an <strong>Election Creator</strong> has been approved.</p>
          <p>You can now log in to your account and start creating elections.</p>
          <p>
            <a href="${process.env.FRONTEND_URL}/creator/dashboard" 
               style="display: inline-block; padding: 10px 20px; background: #10b981; color: white; text-decoration: none; border-radius: 5px;">
              Go to Creator Dashboard
            </a>
          </p>
          <p style="color: #666; font-size: 14px;">
            Thank you for using our election management system.
          </p>
        </div>
      `
    });
    console.log(`✓ Approval email sent to ${email}`);
  } catch (error) {
    console.error('Error sending approval email:', error);
    throw error;
  }
};

/**
 * Send rejection email to creator
 */
export const sendRejectionEmail = async (email, name, reason) => {
  try {
    await resend.emails.send({
      from: process.env.FROM_EMAIL,
      to: email,
      subject: '❌ Election Creator Request Update',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2>Hi ${name},</h2>
          <p>Thank you for your interest in becoming an Election Creator.</p>
          <p>Unfortunately, your request was not approved at this time.</p>
          <div style="background: #fee2e2; border-left: 4px solid #ef4444; padding: 15px; margin: 20px 0; border-radius: 4px;">
            <strong>Reason:</strong><br/>
            ${reason}
          </div>
          <p>You can resubmit your request after addressing the feedback.</p>
          <p style="color: #666; font-size: 14px;">
            If you have questions, please contact the system administrator.
          </p>
        </div>
      `
    });
    console.log(`✓ Rejection email sent to ${email}`);
  } catch (error) {
    console.error('Error sending rejection email:', error);
    throw error;
  }
};

/**
 * Send secret voter ID email
 */
export const sendSecretIdEmail = async (email, name, secretId, electionTitle) => {
  try {
    await resend.emails.send({
      from: process.env.FROM_EMAIL,
      to: email,
      subject: `🔐 Your Secret Voter ID for: ${electionTitle}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2>Hi ${name},</h2>
          <p>You have been finalized as a voter for:</p>
          <h3 style="color: #6366f1;">${electionTitle}</h3>
          
          <div style="background: #f0f0f0; padding: 20px; border-radius: 8px; text-align: center; margin: 20px 0;">
            <p style="color: #666; margin: 0 0 10px 0; font-size: 14px;">Your Secret Voter ID:</p>
            <div style="font-size: 28px; font-family: monospace; letter-spacing: 4px; font-weight: bold; color: #6366f1;">
              ${secretId}
            </div>
          </div>
          
          <div style="background: #fef3c7; border-left: 4px solid #f59e0b; padding: 15px; border-radius: 4px; margin: 20px 0;">
            <strong>⚠️ IMPORTANT:</strong><br/>
            • Keep this code SECRET<br/>
            • Do NOT share it with anyone<br/>
            • You will need it to cast your vote<br/>
            • This code is unique to you and this election<br/>
          </div>
          
          <p style="color: #666; font-size: 14px;">
            You will receive another email when voting begins.
          </p>
        </div>
      `
    });
    console.log(`✓ Secret ID email sent to ${email}`);
  } catch (error) {
    console.error('Error sending secret ID email:', error);
    throw error;
  }
};

/**
 * Send election start notification
 */
export const sendElectionStartEmail = async (email, name, electionTitle, endTime) => {
  try {
    const endDateTime = new Date(endTime).toLocaleString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });

    await resend.emails.send({
      from: process.env.FROM_EMAIL,
      to: email,
      subject: `🗳️ Voting is NOW OPEN: ${electionTitle}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #10b981;">🗳️ Voting is NOW OPEN!</h2>
          <p>Hi ${name},</p>
          <p>Voting has started for:</p>
          <h3 style="color: #6366f1;">${electionTitle}</h3>
          
          <div style="background: #dbeafe; border-left: 4px solid #3b82f6; padding: 15px; border-radius: 4px; margin: 20px 0;">
            <strong>⏰ Voting Closes At:</strong><br/>
            ${endDateTime}
          </div>
          
          <p>Use your secret voter ID (sent earlier) to cast your vote. Your vote is anonymous and will be kept secret.</p>
          
          <p>
            <a href="${process.env.FRONTEND_URL}" 
               style="display: inline-block; padding: 10px 20px; background: #10b981; color: white; text-decoration: none; border-radius: 5px;">
              Cast Your Vote Now
            </a>
          </p>
          
          <p style="color: #666; font-size: 14px;">
            Do not miss this opportunity to vote!
          </p>
        </div>
      `
    });
    console.log(`✓ Election start email sent to ${email}`);
  } catch (error) {
    console.error('Error sending election start email:', error);
    throw error;
  }
};

/**
 * Send election results notification
 */
export const sendElectionResultsEmail = async (email, name, electionTitle, winnerName) => {
  try {
    await resend.emails.send({
      from: process.env.FROM_EMAIL,
      to: email,
      subject: `📊 Election Results: ${electionTitle}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #6366f1;">📊 Election Results</h2>
          <p>Hi ${name},</p>
          <p>Voting has closed for:</p>
          <h3>${electionTitle}</h3>
          
          <div style="background: #f0f9ff; border-left: 4px solid #6366f1; padding: 15px; border-radius: 4px; margin: 20px 0;">
            <strong>🏆 Winner:</strong><br/>
            <h3 style="margin: 10px 0; color: #10b981;">${winnerName}</h3>
          </div>
          
          <p>View detailed results and analytics:</p>
          <p>
            <a href="${process.env.FRONTEND_URL}/election/${electionTitle}" 
               style="display: inline-block; padding: 10px 20px; background: #6366f1; color: white; text-decoration: none; border-radius: 5px;">
              View Full Results
            </a>
          </p>
        </div>
      `
    });
    console.log(`✓ Results email sent to ${email}`);
  } catch (error) {
    console.error('Error sending results email:', error);
    throw error;
  }
};
