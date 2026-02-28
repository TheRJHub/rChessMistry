package com.therjhub.rchessmistry.service;

import com.therjhub.rchessmistry.config.JwtUtil;
import com.therjhub.rchessmistry.dto.AuthResponse;
import com.therjhub.rchessmistry.dto.LoginRequest;
import com.therjhub.rchessmistry.dto.RegisterRequest;
import com.therjhub.rchessmistry.model.User;
import com.therjhub.rchessmistry.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
public class AuthService {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private JwtUtil jwtUtil;

    @Autowired
    private GoogleSheetsService sheetsService;

    public boolean usernameExists(String username) {
        return userRepository.existsByUsername(username);
    }

    public AuthResponse register(RegisterRequest req) {
        if (userRepository.existsByUsername(req.getUsername())) {
            throw new RuntimeException("Username '" + req.getUsername() + "' is already taken. Please choose another.");
        }

        User user = new User();
        user.setUsername(req.getUsername().toLowerCase().trim());
        user.setPassword(passwordEncoder.encode(req.getPassword()));
        user.setDisplayName(req.getDisplayName() != null ? req.getDisplayName() : req.getUsername());
        user.setDeviceId(req.getDeviceId());
        user.setDeviceName(req.getDeviceName());

        User saved = userRepository.save(user);

        // Sync new user to Google Sheets
        sheetsService.syncUser(saved);

        String token = jwtUtil.generateToken(saved.getUsername());

        return new AuthResponse(
                token,
                saved.getUsername(),
                saved.getDisplayName(),
                saved.getProfilePhotoUrl(),
                saved.getWins(),
                saved.getLosses(),
                saved.getDraws(),
                saved.getGamesPlayed(),
                saved.getThemePreference(),
                "Welcome to rChessMistry! 🎉"
        );
    }

    public AuthResponse login(LoginRequest req) {
        User user = userRepository.findByUsername(req.getUsername().toLowerCase().trim())
                .orElseThrow(() -> new RuntimeException("Invalid username or password."));

        if (!passwordEncoder.matches(req.getPassword(), user.getPassword())) {
            throw new RuntimeException("Invalid username or password.");
        }

        // Update device info on login
        if (req.getDeviceId() != null) {
            user.setDeviceId(req.getDeviceId());
            user.setDeviceName(req.getDeviceName());
        }
        userRepository.save(user);

        String token = jwtUtil.generateToken(user.getUsername());

        return new AuthResponse(
                token,
                user.getUsername(),
                user.getDisplayName(),
                user.getProfilePhotoUrl(),
                user.getWins(),
                user.getLosses(),
                user.getDraws(),
                user.getGamesPlayed(),
                user.getThemePreference(),
                "Welcome back, " + user.getDisplayName() + "! ♟️"
        );
    }
}
