package com.therjhub.rchessmistry.controller;

import com.therjhub.rchessmistry.model.Challenge;
import com.therjhub.rchessmistry.repository.ChallengeRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Arrays;
import java.util.List;

@RestController
@RequestMapping("/api/challenges")
@CrossOrigin(origins = "*")
public class ChallengeController {

    @Autowired
    private ChallengeRepository challengeRepository;

    @GetMapping("/public")
    public ResponseEntity<List<Challenge>> getAllChallenges() {
        return ResponseEntity.ok(challengeRepository.findByActiveTrue());
    }

    @GetMapping("/difficulty/{level}")
    public ResponseEntity<List<Challenge>> getByDifficulty(@PathVariable String level) {
        return ResponseEntity.ok(challengeRepository.findByDifficultyAndActiveTrue(level.toUpperCase()));
    }

    @Bean
    public CommandLineRunner seedChallenges() {
        return args -> {
            if (challengeRepository.count() == 0) {
                List<Challenge> challenges = Arrays.asList(
                        createChallenge(
                                "Fool's Mate",
                                "Deliver checkmate in 2 moves as Black",
                                "rnbqkbnr/pppp1ppp/8/4p3/6P1/5P2/PPPPP2P/RNBQKBNR b KQkq g3 0 2",
                                "Qh4",
                                "BEGINNER", 10
                        ),
                        createChallenge(
                                "Scholar's Mate Defense",
                                "Defend against the Scholar's Mate and counter-attack",
                                "r1bqk2r/pppp1ppp/2n2n2/2b1p3/2B1P3/2N2N2/PPPP1PPP/R1BQK2R w KQkq - 4 4",
                                "d3 d6 Bg5",
                                "BEGINNER", 15
                        ),
                        createChallenge(
                                "Pin and Win",
                                "Use a pin to win material in 3 moves",
                                "r3k2r/ppp2ppp/2n1bn2/3pp3/1b1PP3/2N1BN2/PPP2PPP/R2QKB1R w KQkq - 0 8",
                                "Bb5 Bd7 Bxc6",
                                "INTERMEDIATE", 20
                        ),
                        createChallenge(
                                "Back Rank Checkmate",
                                "Exploit the back rank weakness for checkmate",
                                "6k1/5ppp/8/8/8/8/5PPP/3R2K1 w - - 0 1",
                                "Rd8",
                                "INTERMEDIATE", 25
                        ),
                        createChallenge(
                                "Smothered Mate",
                                "Deliver the legendary smothered mate with the knight",
                                "6rk/6pp/7N/8/8/8/8/7K w - - 0 1",
                                "Nf7 Rxf7 -- Ng5 -- Qh5",
                                "ADVANCED", 50
                        ),
                        createChallenge(
                                "Windmill Combination",
                                "Execute a windmill to win decisive material",
                                "r4rk1/pp3p1p/2p3p1/4n3/8/2N5/PPP2PPP/R3R1K1 w - - 0 1",
                                "Rxe5 Rf8 Re7 Rf7 Rxf7 Rxf7",
                                "ADVANCED", 60
                        ),
                        createChallenge(
                                "Zwischenzug Tactics",
                                "Find the intermediate move that changes everything",
                                "r1bq1rk1/pp3ppp/2nbpn2/3p4/3P4/2NBPN2/PPQ2PPP/R1B2RK1 w - - 0 1",
                                "Ne5 Nxe5 Nxe5 Nxd4",
                                "ADVANCED", 75
                        ),
                        createChallenge(
                                "Endgame: King & Pawn",
                                "Win this classic king and pawn endgame",
                                "4k3/8/8/8/8/8/4P3/4K3 w - - 0 1",
                                "Ke2 Ke7 Ke3 Ke6 Ke4 Ke7 Ke5 Ke8 Kf6 Kd7 e4 Ke8 e5 Kd8 e6 Ke8 e7 Kf7 Kd7",
                                "BEGINNER", 20
                        )
                );
                challengeRepository.saveAll(challenges);
                System.out.println("✅ Seeded " + challenges.size() + " chess challenges!");
            }
        };
    }

    private Challenge createChallenge(String title, String desc, String fen, String solution, String difficulty, int points) {
        Challenge c = new Challenge();
        c.setTitle(title);
        c.setDescription(desc);
        c.setFen(fen);
        c.setSolutionMoves(solution);
        c.setDifficulty(difficulty);
        c.setPoints(points);
        c.setActive(true);
        return c;
    }
}
