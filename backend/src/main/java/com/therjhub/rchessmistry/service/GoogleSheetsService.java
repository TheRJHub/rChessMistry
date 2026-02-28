package com.therjhub.rchessmistry.service;

import com.google.api.client.googleapis.javanet.GoogleNetHttpTransport;
import com.google.api.client.json.jackson2.JacksonFactory;
import com.google.api.services.sheets.v4.Sheets;
import com.google.api.services.sheets.v4.model.ValueRange;
import com.google.auth.http.HttpCredentialsAdapter;
import com.google.auth.oauth2.GoogleCredentials;
import com.therjhub.rchessmistry.model.User;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.io.Resource;
import org.springframework.stereotype.Service;

import jakarta.annotation.PostConstruct;
import java.io.InputStream;
import java.util.ArrayList;
import java.util.Collections;
import java.util.List;

@Service
public class GoogleSheetsService {

    @Value("${google.sheets.spreadsheet-id}")
    private String spreadsheetId;

    @Value("${google.sheets.credentials-path}")
    private Resource credentialsResource;

    @Value("${google.sheets.sheet-name}")
    private String sheetName;

    private Sheets sheetsService;
    private boolean enabled = false;

    @PostConstruct
    public void init() {
        try {
            if (spreadsheetId.equals("YOUR_SPREADSHEET_ID_HERE")) {
                System.out.println("⚠️  Google Sheets not configured. Skipping sheet sync.");
                return;
            }

            InputStream credentialsStream = credentialsResource.getInputStream();
            GoogleCredentials credentials = GoogleCredentials
                    .fromStream(credentialsStream)
                    .createScoped(Collections.singletonList(
                            "https://www.googleapis.com/auth/spreadsheets"));

            sheetsService = new Sheets.Builder(
                    GoogleNetHttpTransport.newTrustedTransport(),
                    JacksonFactory.getDefaultInstance(),
                    new HttpCredentialsAdapter(credentials))
                    .setApplicationName("rChessMistry-TheRJHub")
                    .build();

            ensureHeaderRow();
            enabled = true;
            System.out.println("✅ Google Sheets connected successfully!");

        } catch (Exception e) {
            System.out.println("⚠️  Google Sheets initialization failed: " + e.getMessage());
        }
    }

    private void ensureHeaderRow() {
        try {
            List<Object> headers = new ArrayList<>();
            headers.add("ID"); headers.add("Username"); headers.add("Display Name");
            headers.add("Wins"); headers.add("Losses"); headers.add("Draws");
            headers.add("Games Played"); headers.add("Best Streak"); headers.add("Device ID");
            headers.add("Device Name"); headers.add("Theme"); headers.add("Joined At");
            headers.add("Last Login"); headers.add("Profile Photo"); headers.add("Total Moves");

            List<List<Object>> rows = new ArrayList<>();
            rows.add(headers);

            ValueRange headerRow = new ValueRange().setValues(rows);
            sheetsService.spreadsheets().values()
                    .update(spreadsheetId, sheetName + "!A1:O1", headerRow)
                    .setValueInputOption("RAW")
                    .execute();
        } catch (Exception e) {
            System.out.println("Could not set header row: " + e.getMessage());
        }
    }

    public void syncUser(User user) {
        if (!enabled) return;
        try {
            List<Object> row = new ArrayList<>();
            row.add(String.valueOf(user.getId()));
            row.add(user.getUsername());
            row.add(user.getDisplayName() != null ? user.getDisplayName() : user.getUsername());
            row.add(String.valueOf(user.getWins()));
            row.add(String.valueOf(user.getLosses()));
            row.add(String.valueOf(user.getDraws()));
            row.add(String.valueOf(user.getGamesPlayed()));
            row.add(String.valueOf(user.getBestStreak()));
            row.add(user.getDeviceId() != null ? user.getDeviceId() : "");
            row.add(user.getDeviceName() != null ? user.getDeviceName() : "");
            row.add(user.getThemePreference());
            row.add(user.getJoinedAt() != null ? user.getJoinedAt().toString() : "");
            row.add(user.getLastLogin() != null ? user.getLastLogin().toString() : "");
            row.add(user.getProfilePhotoUrl() != null ? user.getProfilePhotoUrl() : "");
            row.add(String.valueOf(user.getTotalMoves()));

            List<List<Object>> rows = new ArrayList<>();
            rows.add(row);

            ValueRange body = new ValueRange().setValues(rows);
            sheetsService.spreadsheets().values()
                    .append(spreadsheetId, sheetName + "!A:O", body)
                    .setValueInputOption("RAW")
                    .setInsertDataOption("INSERT_ROWS")
                    .execute();
        } catch (Exception e) {
            System.out.println("Sheet sync failed for user " + user.getUsername() + ": " + e.getMessage());
        }
    }
}
