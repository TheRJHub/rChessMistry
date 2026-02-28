package com.therjhub.rchessmistry.repository;

import com.therjhub.rchessmistry.model.Challenge;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface ChallengeRepository extends JpaRepository<Challenge, Long> {
    List<Challenge> findByActiveTrue();
    List<Challenge> findByDifficultyAndActiveTrue(String difficulty);
}
