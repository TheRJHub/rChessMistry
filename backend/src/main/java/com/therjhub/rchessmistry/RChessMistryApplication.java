package com.therjhub.rchessmistry;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

@SpringBootApplication
public class RChessMistryApplication {
    public static void main(String[] args) {
        SpringApplication.run(RChessMistryApplication.class, args);
        System.out.println("♟️  rChessMistry API is running — by TheRJHub");
        System.out.println("📡 API available at: http://localhost:8080/api");
        System.out.println("🗃️  H2 Console: http://localhost:8080/h2-console");
    }
}
