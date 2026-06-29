<div align="center">

<img src="frontend/public/logo_light.png" alt="Vibley" width="64" />

# Vibley 💬

### Real-Time Messaging with a Friends-Only Graph & Ephemeral Vibes

*Real conversations. Real connections. Less noise.*

[![React](https://img.shields.io/badge/React-19.x-61DAFB?style=flat-square&logo=react&logoColor=black)](https://react.dev/)
[![Node.js](https://img.shields.io/badge/Node.js-18.x-339933?style=flat-square&logo=node.js&logoColor=white)](https://nodejs.org/)
[![Express](https://img.shields.io/badge/Express-5.x-000000?style=flat-square&logo=express&logoColor=white)](https://expressjs.com/)
[![MongoDB](https://img.shields.io/badge/MongoDB-Atlas-47A248?style=flat-square&logo=mongodb&logoColor=white)](https://www.mongodb.com/atlas)
[![Socket.io](https://img.shields.io/badge/Socket.io-4.x-010101?style=flat-square&logo=socket.io&logoColor=white)](https://socket.io/)
[![Cloudinary](https://img.shields.io/badge/Cloudinary-Media-3448C5?style=flat-square&logo=cloudinary&logoColor=white)](https://cloudinary.com/)
[![Tailwind](https://img.shields.io/badge/Tailwind-v3-06B6D4?style=flat-square&logo=tailwindcss&logoColor=white)](https://tailwindcss.com/)

[**Live Demo**](#) · [API Reference](#api-reference) · [Architecture](#architecture)

</div>

---

## Why This Project Exists

Most messaging apps optimize for engagement, not connection — algorithmic strangers, infinite feeds, permanent archives of every word you've ever typed. Vibley is the opposite bet:

- You can only message **mutual friends** — there is no inbox for strangers to land in.
- Conversations show a **rolling 7-day window** — old messages aren't deleted, but the UI deliberately keeps you present instead of scrolling through history.
- **Vibes** let you post a meme-based mood that **expires after 24 hours** by design — low-pressure, ephemeral self-expression instead of a permanent feed.

It's a small product, but it's a *real* one — built to handle the things every chat app actually has to deal with: delivery guarantees over an unreliable socket connection, optimistic UI that has to roll back cleanly, and authorization rules that have to be airtight because it's people's private messages.

---

## Engineering Highlights

*(The decisions that took actual thought — not the parts that came for free with a tutorial.)*

- **Optimistic send with clean rollback** — when you hit send, the message renders immediately with a temporary client-side ID and a `sending` state. On success it's swapped in-place for the server's real document (preserving scroll position); on failure it's removed from state entirely and the user gets a toast — no ghost messages, no duplicate sends.
- **Delivery state that survives disconnects** — a message sent to an offline user is marked `sent`. The moment that user's socket reconnects, the server queries their backlog of `sent` messages, bulk-updates them to `delivered`, and pushes a `messagesDelivered` event back to each original sender — so delivery status catches up retroactively instead of being lost.
- **Aggregation over application logic** — both *unread counts per contact* and *recent-conversation ordering* are computed with MongoDB aggregation pipelines (`$group`, `$sort`, `$cond` on sender/receiver) in a single round-trip, rather than pulling messages into Node and counting in JavaScript. The sidebar's "most recent chat first" ordering and unread badges are both byproducts of that one query shape.
- **Soft-delete vs. hard-delete, enforced server-side** — "delete for me" appends the requester's ID to a `deletedFor` array (the message survives, just gets filtered out of that user's query). "Delete for everyone" is a real document deletion — but only after the server independently verifies the requester is the original sender, regardless of what the client claims.
- **Query-time conversation windowing** — the 7-day "freshness" window is enforced with a `createdAt: { $gte: sevenDaysAgo }` filter at read time, not a TTL or cron job. Nothing is destroyed; the product just chooses not to surface it, which keeps the data model boring and reversible.
- **httpOnly, sameSite-aware auth cookies** — JWTs never touch `localStorage` or client JS at all. Cookie flags (`secure`, `sameSite`) are conditionally set based on `NODE_ENV`, so local dev over HTTP and a deployed HTTPS frontend both work without code branching at the call site.
- **Self-referencing social graph with pending-state subdocuments** — friendship is modeled as a symmetric `User.friends` array on both documents, while incoming requests live as embedded subdocuments (`friendRequests: [{ from, createdAt }]`) rather than a separate collection — so an accept/reject is a single atomic update per side with no join required.
- **Mobile-first interaction without a UI framework dependency** — message actions (reply/delete) appear on hover for desktop, but on touch devices a long-press (500ms `setTimeout`, cleared on move/end) opens the same delete modal — implemented with raw touch events rather than pulling in a gesture library.

---

## Features

| Feature | Description |
|---|---|
| **Friends-Only Messaging** | Chat is gated behind a mutual friend request — no cold messages, no stranger inbox |
| **Live Delivery Status** | Per-message `sending → sent → delivered → seen` state, updated in real time over WebSocket |
| **Reply-to-Message** | Quote any message inline; the original is fetched and embedded via `populate` |
| **Delete for Me / Everyone** | Sender-only "delete for everyone"; anyone can hide a message from their own view |
| **Image Attachments** | Send photos in-chat and as profile pictures, stored on Cloudinary |
| **Unread Badges** | Per-contact unread counts computed via aggregation, cleared on opening the thread |
| **Smart Contact Ordering** | Sidebar reorders by most-recent activity, not alphabetically or by friend-since date |
| **Online Presence** | Real-time online/offline indicator per contact |
| **Vibes** | Post a daily meme-based mood (sourced from Imgflip) that auto-expires after 24 hours, with friend replies |

---

## Tech Stack

<table>
<tr>
<td valign="top" width="50%">

**Backend**
| Layer | Technology |
|---|---|
| Runtime | Node.js ≥ 18 |
| Framework | Express.js 5 |
| Database | MongoDB Atlas (Mongoose) |
| Real-time | Socket.IO 4 |
| Auth | JWT + bcryptjs, httpOnly cookies |
| Media | Cloudinary |
| Memes | Imgflip public API |

</td>
<td valign="top" width="50%">

**Frontend**
| Layer | Technology |
|---|---|
| Framework | React 19 + Vite |
| Routing | React Router 7 |
| State | Zustand |
| HTTP | Axios (`withCredentials`) |
| Real-time | Socket.IO Client |
| Styling | Tailwind CSS 3 + DaisyUI 5 |
| Icons / Toasts | lucide-react, react-hot-toast |

</td>
</tr>
</table>

---

## Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                        CLIENT (React + Vite)                    │
│                                                                 │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌───────────────┐    │
│  │ Auth     │  │ Chat     │  │ Vibe     │  │ Friends       │    │
│  │ Store    │  │ Store    │  │ Store    │  │ (in ChatStore)│    │
│  └────┬─────┘  └────┬─────┘  └────┬─────┘  └──────┬────────┘    │
│       └─────────────┴──────────────┴────────────────┘           │
│                    Axios (REST) + Socket.IO Client              │
└──────────────────────────────┬──────────────────────────────────┘
                               │ HTTPS / WebSocket
              ┌────────────────▼────────────────┐
              │        Express.js Server        │
              │   /api/auth  /api/messages       │
              │   /api/users  /api/vibes         │
              │   ──────────────────────────     │
              │   Socket.IO: presence, delivery,  │
              │   seen receipts                   │
              └──────────────┬──────────────────┘
                             │
              ┌──────────────▼─────────────┐      ┌─────────────────┐
              │         MongoDB            │      │   Cloudinary    │
              │  Users · Messages · Vibes  │      │ Images / Memes  │
              └─────────────────────────────┘      └─────────────────┘
```

### Message Lifecycle

```
Client: optimistic render (status: "sending", tempId)
   │
   ▼
POST /messages/send/:id  →  receiver online?
   ├─ yes → status: "delivered"  →  emit "newMessage" to receiver socket
   └─ no  → status: "sent"       →  queued for catch-up on next connect
   │
   ▼
Server response replaces optimistic message in client state
   │
   ▼
Receiver opens thread  →  GET /messages/:id marks matching messages "seen"
                       →  emit "messagesSeen" back to original sender's socket
   │
   ▼
Sender's UI updates status label live, no refetch required
```

---

## Database Schemas

### User
```js
{
  email:          String    // required, unique
  fullName:       String    // required, enforced unique (case-insensitive) at signup
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
  replyTo:    ObjectId → Message // quoted message reference, populated on read
  deletedFor: [ObjectId → User]  // soft-delete, per viewer
}
```

### Vibe
```js
{
  userId:    ObjectId → User
  memeUrl:   String            // Cloudinary URL
  moodText:  String            // required
  caption:   String            // default: ""
  expiresAt: Date              // +24h from creation — TTL indexed
  replies: [{ fromId: ObjectId → User, text: String, createdAt: Date }]
}
```

### ER Diagram

```
┌──────────────────────┐         ┌──────────────────────┐
│         User         │         │       Message        │
├──────────────────────┤         ├──────────────────────┤
│ _id (PK)             │◄────────│ senderId (FK)        │
│ email                │◄────────│ receiverId (FK)      │
│ fullName             │         │ text / image         │
│ password             │         │ status               │
│ friends[]    ────────┼──┐      │ replyTo (FK→Message) │
│ friendRequests[]     │  │      │ deletedFor[] (FK)    │
└──────────────────────┘  │      └──────────────────────┘
         ▲                │
         └────────────────┘  (self-referencing M:M)

┌──────────────────────┐
│         Vibe         │
├──────────────────────┤
│ userId (FK → User)   │
│ memeUrl / moodText    │
│ expiresAt (TTL)       │
│ replies[] { fromId, text } │
└──────────────────────┘
```

---

## API Reference

All protected routes require a valid JWT cookie set at login.

### Auth — `/api/auth`
| Method | Endpoint | Auth | Description |
|---|---|---|---|
| POST | `/signup` | ✗ | Register, sets JWT cookie |
| POST | `/login` | ✗ | Login, sets JWT cookie |
| POST | `/logout` | ✗ | Clears JWT cookie |
| PUT | `/update-profile` | ✓ | Upload profile picture |
| GET | `/check` | ✓ | Verify session, return current user |

### Messages — `/api/messages`
| Method | Endpoint | Auth | Description |
|---|---|---|---|
| GET | `/unread` | ✓ | Unread counts grouped by sender (aggregation) |
| GET | `/recent-contacts` | ✓ | Conversation order by most-recent message (aggregation) |
| POST | `/send/:id` | ✓ | Send a message; optional `replyTo` |
| GET | `/:id` | ✓ | Conversation with a user — 7-day window, marks incoming as seen |
| DELETE | `/:id` | ✓ | Delete for me, or for everyone (sender-only, server-verified) |

### Users — `/api/users`
| Method | Endpoint | Auth | Description |
|---|---|---|---|
| GET | `/search?query=` | ✓ | Search users by name (excludes self) |
| GET | `/friends` | ✓ | My friends list |
| GET | `/requests` | ✓ | Incoming friend requests |
| POST | `/request/:id` | ✓ | Send a friend request (idempotent) |
| POST | `/accept/:id` `/reject/:id` | ✓ | Resolve a friend request |

### Vibes — `/api/vibes`
| Method | Endpoint | Auth | Description |
|---|---|---|---|
| GET | `/friends` / `/mine` | ✓ | Active vibes from friends / your own |
| POST | `/generate` | ✓ | Fetch a random meme from Imgflip |
| POST | `/` | ✓ | Post a vibe |
| POST | `/:id/reply` | ✓ | Reply to a friend's vibe |
| DELETE | `/:id` | ✓ | Delete your vibe |

---

## WebSocket Events

| Direction | Event | Payload | Description |
|---|---|---|---|
| Server → Client | `getOnlineUsers` | `string[]` | Broadcast current online user IDs |
| Server → Client | `newMessage` | `Message` | Push a new message to its receiver |
| Server → Client | `messagesDelivered` | `{ to }` | Backlog of `sent` messages just became `delivered` |
| Server → Client | `messagesSeen` | `{ by }` | Receiver opened the thread; sender's messages are now `seen` |
| Client → Server | `disconnect` | — | Auto-handled; removes user from the online map |

---

## Getting Started

### Prerequisites
- Node.js ≥ 18
- [MongoDB Atlas](https://www.mongodb.com/atlas) (free tier works)
- [Cloudinary](https://cloudinary.com) account
- [Imgflip](https://imgflip.com) account (free, for Vibes)

### Backend
```bash
cd backend
npm install
cp .env.example .env   # fill in your keys
npm run dev             # → http://localhost:5001
```

### Frontend
```bash
cd frontend
npm install
npm run dev             # → http://localhost:5173
```

<details>
<summary><strong>Environment variables</strong></summary>

```env
# backend/.env
PORT=5001
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret_key
NODE_ENV=development
FRONTEND_URL=http://localhost:5173

CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret

IMGFLIP_USERNAME=your_imgflip_username
IMGFLIP_PASSWORD=your_imgflip_password
```
</details>

### Production Build
```bash
cd frontend && npm run build      # outputs to dist/
cd ../backend && NODE_ENV=production npm start
```

---

## Project Structure

```
vibley/
├── backend/
│   ├── controllers/   # Auth, Message, User, Vibe
│   ├── lib/            # Cloudinary config, DB connect, Socket server, JWT util
│   ├── middleware/      # protectRoute — JWT cookie verification
│   ├── models/          # User, Message, Vibe (TTL-indexed)
│   ├── routes/
│   └── server.js
│
└── frontend/
    └── src/
        ├── components/
        │   ├── chat/         # ChatContainer, ChatHeader, MessageInput, DeleteModal, StatusLabel
        │   ├── contact/      # AddContactModal, FriendRequestsModal
        │   ├── vibe/          # AddVibeModal, MemeSelector, VibeCard
        │   └── skeletons/
        ├── lib/               # Axios instance, time-formatting utils
        ├── pages/             # home, login, signup, profile, vibe
        └── store/             # useAuthStore, useChatStore, useVibeStore (Zustand)
```

---

## Key Design Decisions

| Decision | Rationale |
|---|---|
| Friends-only messaging | Removes spam and cold outreach by construction, not moderation |
| Read-time 7-day window | Keeps the data model reversible — nothing is actually destroyed |
| Vibes expire via TTL index | Zero-maintenance cleanup; MongoDB handles it, no cron job |
| `sent → delivered → seen` | Transparent like WhatsApp, without per-message read-receipt anxiety |
| httpOnly cookies, not localStorage | Immune to XSS-based token theft |
| Optimistic UI with explicit rollback | Chat should feel instant, but state must never lie about what the server actually has |
| Aggregation pipelines over app-level loops | Push the work to the database; one round trip instead of N |
| Zustand over Redux | Minimal boilerplate for a store this size, with simple async actions |

---

## Security

| Concern | Mitigation |
|---|---|
| Password storage | bcrypt, 10 salt rounds |
| Authentication | JWT in httpOnly, `sameSite` cookie (env-aware `secure` flag) |
| Authorization | Every route behind `protectRoute`; ownership checked server-side, never trusted from the client |
| Delete-for-everyone | Independently re-verified against `message.senderId` before deletion |
| Impersonation | Case-insensitive unique `fullName` constraint at signup |
| CORS | Explicit origin allow-list, credentialed requests only |

---

## Contributing

```bash
git checkout -b feature/your-feature-name
git commit -m "feat: add some feature"
git push origin feature/your-feature-name
```

Follows [Conventional Commits](https://www.conventionalcommits.org/) (`feat`, `fix`, `docs`, `refactor`, `perf`, `test`, `chore`). One non-negotiable rule for backend PRs: **any state-changing action (delete, accept, update) must independently verify the requester's identity server-side** — never trust a client-supplied "I am the owner" flag.

---

## Author

**Jay Shelke** — Pune, Maharashtra, India
[GitHub @imjay05](https://github.com/imjay05) · [LinkedIn](https://www.linkedin.com/in/jay-shelke-4323a22a5/)

<div align="center">

*Vibley — real conversations, real connections, less noise.*

</div>