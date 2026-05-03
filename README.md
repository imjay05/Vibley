# Vibley 💬✨

> **Real conversations. Real connections. Less noise.**

Vibley is a full-stack real-time messaging application with a friends system and ephemeral "Vibes" — a meme-based mood-sharing feature that expires after 24 hours.

---

## 📋 Problem Statement

Modern messaging apps are bloated with features that dilute genuine connection. Vibley solves this by providing:

- A **clean, distraction-free** chat experience between friends only (no strangers)
- A **friend-request system** ensuring you only chat with people you know
- **Ephemeral Vibes** — share your mood via memes that disappear after 24 hours, inspired by Stories, but lighter and more expressive
- **Real-time delivery receipts** (sent → delivered → seen) for transparency
- **Message history limited to 7 days** to keep conversations fresh and storage lean

---

## 🚀 Features

### 🔐 Authentication
- JWT-based auth with HTTP-only cookies (secure, sameSite strict)
- Signup with unique name + email enforcement
- Password hashing via bcryptjs
- Protected routes on both frontend and backend

### 👥 Friends System
- Search users by name
- Send / accept / reject friend requests
- Real-time friend request badge in sidebar
- Chat only available between mutual friends

### 💬 Real-Time Messaging
- Powered by **Socket.IO**
- Instant message delivery to online users
- **Message statuses**: `sending → sent → delivered → seen`
- Status auto-upgrades on connection and on chat open
- Image attachments via Cloudinary
- Reply-to / quote messages
- Delete for me or delete for everyone
- 7-day message history window
- Unread message counts per contact

### ✨ Vibes (Ephemeral Mood Board)
- Post a daily meme-based "Vibe" that expires after **24 hours**
- Powered by the **Imgflip API** — random real memes fetched live
- Friends can reply to your Vibe
- Visual ring indicator on sidebar avatar when a friend has an active Vibe
- MongoDB TTL index auto-deletes expired Vibes

### 🎨 UI / UX
- Clean minimal design with Tailwind CSS + DaisyUI
- Animated transitions (fade-up, slide-left)
- Responsive sidebar (icon-only on mobile, full on desktop)
- Profile photo upload (Cloudinary)
- Online/offline presence indicators
- Rotating taglines on auth pages

---

## 🛠️ Tech Stack

| Layer       | Technology                       |
|-------------|----------------------------------|
| Frontend    | React 19, Vite, Zustand          |
| Styling     | Tailwind CSS v3, DaisyUI v5      |
| Routing     | React Router v7                  |
| HTTP Client | Axios                            |
| Real-time   | Socket.IO (client + server)      |
| Backend     | Node.js, Express v5              |
| Database    | MongoDB, Mongoose                |
| Auth        | JWT, bcryptjs, HTTP-only cookies |
| Media       | Cloudinary                       |
| Memes       | Imgflip public API               |
| Toasts      | react-hot-toast                  |
| Icons       | lucide-react                     |

---

## 🏗️ Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                        CLIENT (React + Vite)                    │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌───────────────┐  │
│  │ Auth     │  │ Chat     │  │ Vibes    │  │ Friends       │  │
│  │ Store    │  │ Store    │  │ Store    │  │ (in ChatStore)│  │
│  └────┬─────┘  └────┬─────┘  └────┬─────┘  └──────┬────────┘  │
│       │              │              │                │           │
│       └──────────────┴──────────────┴────────────────┘          │
│                          Axios (REST) + Socket.IO Client         │
└──────────────────────────────┬──────────────────────────────────┘
                               │
              ┌────────────────▼────────────────┐
              │        Express.js Server         │
              │   ┌──────────────────────────┐   │
              │   │     REST API Routes       │   │
              │   │  /api/auth               │   │
              │   │  /api/messages           │   │
              │   │  /api/users              │   │
              │   │  /api/vibes              │   │
              │   └──────────────────────────┘   │
              │   ┌──────────────────────────┐   │
              │   │     Socket.IO Server      │   │
              │   │  - online presence        │   │
              │   │  - newMessage event       │   │
              │   │  - messagesDelivered      │   │
              │   │  - messagesSeen           │   │
              │   └──────────────────────────┘   │
              └──────────────┬──────────────────-┘
                             │
              ┌──────────────▼─────────────┐
              │         MongoDB             │
              │  Users | Messages | Vibes   │
              └──────────────┬─────────────┘
                             │
              ┌──────────────▼─────────────┐
              │         Cloudinary          │
              │  Profile pics | Attachments │
              │  Vibe meme mirrors          │
              └────────────────────────────┘
