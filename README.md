# Vibley 
> **Stay connected, always.** — A real-time full-stack chat application with friend requests, group messaging, emoji reactions.

---

## Problem Statement

Most chat apps are either too heavyweight (Slack, Teams) for casual personal use, or too limited (basic WebSocket demos) for real-world use. Vibley fills that gap — a lightweight yet feature-rich real-time messenger with a WhatsApp-inspired UX, friend system, group chats, and rich media support.

---

## Features

- 🔐 **JWT Auth** — Secure signup/login with HTTP-only cookies
- 💬 **Real-time messaging** — Instant delivery via Socket.IO
- 👥 **Friend system** — Send, accept, and reject friend requests
- 👁️ **Read receipts** — Seen/delivered/sent message status (✓ / ✓✓ / blue ✓✓)
- 🗑️ **Delete messages** — Delete for everyone (sender only) or delete for me
- 💬 **Reply to messages** — Threaded reply previews inside bubbles
- 😄 **Emoji reactions** — React to any message with 6 quick emojis
- 🔔 **Unread badges** — Per-contact unread message counts in sidebar
- ⌨️ **Typing indicator** — Live "X is typing..." with animated dots
- 👤 **Profile management** — Upload/update profile picture via Cloudinary
- 🖼️ **Image sharing** — Send images in chat with Cloudinary storage
- 👥 **Group chats** — Create groups, manage members
- 📱 **Responsive design** — Mobile-first, works on all screen sizes

---

## 🛠️ Tech Stack

### Frontend
| Tech | Purpose |
|------|---------|
| React 18 | UI framework |
| Zustand | Global state management |
| Socket.IO Client | Real-time communication |
| Tailwind CSS + DaisyUI | Styling & component library |
| React Router v6 | Client-side routing |
| Axios | HTTP requests |
| Lucide React | Icon library |
| React Hot Toast | Toast notifications |

### Backend
| Tech | Purpose |
|------|---------|
| Node.js + Express | REST API server |
| Socket.IO | WebSocket server |
| MongoDB + Mongoose | Database & ODM |
| JWT + bcryptjs | Authentication & password hashing |
| Cloudinary | Image/media storage |
| Cookie-parser | JWT cookie handling |
| dotenv | Environment variables |

---

## 🏗️ System Design / Architecture

### High-Level Flow

```
┌─────────────────────────────────────────────────────────────┐
│                        CLIENT (React)                       │
│  Zustand Store ←→ Axios (REST) + Socket.IO (WS)            │
└──────────────┬────────────────────────┬────────────────────-┘
               │ HTTP REST              │ WebSocket
               ▼                        ▼
┌──────────────────────────────────────────────────────────────┐
│               EXPRESS SERVER + SOCKET.IO SERVER              │
│  Routes → Middleware (JWT Auth) → Controllers                │
│  userSocketMap: { userId → socketId }  (in-memory)          │
└──────────────┬────────────────────────────────────────────--─┘
               │ Mongoose ODM
               ▼
┌─────────────────────┐       ┌────────────────────────┐
│      MongoDB        │       │      Cloudinary CDN     │
│  Users, Messages,   │       │  Profile pics, images  │
│  Groups             │       │  in messages           │
└─────────────────────┘       └────────────────────────┘
```

### Real-Time Message Flow

```
1. User A types → socket.emit("typing", { to: UserB })
   └─ Server → io.to(UserB_socketId).emit("typing", UserA)
   └─ UserB sees "UserA is typing..." with animated dots

2. User A sends message → POST /api/messages/send/:receiverId
   └─ Server saves Message to MongoDB
   └─ Server calls getReceiverSocketId(receiverId)
   └─ io.to(receiverSocketId).emit("newMessage", message)
   └─ UserB's Zustand store appends message → UI re-renders

3. UserB opens chat → GET /api/messages/:senderId
   └─ Server marks all incoming messages as seen: true
   └─ Server emits "messagesSeen" to sender's socket
   └─ Sender's UI updates tick to blue ✓✓

4. Socket disconnect → delete userSocketMap[userId]
   └─ User removed from online users list
   └─ All connected clients notified via "getOnlineUsers"
```

### Architecture Diagram

