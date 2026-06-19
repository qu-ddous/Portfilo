# 🗳️ Secure Online Election Management System

## 📋 Project Overview

A comprehensive, production-ready election management platform built with modern web technologies. Features anonymous voting, real-time results, advanced security measures, and role-based access control.

**Status**: ✅ **100% COMPLETE** - All core features and advanced features implemented and tested

---

## 🏗️ Architecture Overview

### Tech Stack

**Frontend:**
- React 18 with Vite (ES6 modules, HMR enabled)
- TypeScript-ready structure (can add type safety)
- Tailwind CSS with custom dark theme
- Framer Motion for smooth animations
- React Router v6 with protected routes
- Zustand for state management
- TanStack React Query for data fetching
- Supabase JS Client for auth
- React Hook Form + Zod for validation
- QRCode library for vote receipts

**Backend:**
- Node.js with ES6 modules
- Express.js with comprehensive middleware
- Supabase SDK (PostgreSQL database)
- JWT authentication
- Resend API for email delivery
- Crypto for 2FA (TOTP)
- Rate limiting (5 votes/min, 100 global/15min)

**Database:**
- PostgreSQL via Supabase
- 8 data tables with Row Level Security
- 3 database functions for aggregation
- 3 triggers for automation
- Strategic indexes on hot columns

---

## 📦 Project Structure

```
Election Management System/
├── backend/
│   ├── src/
│   │   ├── controllers/
│   │   │   ├── auth.controller.js
│   │   │   ├── election.controller.js
│   │   │   ├── candidate.controller.js
│   │   │   ├── vote.controller.js
│   │   │   ├── admin.controller.js
│   │   │   ├── voter-registration.controller.js
│   │   │   ├── notification.controller.js
│   │   │   ├── analytics.controller.js (ADVANCED)
│   │   │   └── twofa.controller.js (ADVANCED)
│   │   ├── routes/
│   │   │   ├── auth.routes.js
│   │   │   ├── election.routes.js
│   │   │   ├── candidate.routes.js
│   │   │   ├── vote.routes.js
│   │   │   ├── admin.routes.js
│   │   │   ├── voter-registration.routes.js
│   │   │   ├── notification.routes.js
│   │   │   ├── analytics.routes.js (ADVANCED)
│   │   │   └── twofa.routes.js (ADVANCED)
│   │   ├── middleware/
│   │   │   └── auth.middleware.js
│   │   ├── services/
│   │   │   ├── supabase.js
│   │   │   ├── email.js
│   │   │   ├── secretId.js
│   │   │   └── qrcode.js (ADVANCED)
│   │   ├── templates/
│   │   │   └── emailTemplates.js (ADVANCED)
│   │   └── app.js
│   ├── .env (configure with your Supabase credentials)
│   └── package.json
│
├── frontend/
│   ├── src/
│   │   ├── pages/
│   │   │   ├── LandingPage.jsx
│   │   │   ├── LoginPage.jsx
│   │   │   ├── RegisterPage.jsx
│   │   │   ├── ForgotPasswordPage.jsx
│   │   │   ├── admin/
│   │   │   │   ├── AdminDashboard.jsx
│   │   │   │   ├── ApprovalQueuePage.jsx
│   │   │   │   ├── AuditLogsPage.jsx
│   │   │   │   └── AnalyticsPage.jsx (ADVANCED)
│   │   │   ├── creator/
│   │   │   │   ├── CreatorDashboard.jsx
│   │   │   │   ├── CreateElectionPage.jsx
│   │   │   │   ├── ManageCandidatesPage.jsx
│   │   │   │   ├── ElectionControlPage.jsx
│   │   │   │   └── MyElectionsPage.jsx
│   │   │   ├── voter/
│   │   │   │   ├── VoterDashboard.jsx
│   │   │   │   ├── CastVotePage.jsx
│   │   │   │   └── VoteConfirmationPage.jsx
│   │   │   └── ElectionDetailPage.jsx
│   │   ├── components/
│   │   │   ├── Button.jsx
│   │   │   ├── Badge.jsx
│   │   │   ├── Modal.jsx
│   │   │   ├── Card.jsx
│   │   │   ├── LoadingSpinner.jsx
│   │   │   ├── ErrorBoundary.jsx
│   │   │   ├── Alert.jsx
│   │   │   ├── InputField.jsx
│   │   │   ├── SelectField.jsx
│   │   │   ├── BubbleCard.jsx
│   │   │   ├── LanguageSwitcher.jsx (ADVANCED)
│   │   │   ├── TwoFASetup.jsx (ADVANCED)
│   │   │   └── VoteReceiptQR.jsx (ADVANCED)
│   │   ├── i18n/
│   │   │   ├── translations.js (ADVANCED)
│   │   │   └── LanguageContext.jsx (ADVANCED)
│   │   ├── router/
│   │   │   ├── ProtectedRoute.jsx
│   │   │   ├── RoleRoute.jsx
│   │   │   └── index.jsx
│   │   ├── services/
│   │   │   ├── api.js
│   │   │   ├── supabase.js
│   │   │   ├── secretId.js
│   │   │   ├── email.js
│   │   │   └── qrcode.js
│   │   ├── store/
│   │   │   └── authStore.js
│   │   ├── App.jsx
│   │   └── main.jsx
│   ├── .env.local (configure with your Supabase credentials)
│   └── package.json
│
└── DOCUMENTATION.md (this file)
```

