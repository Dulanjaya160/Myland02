package com.example.myland02;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.ConfigurableApplicationContext;
import org.springframework.jdbc.core.JdbcTemplate;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.Files;
import java.io.File;

@SpringBootApplication
public class Myland02Application {

    public static void main(String[] args) {
        try {
            // Determine database location based on environment
            Path dbPath;
            String userDataDir = System.getProperty("user.data.dir");
            
            if (userDataDir != null && !userDataDir.isEmpty()) {
                // Running from Electron - use the working directory set by Electron
                dbPath = Paths.get(userDataDir, "myland.db").toAbsolutePath();
                System.out.println("Running in Electron mode, using user data directory");
            } else {
                // Running standalone or in development
                String userHome = System.getProperty("user.home");
                Path dbDir = Paths.get(userHome, ".myland");
                Files.createDirectories(dbDir);
                dbPath = dbDir.resolve("myland.db").toAbsolutePath();
                System.out.println("Running in standalone mode");
            }

            // Ensure parent directory exists
            Files.createDirectories(dbPath.getParent());

            // Set the database URL with proper Windows path handling
            String jdbcUrl = "jdbc:sqlite:" + dbPath.toString().replace("\\", "/");
            System.setProperty("spring.datasource.url", jdbcUrl);

            System.out.println("===========================================");
            System.out.println("Myland Backend Starting");
            System.out.println("===========================================");
            System.out.println("Database location: " + dbPath);
            System.out.println("JDBC URL: " + jdbcUrl);
            System.out.println("Working directory: " + new File(".").getAbsolutePath());
            System.out.println("Java version: " + System.getProperty("java.version"));
            System.out.println("===========================================");
            
        } catch (Exception e) {
            System.err.println("===========================================");
            System.err.println("FATAL: Startup initialization failed!");
            System.err.println("===========================================");
            System.err.println("Error: " + e.getMessage());
            e.printStackTrace();
            System.err.println("===========================================");
            System.exit(1);
        }
        
        ConfigurableApplicationContext context = SpringApplication.run(Myland02Application.class, args);
        
        // Enable foreign keys for SQLite after application starts
        try {
            JdbcTemplate jdbcTemplate = context.getBean(JdbcTemplate.class);
            jdbcTemplate.execute("PRAGMA foreign_keys = ON");
            System.out.println("✓ Foreign key constraints enabled");
        } catch (Exception e) {
            System.err.println("Warning: Could not enable foreign keys: " + e.getMessage());
        }
    }
}
