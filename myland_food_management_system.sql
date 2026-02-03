-- =====================================================
-- Myland Food Management System - Complete SQL Schema
-- =====================================================
-- This script creates the complete database schema for the food management system
-- Compatible with H2, MySQL, PostgreSQL, and SQL Server databases

-- =====================================================
-- 1. DROP EXISTING TABLES (if they exist)
-- =====================================================
DROP TABLE IF EXISTS sale CASCADE;
DROP TABLE IF EXISTS production_ingredient CASCADE;
DROP TABLE IF EXISTS production CASCADE;
DROP TABLE IF EXISTS product_ingredient CASCADE;
DROP TABLE IF EXISTS shop CASCADE;
DROP TABLE IF EXISTS ingredient CASCADE;
DROP TABLE IF EXISTS product CASCADE;

-- =====================================================
-- 2. CREATE MAIN ENTITY TABLES
-- =====================================================

-- Products Table
CREATE TABLE product (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    price DOUBLE NOT NULL,
    selling_price DOUBLE NOT NULL,
    product_cost DOUBLE NOT NULL,
    storage_quantity INTEGER NOT NULL DEFAULT 0
);

-- Ingredients Table
CREATE TABLE ingredient (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    ingredient_type VARCHAR(255),
    quantity DOUBLE NOT NULL DEFAULT 0.0,
    price_per_unit DOUBLE NOT NULL DEFAULT 0.0
);

-- Shops Table
CREATE TABLE shop (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    address VARCHAR(255),
    contact_number VARCHAR(255),
    email VARCHAR(255)
);

-- =====================================================
-- 3. CREATE RELATIONSHIP TABLES
-- =====================================================

-- Product-Ingredient Relationship Table
CREATE TABLE product_ingredient (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    product_id BIGINT NOT NULL,
    ingredient_id BIGINT NOT NULL,
    amount_required DOUBLE NOT NULL,
    FOREIGN KEY (product_id) REFERENCES product(id) ON DELETE CASCADE,
    FOREIGN KEY (ingredient_id) REFERENCES ingredient(id) ON DELETE CASCADE
);

-- Production Table
CREATE TABLE production (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    date DATE,
    product_id BIGINT NOT NULL,
    produced_units INTEGER NOT NULL,
    FOREIGN KEY (product_id) REFERENCES product(id) ON DELETE CASCADE
);

-- Production-Ingredient Usage Table
CREATE TABLE production_ingredient (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    production_id BIGINT NOT NULL,
    ingredient_id BIGINT NOT NULL,
    quantity_used DOUBLE NOT NULL,
    FOREIGN KEY (production_id) REFERENCES production(id) ON DELETE CASCADE,
    FOREIGN KEY (ingredient_id) REFERENCES ingredient(id) ON DELETE CASCADE
);

-- Sales Table
CREATE TABLE sale (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    date DATE,
    product_id BIGINT NOT NULL,
    shop_id BIGINT NOT NULL,
    sold_units INTEGER NOT NULL,
    returned_units INTEGER NOT NULL DEFAULT 0,
    FOREIGN KEY (product_id) REFERENCES product(id) ON DELETE CASCADE,
    FOREIGN KEY (shop_id) REFERENCES shop(id) ON DELETE CASCADE
);

-- =====================================================
-- 4. CREATE INDEXES FOR PERFORMANCE
-- =====================================================

-- Product indexes
CREATE INDEX idx_product_name ON product(name);
CREATE INDEX idx_product_selling_price ON product(selling_price);

-- Ingredient indexes
CREATE INDEX idx_ingredient_name ON ingredient(name);
CREATE INDEX idx_ingredient_type ON ingredient(ingredient_type);

-- Shop indexes
CREATE INDEX idx_shop_name ON shop(name);
CREATE INDEX idx_shop_email ON shop(email);

-- Production indexes
CREATE INDEX idx_production_date ON production(date);
CREATE INDEX idx_production_product ON production(product_id);

-- Sales indexes
CREATE INDEX idx_sale_date ON sale(date);
CREATE INDEX idx_sale_product ON sale(product_id);
CREATE INDEX idx_sale_shop ON sale(shop_id);

-- =====================================================
-- 5. INSERT SAMPLE DATA
-- =====================================================

-- Insert sample ingredients
INSERT INTO ingredient (name, ingredient_type, quantity, price_per_unit) VALUES
('Flour', 'KG', 100.0, 2.50),
('Sugar', 'KG', 50.0, 3.00),
('Eggs', 'Pieces', 200.0, 0.30),
('Butter', 'KG', 25.0, 8.00),
('Milk', 'Liters', 30.0, 1.20),
('Salt', 'Grams', 1000.0, 0.01),
('Yeast', 'Grams', 500.0, 0.05),
('Vanilla Extract', 'ML', 100.0, 0.15),
('Chocolate Chips', 'KG', 15.0, 12.00),
('Baking Powder', 'Grams', 200.0, 0.08);