```

---

## 📁 Folder Structure

```
vibley/
├── backend/
│   ├── controllers/
│   │   ├── AuthController.js       # signup, login, logout, updateProfile, checkAuth
│   │   ├── MessageController.js    # getMessages, sendMessage, deleteMessage, getUnreadCounts
│   │   ├── UserController.js       # searchUsers, friend requests, getFriends
│   │   └── VibeController.js       # CRUD vibes, meme generation, replies
│   ├── lib/
│   │   ├── Cloudinary.js           # Cloudinary v2 config
│   │   ├── DB.js                   # MongoDB connection
│   │   ├── Socket.js               # Socket.IO server + userSocketMap
│   │   └── Utils.js                # generateToken (JWT + cookie)
│   ├── middleware/
│   │   └── AuthMiddleware.js       # protectRoute — JWT verification
│   ├── models/
│   │   ├── User.js                 # User schema
│   │   ├── Message.js              # Message schema
│   │   └── Vibe.js                 # Vibe schema (TTL indexed)
│   ├── routes/
│   │   ├── AuthRoute.js
│   │   ├── MessageRoute.js
│   │   ├── UserRoute.js
│   │   └── VibeRoute.js
│   ├── server.js                   # Entry point
│   └── package.json
│
└── frontend/
    ├── public/
    │   ├── avatar.png
    │   └── logo_light.png
    ├── src/
    │   ├── components/
    │   │   ├── chat/
    │   │   │   ├── ChatContainer.jsx   # Message list, delete, reply
    │   │   │   ├── ChatHeader.jsx      # Selected user header + close
    │   │   │   ├── DeleteModal.jsx     # Delete for me / everyone modal
    │   │   │   ├── MessageInput.jsx    # Text + image + reply input
    │   │   │   └── StatusLabel.jsx     # sent/delivered/seen indicator
    │   │   ├── contact/
    │   │   │   ├── AddContactModal.jsx       # Search + send friend request
    │   │   │   └── FriendRequestsModal.jsx   # Accept / reject requests
    │   │   ├── skeletons/
    │   │   │   ├── MessageSkeleton.jsx
    │   │   │   └── SidebarSkeleton.jsx
    │   │   ├── vibe/
    │   │   │   ├── AddVibeModal.jsx    # Generate + post vibe
    │   │   │   ├── MemeSelector.jsx    # Pick from meme options
    │   │   │   └── VibeCard.jsx        # Display a single vibe
    │   │   ├── Navbar.jsx
    │   │   └── Sidebar.jsx
    │   ├── lib/
    │   │   ├── Axios.js               # Axios instance
    │   │   └── Utils.js               # formatMessageTime, formatRelativeTime
    │   ├── pages/
    │   │   ├── home/
    │   │   │   ├── HomePage.jsx
    │   │   │   └── HomePage.css
    │   │   ├── login/
    │   │   │   ├── LoginPage.jsx
    │   │   │   └── LoginPage.css
    │   │   ├── profile/
    │   │   │   ├── Profilepage.jsx
    │   │   │   └── ProfilePage.css
    │   │   ├── signup/
    │   │   │   ├── SignupPage.jsx
    │   │   │   └── SignupPage.css
    │   │   └── vibe/
    │   │       ├── VibePage.jsx
    │   │       └── VibePage.css
    │   ├── store/
    │   │   ├── useAuthStore.js        # Auth state + socket init
    │   │   ├── useChatStore.js        # Messages, friends, unread counts
    │   │   └── useVibeStore.js        # Vibes state
    │   ├── App.jsx
    │   ├── main.jsx
    │   └── index.css
    └── package.json
```

---

## 🗄️ Database Schemas

### User
```js
{
  email:          String (required, unique),
  fullName:       String (required),
  password:       String (required, minlength: 6),  // bcrypt hashed
  profilePic:     String (default: ""),
  friends:        [ObjectId → User],
  friendRequests: [{ from: ObjectId → User, createdAt: Date }],
  createdAt:      Date,
  updatedAt:      Date
}
```

### Message
```js
{
  senderId:   ObjectId → User (required),
  receiverId: ObjectId → User (required),
  text:       String,
  image:      String,              // Cloudinary URL
  status:     Enum ["sent", "delivered", "seen"] (default: "sent"),
  replyTo:    ObjectId → Message,  // quoted message
  deletedFor: [ObjectId → User],   // soft-delete per user
  createdAt:  Date,
  updatedAt:  Date
}
```

### Vibe
```js
{
  userId:    ObjectId → User (required),
  memeUrl:   String (required),    // Cloudinary URL
  moodText:  String (required),
  caption:   String (default: ""),
  expiresAt: Date (required),      // +24h from creation — TTL indexed
  replies: [{
    fromId:    ObjectId → User,
    text:      String,
    createdAt: Date
  }],
  createdAt: Date,
  updatedAt: Date
}
// TTL index: { expiresAt: 1 }, expireAfterSeconds: 0
```

---

## 🔗 ER Diagram

```
┌──────────────────────┐         ┌──────────────────────┐
│         User         │         │       Message         │
├──────────────────────┤         ├──────────────────────┤
│ _id (PK)             │◄────────│ senderId (FK)         │
│ email                │◄────────│ receiverId (FK)       │
│ fullName             │         │ text                  │
│ password             │         │ image                 │
│ profilePic           │         │ status                │
│ friends[]  ──────────┼─────┐   │ replyTo (FK→Message) │
│ friendRequests[]     │     │   │ deletedFor[] (FK)     │
│ createdAt            │     │   │ createdAt             │
└──────────────────────┘     │   └──────────────────────┘
         ▲                   │
         │  (self-ref M:M)   │
         └───────────────────┘

