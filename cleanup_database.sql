-- =====================================================
-- Database Cleanup Script for Myland Food Management
-- =====================================================
-- Run this script FIRST to clean up existing tables and constraints
-- Then run the main schema creation script

USE your_database_name;  -- Replace with your actual database name
GO

PRINT 'Starting database cleanup...'

-- Method 1: Drop all foreign key constraints first
DECLARE @sql NVARCHAR(MAX) = ''

-- Get all foreign key constraints and build DROP statements
-- This query looks for constraints that reference our target tables
SELECT @sql = @sql + 
    'ALTER TABLE ' + QUOTENAME(SCHEMA_NAME(fk.schema_id)) + '.' + QUOTENAME(OBJECT_NAME(fk.parent_object_id)) + 
    ' DROP CONSTRAINT ' + QUOTENAME(fk.name) + ';' + CHAR(13)
FROM sys.foreign_keys fk
INNER JOIN sys.tables t ON fk.referenced_object_id = t.object_id
WHERE t.name IN ('sale', 'production_ingredient', 'product_ingredient', 'production', 'shop', 'ingredient', 'product')
   OR OBJECT_NAME(fk.parent_object_id) IN ('sale', 'production_ingredient', 'product_ingredient', 'production', 'shop', 'ingredient', 'product')

-- Also get constraints that reference our tables
SELECT @sql = @sql + 
    'ALTER TABLE ' + QUOTENAME(SCHEMA_NAME(fk.schema_id)) + '.' + QUOTENAME(OBJECT_NAME(fk.parent_object_id)) + 
    ' DROP CONSTRAINT ' + QUOTENAME(fk.name) + ';' + CHAR(13)
FROM sys.foreign_keys fk
WHERE OBJECT_NAME(fk.parent_object_id) IN ('sale', 'production_ingredient', 'product_ingredient', 'production', 'shop', 'ingredient', 'product')

-- Execute the DROP CONSTRAINT statements
IF @sql <> ''
BEGIN
    PRINT 'Dropping foreign key constraints...'
    PRINT @sql
    EXEC sp_executesql @sql
END
ELSE
BEGIN
    PRINT 'No foreign key constraints found to drop.'
END
GO

-- Method 2: Force drop with CASCADE (if supported)
PRINT 'Attempting to drop tables with CASCADE...'
BEGIN TRY
    DROP TABLE IF EXISTS sale CASCADE;
    DROP TABLE IF EXISTS production_ingredient CASCADE;
    DROP TABLE IF EXISTS product_ingredient CASCADE;
    DROP TABLE IF EXISTS production CASCADE;
    DROP TABLE IF EXISTS shop CASCADE;
    DROP TABLE IF EXISTS ingredient CASCADE;
    DROP TABLE IF EXISTS product CASCADE;
    PRINT 'Tables dropped successfully with CASCADE.'
END TRY
BEGIN CATCH
    PRINT 'CASCADE not supported, continuing with individual drops...'
END CATCH
GO

-- Method 2: Drop tables (should work now that constraints are gone)
PRINT 'Dropping tables...'

IF OBJECT_ID('sale', 'U') IS NOT NULL 
BEGIN
    PRINT 'Dropping table: sale'
    DROP TABLE sale
END
ELSE
BEGIN
    PRINT 'Table sale does not exist'
END
GO

IF OBJECT_ID('production_ingredient', 'U') IS NOT NULL 
BEGIN
    PRINT 'Dropping table: production_ingredient'
    DROP TABLE production_ingredient
END
ELSE
BEGIN
    PRINT 'Table production_ingredient does not exist'
END
GO

IF OBJECT_ID('product_ingredient', 'U') IS NOT NULL 
BEGIN
    PRINT 'Dropping table: product_ingredient'
    DROP TABLE product_ingredient
END
ELSE
BEGIN
    PRINT 'Table product_ingredient does not exist'
END
GO

IF OBJECT_ID('production', 'U') IS NOT NULL 
BEGIN
    PRINT 'Dropping table: production'
    DROP TABLE production
END
ELSE
BEGIN
    PRINT 'Table production does not exist'
END
GO

IF OBJECT_ID('shop', 'U') IS NOT NULL 
BEGIN
    PRINT 'Dropping table: shop'
    DROP TABLE shop
END
ELSE
BEGIN
    PRINT 'Table shop does not exist'
END
GO

IF OBJECT_ID('ingredient', 'U') IS NOT NULL 
BEGIN
    PRINT 'Dropping table: ingredient'
    DROP TABLE ingredient
END
ELSE
BEGIN
    PRINT 'Table ingredient does not exist'
END
GO

IF OBJECT_ID('product', 'U') IS NOT NULL 
BEGIN
    PRINT 'Dropping table: product'
    DROP TABLE product
END
ELSE
BEGIN
    PRINT 'Table product does not exist'
END
GO

PRINT 'Database cleanup completed!'
PRINT 'Now you can run the main schema creation script.'