-- Insert sample products
INSERT INTO product (name, price, selling_price, product_cost, storage_quantity) VALUES
('Chocolate Cake', 15.00, 25.00, 8.50, 0),
('Vanilla Cupcakes', 2.50, 4.00, 1.20, 0),
('Bread Loaf', 3.00, 5.00, 1.80, 0),
('Cookies (Pack of 12)', 8.00, 12.00, 4.50, 0),
('Muffins (Pack of 6)', 6.00, 9.00, 3.20, 0);

-- Insert sample shops
INSERT INTO shop (name, address, contact_number, email) VALUES
('Downtown Bakery', '123 Main Street, Downtown', '+1-555-0101', 'downtown@bakery.com'),
('Mall Food Court', '456 Shopping Mall, City Center', '+1-555-0102', 'mall@foodcourt.com'),
('University Cafe', '789 University Ave, Campus', '+1-555-0103', 'cafe@university.edu'),
('Airport Kiosk', 'Terminal 1, Airport Plaza', '+1-555-0104', 'airport@bakery.com'),
('Hospital Cafeteria', '321 Medical Center, Health District', '+1-555-0105', 'hospital@food.com');

-- Insert product-ingredient relationships
INSERT INTO product_ingredient (product_id, ingredient_id, amount_required) VALUES
-- Chocolate Cake ingredients
(1, 1, 2.0),  -- 2 KG Flour
(1, 2, 1.5),  -- 1.5 KG Sugar
(1, 3, 4.0),  -- 4 Eggs
(1, 4, 0.5),  -- 0.5 KG Butter
(1, 5, 1.0),  -- 1 Liter Milk
(1, 6, 10.0), -- 10 Grams Salt
(1, 7, 15.0), -- 15 Grams Yeast
(1, 8, 5.0),  -- 5 ML Vanilla
(1, 9, 0.3),  -- 0.3 KG Chocolate Chips

-- Vanilla Cupcakes ingredients
(2, 1, 1.0),  -- 1 KG Flour
(2, 2, 0.8),  -- 0.8 KG Sugar
(2, 3, 2.0),  -- 2 Eggs
(2, 4, 0.3),  -- 0.3 KG Butter
(2, 5, 0.5),  -- 0.5 Liter Milk
(2, 6, 5.0),  -- 5 Grams Salt
(2, 7, 8.0),  -- 8 Grams Yeast
(2, 8, 3.0),  -- 3 ML Vanilla

-- Bread Loaf ingredients
(3, 1, 3.0),  -- 3 KG Flour
(3, 2, 0.5),  -- 0.5 KG Sugar
(3, 3, 1.0),  -- 1 Egg
(3, 4, 0.2),  -- 0.2 KG Butter
(3, 5, 1.5),  -- 1.5 Liter Milk
(3, 6, 15.0), -- 15 Grams Salt
(3, 7, 20.0), -- 20 Grams Yeast

-- Cookies ingredients
(4, 1, 1.5),  -- 1.5 KG Flour
(4, 2, 1.0),  -- 1 KG Sugar
(4, 3, 2.0),  -- 2 Eggs
(4, 4, 0.8),  -- 0.8 KG Butter
(4, 6, 8.0),  -- 8 Grams Salt
(4, 8, 2.0),  -- 2 ML Vanilla
(4, 9, 0.5),  -- 0.5 KG Chocolate Chips

-- Muffins ingredients
(5, 1, 1.2),  -- 1.2 KG Flour
(5, 2, 0.6),  -- 0.6 KG Sugar
(5, 3, 3.0),  -- 3 Eggs
(5, 4, 0.4),  -- 0.4 KG Butter
(5, 5, 0.8),  -- 0.8 Liter Milk
(5, 6, 6.0),  -- 6 Grams Salt
(5, 7, 10.0), -- 10 Grams Yeast
(5, 8, 4.0);  -- 4 ML Vanilla

-- =====================================================
-- 6. CREATE USEFUL VIEWS
-- =====================================================

-- View for product inventory with calculated values
CREATE VIEW product_inventory AS
SELECT 
    p.id,
    p.name,
    p.selling_price,
    p.product_cost,
    p.storage_quantity,
    (p.selling_price - p.product_cost) AS profit_per_unit,
    ((p.selling_price - p.product_cost) / p.selling_price * 100) AS profit_margin_percent
FROM product p;

-- View for ingredient inventory with calculated values
CREATE VIEW ingredient_inventory AS
SELECT 
    i.id,
    i.name,
    i.ingredient_type,
    i.quantity,
    i.price_per_unit,
    (i.quantity * i.price_per_unit) AS total_value
