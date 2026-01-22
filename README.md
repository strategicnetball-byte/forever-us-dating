# Forever Us - Dating App

A modern dating application built with React, Node.js, and MongoDB.

## Features

- User authentication (register/login)
- Profile creation and management
- Swipe-based matching system
- Real-time messaging
- Location-based matching
- Photo uploads

## Tech Stack

**Frontend:**
- React 18 with TypeScript
- React Router for navigation
- Styled Components for styling
- Socket.io for real-time features

**Backend:**
- Node.js with Express
- MongoDB with Mongoose
- JWT authentication
- Socket.io for real-time messaging
- Multer for file uploads

## Getting Started

### Prerequisites
- Node.js (v16 or higher)
- MongoDB (local or cloud)
- npm or yarn

### Installation

1. Clone the repository
```bash
git clone <your-repo-url>
cd forever-us-dating
```

2. Install dependencies
```bash
npm run install-all
```

3. Set up environment variables
```bash
cp .env.example .env
# Edit .env with your configuration
```

4. Start MongoDB (if running locally)

5. Run the development servers
```bash
npm run dev
```

This will start:
- Backend server on http://localhost:5000
- Frontend development server on http://localhost:3000

## Project Structure

```
forever-us-dating/
├── client/                 # React frontend
│   ├── src/
│   │   ├── components/     # React components
│   │   ├── contexts/       # React contexts
│   │   └── ...
├── server/                 # Node.js backend
│   ├── models/            # MongoDB models
│   ├── routes/            # API routes
│   ├── middleware/        # Custom middleware
│   └── index.js           # Server entry point
└── ...
```

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/me` - Get current user

### Users
- `GET /api/users/profile` - Get user profile
- `PUT /api/users/profile` - Update user profile
- `GET /api/users/discover` - Get potential matches

### Matches
- `POST /api/matches/like` - Like a user
- `POST /api/matches/pass` - Pass on a user
- `GET /api/matches` - Get user's matches

### Messages
- `GET /api/messages/:matchId` - Get messages for a match
- `POST /api/messages` - Send a message

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

This project is licensed under the MIT License.