```
frontend/
├── public/  
├── src/
│   ├── pages/          ← Route-level components (Home, Login, Signup, Profile, Settings)
│   ├── components/     ← Reusable UI (ChatContainer, Sidebar, MessageInput, Navbar, Modals)
│   ├── store/          ← Zustand stores (useAuthStore, useChatStore, useThemeStore)
│   └── lib/            ← axios instance, utility
│   ├── constants/
├──functions

backend/
├── controllers/        ← Business logic (auth, message, group, user)
├── models/             ← Mongoose schemas (User, Message, Group)
├── routes/             ← Express routers (auth, messages, users)
├── middleware/         ← JWT auth guard (protectRoute)
└── lib/                ← cloudinary config, socket.io setup, JWT utils 
```

---

## 🗄️ Database Schemas

### User
```
User {
  email:          String (unique, required)
  fullName:       String (required)
  password:       String (hashed, min 6 chars)
  profilePic:     String (Cloudinary URL)
  friends:        [ObjectId → User]
  friendRequests: [{ from: ObjectId, status: "pending", createdAt: Date }]
  createdAt:      Date (auto)
  updatedAt:      Date (auto)
}
```

### Message
```
Message {
  senderId:   ObjectId → User (required)
  receiverId: ObjectId → User (null for group messages)
  groupId:    ObjectId → Group (null for DMs)
  text:       String
  image:      String (Cloudinary URL)
  status:     Enum ["sent", "delivered", "seen"] (default: "sent")
  seen:       Boolean (default: false)
  replyTo:    ObjectId → Message (self-reference, nullable)
  reactions:  [{ userId: ObjectId, emoji: String }]
  deletedFor: [ObjectId → User]  ← soft delete per user
  createdAt:  Date (auto)
}
```

### Group
```
Group {
  name:      String (required)
  members:   [ObjectId → User]
  admin:     ObjectId → User
  createdAt: Date (auto)
  updatedAt: Date (auto)
}
```

---

## 📡 API Documentation

### Auth Routes — `/api/auth`
| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| POST | `/signup` | No | Register new user |
| POST | `/login` | No | Login, sets JWT cookie |
| POST | `/logout` | No | Clears JWT cookie |
| PUT | `/update-profile` | ✅ | Update profile picture |
| GET | `/check` | ✅ | Verify current session |

### Message Routes — `/api/messages`
| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| GET | `/users` | ✅ | Get all users (sidebar) |
| GET | `/unread` | ✅ | Get unread counts per sender |
| GET | `/:id` | ✅ | Get messages with a user (last 7 days) |
| POST | `/send/:id` | ✅ | Send message (text/image/reply) |
| DELETE | `/:id` | ✅ | Delete message (for me or everyone) |
| POST | `/:id/react` | ✅ | React to message with emoji |
| PUT | `/delete-chat/:id` | ✅ | Soft-delete today's chat for current user |

### Group Routes — `/api/messages/group`
| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| POST | `/group` | ✅ | Create a new group |
| GET | `/group` | ✅ | Get all groups for current user |
| GET | `/group/:id/members` | ✅ | Get group members |

### User / Friend Routes — `/api/users`
| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| GET | `/search?query=` | ✅ | Search users by name |
| GET | `/friends` | ✅ | Get friend list |
| GET | `/requests` | ✅ | Get pending friend requests |
| POST | `/request/:id` | ✅ | Send friend request |
| POST | `/accept/:id` | ✅ | Accept friend request |
| POST | `/reject/:id` | ✅ | Reject friend request |

---

## ⚡ Performance

- **7-day message window** — `getMessages` only fetches messages from the last 7 days, capping query size
- **Soft deletes** — `deletedFor` array avoids hard deletes and expensive cascades
- **Aggregation for unread counts** — Single MongoDB `$aggregate` pipeline groups unseen messages by sender instead of N+1 queries
- **Socket map (in-memory)** — `userSocketMap` provides O(1) socket lookups for targeted delivery
- **Cloudinary CDN** — Images served via CDN, not the Node server, keeping bandwidth low
- **Zustand** — Minimal re-renders; only affected slices re-render on state change
- **Lazy socket subscription** — `subscribeToMessages` called only when a chat is open; cleaned up on close

---

## 🔒 Security Measures

- **HTTP-only JWT cookies** — Tokens are inaccessible to JavaScript, preventing XSS theft
- **`sameSite: strict`** — Mitigates CSRF attacks
- **`secure: true` in production** — Cookies only sent over HTTPS
- **bcryptjs password hashing** — `bcrypt.genSalt(10)` + hash before storage; plaintext never persisted
- **`protectRoute` middleware** — Every protected endpoint verifies JWT and attaches `req.user`
- **Password excluded from all queries** — `.select("-password")` on every User query
- **Sender-only delete-for-everyone** — Backend validates `message.senderId === req.user._id` before allowing global delete
- **Request deduplication** — Friend request endpoint checks for existing requests before inserting

