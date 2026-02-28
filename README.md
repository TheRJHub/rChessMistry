# ♟️ rChessMistry — by TheRJHub

> *"Where Every Move Tells a Story"*

A premium full-stack Chess mobile application built with React Native (Frontend) and Java Spring Boot (Backend), featuring multiple game modes, bot difficulty levels, user profiles, and a sleek e-commerce-style UI.

---

## 🏗️ Tech Stack

| Layer | Technology |
|---|---|
| Mobile App | React Native (Expo) |
| Backend API | Java Spring Boot 3.x |
| Database | H2 (dev) / PostgreSQL (prod) |
| Admin Data | Google Sheets API v4 |
| Chess Engine | Chess.js (frontend) + Stockfish (backend bot) |
| Auth | JWT Tokens + BCrypt |

---

## 📁 Project Structure

```
rChessMistry/
├── backend/          ← Spring Boot Java API
│   ├── src/main/java/com/therjhub/rchessmistry/
│   │   ├── controller/
│   │   ├── service/
│   │   ├── model/
│   │   ├── repository/
│   │   ├── config/
│   │   └── dto/
│   └── src/main/resources/
└── frontend/         ← React Native Expo App
    └── src/
        ├── screens/
        ├── components/
        ├── context/
        ├── services/
        ├── navigation/
        └── hooks/
```

---

## 🚀 Quick Start

### Backend
```bash
cd backend
./mvnw spring-boot:run
# Runs on http://localhost:8080
```

### Frontend
```bash
cd frontend
npm install
npx expo start
```

---

## 🎮 Features
- ♟️ Manual 2-Player Mode
- 🤖 Bot Modes: Easy / Hard / Unbeatable
- 💡 Classic Mode with move hints
- 🧩 Chess Challenges / Puzzles
- 👤 User Profile with photo, stats (W/L/D)
- 🌙 Dark / Light / Grey Theme
- 📊 Admin: All user data synced to Google Sheet
- 📝 Feedback via Google Form
- 🔐 App-only username/password auth (no email)

---

## 🔐 Admin Access
All user data (username, stats, device, join date) is automatically synced to your configured Google Sheet.
Set your credentials in `backend/src/main/resources/application.properties`.

---

*Built with ❤️ by TheRJHub*
