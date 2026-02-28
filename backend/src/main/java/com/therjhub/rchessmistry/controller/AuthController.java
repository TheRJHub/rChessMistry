package com.therjhub.rchessmistry.controller;

import com.therjhub.rchessmistry.dto.AuthResponse;
import com.therjhub.rchessmistry.dto.LoginRequest;
import com.therjhub.rchessmistry.dto.RegisterRequest;
import com.therjhub.rchessmistry.service.AuthService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = "*")
public class AuthController {

    @Autowired
    private AuthService authService;

    @PostMapping("/register")
    public ResponseEntity<?> register(@Valid @RequestBody RegisterRequest request) {
        try {
            AuthResponse response = authService.register(request);
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@Valid @RequestBody LoginRequest request) {
        try {
            AuthResponse response = authService.login(request);
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }

    @GetMapping("/check-username/{username}")
    public ResponseEntity<?> checkUsername(@PathVariable String username) {
        boolean available = !authService.usernameExists(username.toLowerCase().trim());
        return ResponseEntity.ok(Map.of(
                "username", username,
                "available", available,
                "message", available ? "Username is available! ✅" : "Username is taken. Try another. ❌"
        ));
    }

    @GetMapping("/ping")
    public ResponseEntity<?> ping() {
        return ResponseEntity.ok(Map.of(
                "status", "ok",
                "app", "rChessMistry",
                "by", "TheRJHub",
                "version", "1.0.0"
        ));
    }
}
