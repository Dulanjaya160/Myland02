import java.sql.*;
import java.nio.file.*;

public class DbDiag {
    public static void main(String[] args) {
        String home = System.getProperty("user.home");
        String dbPath = home + "/.myland/myland.db";
        String url = "jdbc:sqlite:" + dbPath.replace("\\", "/");

        try {
            Class.forName("org.sqlite.JDBC");
            try (Connection conn = DriverManager.getConnection(url)) {
                System.out.println("Connected to: " + dbPath);
                DatabaseMetaData meta = conn.getMetaData();

                System.out.println("\nColumns in 'sales' table:");
                ResultSet rs = meta.getColumns(null, null, "sales", null);
                boolean foundTable = false;
                while (rs.next()) {
                    foundTable = true;
                    System.out.println("- " + rs.getString("COLUMN_NAME") + " (" + rs.getString("TYPE_NAME") + ")");
                }

                if (!foundTable) {
                    System.out.println("Table 'sales' NOT FOUND!");
                    ResultSet tables = meta.getTables(null, null, null, new String[] { "TABLE" });
                    System.out.println("\nFound tables:");
                    while (tables.next()) {
                        System.out.println("- " + tables.getString("TABLE_NAME"));
                    }
                } else {
                    System.out.println("\nSample data from 'sales':");
                    Statement stmt = conn.createStatement();
                    ResultSet data = stmt.executeQuery("SELECT * FROM sales LIMIT 5");
                    ResultSetMetaData dataMeta = data.getMetaData();
                    int cols = dataMeta.getColumnCount();

                    while (data.next()) {
                        StringBuilder row = new StringBuilder("| ");
                        for (int i = 1; i <= cols; i++) {
                            row.append(dataMeta.getColumnName(i)).append(": ").append(data.getString(i)).append(" | ");
                        }
                        System.out.println(row);
                    }
                }
            }
        } catch (Exception e) {
            e.printStackTrace();
        }
    }
}
