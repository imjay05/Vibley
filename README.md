<div align="center">

<img src="frontend/public/logo_light.png" alt="Vibley Logo" width="80" />

# Vibley 💬

### Real-Time Messaging with a Friends System & Ephemeral Vibes

*Real conversations. Real connections. Less noise.*

[![React](https://img.shields.io/badge/React-19.x-61DAFB?style=flat-square&logo=react&logoColor=black)](https://react.dev/)
[![Node.js](https://img.shields.io/badge/Node.js-18.x-339933?style=flat-square&logo=node.js&logoColor=white)](https://nodejs.org/)
[![MongoDB](https://img.shields.io/badge/MongoDB-Atlas-47A248?style=flat-square&logo=mongodb&logoColor=white)](https://www.mongodb.com/atlas)
[![Socket.io](https://img.shields.io/badge/Socket.io-4.x-010101?style=flat-square&logo=socket.io&logoColor=white)](https://socket.io/)
[![Cloudinary](https://img.shields.io/badge/Cloudinary-Media-3448C5?style=flat-square&logo=cloudinary&logoColor=white)](https://cloudinary.com/)
[![Tailwind](https://img.shields.io/badge/Tailwind-v3-06B6D4?style=flat-square&logo=tailwindcss&logoColor=white)](https://tailwindcss.com/)

**[Live Demo →](#)**

</div>

---

## The Problem

Modern messaging apps are bloated. Algorithmically-recommended strangers, infinite scroll, engagement traps — none of it makes you feel more connected to the people you actually care about.

Vibley cuts through the noise:

- You can only chat with **mutual friends** — no strangers, no spam
- Messages auto-expire after **7 days** to keep conversations present, not archival
- **Vibes** let you share your mood via a meme that disappears after 24 hours — expressive, low-pressure, ephemeral

---

## What It Does

| Feature | Description |
|---|---|
| **Friends-Only Messaging** | Chat is gated behind a mutual friend request — no cold messages |
| **Real-Time Delivery** | Messages show `sending → sent → delivered → seen` status, live |
| **Vibes** | Post a daily meme-based mood that expires after 24 hours |
| **Image Attachments** | Send photos in chat via Cloudinary |
| **Reply & Delete** | Quote messages, delete for yourself or delete for everyone |
| **Unread Counts** | Per-contact unread badge in the sidebar |
| **Online Presence** | See which friends are currently online |

---

## Tech Stack

### Backend

| Layer | Technology |
|---|---|
| Runtime | Node.js ≥ 18 |
| Framework | Express.js v5 |
| Database | MongoDB Atlas (Mongoose ODM) |
| Real-time | Socket.IO |
| Auth | JWT + bcryptjs, HTTP-only cookies |
| Media | Cloudinary |
| Memes | Imgflip public API |

### Frontend

| Layer | Technology |
|---|---|
| Framework | React 19 + Vite |
| Routing | React Router v7 |
| State | Zustand |
| HTTP | Axios |
| Real-time | Socket.IO Client |
| Styling | Tailwind CSS v3 + DaisyUI v5 |
| Toasts | react-hot-toast |
| Icons | lucide-react |

---

## Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                        CLIENT (React + Vite)                    │
│                                                                 │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌───────────────┐    │
│  │ Auth     │  │ Chat     │  │ Vibes    │  │ Friends       │    │
│  │ Store    │  │ Store    │  │ Store    │  │ (in ChatStore)│    │
│  └────┬─────┘  └────┬─────┘  └────┬─────┘  └──────┬────────┘    │
│       └─────────────┴──────────────┴────────────────┘           │
│                    Axios (REST) + Socket.IO Client              │
└──────────────────────────────┬──────────────────────────────────┘
                               │ HTTP / WebSocket
              ┌────────────────▼────────────────┐
              │        Express.js Server        │
              │                                 │
              │   ┌──────────────────────────┐  │
              │   │     REST API Routes      │  │
              │   │  /api/auth               │  │
              │   │  /api/messages           │  │
              │   │  /api/users              │  │
              │   │  /api/vibes              │  │
              │   └──────────────────────────┘  │
              │   ┌──────────────────────────┐  │
              │   │     Socket.IO Server     │  │
              │   │  - online presence       │  │
              │   │  - newMessage            │  │
              │   │  - messagesDelivered     │  │
              │   │  - messagesSeen          │  │
              │   └──────────────────────────┘  │
              └──────────────┬──────────────────┘
                             │
              ┌──────────────▼─────────────┐
              │         MongoDB            │
              │  Users · Messages · Vibes  │
              └──────────────┬─────────────┘
                             │
              ┌──────────────▼─────────────┐
              │         Cloudinary         │
              │  Profile pics · Attachments│
              │  Vibe meme mirrors         │
              └────────────────────────────┘
```

---

## Folder Structure

```
vibley/
│
├── backend/
│   ├── controllers/
│   │   ├── AuthController.js       # signup, login, logout, updateProfile, checkAuth
│   │   ├── MessageController.js    # getMessages, sendMessage, deleteMessage, getUnreadCounts
│   │   ├── UserController.js       # searchUsers, friend requests, getFriends
│   │   └── VibeController.js       # CRUD vibes, meme generation, replies
│   │
│   ├── lib/
│   │   ├── Cloudinary.js           # Cloudinary v2 config
│   │   ├── DB.js                   # MongoDB connection
│   │   ├── Socket.js               # Socket.IO server + userSocketMap
│   │   └── Utils.js                # generateToken (JWT + cookie)
│   │
│   ├── middleware/
│   │   └── AuthMiddleware.js       # protectRoute — JWT verification
│   │
│   ├── models/
│   │   ├── User.js
│   │   ├── Message.js
│   │   └── Vibe.js                 # TTL indexed on expiresAt
│   │
│   ├── routes/
│   │   ├── AuthRoute.js
│   │   ├── MessageRoute.js
│   │   ├── UserRoute.js
│   │   └── VibeRoute.js
│   │
│   └── server.js                   # Entry point
│
└── frontend/
    ├── public/
    │   ├── avatar.png
    │   └── logo_light.png
    │
    └── src/
        ├── components/
        │   ├── chat/
        │   │   ├── ChatContainer.jsx    # Message list, delete, reply
        │   │   ├── ChatHeader.jsx       # Selected user header + close
        │   │   ├── DeleteModal.jsx      # Delete for me / everyone modal
        │   │   ├── MessageInput.jsx     # Text + image + reply input
        │   │   └── StatusLabel.jsx      # sent/delivered/seen indicator
        │   ├── contact/
        │   │   ├── AddContactModal.jsx       # Search + send friend request
        │   │   └── FriendRequestsModal.jsx   # Accept / reject requests
        │   ├── skeletons/
        │   │   ├── MessageSkeleton.jsx
        │   │   └── SidebarSkeleton.jsx
        │   ├── vibe/
        │   │   ├── AddVibeModal.jsx     # Generate + post vibe
        │   │   ├── MemeSelector.jsx     # Pick from meme options
        │   │   └── VibeCard.jsx         # Display a single vibe
        │   ├── Navbar.jsx
        │   └── Sidebar.jsx
        │
        ├── lib/
        │   ├── Axios.js                 # Axios instance
        │   └── Utils.js                 # formatMessageTime, formatRelativeTime
        │
        ├── pages/
        │   ├── home/                    # HomePage.jsx + HomePage.css
        │   ├── login/                   # LoginPage.jsx + LoginPage.css
        │   ├── profile/                 # ProfilePage.jsx + ProfilePage.css
        │   ├── signup/                  # SignupPage.jsx + SignupPage.css
        │   └── vibe/                    # VibePage.jsx + VibePage.css
        │
        └── store/
            ├── useAuthStore.js          # Auth state + socket init
            ├── useChatStore.js          # Messages, friends, unread counts
            └── useVibeStore.js          # Vibes state
```

---

## Database Schemas

### User
```js
{
  email:          String    // required, unique
  fullName:       String    // required
  password:       String    // bcrypt-hashed, minlength: 6, select: false
  profilePic:     String    // Cloudinary URL, default: ""
  friends:        [ObjectId → User]
  friendRequests: [{ from: ObjectId → User, createdAt: Date }]
}
```

### Message
```js
{
  senderId:   ObjectId → User    // required
  receiverId: ObjectId → User    // required
  text:       String
  image:      String             // Cloudinary URL
  status:     String             // enum: "sent" | "delivered" | "seen"
  replyTo:    ObjectId → Message // quoted message reference
  deletedFor: [ObjectId → User]  // soft-delete per user
}
```

### Vibe
```js
{
  userId:    ObjectId → User   // required
  memeUrl:   String            // Cloudinary URL
  moodText:  String            // required
  caption:   String            // default: ""
  expiresAt: Date              // +24h from creation — TTL indexed
  replies: [{
    fromId:    ObjectId → User
    text:      String
    createdAt: Date
  }]
}
// TTL index: { expiresAt: 1 }, expireAfterSeconds: 0
```

### ER Diagram

```
┌──────────────────────┐         ┌──────────────────────┐
│         User         │         │       Message        │
├──────────────────────┤         ├──────────────────────┤
│ _id (PK)             │◄────────│ senderId (FK)        │
│ email                │◄────────│ receiverId (FK)      │
│ fullName             │         │ text                 │
│ password             │         │ image                │
│ profilePic           │         │ status               │
│ friends[]    ────────┼──┐      │ replyTo (FK→Message) │
│ friendRequests[]     │  │      │ deletedFor[] (FK)    │
└──────────────────────┘  │      └──────────────────────┘
         ▲                │
         │  (self-ref M:M)│
         └────────────────┘

┌──────────────────────┐
│         Vibe         │
├──────────────────────┤
│ _id (PK)             │
│ userId (FK → User)   │  ← one user, one active vibe
│ memeUrl              │
│ moodText             │
│ caption              │
│ expiresAt (TTL)      │
│ replies[]            │
│   ├─ fromId (FK→User)│
│   ├─ text            │
│   └─ createdAt       │
└──────────────────────┘
```

---

## API Reference

All protected routes require a valid JWT cookie set at login.

### Auth — `/api/auth`

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| POST | `/signup` | ✗ | Register new user |
| POST | `/login` | ✗ | Login, sets JWT HTTP-only cookie |
| POST | `/logout` | ✗ | Clears JWT cookie |
| PUT | `/update-profile` | ✓ | Upload profile picture |
| GET | `/check` | ✓ | Verify session / get current user |

### Messages — `/api/messages`

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| GET | `/unread` | ✓ | Unread counts grouped by sender |
| POST | `/send/:id` | ✓ | Send message to user |
| GET | `/:id` | ✓ | Get conversation (7-day window) |
| DELETE | `/:id` | ✓ | Delete message — for me or for everyone |

### Users — `/api/users`

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| GET | `/search?query=` | ✓ | Search users by name |
| GET | `/friends` | ✓ | Get my friends list |
| GET | `/requests` | ✓ | Get incoming friend requests |
| POST | `/request/:id` | ✓ | Send friend request |
| POST | `/accept/:id` | ✓ | Accept friend request |
| POST | `/reject/:id` | ✓ | Reject friend request |

### Vibes — `/api/vibes`

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| GET | `/friends` | ✓ | Get active vibes from friends |
| GET | `/mine` | ✓ | Get my current active vibe |
| POST | `/generate` | ✓ | Fetch random meme from Imgflip |
| POST | `/` | ✓ | Post a new vibe |
| DELETE | `/:id` | ✓ | Delete my vibe |
| POST | `/:id/reply` | ✓ | Reply to a friend's vibe |

---

## WebSocket Events

### Server → Client

| Event | Payload | Description |
|---|---|---|
| `getOnlineUsers` | `string[]` (userIds) | Broadcast online user list |
| `newMessage` | `Message` object | Deliver new message to receiver |
| `messagesDelivered` | `{ to: userId }` | Notify sender messages were delivered |
| `messagesSeen` | `{ by: userId }` | Notify sender messages were seen |

### Client → Server

| Event | Description |
|---|---|
| `disconnect` | Auto — removes user from online map |

---

## Environment Variables

### Backend `.env`

```env
PORT=5001
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret_key
NODE_ENV=development

CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret

IMGFLIP_USERNAME=your_imgflip_username
IMGFLIP_PASSWORD=your_imgflip_password
```

---

## Getting Started

### Prerequisites

- Node.js ≥ 18
- [MongoDB Atlas](https://www.mongodb.com/atlas) account (free tier works)
- [Cloudinary](https://cloudinary.com) account (free tier)
- [Imgflip](https://imgflip.com) account (free)

### Installation

```bash
# 1. Clone
git clone https://github.com/imjay05/vibley.git
cd vibley

# 2. Backend
cd backend
npm install
cp .env.example .env
# Fill in all values in .env
npm run dev
# → running on http://localhost:5001

# 3. Frontend (separate terminal)
cd ../frontend
npm install
npm run dev
# → running on http://localhost:5173
```

### Building for Production

```bash
cd frontend
npm run build        # outputs to dist/

cd ../backend
NODE_ENV=production npm start
# Express serves the built frontend from ../frontend/dist
```

---

## Usage

### Messaging a Friend

1. Send a friend request via **Add Contact** in the sidebar
2. Once accepted, the friend appears in your contacts list
3. Click a friend to open the chat — messages are delivered live via Socket.IO
4. Status updates from `sent` → `delivered` → `seen` happen automatically

### Posting a Vibe

1. Go to the **Vibes** page from the sidebar
2. Click **Post a Vibe** — a random meme is fetched from Imgflip
3. Pick your meme, add a mood and optional caption, and post
4. Your Vibe shows up for all friends with a ring indicator on your avatar
5. Friends can reply to your Vibe — it auto-deletes after 24 hours

---

## Key Design Decisions

| Decision | Rationale |
|---|---|
| Friends-only messaging | Prevents spam, maintains trust — you only chat with people you know |
| 7-day message window | Keeps the DB lean and encourages present-tense conversations |
| Vibes expire in 24h | Ephemeral sharing reduces social pressure — no permanent record |
| `sent → delivered → seen` status | Transparent delivery without read-receipt anxiety, matching WhatsApp UX |
| HTTP-only cookies for JWT | Immune to XSS token theft — safer than `localStorage` |
| Cloudinary for media | Offloads storage, provides CDN, avoids GridFS complexity |
| Imgflip for memes | Free, large library, no generation cost |
| TTL index on Vibe | Zero-maintenance expiry — MongoDB handles cleanup automatically |
| Zustand over Redux | Minimal boilerplate, simpler async patterns, built-in devtools |

---

## Security

| Concern | Mitigation |
|---|---|
| Password storage | bcrypt with 10 salt rounds |
| Authentication | JWT in HTTP-only, sameSite strict cookies — immune to XSS |
| Authorization | All routes protected by `protectRoute` middleware |
| Delete-for-everyone | Only allowed for the original message sender |
| Impersonation | Unique `fullName` enforcement at signup |
| CORS | Restricted to `localhost:5173` in development |

---

## Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/your-feature-name`
3. Commit using [Conventional Commits](https://www.conventionalcommits.org/): `git commit -m 'feat: add some feature'`
4. Push and open a Pull Request against `main`

**Commit types:** `feat` · `fix` · `docs` · `style` · `refactor` · `perf` · `test` · `chore`

---

<div align="center">

Made with dedication in Pune, Maharashtra

**Jay** · [GitHub](https://github.com/imjay05) · [LinkedIn](https://www.linkedin.com/in/jay-shelke-4323a22a5/)

*Vibley — real conversations, real connections, less noise.*

</div>
