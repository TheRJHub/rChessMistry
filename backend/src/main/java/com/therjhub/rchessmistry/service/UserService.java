package com.therjhub.rchessmistry.service;

import com.therjhub.rchessmistry.model.User;
import com.therjhub.rchessmistry.model.GameRecord;
import com.therjhub.rchessmistry.repository.UserRepository;
import com.therjhub.rchessmistry.repository.GameRecordRepository;
import com.therjhub.rchessmistry.dto.SaveGameRequest;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.List;
import java.util.UUID;

@Service
public class UserService {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private GameRecordRepository gameRecordRepository;

    @Autowired
    private GoogleSheetsService sheetsService;

    @Value("${app.upload.dir}")
    private String uploadDir;

    public User getProfile(String username) {
        return userRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("User not found"));
    }

    public User updateTheme(String username, String theme) {
        User user = getProfile(username);
        user.setThemePreference(theme);
        return userRepository.save(user);
    }

    public User updateDisplayName(String username, String displayName) {
        User user = getProfile(username);
        user.setDisplayName(displayName);
        return userRepository.save(user);
    }

    public String uploadProfilePhoto(String username, MultipartFile file) throws IOException {
        User user = getProfile(username);

        // Create upload directory
        Path uploadPath = Paths.get(uploadDir);
        if (!Files.exists(uploadPath)) {
            Files.createDirectories(uploadPath);
        }

        String extension = getFileExtension(file.getOriginalFilename());
        String filename = username + "_" + UUID.randomUUID().toString().substring(0, 8) + "." + extension;
        Path filePath = uploadPath.resolve(filename);
        Files.write(filePath, file.getBytes());

        String photoUrl = "/uploads/profiles/" + filename;
        user.setProfilePhotoUrl(photoUrl);
        userRepository.save(user);

        return photoUrl;
    }

    public GameRecord saveGame(String username, SaveGameRequest req) {
        User user = getProfile(username);

        GameRecord record = new GameRecord();
        record.setUser(user);
        record.setOpponentType(GameRecord.OpponentType.valueOf(req.getOpponentType()));
        record.setGameMode(GameRecord.GameMode.valueOf(req.getGameMode()));
        record.setResult(GameRecord.GameResult.valueOf(req.getResult()));
        record.setTotalMoves(req.getTotalMoves());
        record.setDurationSeconds(req.getDurationSeconds());
        record.setPgn(req.getPgn());
        record.setBlunderCount(req.getBlunderCount());
        record.setAccuracyScore(req.getAccuracyScore());

        // Update user stats
        user.setGamesPlayed(user.getGamesPlayed() + 1);
        user.setTotalMoves(user.getTotalMoves() + req.getTotalMoves());

        switch (req.getResult()) {
            case "WIN" -> {
                user.setWins(user.getWins() + 1);
                user.setCurrentStreak(user.getCurrentStreak() + 1);
                if (user.getCurrentStreak() > user.getBestStreak()) {
                    user.setBestStreak(user.getCurrentStreak());
                }
            }
            case "LOSS" -> {
                user.setLosses(user.getLosses() + 1);
                user.setCurrentStreak(0);
            }
            case "DRAW" -> {
                user.setDraws(user.getDraws() + 1);
            }
        }

        userRepository.save(user);
        sheetsService.syncUser(user);

        return gameRecordRepository.save(record);
    }

    public List<GameRecord> getGameHistory(String username) {
        User user = getProfile(username);
        return gameRecordRepository.findByUserOrderByPlayedAtDesc(user);
    }

    public List<User> getLeaderboard() {
        return userRepository.findByOrderByWinsDesc();
    }

    private String getFileExtension(String filename) {
        if (filename == null || !filename.contains(".")) return "jpg";
        return filename.substring(filename.lastIndexOf(".") + 1).toLowerCase();
    }
}
