// backend/src/templates/emailTemplates.js
/**
 * Email HTML Templates
 * All email templates for the election system
 */

export const getApprovalEmailHTML = (name) => `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <style>
        body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; background: #f9f9f9; }
        .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; text-align: center; border-radius: 8px; margin-bottom: 20px; }
        .content { background: white; padding: 30px; border-radius: 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.1); }
        .footer { text-align: center; margin-top: 20px; font-size: 12px; color: #666; }
        .button { display: inline-block; background: #667eea; color: white; padding: 12px 30px; text-decoration: none; border-radius: 4px; margin: 20px 0; }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>🎉 Approved!</h1>
        </div>
        <div class="content">
            <h2>Hi ${name},</h2>
            <p>Congratulations! Your request to become an Election Creator has been <strong>approved</strong>.</p>
            <p>You can now:</p>
            <ul>
                <li>✅ Create new elections</li>
                <li>✅ Manage candidates</li>
                <li>✅ Monitor voting in real-time</li>
                <li>✅ View election results</li>
            </ul>
            <p>Log in to your account to get started creating your first election!</p>
            <a href="${process.env.FRONTEND_URL}/creator/dashboard" class="button">Go to Dashboard</a>
            <p style="margin-top: 30px; color: #666;">If you have any questions, please contact us at ${process.env.FROM_EMAIL}</p>
        </div>
        <div class="footer">
            <p>&copy; 2024 Election Management System. All rights reserved.</p>
        </div>
    </div>
</body>
</html>
`;

export const getRejectionEmailHTML = (name, reason) => `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <style>
        body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; background: #f9f9f9; }
        .header { background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%); color: white; padding: 30px; text-align: center; border-radius: 8px; margin-bottom: 20px; }
        .content { background: white; padding: 30px; border-radius: 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.1); }
        .reason { background: #ffe5e5; border-left: 4px solid #f5576c; padding: 15px; border-radius: 4px; margin: 20px 0; }
        .footer { text-align: center; margin-top: 20px; font-size: 12px; color: #666; }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>📋 Decision Update</h1>
        </div>
        <div class="content">
            <h2>Hi ${name},</h2>
            <p>Thank you for your interest in becoming an Election Creator. Unfortunately, your request has been <strong>rejected</strong>.</p>
            <div class="reason">
                <strong>Reason:</strong>
                <p>${reason}</p>
            </div>
            <p>You can reapply after addressing the concerns mentioned above. We encourage you to try again!</p>
            <p style="margin-top: 30px; color: #666;">If you have questions, please contact us at ${process.env.FROM_EMAIL}</p>
        </div>
        <div class="footer">
            <p>&copy; 2024 Election Management System. All rights reserved.</p>
        </div>
    </div>
</body>
</html>
`;

export const getSecretIdEmailHTML = (name, electionTitle, secretId) => `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <style>
        body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; background: #f9f9f9; }
        .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; text-align: center; border-radius: 8px; margin-bottom: 20px; }
        .content { background: white; padding: 30px; border-radius: 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.1); }
        .secret-box { background: #f0f4ff; border: 2px dashed #667eea; padding: 20px; text-align: center; border-radius: 8px; margin: 20px 0; }
        .secret-id { font-size: 24px; font-weight: bold; color: #667eea; letter-spacing: 2px; font-family: monospace; }
        .warning { background: #fff3cd; border-left: 4px solid #ffc107; padding: 15px; border-radius: 4px; margin: 20px 0; font-size: 14px; }
        .footer { text-align: center; margin-top: 20px; font-size: 12px; color: #666; }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>🗳️ Your Voting Access</h1>
        </div>
        <div class="content">
            <h2>Hi ${name},</h2>
            <p>You have been registered to vote in the election:</p>
            <h3 style="color: #667eea; text-align: center;">${electionTitle}</h3>
            <p>Your unique Secret ID is:</p>
            <div class="secret-box">
                <p>Secret ID</p>
                <div class="secret-id">${secretId}</div>
            </div>
            <div class="warning">
                <strong>⚠️ Important:</strong>
                <ul>
                    <li>Keep this Secret ID confidential</li>
                    <li>You will need this to cast your vote</li>
                    <li>Do not share this with anyone</li>
                    <li>This is your voting credential</li>
                </ul>
            </div>
            <p>Visit the election page to cast your vote using this Secret ID.</p>
        </div>
        <div class="footer">
            <p>&copy; 2024 Election Management System. All rights reserved.</p>
        </div>
    </div>
</body>
</html>
`;

export const getElectionStartEmailHTML = (name, electionTitle, votingUrl) => `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <style>
        body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; background: #f9f9f9; }
        .header { background: linear-gradient(135deg, #11998e 0%, #38ef7d 100%); color: white; padding: 30px; text-align: center; border-radius: 8px; margin-bottom: 20px; }
        .content { background: white; padding: 30px; border-radius: 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.1); }
        .button { display: inline-block; background: #38ef7d; color: white; padding: 12px 30px; text-decoration: none; border-radius: 4px; margin: 20px 0; }
        .footer { text-align: center; margin-top: 20px; font-size: 12px; color: #666; }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>🎯 Voting Started!</h1>
        </div>
        <div class="content">
            <h2>Hi ${name},</h2>
            <p>The election <strong>${electionTitle}</strong> has started!</p>
            <p>Voting is now open. You can cast your vote using your Secret ID.</p>
            <a href="${votingUrl}" class="button">Cast Your Vote Now</a>
            <p style="margin-top: 30px; color: #666;">Hurry! Voting will close at the scheduled time.</p>
        </div>
        <div class="footer">
            <p>&copy; 2024 Election Management System. All rights reserved.</p>
        </div>
    </div>
</body>
</html>
`;

export const getResultsEmailHTML = (name, electionTitle, winner, totalVotes) => `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <style>
        body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; background: #f9f9f9; }
        .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; text-align: center; border-radius: 8px; margin-bottom: 20px; }
        .content { background: white; padding: 30px; border-radius: 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.1); }
        .winner-box { background: #fff3cd; border: 2px solid #ffc107; padding: 20px; border-radius: 8px; text-align: center; margin: 20px 0; }
        .winner-name { font-size: 20px; font-weight: bold; color: #667eea; }
        .stats { display: grid; grid-template-columns: 1fr 1fr; gap: 10px; margin: 20px 0; }
        .stat-box { background: #f0f4ff; padding: 15px; border-radius: 4px; text-align: center; }
        .footer { text-align: center; margin-top: 20px; font-size: 12px; color: #666; }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>📊 Results Are In!</h1>
        </div>
        <div class="content">
            <h2>Hi ${name},</h2>
            <p>The election <strong>${electionTitle}</strong> has concluded. Here are the results:</p>
            <div class="winner-box">
                <p>🏆 Winner</p>
                <div class="winner-name">${winner}</div>
            </div>
            <div class="stats">
                <div class="stat-box">
                    <div style="font-size: 24px; font-weight: bold; color: #667eea;">${totalVotes}</div>
                    <div style="color: #666; font-size: 12px;">Total Votes</div>
                </div>
            </div>
            <p>Thank you for participating in this election!</p>
        </div>
        <div class="footer">
            <p>&copy; 2024 Election Management System. All rights reserved.</p>
        </div>
    </div>
</body>
</html>
`;