---

## 🔐 Security Architecture

### Authentication & Authorization

- **JWT-based authentication** with automatic token refresh
- **Three user roles**: super_admin, election_creator, voter
- **Row Level Security (RLS)** on all database tables
- **Protected routes** with automatic redirect to login
- **Role-based route guards** restricting access by profile role

### Voting Security (9-Step Process)

1. Email-based voter registration
2. Secret ID generation (deterministic, SHA-256 hashed)
3. Vote token creation (HMAC-SHA256)
4. Duplicate prevention check
5. Rate limiting (5 votes per minute per user)
6. Anonymous vote storage (no voter_id in votes table)
7. Vote completion recording
8. Audit logging
9. Result aggregation

### Advanced Security Features

- **Two-Factor Authentication (TOTP)** using HMAC-SHA1
- **Email verification** for critical actions
- **Audit logging** of all system actions
- **Rate limiting** on sensitive endpoints
- **CORS protection** with whitelist
- **Security headers** via Helmet.js
- **Request logging** with Morgan

---

## 📊 Database Schema

### Tables

1. **profiles** - User accounts with roles
2. **elections** - Election metadata and lifecycle
3. **candidates** - Candidates for elections
4. **voter_registrations** - Voter-election linkages
5. **votes** - Anonymous vote records (no voter_id)
6. **audit_logs** - All system actions
7. **creator_requests** - Pending creator approvals
8. **notifications** - User notifications

### Functions

- `get_vote_counts()` - Real-time vote aggregation
- `get_voter_count()` - Count registered voters
- `get_total_votes()` - Sum all votes

### Triggers

- Auto-profile creation on user signup
- Voter status finalization
- Automatic timestamp updates

---

## 🚀 Installation & Setup

### Prerequisites

- Node.js 16+ and npm
- Supabase account (free tier available)
- Resend API key (for email functionality)

### Step 1: Clone & Install Dependencies

```bash
# Backend
cd backend
npm install

# Frontend
cd frontend
npm install
```

### Step 2: Database Setup

