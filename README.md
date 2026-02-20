🏗️ Project Structure & Technical Details

1. Architecture Overview
The system follows a modern Client-Server Architecture bundled into a single desktop installation:

Backend (Core): A Spring Boot REST API that handles business logic, data persistence, and security.
Frontend (UI): A responsive web interface built with Vanilla JavaScript, HTML5, and CSS3, providing a fast and lightweight user experience.
Desktop Layer: Electron acts as the cross-platform wrapper, managing the lifecycle of the backend service and providing native desktop features.

2. Technical Breakdown
   
Spring Boot 3.1.5: Utilized for building a scalable and maintainable backend.
Cross-Platform Packaging: Bundled with a private JRE and the backend JAR using electron-builder, ensuring Zero-Dependency installation for the end-user.
Data Layer: Implemented with Spring Data JPA and Hibernate, supporting multiple database engines (SQLite for local storage, MySQL/SQL Server for scalability).
Real-time Validation: Advanced stock validation and financial calculation logic to prevent data entry errors and ensure accurate reporting.

3. Key Modules
   
Dashboard: Real-time visualization of sales metrics, income, and profit trends.
Inventory & Production: Seamless tracking of raw ingredients vs. finished products.
Sales & Analytics: Detailed reporting and transaction management for daily operations.
Shop Management: Centralized control for multiple business locations/outlets.