---

## 🚀 Installation Guide

### Prerequisites
- Node.js v18+
- MongoDB (local or Atlas)
- Cloudinary account

### 1. Clone the repository
```bash
git clone https://github.com/your-username/vibley.git
cd vibley
```

### 2. Backend setup
```bash
cd backend
npm install
```

Create a `.env` file in `/backend`:
```env
PORT=5001
MONGODB_URI=mongodb+srv://<user>:<password>@cluster.mongodb.net/vibley
JWT_SECRET=your_super_secret_key
NODE_ENV=development

CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
```

### 3. Frontend setup
```bash
cd ../frontend
npm install
```

### 4. Run in development
```bash
# Terminal 1 — Backend
cd backend && npm run dev

# Terminal 2 — Frontend
cd frontend && npm run dev
```

Frontend: http://localhost:5173  
Backend API: http://localhost:5001

### 5. Build for production
```bash
cd frontend && npm run build
cd ../backend && npm start
```
In production mode, Express serves the frontend's `dist` folder at the root.

---

## 📁 Project Structure

```
vibley/
├── backend/
│   ├── controllers/
│   │   ├── auth.controller.js       ← signup, login, logout, updateProfile, checkAuth
│   │   ├── message.controller.js    ← getMessages, sendMessage, deleteMessage, reactToMessage
│   │   ├── group.controller.js      ← createGroup, getUserGroups, getGroupMembers
│   │   └── user.controller.js       ← searchUsers, friend request CRUD, getFriends
│   ├── lib/
│   │   ├── cloudinary.js            ← Cloudinary SDK config
│   │   ├── db.js                    ← MongoDB connection
│   │   ├── socket.js                ← Socket.IO server + userSocketMap
│   │   └── utils.js                 ← generateToken (JWT + cookie)
│   ├── middleware/
│   │   └── auth.middleware.js       ← protectRoute JWT guard
│   ├── models/
│   │   ├── user.model.js            ← User schema (friends, friendRequests)
│   │   ├── message.model.js         ← Message schema (reactions, replyTo, deletedFor)
│   │   └── group.model.js           ← Group schema
│   ├── routes/
│   │   ├── auth.route.js            ← /api/auth
│   │   ├── message.route.js         ← /api/messages
│   │   └── user.route.js            ← /api/users
│   └── server.js                     ← Express app entry point
│
└── frontend/
    └── src/
        ├── components/
        │   ├── ChatContainer.jsx     ← Message list, delete modal, reactions
        │   ├── ChatHeader.jsx        ← Active chat user info
        │   ├── MessageInput.jsx      ← Text/image input, reply preview, typing emit
        │   ├── Sidebar.jsx           ← Friends list, unread badges, online status
        │   ├── Navbar.jsx            ← Top nav with theme-aware logo
        │   ├── AddContactModal.jsx   ← Search users + send friend request
        │   ├── FriendRequestsModal.jsx ← Accept/reject incoming requests
        │   ├── AuthImagePattern.jsx  ← Decorative auth page side panel
        │   └── NoChatSelected.jsx    ← Empty state for chat area
        ├── pages/
        │   ├── HomePage.jsx          ← Main layout with modals, sidebar, chat
        │   ├── LoginPage.jsx         ← Login form with theme-aware logo
        │   ├── SignUpPage.jsx        ← Registration form with validation
        │   ├── ProfilePage.jsx       ← View/edit profile, avatar upload, logout
        │   └── SettingsPage.jsx      ← Theme selector with live preview
        ├── store/
        │   ├── useAuthStore.js       ← Auth state, socket init, online users
        │   ├── useChatStore.js       ← Messages, friends, requests, unread counts
        │   └── useThemeStore.js      ← Selected theme (persisted)
        └── lib/
            ├── axios.js              ← Axios instance with base URL + credentials
            └── utils.js             ← formatMessageTime helper
```

---

## 👤 Author

Jay Shelke  
Full Stack Developer  

- GitHub: [@imjay05](https://github.com/imjay05)  
- LinkedIn: [www.linkedin.com/in/jay-shelke](https://www.linkedin.com/in/jay-shelke-4323a22a5/)  
- Email: imjaydigambarshelke@gmail.com

---

> Built with Dedication using the MERN stack + Socket.IO
