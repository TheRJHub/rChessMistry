package com.therjhub.rchessmistry.dto;

public class AuthResponse {
    private String token;
    private String username;
    private String displayName;
    private String profilePhotoUrl;
    private int wins;
    private int losses;
    private int draws;
    private int gamesPlayed;
    private String themePreference;
    private String message;

    public AuthResponse() {}

    public AuthResponse(String token, String username, String displayName,
                        String profilePhotoUrl, int wins, int losses, int draws,
                        int gamesPlayed, String themePreference, String message) {
        this.token = token;
        this.username = username;
        this.displayName = displayName;
        this.profilePhotoUrl = profilePhotoUrl;
        this.wins = wins;
        this.losses = losses;
        this.draws = draws;
        this.gamesPlayed = gamesPlayed;
        this.themePreference = themePreference;
        this.message = message;
    }

    public String getToken() { return token; }
    public void setToken(String token) { this.token = token; }
    public String getUsername() { return username; }
    public void setUsername(String username) { this.username = username; }
    public String getDisplayName() { return displayName; }
    public void setDisplayName(String displayName) { this.displayName = displayName; }
    public String getProfilePhotoUrl() { return profilePhotoUrl; }
    public void setProfilePhotoUrl(String profilePhotoUrl) { this.profilePhotoUrl = profilePhotoUrl; }
    public int getWins() { return wins; }
    public void setWins(int wins) { this.wins = wins; }
    public int getLosses() { return losses; }
    public void setLosses(int losses) { this.losses = losses; }
    public int getDraws() { return draws; }
    public void setDraws(int draws) { this.draws = draws; }
    public int getGamesPlayed() { return gamesPlayed; }
    public void setGamesPlayed(int gamesPlayed) { this.gamesPlayed = gamesPlayed; }
    public String getThemePreference() { return themePreference; }
    public void setThemePreference(String themePreference) { this.themePreference = themePreference; }
    public String getMessage() { return message; }
    public void setMessage(String message) { this.message = message; }
}
