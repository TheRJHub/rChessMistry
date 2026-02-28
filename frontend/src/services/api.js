import axios from 'axios';

// ⚠️ Change this to your backend IP/URL
// For local development use your machine's local IP (not localhost)
// e.g. http://192.168.1.100:8080/api
export const BASE_URL = 'http://10.0.2.2:8080/api'; // Android emulator
// export const BASE_URL = 'http://localhost:8080/api'; // iOS simulator
// export const BASE_URL = 'https://your-production-server.com/api'; // Production

export const api = axios.create({
  baseURL: BASE_URL,
  timeout: 15000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Response interceptor for error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.data?.error) {
      return Promise.reject(new Error(error.response.data.error));
    }
    if (error.code === 'ECONNABORTED') {
      return Promise.reject(new Error('Connection timeout. Check your internet.'));
    }
    return Promise.reject(error);
  }
);

// Chess Bot API calls
export const getBotMove = async (fen, depth = 5) => {
  // Stockfish WASM — uses a free public API or local Stockfish via backend
  try {
    const response = await axios.get(
      `https://stockfish.online/api/s/v2.php?fen=${encodeURIComponent(fen)}&depth=${depth}`,
      { timeout: 10000 }
    );
    return response.data?.bestmove?.split(' ')[1] || null;
  } catch {
    return null;
  }
};

export const DIFFICULTY_DEPTH = {
  EASY: 1,
  HARD: 12,
  UNBEATABLE: 20,
  CLASSIC: 5,
};
