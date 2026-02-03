-- =====================================================
-- Myland Food Management System - MySQL Version
-- =====================================================
-- This script is specifically designed for MySQL Server
-- Use this in MySQL Workbench or SQL Server Management Studio (SSMS)

-- =====================================================
-- 1. CREATE DATABASE (Optional - uncomment if needed)
-- =====================================================
-- CREATE DATABASE IF NOT EXISTS myland_food_management;
-- USE myland_food_management;

-- =====================================================
-- 2. DROP EXISTING TABLES (if they exist)
-- =====================================================
DROP TABLE IF EXISTS sale;
DROP TABLE IF EXISTS production_ingredient;
DROP TABLE IF EXISTS production;
DROP TABLE IF EXISTS product_ingredient;
DROP TABLE IF EXISTS shop;
DROP TABLE IF EXISTS ingredient;
DROP TABLE IF EXISTS product;

-- =====================================================
-- 3. CREATE MAIN ENTITY TABLES
-- =====================================================

-- Products Table
CREATE TABLE product (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    price DECIMAL(10,2) NOT NULL,
    selling_price DECIMAL(10,2) NOT NULL,
    product_cost DECIMAL(10,2) NOT NULL,
    storage_quantity INT NOT NULL DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Ingredients Table
CREATE TABLE ingredient (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    ingredient_type VARCHAR(255),
    quantity DECIMAL(10,2) NOT NULL DEFAULT 0.00,
    price_per_unit DECIMAL(10,2) NOT NULL DEFAULT 0.00,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Shops Table
CREATE TABLE shop (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    address VARCHAR(255),
    contact_number VARCHAR(255),
    email VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- =====================================================
-- 4. CREATE RELATIONSHIP TABLES
-- =====================================================

-- Product-Ingredient Relationship Table
CREATE TABLE product_ingredient (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    product_id BIGINT NOT NULL,
    ingredient_id BIGINT NOT NULL,
    amount_required DECIMAL(10,2) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (product_id) REFERENCES product(id) ON DELETE CASCADE,
    FOREIGN KEY (ingredient_id) REFERENCES ingredient(id) ON DELETE CASCADE
);

-- Production Table
CREATE TABLE production (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    date DATE,
    product_id BIGINT NOT NULL,
    produced_units INT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (product_id) REFERENCES product(id) ON DELETE CASCADE
);

-- Production-Ingredient Usage Table
CREATE TABLE production_ingredient (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    production_id BIGINT NOT NULL,
    ingredient_id BIGINT NOT NULL,
    quantity_used DECIMAL(10,2) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (production_id) REFERENCES production(id) ON DELETE CASCADE,
    FOREIGN KEY (ingredient_id) REFERENCES ingredient(id) ON DELETE CASCADE
);

-- Sales Table
CREATE TABLE sale (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    date DATE,
    product_id BIGINT NOT NULL,
    shop_id BIGINT NOT NULL,
    sold_units INT NOT NULL,
    returned_units INT NOT NULL DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (product_id) REFERENCES product(id) ON DELETE CASCADE,
    FOREIGN KEY (shop_id) REFERENCES shop(id) ON DELETE CASCADE
);

-- =====================================================
-- 5. CREATE INDEXES FOR PERFORMANCE
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
-- 6. INSERT SAMPLE DATA
-- =====================================================

-- Insert sample ingredients
INSERT INTO ingredient (name, ingredient_type, quantity, price_per_unit) VALUES
('Flour', 'KG', 100.00, 2.50),
('Sugar', 'KG', 50.00, 3.00),
('Eggs', 'Pieces', 200.00, 0.30),
('Butter', 'KG', 25.00, 8.00),
('Milk', 'Liters', 30.00, 1.20),
('Salt', 'Grams', 1000.00, 0.01),
('Yeast', 'Grams', 500.00, 0.05),
('Vanilla Extract', 'ML', 100.00, 0.15),
('Chocolate Chips', 'KG', 15.00, 12.00),
('Baking Powder', 'Grams', 200.00, 0.08);

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
(1, 1, 2.00),  -- 2 KG Flour
(1, 2, 1.50),  -- 1.5 KG Sugar
(1, 3, 4.00),  -- 4 Eggs
(1, 4, 0.50),  -- 0.5 KG Butter
(1, 5, 1.00),  -- 1 Liter Milk
(1, 6, 10.00), -- 10 Grams Salt
(1, 7, 15.00), -- 15 Grams Yeast
(1, 8, 5.00),  -- 5 ML Vanilla
(1, 9, 0.30),  -- 0.3 KG Chocolate Chips

-- Vanilla Cupcakes ingredients
(2, 1, 1.00),  -- 1 KG Flour
(2, 2, 0.80),  -- 0.8 KG Sugar
(2, 3, 2.00),  -- 2 Eggs
(2, 4, 0.30),  -- 0.3 KG Butter
(2, 5, 0.50),  -- 0.5 Liter Milk
(2, 6, 5.00),  -- 5 Grams Salt
(2, 7, 8.00),  -- 8 Grams Yeast
(2, 8, 3.00),  -- 3 ML Vanilla

-- Bread Loaf ingredients
(3, 1, 3.00),  -- 3 KG Flour
(3, 2, 0.50),  -- 0.5 KG Sugar
(3, 3, 1.00),  -- 1 Egg
(3, 4, 0.20),  -- 0.2 KG Butter
(3, 5, 1.50),  -- 1.5 Liter Milk
(3, 6, 15.00), -- 15 Grams Salt
(3, 7, 20.00), -- 20 Grams Yeast

-- Cookies ingredients
(4, 1, 1.50),  -- 1.5 KG Flour
(4, 2, 1.00),  -- 1 KG Sugar
(4, 3, 2.00),  -- 2 Eggs
(4, 4, 0.80),  -- 0.8 KG Butter
(4, 6, 8.00),  -- 8 Grams Salt
(4, 8, 2.00),  -- 2 ML Vanilla
(4, 9, 0.50),  -- 0.5 KG Chocolate Chips

-- Muffins ingredients
(5, 1, 1.20),  -- 1.2 KG Flour
(5, 2, 0.60),  -- 0.6 KG Sugar
(5, 3, 3.00),  -- 3 Eggs
(5, 4, 0.40),  -- 0.4 KG Butter
(5, 5, 0.80),  -- 0.8 Liter Milk
(5, 6, 6.00),  -- 6 Grams Salt
(5, 7, 10.00), -- 10 Grams Yeast
(5, 8, 4.00);  -- 4 ML Vanilla

-- =====================================================
-- 7. CREATE USEFUL VIEWS
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
    ROUND(((p.selling_price - p.product_cost) / p.selling_price * 100), 2) AS profit_margin_percent
FROM product p;

-- View for ingredient inventory with calculated values
CREATE VIEW ingredient_inventory AS
SELECT 
    i.id,
    i.name,
    i.ingredient_type,
    i.quantity,
    i.price_per_unit,
    ROUND((i.quantity * i.price_per_unit), 2) AS total_value
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
    ROUND((p.selling_price * s.sold_units), 2) AS income,
    ROUND(((p.selling_price - p.product_cost) * s.sold_units), 2) AS profit,
    CASE 
        WHEN s.sold_units > 0 THEN ROUND((s.returned_units * 100.0 / s.sold_units), 2)
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
-- 8. CREATE STORED PROCEDURES
-- =====================================================

DELIMITER //

-- Procedure to calculate product storage levels
CREATE PROCEDURE CalculateProductStorage(IN p_product_id BIGINT)
BEGIN
    DECLARE total_produced INT DEFAULT 0;
    DECLARE total_sold INT DEFAULT 0;
    DECLARE current_storage INT DEFAULT 0;
    
    -- Calculate total produced
    SELECT COALESCE(SUM(produced_units), 0) INTO total_produced
    FROM production 
    WHERE product_id = p_product_id;
    
    -- Calculate total sold
    SELECT COALESCE(SUM(sold_units), 0) INTO total_sold
    FROM sale 
    WHERE product_id = p_product_id;
    
    -- Calculate current storage
    SET current_storage = total_produced - total_sold;
    
    -- Update product storage quantity
    UPDATE product 
    SET storage_quantity = current_storage
    WHERE id = p_product_id;
    
    -- Return the calculated storage
    SELECT current_storage AS calculated_storage;
END //

-- Procedure to get monthly sales report
CREATE PROCEDURE GetMonthlySalesReport(IN p_year INT, IN p_month INT)
BEGIN
    SELECT 
        sh.name AS shop_name,
        SUM(s.sold_units) as total_sold,
        SUM(s.returned_units) as total_returned,
        ROUND(SUM(p.selling_price * s.sold_units), 2) as total_income,
        ROUND(SUM((p.selling_price - p.product_cost) * s.sold_units), 2) as total_profit,
        ROUND(AVG(CASE 
            WHEN s.sold_units > 0 THEN (s.returned_units * 100.0 / s.sold_units)
            ELSE 0 
        END), 2) as avg_return_rate
    FROM sale s
    JOIN product p ON s.product_id = p.id
    JOIN shop sh ON s.shop_id = sh.id
    WHERE YEAR(s.date) = p_year AND MONTH(s.date) = p_month
    GROUP BY sh.name
    ORDER BY total_income DESC;
END //

DELIMITER ;

-- =====================================================
-- 9. CREATE TRIGGERS
-- =====================================================

-- Trigger to update product storage quantity after production
DELIMITER //
CREATE TRIGGER update_product_storage_after_production
AFTER INSERT ON production
FOR EACH ROW
BEGIN
    UPDATE product 
    SET storage_quantity = storage_quantity + NEW.produced_units
    WHERE id = NEW.product_id;
END //
DELIMITER ;

-- Trigger to update product storage quantity after sale
DELIMITER //
CREATE TRIGGER update_product_storage_after_sale
AFTER INSERT ON sale
FOR EACH ROW
BEGIN
    UPDATE product 
    SET storage_quantity = storage_quantity - NEW.sold_units
    WHERE id = NEW.product_id;
END //
DELIMITER ;

-- =====================================================
-- 10. SAMPLE QUERIES FOR TESTING
-- =====================================================

-- Query 1: Get all products with their current stock levels
-- SELECT * FROM product_inventory ORDER BY name;

-- Query 2: Get monthly sales report for a specific month
-- CALL GetMonthlySalesReport(2024, 10);

-- Query 3: Get ingredients that are running low (less than 10 units)
-- SELECT * FROM ingredient_inventory WHERE quantity < 10;

-- Query 4: Get top-selling products
-- SELECT 
--     product_name,
--     SUM(sold_units) as total_sold,
--     ROUND(SUM(income), 2) as total_revenue
-- FROM sales_summary 
-- GROUP BY product_name 
-- ORDER BY total_sold DESC;

-- Query 5: Get shop performance report
-- SELECT 
--     shop_name,
--     COUNT(*) as total_sales,
--     SUM(sold_units) as total_units_sold,
--     ROUND(SUM(income), 2) as total_revenue,
--     ROUND(AVG(return_rate_percent), 2) as avg_return_rate
-- FROM sales_summary 
-- GROUP BY shop_name 
-- ORDER BY total_revenue DESC;

-- =====================================================
-- END OF MYSQL SCRIPT
-- =====================================================

-- To execute this script in MySQL:
-- 1. Open MySQL Workbench or SSMS
-- 2. Connect to your MySQL server
-- 3. Create a new database: CREATE DATABASE myland_food_management;
-- 4. Use the database: USE myland_food_management;
-- 5. Copy and paste this entire script
-- 6. Execute the script (F5 or Ctrl+Shift+Enter)
