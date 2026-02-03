# SQL Server Setup Instructions

## 🗄️ **Setting Up Permanent Data Storage**

### **Prerequisites:**
1. SQL Server installed and running
2. Database `myland_food_management` created
3. User with appropriate permissions

### **Step 1: Create Database**
```sql
-- Connect to SQL Server and run:
CREATE DATABASE myland_food_management;
GO
```

### **Step 2: Update Application Configuration**

#### **Option A: Update application.properties**
1. Open `src/main/resources/application.properties`
2. Update the following values:
   - `spring.datasource.password=your_actual_password`
   - `spring.datasource.url=jdbc:sqlserver://localhost:1433;databaseName=myland_food_management;trustServerCertificate=true`

#### **Option B: Use Environment Variables (Recommended)**
Create a `.env` file in your project root:
```
DB_PASSWORD=your_actual_password
DB_URL=jdbc:sqlserver://localhost:1433;databaseName=myland_food_management;trustServerCertificate=true
```

Then update `application.properties`:
```properties
spring.datasource.password=${DB_PASSWORD}
spring.datasource.url=${DB_URL}
```

### **Step 3: Run Database Schema**
1. Open `myland_food_management_sqlserver.sql` in SSMS
2. Select your `myland_food_management` database
3. Execute the entire script
4. This will create all tables, views, and sample data

### **Step 4: Test Connection**
1. Run your Spring Boot application
2. Check the console for successful database connection
3. Access the application at `http://localhost:8080/index.html`

### **Step 5: Verify Data Persistence**
1. Add some data through the web interface
2. Stop the application
3. Start the application again
4. Check that your data is still there

## 🔧 **Configuration Details**

### **Database Settings:**
- **URL**: `jdbc:sqlserver://localhost:1433;databaseName=myland_food_management;trustServerCertificate=true`
- **Driver**: `com.microsoft.sqlserver.jdbc.SQLServerDriver`
- **Dialect**: `org.hibernate.dialect.SQLServerDialect`
- **DDL Mode**: `update` (preserves existing data)

### **Security Notes:**
- Replace `your_password_here` with your actual SQL Server password
- Consider using Windows Authentication for better security
- Use environment variables for sensitive configuration

### **Troubleshooting:**
- **Connection Failed**: Check SQL Server is running and accessible
- **Authentication Error**: Verify username/password
- **Database Not Found**: Ensure database exists and is accessible
- **Port Issues**: Default SQL Server port is 1433

## ✅ **Benefits of SQL Server:**
- ✅ **Permanent Data Storage** - Data survives application restarts
- ✅ **Production Ready** - Scalable and reliable
- ✅ **Advanced Features** - Stored procedures, triggers, views
- ✅ **Backup & Recovery** - Full database backup capabilities
- ✅ **Performance** - Optimized for large datasets
