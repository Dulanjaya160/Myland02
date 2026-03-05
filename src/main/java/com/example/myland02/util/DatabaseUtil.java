package com.example.myland02.util;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Component;

@Component
public class DatabaseUtil {
    
    @Autowired
    private JdbcTemplate jdbcTemplate;
    
    /**
     * Reset the auto-increment sequence for a table
     * Useful after deleting records in SQLite
     */
    public void resetSequence(String tableName) {
        try {
            // Get the maximum ID from the table
            String maxIdQuery = "SELECT COALESCE(MAX(id), 0) FROM " + tableName;
            Integer maxId = jdbcTemplate.queryForObject(maxIdQuery, Integer.class);
            
            // Update the sqlite_sequence table
            String updateSeqQuery = "UPDATE sqlite_sequence SET seq = ? WHERE name = ?";
            int rowsAffected = jdbcTemplate.update(updateSeqQuery, maxId, tableName);
            
            if (rowsAffected == 0) {
                // If no row was updated, insert a new one
                String insertSeqQuery = "INSERT INTO sqlite_sequence (name, seq) VALUES (?, ?)";
                jdbcTemplate.update(insertSeqQuery, tableName, maxId);
            }
            
            System.out.println("Reset sequence for " + tableName + " to " + maxId);
        } catch (Exception e) {
            System.err.println("Error resetting sequence for " + tableName + ": " + e.getMessage());
        }
    }
    
    /**
     * Enable foreign key constraints in SQLite
     */
    public void enableForeignKeys() {
        try {
            jdbcTemplate.execute("PRAGMA foreign_keys = ON");
            System.out.println("Foreign keys enabled");
        } catch (Exception e) {
            System.err.println("Error enabling foreign keys: " + e.getMessage());
        }
    }
}
