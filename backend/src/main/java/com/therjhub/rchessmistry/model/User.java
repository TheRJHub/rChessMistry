package com.therjhub.rchessmistry.model;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "users")
public class User {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(unique = true, nullable = false, length = 30)
    private String username;

    @Column(nullable = false)
    private String password;

    @Column(name = "display_name", length = 50)
    private String displayName;

    @Column(name = "profile_photo_url")
    private String profilePhotoUrl;

    @Column(name = "wins")
    private int wins = 0;

    @Column(name = "losses")
    private int losses = 0;

    @Column(name = "draws")
    private int draws = 0;

    @Column(name = "games_played")
    private int gamesPlayed = 0;

    @Column(name = "total_moves")
    private int totalMoves = 0;

    @Column(name = "best_streak")
    private int bestStreak = 0;

    @Column(name = "current_streak")
    private int currentStreak = 0;

    @Column(name = "device_id")
    private String deviceId;

    @Column(name = "device_name")
    private String deviceName;

    @Column(name = "theme_preference")
    private String themePreference = "dark";

    @Column(name = "joined_at")
    private LocalDateTime joinedAt;

    @Column(name = "last_login")
    private LocalDateTime lastLogin;

    @Column(name = "synced_to_sheet")
    private boolean syncedToSheet = false;

    @PrePersist
    protected void onCreate() {
        joinedAt = LocalDateTime.now();
        lastLogin = LocalDateTime.now();
    }

    @PreUpdate
    protected void onUpdate() {
        lastLogin = LocalDateTime.now();
    }

    // ========== GETTERS ==========
    public Long getId() { return id; }
    public String getUsername() { return username; }
    public String getPassword() { return password; }
    public String getDisplayName() { return displayName; }
    public String getProfilePhotoUrl() { return profilePhotoUrl; }
    public int getWins() { return wins; }
    public int getLosses() { return losses; }
    public int getDraws() { return draws; }
    public int getGamesPlayed() { return gamesPlayed; }
    public int getTotalMoves() { return totalMoves; }
    public int getBestStreak() { return bestStreak; }
    public int getCurrentStreak() { return currentStreak; }
    public String getDeviceId() { return deviceId; }
    public String getDeviceName() { return deviceName; }
    public String getThemePreference() { return themePreference; }
    public LocalDateTime getJoinedAt() { return joinedAt; }
    public LocalDateTime getLastLogin() { return lastLogin; }
    public boolean isSyncedToSheet() { return syncedToSheet; }

    // ========== SETTERS ==========
    public void setId(Long id) { this.id = id; }
    public void setUsername(String username) { this.username = username; }
    public void setPassword(String password) { this.password = password; }
    public void setDisplayName(String displayName) { this.displayName = displayName; }
    public void setProfilePhotoUrl(String profilePhotoUrl) { this.profilePhotoUrl = profilePhotoUrl; }
    public void setWins(int wins) { this.wins = wins; }
    public void setLosses(int losses) { this.losses = losses; }
    public void setDraws(int draws) { this.draws = draws; }
    public void setGamesPlayed(int gamesPlayed) { this.gamesPlayed = gamesPlayed; }
    public void setTotalMoves(int totalMoves) { this.totalMoves = totalMoves; }
    public void setBestStreak(int bestStreak) { this.bestStreak = bestStreak; }
    public void setCurrentStreak(int currentStreak) { this.currentStreak = currentStreak; }
    public void setDeviceId(String deviceId) { this.deviceId = deviceId; }
    public void setDeviceName(String deviceName) { this.deviceName = deviceName; }
    public void setThemePreference(String themePreference) { this.themePreference = themePreference; }
    public void setJoinedAt(LocalDateTime joinedAt) { this.joinedAt = joinedAt; }
    public void setLastLogin(LocalDateTime lastLogin) { this.lastLogin = lastLogin; }
    public void setSyncedToSheet(boolean syncedToSheet) { this.syncedToSheet = syncedToSheet; }
}
