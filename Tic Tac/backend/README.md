# Tic Tac Pro - Backend Server

Node.js + Express.js + Socket.IO backend for Tic Tac Pro game.

## Features

- ✅ User authentication (JWT)
- ✅ Game management (create, move, forfeit)
- ✅ Real-time multiplayer (Socket.IO)
- ✅ Leaderboard system
- ✅ Achievement tracking
- ✅ Room management
- ✅ AI move calculation
- ✅ SQLite database
- ✅ Rate limiting
- ✅ Error handling

## Quick Start

### 1. Install Dependencies

```bash
cd backend
npm install
```

### 2. Setup Environment

```bash
cp .env.example .env
```

Edit `.env` and set your configuration:
```env
PORT=3000
JWT_SECRET=your_super_secret_key_here
NODE_ENV=development
```

### 3. Initialize Database

```bash
npm run init-db
```

This creates all tables and inserts default achievements.

### 4. Start Server

```bash
# Development (with auto-reload)
npm run dev

# Production
npm start
```

Server will run on `http://localhost:3000`

## API Endpoints

### Authentication

- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `POST /api/auth/logout` - Logout user
- `GET /api/auth/profile` - Get user profile
- `PUT /api/auth/profile` - Update user profile

### Games

- `POST /api/games/create` - Create new game
- `POST /api/games/:gameId/move` - Make a move
- `GET /api/games/:gameId` - Get game details
- `POST /api/games/:gameId/forfeit` - Forfeit game
- `GET /api/games/history` - Get game history
- `GET /api/games/stats` - Get player stats

### Scores

- `GET /api/scores/leaderboard` - Get leaderboard
- `POST /api/scores/save` - Save score
- `GET /api/scores/my-scores` - Get my scores

### Rooms

- `POST /api/rooms/create` - Create room
- `POST /api/rooms/:roomCode/join` - Join room
- `GET /api/rooms/available` - Get available rooms
- `GET /api/rooms/:roomCode` - Get room details
- `POST /api/rooms/:roomCode/leave` - Leave room

### Achievements

- `GET /api/achievements` - Get all achievements
- `GET /api/achievements/my-achievements` - Get my achievements
- `POST /api/achievements/check` - Check for new achievements

## Socket.IO Events

### Client → Server

- `game:create-room` - Create game room
- `game:join-room` - Join game room
- `game:move` - Make move in game
- `game:leave` - Leave room

### Server → Client

- `game:room-created` - Room created successfully
- `game:player-joined` - Player joined room
- `game:game-started` - Game started
- `game:move-received` - Move received
- `game:game-ended` - Game ended
- `game:player-left` - Player left room
- `game:error` - Error occurred

## Testing

### Using curl

```bash
# Register
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"name":"Test User","email":"test@test.com","password":"password123"}'

# Login
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@test.com","password":"password123"}'

# Create Game (replace YOUR_TOKEN)
curl -X POST http://localhost:3000/api/games/create \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -d '{"gameMode":"pva","gridSize":3,"aiDifficulty":"hard"}'
```

### Using Postman

1. Import the API endpoints
2. Set Authorization header: `Bearer YOUR_TOKEN`
3. Test each endpoint

## Project Structure

```
backend/
├── src/
│   ├── config/
│   │   ├── database.js          # Database connection
│   │   ├── init-database.js     # Database initialization
│   │   └── constants.js         # App constants
│   ├── middleware/
│   │   ├── auth.js              # JWT authentication
│   │   ├── errorHandler.js     # Error handling
│   │   └── validation.js       # Input validation
│   ├── services/
│   │   ├── gameService.js       # Game logic
│   │   ├── aiService.js         # AI algorithms
│   │   └── authService.js       # Auth logic
│   ├── routes/
│   │   ├── auth.js              # Auth routes
│   │   ├── games.js             # Game routes
│   │   ├── scores.js            # Score routes
│   │   ├── rooms.js             # Room routes
│   │   └── achievements.js      # Achievement routes
│   ├── socket-handlers.js       # Socket.IO handlers
│   ├── app.js                   # Express app
│   └── server.js                # Server entry point
├── database.sqlite              # SQLite database
├── .env                         # Environment variables
├── .env.example                 # Environment template
├── package.json                 # Dependencies
└── README.md                    # This file
```

## Database Schema

### Users
- id, name, email, password_hash
- total_wins, total_losses, total_draws, total_games
- created_at, updated_at, last_login

### Games
- id, game_mode, grid_size, status
- player_x_id, player_o_id
- board (JSON), current_player, winner, winning_line
- ai_difficulty, duration_seconds
- created_at, updated_at, ended_at

### Scores
- id, player_id, game_id
- opponent_name, result, grid_size
- created_at

### Achievements
- id, name, description, icon
- created_at

### User Achievements
- id, user_id, achievement_id
- unlocked_at

### Rooms
- id, code, host_id, room_name
- grid_size, max_players, status
- created_at, updated_at

### Room Players
- id, room_id, player_id
- joined_at

## Environment Variables

```env
# Server
PORT=3000
NODE_ENV=development

# Database
DATABASE_URL=./database.sqlite

# JWT
JWT_SECRET=your_secret_key
JWT_EXPIRES_IN=7d

# CORS
CORS_ORIGIN=http://localhost:*

# Rate Limiting
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100
```

## Security

- ✅ JWT authentication
- ✅ Password hashing (bcrypt)
- ✅ Rate limiting
- ✅ Input validation
- ✅ CORS configuration
- ✅ SQL injection prevention (parameterized queries)

## Deployment

### Heroku

```bash
heroku create tic-tac-pro-backend
heroku config:set JWT_SECRET=your_secret
git push heroku main
```

### Docker

```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm install --production
COPY . .
EXPOSE 3000
CMD ["npm", "start"]
```

## Troubleshooting

### Database locked error
```bash
rm database.sqlite
npm run init-db
```

### Port already in use
```bash
# Change PORT in .env file
PORT=3001
```

### JWT errors
```bash
# Generate new secret
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

## Development

### Add new endpoint

1. Create route in `src/routes/`
2. Create controller logic
3. Add to `src/app.js`
4. Test with curl/Postman

### Add new socket event

1. Add handler in `src/socket-handlers.js`
2. Emit from client
3. Test connection

## License

MIT

## Support

For issues, please check:
1. Database is initialized
2. Environment variables are set
3. Port is available
4. Dependencies are installed

---

**Status**: ✅ Ready to use  
**Version**: 1.0.0