1. Log in to [Supabase](https://supabase.com)
2. Create a new project
3. Run the schema script: `SUPABASE_SCHEMA.sql`
4. Verify tables are created with RLS enabled

### Step 3: Environment Configuration

**Backend (.env)**
```env
SUPABASE_URL=your_supabase_url
SUPABASE_SERVICE_KEY=your_service_role_key
SUPABASE_JWT_SECRET=your_jwt_secret
RESEND_API_KEY=your_resend_api_key
JWT_EXPIRY=7d
PORT=3001
```

**Frontend (.env.local)**
```env
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_anon_key
VITE_API_BASE_URL=http://localhost:3001/api
```

### Step 4: Run the Application

**Backend**
```bash
cd backend
npm start
# Server runs on http://localhost:3001
```

**Frontend**
```bash
cd frontend
npm run dev
# App runs on http://localhost:5173
```

---

## 📚 API Documentation

### Authentication Endpoints

```
POST   /api/auth/register          - Create account
POST   /api/auth/login             - Login with email/password
GET    /api/auth/me                - Get current user profile
POST   /api/auth/request-creator   - Request creator role
PATCH  /api/auth/profile           - Update user profile
```

### Election Endpoints

```
POST   /api/elections              - Create election (creator)
GET    /api/elections              - List all elections
GET    /api/elections/:id          - Get election details
PUT    /api/elections/:id          - Update election (creator)
PATCH  /api/elections/:id/publish  - Publish election (creator)
PATCH  /api/elections/:id/start    - Start voting (creator)
PATCH  /api/elections/:id/stop     - Stop voting (creator)
DELETE /api/elections/:id          - Delete election (creator)
GET    /api/elections/:id/results  - Get election results
```

### Voting Endpoints

```
POST   /api/votes/cast             - Cast anonymous vote (rate-limited)
GET    /api/votes/my-vote/:id      - Check if voted (authenticated)
```

### Admin Endpoints

```
GET    /api/admin/creator-requests         - List pending requests
PATCH  /api/admin/creator-requests/:id     - Approve/reject request
GET    /api/admin/users                    - List all users
GET    /api/admin/audit-logs               - View audit logs
GET    /api/admin/stats                    - System statistics
```

### Advanced Endpoints

```
POST   /api/2fa/generate-secret    - Generate 2FA secret
POST   /api/2fa/enable             - Enable 2FA with code
POST   /api/2fa/disable            - Disable 2FA
POST   /api/2fa/verify             - Verify 2FA code
GET    /api/2fa/status             - Get 2FA status

GET    /api/analytics/election/:id - Election analytics
GET    /api/analytics/system       - System analytics
GET    /api/analytics/voting-timeline/:id - Voting timeline
```

---

## 🎯 Features

### Core Features

✅ **User Management**
- Registration & login with email verification
- Profile management and role assignment
- Creator role request workflow
- Password reset functionality

✅ **Election Management**
- Create elections with custom metadata
- Add candidates with photos and manifestos
- Define registration periods
- Control election lifecycle (draft → published → active → completed)

✅ **Anonymous Voting**
- Secret ID-based voter registration
- Deterministic vote tokens
- Anonymous vote storage
- Duplicate prevention
- Real-time result aggregation

✅ **Admin Dashboard**
- Creator approval workflow
- User management and role assignment
- Comprehensive audit logging
- System statistics and monitoring

✅ **Voter Interface**
- Browse available elections
- Register as voter
- Cast anonymous votes
- View election results
- Vote history tracking

### Advanced Features

✅ **Analytics System**
- Real-time vote aggregation
- Participation rate calculation
- Candidate performance metrics
- Voting timeline visualization (hourly/daily/weekly)
- System-wide statistics

✅ **Two-Factor Authentication (2FA)**
- TOTP-based authentication
- Secret key generation
- QR code scanning support
- Device verification
- Audit trail for 2FA changes

✅ **Email Notifications**
- Creator approval/rejection emails
- Secret ID distribution
- Election timeline announcements
- Results publication
- Responsive HTML templates

✅ **QR Code Generation**
- Vote receipts with QR codes
- Election sharing QR codes
- High error correction (Level H)
- PNG data URL export

✅ **Multi-Language Support**
- English and Urdu translations
- RTL/LTR automatic switching
- Persistent language selection
- Comprehensive UI translations

---

## 🧪 Testing the System

### Test Workflow

1. **Register** as a voter
2. **Navigate** to landing page to see available elections
3. **Create** a test election as a creator (request role first)
4. **Add** candidates to your election
5. **Publish** the election
6. **Register** voters for the election
7. **Start** voting
8. **Cast** votes as different voters (using different secret IDs)
9. **View** live results
10. **Stop** election and finalize results

### Test Roles

- **Super Admin**: Approve creators, view all audit logs, system stats
- **Election Creator**: Create/manage elections, view results
- **Voter**: Register for elections, cast votes, view results

---

## 📈 Performance & Scalability

### Optimizations

- **Database indexes** on hot columns (user_id, election_id, created_at)
- **Query caching** with React Query
- **JWT token refresh** preventing re-authentication
- **Rate limiting** preventing abuse
- **Pagination** for large data sets
- **Lazy loading** of components

### Scalability Considerations

- Supabase handles database scaling automatically
- Stateless backend allows horizontal scaling
- Frontend assets can be CDN-cached
- Vote aggregation uses database functions (server-side processing)
- Email delivery via Resend (handles high volume)

---

## 🐛 Troubleshooting

### Common Issues

**"Cannot find module" errors**
- Solution: Ensure `package.json` has `"type": "module"` in backend
- Solution: Check import paths use `.js` extensions

**Database connection failed**
- Solution: Verify `SUPABASE_URL` and keys in `.env`
- Solution: Check Supabase project is active
- Solution: Verify RLS policies allow operations

**CORS errors**
- Solution: Backend CORS is configured for `http://localhost:5173`
- Solution: Update `origin` in `app.js` if using different frontend URL

**Email not sending**
- Solution: Verify `RESEND_API_KEY` is valid
- Solution: Check email address format
- Solution: Review Resend dashboard for delivery status

**2FA QR code not scanning**
- Solution: Ensure `qrcode` package is installed (`npm install qrcode`)
- Solution: Try scanning with different authenticator app

**Rate limit exceeded**
- Solution: Wait 1 minute before casting another vote
- Solution: Check rate limiter configuration in `vote.routes.js`

---

## 📝 Code Examples

### Create a Vote (Frontend)

```javascript
const castVote = async (electionId, candidateId, secretId) => {
  try {
    const response = await api.post('/votes/cast', {
      election_id: electionId,
      candidate_id: candidateId,
      secret_id: secretId
    });
    // Vote successful, show confirmation
  } catch (error) {
    console.error('Vote failed:', error);
  }
};
```

### Get Election Results (Frontend)

```javascript
const { data: results } = useQuery({
  queryKey: ['election-results', electionId],
  queryFn: async () => {
    const response = await api.get(`/elections/${electionId}/results`);
    return response.data;
  }
});
```

### Enable 2FA (Frontend)

```javascript
const enable2FA = async (code) => {
  try {
    const response = await api.post('/2fa/enable', { code });
    // 2FA enabled successfully
  } catch (error) {
    console.error('2FA setup failed:', error);
  }
};
```

---

## 🤝 Contributing

This is a complete, production-ready system. For modifications:

1. Follow existing code patterns and conventions
2. Maintain security standards (no hardcoded secrets)
3. Test all changes end-to-end
4. Update documentation if adding features
5. Follow role-based access control patterns

---

## 📄 License

This project is provided as-is for educational and commercial use.

---

## 📞 Support

For issues or questions:

1. Check the troubleshooting section
2. Review API documentation
3. Verify environment configuration
4. Check browser console for errors
5. Review server logs for detailed errors

---

**System Status**: ✅ Ready for Production Deployment

**Last Updated**: 2024

**Completion Level**: 100% (All core + advanced features implemented)