FROM ingredient i;

-- View for sales summary with calculated income and profit
CREATE VIEW sales_summary AS
SELECT 
    s.id,
    s.date,
    p.name AS product_name,
    sh.name AS shop_name,
    s.sold_units,
    s.returned_units,
    (p.selling_price * s.sold_units) AS income,
    ((p.selling_price - p.product_cost) * s.sold_units) AS profit,
    CASE 
        WHEN s.sold_units > 0 THEN (s.returned_units * 100.0 / s.sold_units)
        ELSE 0 
    END AS return_rate_percent
FROM sale s
JOIN product p ON s.product_id = p.id
JOIN shop sh ON s.shop_id = sh.id;

-- View for production summary
CREATE VIEW production_summary AS
SELECT 
    pr.id,
    pr.date,
    p.name AS product_name,
    pr.produced_units,
    COUNT(pi.id) AS ingredients_used_count
FROM production pr
JOIN product p ON pr.product_id = p.id
LEFT JOIN production_ingredient pi ON pr.id = pi.production_id
GROUP BY pr.id, pr.date, p.name, pr.produced_units;

-- =====================================================
-- 7. CREATE STORED PROCEDURES (if supported by database)
-- =====================================================

-- Procedure to calculate product storage levels
-- Note: This is a simplified version. Actual implementation depends on database type
CREATE OR REPLACE FUNCTION calculate_product_storage(p_product_id BIGINT)
RETURNS INTEGER
LANGUAGE SQL
READS SQL DATA
RETURN (
    SELECT COALESCE(
        (SELECT SUM(produced_units) FROM production WHERE product_id = p_product_id), 0
    ) - COALESCE(
        (SELECT SUM(sold_units) FROM sale WHERE product_id = p_product_id), 0
    )
);

-- =====================================================
-- 8. CREATE TRIGGERS (if supported by database)
-- =====================================================

-- Trigger to update product storage quantity after production
-- Note: This is a simplified version. Actual implementation depends on database type
CREATE OR REPLACE TRIGGER update_product_storage_after_production
AFTER INSERT ON production
FOR EACH ROW
BEGIN
    UPDATE product 
    SET storage_quantity = storage_quantity + NEW.produced_units
    WHERE id = NEW.product_id;
END;

-- Trigger to update product storage quantity after sale
CREATE OR REPLACE TRIGGER update_product_storage_after_sale
AFTER INSERT ON sale
FOR EACH ROW
BEGIN
    UPDATE product 
    SET storage_quantity = storage_quantity - NEW.sold_units
    WHERE id = NEW.product_id;
END;

-- =====================================================
-- 9. SAMPLE QUERIES FOR TESTING
-- =====================================================

-- Query 1: Get all products with their current stock levels
-- SELECT * FROM product_inventory ORDER BY name;

-- Query 2: Get monthly sales report for a specific month
-- SELECT 
--     shop_name,
--     SUM(sold_units) as total_sold,
--     SUM(returned_units) as total_returned,
--     SUM(income) as total_income,
--     SUM(profit) as total_profit
-- FROM sales_summary 
-- WHERE YEAR(date) = 2024 AND MONTH(date) = 10
-- GROUP BY shop_name;

-- Query 3: Get ingredients that are running low (less than 10 units)
-- SELECT * FROM ingredient_inventory WHERE quantity < 10;

-- Query 4: Get top-selling products
-- SELECT 
--     product_name,
--     SUM(sold_units) as total_sold,
--     SUM(income) as total_revenue
-- FROM sales_summary 
-- GROUP BY product_name 
-- ORDER BY total_sold DESC;

-- Query 5: Get shop performance report
-- SELECT 
--     shop_name,
--     COUNT(*) as total_sales,
--     SUM(sold_units) as total_units_sold,
--     SUM(income) as total_revenue,
--     AVG(return_rate_percent) as avg_return_rate
-- FROM sales_summary 
-- GROUP BY shop_name 
-- ORDER BY total_revenue DESC;

-- =====================================================
-- 10. GRANT PERMISSIONS (if using multi-user database)
-- =====================================================

-- Example for MySQL/PostgreSQL:
-- GRANT SELECT, INSERT, UPDATE, DELETE ON ALL TABLES TO 'food_manager'@'localhost';
-- GRANT SELECT ON ALL VIEWS TO 'food_manager'@'localhost';

-- =====================================================
-- END OF SCRIPT
-- =====================================================

-- To run this script:
-- 1. For H2 Database: Execute in H2 Console or via JDBC
-- 2. For MySQL: mysql -u username -p database_name < myland_food_management_system.sql
-- 3. For PostgreSQL: psql -U username -d database_name -f myland_food_management_system.sql
-- 4. For SQL Server: sqlcmd -S server -d database -i myland_food_management_system.sql
