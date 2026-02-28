# ♟ rChessMistry — Setup Guide
# by TheRJHub

## ✅ STEP 1: Backend Setup (Spring Boot)

```bash
cd rChessMistry/backend
./mvnw spring-boot:run
```

The API will start at: http://localhost:8080
- API Health Check: http://localhost:8080/api/auth/ping
- H2 DB Console: http://localhost:8080/h2-console

---

## ✅ STEP 2: Frontend Setup (React Native)

```bash
cd rChessMistry/frontend
npm install
npx expo start
```

Press `a` for Android emulator, `i` for iOS, or scan QR for Expo Go.

---

## 🔗 STEP 3: Connect Frontend to Backend

Edit `frontend/src/services/api.js`:

```js
// For Android emulator:
export const BASE_URL = 'http://10.0.2.2:8080/api';

// For iOS simulator:
export const BASE_URL = 'http://localhost:8080/api';

// For physical device (replace with your machine's local IP):
export const BASE_URL = 'http://192.168.1.XXX:8080/api';
```

---

## 📊 STEP 4: Google Sheets Admin Setup (Optional)

1. Go to console.cloud.google.com
2. Create a new project
3. Enable "Google Sheets API"
4. Go to Credentials → Create Service Account
5. Download the JSON key
6. Rename it to `google-credentials.json`
7. Place it in `backend/src/main/resources/`
8. Create a Google Sheet and share it with the service account email
9. Copy the Sheet ID from the URL
10. Update `application.properties`:

```properties
google.sheets.spreadsheet-id=YOUR_SHEET_ID_HERE
```

---

## 📝 STEP 5: Add Google Feedback Form

1. Create a Google Form at forms.google.com
2. Click "Send" → Get the link
3. Change `/viewform` to `/viewform?embedded=true`
4. Update `frontend/src/screens/FeedbackScreen.js`:

```js
const FEEDBACK_FORM_URL = 'https://docs.google.com/forms/d/e/YOUR_FORM_ID/viewform?embedded=true';
```

---

## 🚀 STEP 6: Production Deployment

### Backend (Spring Boot)
```bash
# Build JAR
./mvnw clean package -DskipTests

# Run on server
java -jar target/rchessmistry-1.0.0.jar

# Or use PostgreSQL (update application.properties)
```

### Frontend (React Native)
```bash
# Build for Android
npx expo build:android

# Build for iOS
npx expo build:ios

# Or use EAS Build (recommended)
npm install -g eas-cli
eas build --platform all
```

---

## 🎮 API Endpoints Reference

### Auth
- POST /api/auth/register — Create account
- POST /api/auth/login — Login
- GET  /api/auth/check-username/{name} — Check availability
- GET  /api/auth/ping — Health check

### User
- GET  /api/user/profile — Get profile
- PUT  /api/user/theme — Update theme
- PUT  /api/user/display-name — Update name
- POST /api/user/upload-photo — Upload profile photo
- POST /api/user/save-game — Save completed game
- GET  /api/user/game-history — Get game history
- GET  /api/user/leaderboard — Get all players ranked

### Challenges
- GET  /api/challenges/public — Get all challenges
- GET  /api/challenges/difficulty/{level} — Filter by level

---

## 📁 File Structure

```
rChessMistry/
├── README.md
├── SETUP.md  ← You are here
├── backend/
│   ├── pom.xml
│   └── src/main/java/com/therjhub/rchessmistry/
│       ├── RChessMistryApplication.java
│       ├── controller/   (AuthController, UserController, ChallengeController)
│       ├── service/      (AuthService, UserService, GoogleSheetsService)
│       ├── model/        (User, GameRecord, Challenge)
│       ├── repository/   (UserRepository, GameRecordRepository, ChallengeRepository)
│       ├── dto/          (RegisterRequest, LoginRequest, AuthResponse, SaveGameRequest)
│       └── config/       (JwtUtil, JwtAuthFilter, SecurityConfig)
└── frontend/
    ├── App.js
    ├── app.json
    ├── package.json
    └── src/
        ├── screens/  (Splash, Login, Register, Home, ChessBoard, Profile, Challenges, Feedback, Settings)
        ├── context/  (AuthContext, ThemeContext)
        ├── services/ (api.js)
        └── navigation/ (RootNavigator, AuthNavigator, MainNavigator)
```

---

*rChessMistry v1.0.0 — by TheRJHub*
*"Where Every Move Tells a Story"*
