package com.therjhub.rchessmistry.model;

import jakarta.persistence.*;

@Entity
@Table(name = "challenges")
public class Challenge {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String title;

    @Column(columnDefinition = "TEXT")
    private String description;

    @Column(nullable = false)
    private String fen;

    @Column(name = "solution_moves")
    private String solutionMoves;

    @Column
    private String difficulty;

    @Column
    private int points = 10;

    @Column
    private boolean active = true;

    // ========== GETTERS ==========
    public Long getId() { return id; }
    public String getTitle() { return title; }
    public String getDescription() { return description; }
    public String getFen() { return fen; }
    public String getSolutionMoves() { return solutionMoves; }
    public String getDifficulty() { return difficulty; }
    public int getPoints() { return points; }
    public boolean isActive() { return active; }

    // ========== SETTERS ==========
    public void setId(Long id) { this.id = id; }
    public void setTitle(String title) { this.title = title; }
    public void setDescription(String description) { this.description = description; }
    public void setFen(String fen) { this.fen = fen; }
    public void setSolutionMoves(String solutionMoves) { this.solutionMoves = solutionMoves; }
    public void setDifficulty(String difficulty) { this.difficulty = difficulty; }
    public void setPoints(int points) { this.points = points; }
    public void setActive(boolean active) { this.active = active; }
}
