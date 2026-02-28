package com.therjhub.rchessmistry.dto;

public class SaveGameRequest {
    private String opponentType;
    private String gameMode;
    private String result;
    private int totalMoves;
    private int durationSeconds;
    private String pgn;
    private int blunderCount;
    private double accuracyScore;

    public String getOpponentType() { return opponentType; }
    public void setOpponentType(String opponentType) { this.opponentType = opponentType; }
    public String getGameMode() { return gameMode; }
    public void setGameMode(String gameMode) { this.gameMode = gameMode; }
    public String getResult() { return result; }
    public void setResult(String result) { this.result = result; }
    public int getTotalMoves() { return totalMoves; }
    public void setTotalMoves(int totalMoves) { this.totalMoves = totalMoves; }
    public int getDurationSeconds() { return durationSeconds; }
    public void setDurationSeconds(int durationSeconds) { this.durationSeconds = durationSeconds; }
    public String getPgn() { return pgn; }
    public void setPgn(String pgn) { this.pgn = pgn; }
    public int getBlunderCount() { return blunderCount; }
    public void setBlunderCount(int blunderCount) { this.blunderCount = blunderCount; }
    public double getAccuracyScore() { return accuracyScore; }
    public void setAccuracyScore(double accuracyScore) { this.accuracyScore = accuracyScore; }
}
