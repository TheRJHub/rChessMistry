package com.therjhub.rchessmistry.repository;

import com.therjhub.rchessmistry.model.GameRecord;
import com.therjhub.rchessmistry.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface GameRecordRepository extends JpaRepository<GameRecord, Long> {
    List<GameRecord> findByUserOrderByPlayedAtDesc(User user);
    List<GameRecord> findByUserIdOrderByPlayedAtDesc(Long userId);
    int countByUser(User user);
}