┌──────────────────────┐
│         Vibe         │
├──────────────────────┤
│ _id (PK)             │
│ userId (FK→User)     │◄──── one user, one active vibe
│ memeUrl              │
│ moodText             │
│ caption              │
│ expiresAt (TTL)      │
│ replies[]            │
│   ├─ fromId (FK→User)│
│   ├─ text            │
│   └─ createdAt       │
│ createdAt            │
└──────────────────────┘
```

---

## 🔌 API Reference

### Auth — `/api/auth`
| Method | Endpoint          | Auth | Description             |
|--------|-------------------|------|-------------------------|
| POST   | `/signup`         | ✗    | Register new user       |
| POST   | `/login`          | ✗    | Login, sets JWT cookie  |
| POST   | `/logout`         | ✗    | Clears JWT cookie       |
| PUT    | `/update-profile` | ✓    | Upload profile picture  |
| GET    | `/check`          | ✓    | Verify session / get me |

### Messages — `/api/messages`
| Method | Endpoint    | Auth | Description                     |
|--------|-------------|------|---------------------------------|
| GET    | `/unread`   | ✓    | Unread counts grouped by sender |
| POST   | `/send/:id` | ✓    | Send message to user            |
| GET    | `/:id`      | ✓    | Get conversation (7-day window) |
| DELETE | `/:id`      | ✓    | Delete message (me / everyone)  |

### Users — `/api/users`
| Method | Endpoint         | Auth | Description           |
|--------|------------------|------|-----------------------|
| GET    | `/search?query=` | ✓    | Search users by name  |
| GET    | `/friends`       | ✓    | Get my friends list   |
| GET    | `/requests`      | ✓    | Get incoming requests |
| POST   | `/request/:id`   | ✓    | Send friend request   |
| POST   | `/accept/:id`    | ✓    | Accept friend request |
| POST   | `/reject/:id`    | ✓    | Reject friend request |

### Vibes — `/api/vibes`
| Method | Endpoint     | Auth | Description                    |
|--------|--------------|------|--------------------------------|
| GET    | `/friends`   | ✓    | Get active vibes from friends  |
| GET    | `/mine`      | ✓    | Get my current active vibe     |
| POST   | `/generate`  | ✓    | Fetch random meme from Imgflip |
| POST   | `/`          | ✓    | Post a new vibe                |
| DELETE | `/:id`       | ✓    | Delete my vibe                 |
| POST   | `/:id/reply` | ✓    | Reply to a friend's vibe       |

---

## ⚡ Socket.IO Events

### Server → Client
| Event               | Payload              | Description                           |
|---------------------|----------------------|---------------------------------------|
| `getOnlineUsers`    | `string[]` (userIds) | Broadcast online user list            |
| `newMessage`        | `Message` object     | Deliver new message to receiver       |
| `messagesDelivered` | `{ to: userId }`     | Notify sender messages were delivered |
| `messagesSeen`      | `{ by: userId }`     | Notify sender messages were seen      |

### Client → Server
| Event        | Description                    |
|--------------|--------------------------------|
| `disconnect` | Auto — removes from online map |

---

## ⚙️ Environment Variables

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

## 🏃 Getting Started

### Prerequisites
- Node.js ≥ 18
- MongoDB (local or Atlas)
- Cloudinary account
- Imgflip account (free)

### Installation

```bash
# Clone the repo
git clone https://github.com/your-username/vibley.git
cd vibley

# Install backend dependencies
cd backend
npm install

# Install frontend dependencies
cd ../frontend
npm install
```

### Running in Development

```bash
# Terminal 1 — backend
cd backend
npm run dev        # nodemon server.js on port 5001

# Terminal 2 — frontend
cd frontend
npm run dev        # Vite on port 5173
```

### Building for Production

```bash
cd frontend
npm run build      # outputs to dist/

cd ../backend
NODE_ENV=production npm start
# Express serves the built frontend from ../frontend/dist
```

---

## 🔒 Security Highlights

- Passwords hashed with **bcrypt** (salt rounds: 10)
- JWT stored in **HTTP-only, sameSite: strict** cookies — immune to XSS token theft
- All sensitive routes protected by `protectRoute` middleware
- Delete-for-everyone only allowed for the **message sender**
- Unique name enforcement prevents impersonation
- CORS restricted to `localhost:5173` in development

---

## 📌 Key Design Decisions

| Decision                    | Rationale                                                        |
|-----------------------------|------------------------------------------------------------------|
| Friends-only messaging      | Prevents spam, maintains trust                                   |
| 7-day message window        | Keeps DB lean, encourages present conversations                  |
| Vibes expire in 24h         | Ephemeral sharing reduces social pressure                        |
| Status: sent→delivered→seen | Transparency without read receipts anxiety (matches WhatsApp UX) |
| Cloudinary for media        | Offloads storage, provides CDN, avoids GridFS complexity         |
| Imgflip for memes           | Free, large meme library, no generation cost                     |
| TTL index on Vibe           | Zero-maintenance expiry — MongoDB handles cleanup automatically   |
| Zustand over Redux          | Minimal boilerplate, built-in devtools, simpler async patterns   |