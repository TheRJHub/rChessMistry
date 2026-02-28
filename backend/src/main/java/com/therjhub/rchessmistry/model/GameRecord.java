package com.therjhub.rchessmistry.model;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "game_records")
public class GameRecord {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @Column(name = "opponent_type")
    @Enumerated(EnumType.STRING)
    private OpponentType opponentType;

    @Column(name = "game_mode")
    @Enumerated(EnumType.STRING)
    private GameMode gameMode;

    @Column(name = "result")
    @Enumerated(EnumType.STRING)
    private GameResult result;

    @Column(name = "total_moves")
    private int totalMoves;

    @Column(name = "duration_seconds")
    private int durationSeconds;

    @Column(name = "pgn", columnDefinition = "TEXT")
    private String pgn;

    @Column(name = "blunder_count")
    private int blunderCount;

    @Column(name = "accuracy_score")
    private double accuracyScore;

    @Column(name = "played_at")
    private LocalDateTime playedAt;

    @PrePersist
    protected void onCreate() {
        playedAt = LocalDateTime.now();
    }

    public enum OpponentType { HUMAN, BOT }
    public enum GameMode { MANUAL, EASY, HARD, UNBEATABLE, CLASSIC, CHALLENGE }
    public enum GameResult { WIN, LOSS, DRAW }

    // ========== GETTERS ==========
    public Long getId() { return id; }
    public User getUser() { return user; }
    public OpponentType getOpponentType() { return opponentType; }
    public GameMode getGameMode() { return gameMode; }
    public GameResult getResult() { return result; }
    public int getTotalMoves() { return totalMoves; }
    public int getDurationSeconds() { return durationSeconds; }
    public String getPgn() { return pgn; }
    public int getBlunderCount() { return blunderCount; }
    public double getAccuracyScore() { return accuracyScore; }
    public LocalDateTime getPlayedAt() { return playedAt; }

    // ========== SETTERS ==========
    public void setId(Long id) { this.id = id; }
    public void setUser(User user) { this.user = user; }
    public void setOpponentType(OpponentType opponentType) { this.opponentType = opponentType; }
    public void setGameMode(GameMode gameMode) { this.gameMode = gameMode; }
    public void setResult(GameResult result) { this.result = result; }
    public void setTotalMoves(int totalMoves) { this.totalMoves = totalMoves; }
    public void setDurationSeconds(int durationSeconds) { this.durationSeconds = durationSeconds; }
    public void setPgn(String pgn) { this.pgn = pgn; }
    public void setBlunderCount(int blunderCount) { this.blunderCount = blunderCount; }
    public void setAccuracyScore(double accuracyScore) { this.accuracyScore = accuracyScore; }
    public void setPlayedAt(LocalDateTime playedAt) { this.playedAt = playedAt; }
}
