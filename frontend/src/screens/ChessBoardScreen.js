import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
  View, Text, TouchableOpacity, StyleSheet, Dimensions,
  Alert, ActivityIndicator, ScrollView, Modal
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../context/ThemeContext';
import { useAuth } from '../context/AuthContext';
import { getBotMove, DIFFICULTY_DEPTH, api } from '../services/api';
import { Chess } from 'chess.js';
import Toast from 'react-native-toast-message';

const { width } = Dimensions.get('window');
const BOARD_SIZE = width - 32;
const SQUARE_SIZE = BOARD_SIZE / 8;

const PIECE_SYMBOLS = {
  wK: '♔', wQ: '♕', wR: '♖', wB: '♗', wN: '♘', wP: '♙',
  bK: '♚', bQ: '♛', bR: '♜', bB: '♝', bN: '♞', bP: '♟',
};

const FILES = ['a','b','c','d','e','f','g','h'];
const RANKS = ['8','7','6','5','4','3','2','1'];

export default function ChessBoardScreen({ navigation, route }) {
  const { mode } = route.params;
  const { theme } = useTheme();
  const { user, updateUser } = useAuth();

  const [game, setGame] = useState(new Chess());
  const [board, setBoard] = useState([]);
  const [selected, setSelected] = useState(null);
  const [validMoves, setValidMoves] = useState([]);
  const [currentTurn, setCurrentTurn] = useState('w');
  const [gameStatus, setGameStatus] = useState('playing'); // playing, check, checkmate, draw, stalemate
  const [moveHistory, setMoveHistory] = useState([]);
  const [isThinking, setIsThinking] = useState(false);
  const [hint, setHint] = useState(null);
  const [showHint, setShowHint] = useState(false);
  const [gameResult, setGameResult] = useState(null);
  const [startTime] = useState(Date.now());
  const [promotionModal, setPromotionModal] = useState(null);
  const gameRef = useRef(game);

  useEffect(() => { initBoard(); }, []);
  useEffect(() => { gameRef.current = game; }, [game]);

  const initBoard = () => {
    const newGame = new Chess();
    setGame(newGame);
    setBoard(getBoard(newGame));
    setSelected(null);
    setValidMoves([]);
    setCurrentTurn('w');
    setGameStatus('playing');
    setMoveHistory([]);
    setHint(null);
    setGameResult(null);
  };

  const getBoard = (chessGame) => {
    const b = chessGame.board();
    return RANKS.map((rank, ri) =>
      FILES.map((file, fi) => ({
        square: file + rank,
        piece: b[ri][fi],
        isLight: (ri + fi) % 2 === 0,
        rank, file,
      }))
    );
  };

  const handleSquarePress = async (squareData) => {
    if (isThinking || gameStatus === 'checkmate' || gameStatus === 'draw') return;
    if (mode.id !== 'MANUAL' && currentTurn === 'b') return; // bot's turn

    const { square, piece } = squareData;

    if (selected === null) {
      if (piece && piece.color === currentTurn) {
        setSelected(square);
        const moves = game.moves({ square, verbose: true });
        setValidMoves(moves.map(m => m.to));
      }
    } else {
      if (selected === square) {
        setSelected(null);
        setValidMoves([]);
        return;
      }

      if (validMoves.includes(square)) {
        // Check for pawn promotion
        const movingPiece = game.get(selected);
        if (movingPiece?.type === 'p' &&
            ((currentTurn === 'w' && square[1] === '8') ||
             (currentTurn === 'b' && square[1] === '1'))) {
          setPromotionModal({ from: selected, to: square });
          return;
        }
        executeMove(selected, square);
      } else if (piece && piece.color === currentTurn) {
        setSelected(square);
        const moves = game.moves({ square, verbose: true });
        setValidMoves(moves.map(m => m.to));
      } else {
        setSelected(null);
        setValidMoves([]);
      }
    }
  };

  const executeMove = useCallback(async (from, to, promotion = 'q') => {
    const newGame = new Chess(game.fen());
    try {
      const move = newGame.move({ from, to, promotion });
      if (!move) return;

      setGame(newGame);
      setBoard(getBoard(newGame));
      setSelected(null);
      setValidMoves([]);
      setHint(null);
      setShowHint(false);

      const history = newGame.history({ verbose: true });
      setMoveHistory(history);

      const nextTurn = currentTurn === 'w' ? 'b' : 'w';
      setCurrentTurn(nextTurn);
      checkGameStatus(newGame);

      // Bot move
      if (!newGame.isGameOver() && mode.id !== 'MANUAL' && nextTurn === 'b') {
        await triggerBotMove(newGame);
      }
    } catch (e) {
      console.log('Move error:', e);
    }
  }, [game, currentTurn, mode]);

  const triggerBotMove = async (currentGame) => {
    setIsThinking(true);
    try {
      const depth = DIFFICULTY_DEPTH[mode.id] || 5;
      const bestMove = await getBotMove(currentGame.fen(), depth);

      if (bestMove && bestMove.length >= 4) {
        const from = bestMove.substring(0, 2);
        const to = bestMove.substring(2, 4);
        const promo = bestMove[4] || 'q';

        const newGame = new Chess(currentGame.fen());
        newGame.move({ from, to, promotion: promo });
        setGame(newGame);
        setBoard(getBoard(newGame));
        setCurrentTurn('w');

        const history = newGame.history({ verbose: true });
        setMoveHistory(history);
        checkGameStatus(newGame);
      }
    } catch (e) {
      Toast.show({ type: 'error', text1: 'Bot Error', text2: 'Using random move' });
      // Fallback: random move
      const moves = currentGame.moves();
      if (moves.length > 0) {
        const randomMove = moves[Math.floor(Math.random() * moves.length)];
        const newGame = new Chess(currentGame.fen());
        newGame.move(randomMove);
        setGame(newGame);
        setBoard(getBoard(newGame));
        setCurrentTurn('w');
        checkGameStatus(newGame);
      }
    } finally {
      setIsThinking(false);
    }
  };

  const checkGameStatus = (currentGame) => {
    if (currentGame.isCheckmate()) {
      const winner = currentGame.turn() === 'b' ? 'White' : 'Black';
      setGameStatus('checkmate');
      endGame(currentGame.turn() === 'b' ? 'WIN' : 'LOSS', `Checkmate! ${winner} wins!`);
    } else if (currentGame.isDraw()) {
      setGameStatus('draw');
      endGame('DRAW', 'Game drawn!');
    } else if (currentGame.isStalemate()) {
      setGameStatus('stalemate');
      endGame('DRAW', 'Stalemate!');
    } else if (currentGame.isCheck()) {
      setGameStatus('check');
    } else {
      setGameStatus('playing');
    }
  };

  const endGame = async (result, message) => {
    setGameResult({ result, message });
    const duration = Math.floor((Date.now() - startTime) / 1000);

    try {
      await api.post('/user/save-game', {
        opponentType: mode.opponentType,
        gameMode: mode.id,
        result,
        totalMoves: moveHistory.length,
        durationSeconds: duration,
        pgn: game.pgn(),
        blunderCount: 0,
        accuracyScore: 0,
      });

      const wins = result === 'WIN' ? (user?.wins || 0) + 1 : (user?.wins || 0);
      const losses = result === 'LOSS' ? (user?.losses || 0) + 1 : (user?.losses || 0);
      const draws = result === 'DRAW' ? (user?.draws || 0) + 1 : (user?.draws || 0);
      await updateUser({ wins, losses, draws, gamesPlayed: (user?.gamesPlayed || 0) + 1 });
    } catch (e) {
      console.log('Save game failed:', e);
    }
  };

  const getHint = async () => {
    if (isThinking) return;
    setIsThinking(true);
    try {
      const bestMove = await getBotMove(game.fen(), 8);
      if (bestMove) {
        const from = bestMove.substring(0, 2);
        const to = bestMove.substring(2, 4);
        setHint({ from, to });
        setShowHint(true);
        Toast.show({ type: 'info', text1: '💡 Hint', text2: `Best move: ${from} → ${to}` });
      }
    } finally {
      setIsThinking(false);
    }
  };

  const handlePromotion = (piece) => {
    if (promotionModal) {
      executeMove(promotionModal.from, promotionModal.to, piece);
      setPromotionModal(null);
    }
  };

  const getSquareColor = (sq) => {
    if (hint && (sq.square === hint.from || sq.square === hint.to)) return theme.accent + 'AA';
    if (selected === sq.square) return theme.pieceHighlight;
    if (validMoves.includes(sq.square)) return theme.moveHighlight;
    if (game.isCheck() && sq.piece?.type === 'k' && sq.piece?.color === currentTurn) return '#FF000066';
    return sq.isLight ? theme.boardLight : theme.boardDark;
  };

  return (
    <View style={{ flex: 1, backgroundColor: theme.background }}>
      <SafeAreaView style={{ flex: 1 }}>

        {/* Header */}
        <View style={[styles.header, { borderBottomColor: theme.cardBorder }]}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Ionicons name="arrow-back" size={22} color={theme.text} />
          </TouchableOpacity>
          <View style={{ alignItems: 'center' }}>
            <Text style={[styles.modeTitle, { color: theme.text }]}>{mode.title}</Text>
            <Text style={[styles.modeSub, { color: theme.textMuted }]}>{mode.subtitle}</Text>
          </View>
          <TouchableOpacity onPress={initBoard}>
            <Ionicons name="refresh-outline" size={22} color={theme.text} />
          </TouchableOpacity>
        </View>

        {/* Status Bar */}
        <View style={[styles.statusBar, {
          backgroundColor: gameStatus === 'check' ? theme.warning + '22' :
                          gameStatus === 'checkmate' ? theme.error + '22' :
                          gameStatus === 'draw' ? theme.accent + '22' : theme.card,
          borderColor: theme.cardBorder
        }]}>
          <Text style={[styles.statusText, {
            color: gameStatus === 'check' ? theme.warning :
                   gameStatus === 'checkmate' ? theme.error :
                   gameStatus === 'draw' ? theme.accent : theme.textSecondary
          }]}>
            {gameStatus === 'checkmate' ? '♟ Checkmate!' :
             gameStatus === 'draw' ? '🤝 Draw!' :
             gameStatus === 'stalemate' ? '⚖️ Stalemate!' :
             gameStatus === 'check' ? '⚠️ Check!' :
             isThinking ? '🤖 Bot is thinking...' :
             `${currentTurn === 'w' ? '⬜ White' : '⬛ Black'} to move`}
          </Text>
          {isThinking && <ActivityIndicator size="small" color={theme.primary} style={{ marginLeft: 8 }} />}
        </View>

        {/* Chess Board */}
        <View style={styles.boardContainer}>
          {/* Rank labels */}
          <View style={styles.rankLabels}>
            {RANKS.map(r => (
              <Text key={r} style={[styles.label, { height: SQUARE_SIZE, lineHeight: SQUARE_SIZE, color: theme.textMuted }]}>{r}</Text>
            ))}
          </View>

          <View>
            {board.map((row, ri) => (
              <View key={ri} style={{ flexDirection: 'row' }}>
                {row.map((sq, fi) => (
                  <TouchableOpacity
                    key={fi}
                    style={[styles.square, { width: SQUARE_SIZE, height: SQUARE_SIZE, backgroundColor: getSquareColor(sq) }]}
                    onPress={() => handleSquarePress(sq)}
                    activeOpacity={0.85}
                  >
                    {sq.piece && (
                      <Text style={[styles.piece, {
                        fontSize: SQUARE_SIZE * 0.65,
                        color: sq.piece.color === 'w' ? '#FFFFFF' : '#000000',
                        textShadowColor: sq.piece.color === 'w' ? '#000000' : '#FFFFFF',
                        textShadowRadius: 2,
                      }]}>
                        {PIECE_SYMBOLS[sq.piece.color + sq.piece.type.toUpperCase()]}
                      </Text>
                    )}
                    {validMoves.includes(sq.square) && !sq.piece && (
                      <View style={[styles.moveDot, { backgroundColor: theme.primary + '88' }]} />
                    )}
                    {validMoves.includes(sq.square) && sq.piece && (
                      <View style={[styles.captureRing, { borderColor: theme.primary }]} />
                    )}
                  </TouchableOpacity>
                ))}
              </View>
            ))}

            {/* File labels */}
            <View style={{ flexDirection: 'row' }}>
              {FILES.map(f => (
                <Text key={f} style={[styles.label, { width: SQUARE_SIZE, textAlign: 'center', color: theme.textMuted }]}>{f}</Text>
              ))}
            </View>
          </View>
        </View>

        {/* Action Buttons */}
        <View style={styles.actions}>
          {mode.id === 'CLASSIC' && (
            <TouchableOpacity
              style={[styles.actionBtn, { backgroundColor: theme.accent + '22', borderColor: theme.accent }]}
              onPress={getHint}
              disabled={isThinking}
            >
              <Ionicons name="bulb-outline" size={18} color={theme.accent} />
              <Text style={[styles.actionText, { color: theme.accent }]}>Hint</Text>
            </TouchableOpacity>
          )}
          <TouchableOpacity
            style={[styles.actionBtn, { backgroundColor: theme.primary + '22', borderColor: theme.primary }]}
            onPress={() => Alert.alert('Resign', 'Are you sure?', [
              { text: 'Cancel' },
              { text: 'Resign', onPress: () => endGame('LOSS', 'You resigned') },
            ])}
          >
            <Ionicons name="flag-outline" size={18} color={theme.primary} />
            <Text style={[styles.actionText, { color: theme.primary }]}>Resign</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.actionBtn, { backgroundColor: theme.card, borderColor: theme.cardBorder }]}
            onPress={initBoard}
          >
            <Ionicons name="refresh-outline" size={18} color={theme.text} />
            <Text style={[styles.actionText, { color: theme.text }]}>New</Text>
          </TouchableOpacity>
        </View>

        {/* Move History */}
        {moveHistory.length > 0 && (
          <ScrollView horizontal style={[styles.moveHistory, { backgroundColor: theme.surface }]} showsHorizontalScrollIndicator={false}>
            {moveHistory.map((m, i) => (
              <View key={i} style={[styles.moveChip, { backgroundColor: theme.card }]}>
                <Text style={[styles.moveNum, { color: theme.textMuted }]}>{i + 1}.</Text>
                <Text style={[styles.moveText, { color: theme.text }]}>{m.san}</Text>
              </View>
            ))}
          </ScrollView>
        )}

        {/* Game Over Modal */}
        <Modal visible={!!gameResult} transparent animationType="fade">
          <View style={styles.modalOverlay}>
            <View style={[styles.modalCard, { backgroundColor: theme.card, borderColor: theme.primary }]}>
              <Text style={styles.resultEmoji}>
                {gameResult?.result === 'WIN' ? '🏆' : gameResult?.result === 'LOSS' ? '😔' : '🤝'}
              </Text>
              <Text style={[styles.resultTitle, { color: theme.text }]}>{gameResult?.message}</Text>
              <Text style={[styles.resultSub, { color: theme.textSecondary }]}>
                {moveHistory.length} moves · {Math.floor((Date.now() - startTime) / 1000)}s
              </Text>
              <View style={styles.modalBtns}>
                <TouchableOpacity
                  style={[styles.modalBtn, { backgroundColor: theme.primary }]}
                  onPress={initBoard}
                >
                  <Text style={styles.modalBtnText}>Play Again</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[styles.modalBtn, { backgroundColor: theme.surface, borderWidth: 1, borderColor: theme.cardBorder }]}
                  onPress={() => { setGameResult(null); navigation.goBack(); }}
                >
                  <Text style={[styles.modalBtnText, { color: theme.text }]}>Home</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </Modal>

        {/* Promotion Modal */}
        <Modal visible={!!promotionModal} transparent animationType="slide">
          <View style={styles.modalOverlay}>
            <View style={[styles.promoCard, { backgroundColor: theme.card }]}>
              <Text style={[styles.promoTitle, { color: theme.text }]}>Promote Pawn</Text>
              <View style={styles.promoOptions}>
                {[['q','♛'],['r','♜'],['b','♝'],['n','♞']].map(([p, sym]) => (
                  <TouchableOpacity
                    key={p}
                    style={[styles.promoBtn, { backgroundColor: theme.primary }]}
                    onPress={() => handlePromotion(p)}
                  >
                    <Text style={styles.promoSymbol}>{sym}</Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>
          </View>
        </Modal>

      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
    paddingHorizontal: 16, paddingVertical: 12, borderBottomWidth: 1,
  },
  modeTitle: { fontSize: 15, fontWeight: '700' },
  modeSub: { fontSize: 11 },
  statusBar: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center',
    paddingVertical: 8, marginHorizontal: 16, marginTop: 8,
    borderRadius: 10, borderWidth: 1,
  },
  statusText: { fontSize: 13, fontWeight: '600' },
  boardContainer: { flexDirection: 'row', alignItems: 'flex-start', marginTop: 12, paddingLeft: 8 },
  rankLabels: { width: 18 },
  label: { fontSize: 10, fontWeight: '600', textAlign: 'center' },
  square: { justifyContent: 'center', alignItems: 'center' },
  piece: { fontWeight: '600', textShadowOffset: { width: 0, height: 1 }, textShadowRadius: 2 },
  moveDot: { width: 12, height: 12, borderRadius: 6 },
  captureRing: { position: 'absolute', width: '90%', height: '90%', borderRadius: 4, borderWidth: 3 },
  actions: { flexDirection: 'row', justifyContent: 'center', gap: 10, marginTop: 12, paddingHorizontal: 16 },
  actionBtn: { flexDirection: 'row', alignItems: 'center', gap: 5, paddingHorizontal: 16, paddingVertical: 8, borderRadius: 10, borderWidth: 1 },
  actionText: { fontSize: 13, fontWeight: '600' },
  moveHistory: { marginTop: 10, paddingHorizontal: 12, paddingVertical: 8, maxHeight: 44 },
  moveChip: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 8, paddingVertical: 4, borderRadius: 8, marginRight: 6 },
  moveNum: { fontSize: 11, marginRight: 3 },
  moveText: { fontSize: 12, fontWeight: '600' },
  modalOverlay: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: 'rgba(0,0,0,0.75)' },
  modalCard: { borderRadius: 20, padding: 28, width: 300, alignItems: 'center', borderWidth: 2 },
  resultEmoji: { fontSize: 56, marginBottom: 12 },
  resultTitle: { fontSize: 20, fontWeight: '800', marginBottom: 6 },
  resultSub: { fontSize: 13 },
  modalBtns: { flexDirection: 'row', gap: 10, marginTop: 20 },
  modalBtn: { flex: 1, height: 44, borderRadius: 10, justifyContent: 'center', alignItems: 'center' },
  modalBtnText: { color: '#fff', fontWeight: '700', fontSize: 14 },
  promoCard: { borderRadius: 16, padding: 24, width: 280, alignItems: 'center' },
  promoTitle: { fontSize: 18, fontWeight: '700', marginBottom: 16 },
  promoOptions: { flexDirection: 'row', gap: 12 },
  promoBtn: { width: 56, height: 56, borderRadius: 12, justifyContent: 'center', alignItems: 'center' },
  promoSymbol: { fontSize: 30, color: '#fff' },
});
