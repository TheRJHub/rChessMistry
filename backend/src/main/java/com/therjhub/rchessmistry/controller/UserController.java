package com.therjhub.rchessmistry.controller;

import com.therjhub.rchessmistry.dto.SaveGameRequest;
import com.therjhub.rchessmistry.model.GameRecord;
import com.therjhub.rchessmistry.model.User;
import com.therjhub.rchessmistry.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/user")
@CrossOrigin(origins = "*")
public class UserController {

    @Autowired
    private UserService userService;

    @GetMapping("/profile")
    public ResponseEntity<?> getProfile(Authentication auth) {
        try {
            User user = userService.getProfile(auth.getName());
            return ResponseEntity.ok(user);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }

    @PutMapping("/theme")
    public ResponseEntity<?> updateTheme(Authentication auth, @RequestBody Map<String, String> body) {
        try {
            User user = userService.updateTheme(auth.getName(), body.get("theme"));
            return ResponseEntity.ok(Map.of("theme", user.getThemePreference(), "message", "Theme updated!"));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }

    @PutMapping("/display-name")
    public ResponseEntity<?> updateDisplayName(Authentication auth, @RequestBody Map<String, String> body) {
        try {
            User user = userService.updateDisplayName(auth.getName(), body.get("displayName"));
            return ResponseEntity.ok(Map.of("displayName", user.getDisplayName(), "message", "Name updated!"));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }

    @PostMapping("/upload-photo")
    public ResponseEntity<?> uploadPhoto(Authentication auth, @RequestParam("photo") MultipartFile file) {
        try {
            String photoUrl = userService.uploadProfilePhoto(auth.getName(), file);
            return ResponseEntity.ok(Map.of("photoUrl", photoUrl, "message", "Profile photo updated!"));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }

    @PostMapping("/save-game")
    public ResponseEntity<?> saveGame(Authentication auth, @RequestBody SaveGameRequest req) {
        try {
            GameRecord record = userService.saveGame(auth.getName(), req);
            return ResponseEntity.ok(Map.of("message", "Game saved!", "gameId", record.getId()));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }

    @GetMapping("/game-history")
    public ResponseEntity<?> gameHistory(Authentication auth) {
        try {
            List<GameRecord> history = userService.getGameHistory(auth.getName());
            return ResponseEntity.ok(history);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }

    @GetMapping("/leaderboard")
    public ResponseEntity<?> leaderboard() {
        try {
            List<User> leaders = userService.getLeaderboard();
            return ResponseEntity.ok(leaders);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }
}
