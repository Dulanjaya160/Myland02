-- =====================================================
-- FORCE Database Cleanup Script
-- =====================================================
-- This script will force drop all tables and constraints
-- Run this if the regular cleanup doesn't work

USE your_database_name;  -- Replace with your actual database name
GO

PRINT 'Starting FORCE database cleanup...'

-- Method 1: Find and display all foreign key constraints
PRINT '=== FINDING ALL FOREIGN KEY CONSTRAINTS ==='
SELECT 
    'Table: ' + OBJECT_NAME(parent_object_id) + 
    ', Constraint: ' + name + 
    ', References: ' + OBJECT_NAME(referenced_object_id) as ConstraintInfo
FROM sys.foreign_keys
WHERE OBJECT_NAME(parent_object_id) IN ('sale', 'production_ingredient', 'product_ingredient', 'production', 'shop', 'ingredient', 'product')
   OR OBJECT_NAME(referenced_object_id) IN ('sale', 'production_ingredient', 'product_ingredient', 'production', 'shop', 'ingredient', 'product')
GO

-- Method 2: Drop constraints using a cursor (more reliable)
PRINT '=== DROPPING FOREIGN KEY CONSTRAINTS ==='
DECLARE @constraint_name NVARCHAR(128)
DECLARE @table_name NVARCHAR(128)
DECLARE @sql NVARCHAR(MAX)

DECLARE constraint_cursor CURSOR FOR
SELECT 
    fk.name as constraint_name,
    OBJECT_NAME(fk.parent_object_id) as table_name
FROM sys.foreign_keys fk
WHERE OBJECT_NAME(fk.parent_object_id) IN ('sale', 'production_ingredient', 'product_ingredient', 'production', 'shop', 'ingredient', 'product')
   OR OBJECT_NAME(fk.referenced_object_id) IN ('sale', 'production_ingredient', 'product_ingredient', 'production', 'shop', 'ingredient', 'product')

OPEN constraint_cursor
FETCH NEXT FROM constraint_cursor INTO @constraint_name, @table_name

WHILE @@FETCH_STATUS = 0
BEGIN
    SET @sql = 'ALTER TABLE ' + QUOTENAME(@table_name) + ' DROP CONSTRAINT ' + QUOTENAME(@constraint_name)
    PRINT 'Executing: ' + @sql
    
    BEGIN TRY
        EXEC sp_executesql @sql
        PRINT 'SUCCESS: Dropped constraint ' + @constraint_name + ' from table ' + @table_name
    END TRY
    BEGIN CATCH
        PRINT 'ERROR: Could not drop constraint ' + @constraint_name + ' from table ' + @table_name + ' - ' + ERROR_MESSAGE()
    END CATCH
    
    FETCH NEXT FROM constraint_cursor INTO @constraint_name, @table_name
END

CLOSE constraint_cursor
DEALLOCATE constraint_cursor
GO

-- Method 3: Force drop tables (ignore errors)
PRINT '=== FORCE DROPPING TABLES ==='

-- Drop tables one by one with error handling
BEGIN TRY
    DROP TABLE sale
    PRINT 'SUCCESS: Dropped table sale'
END TRY
BEGIN CATCH
    PRINT 'ERROR: Could not drop table sale - ' + ERROR_MESSAGE()
END CATCH
GO

BEGIN TRY
    DROP TABLE production_ingredient
    PRINT 'SUCCESS: Dropped table production_ingredient'
END TRY
BEGIN CATCH
    PRINT 'ERROR: Could not drop table production_ingredient - ' + ERROR_MESSAGE()
END CATCH
GO

BEGIN TRY
    DROP TABLE product_ingredient
    PRINT 'SUCCESS: Dropped table product_ingredient'
END TRY
BEGIN CATCH
    PRINT 'ERROR: Could not drop table product_ingredient - ' + ERROR_MESSAGE()
END CATCH
GO

BEGIN TRY
    DROP TABLE production
    PRINT 'SUCCESS: Dropped table production'
END TRY
BEGIN CATCH
    PRINT 'ERROR: Could not drop table production - ' + ERROR_MESSAGE()
END CATCH
GO

BEGIN TRY
    DROP TABLE shop
    PRINT 'SUCCESS: Dropped table shop'
END TRY
BEGIN CATCH
    PRINT 'ERROR: Could not drop table shop - ' + ERROR_MESSAGE()
END CATCH
GO

BEGIN TRY
    DROP TABLE ingredient
    PRINT 'SUCCESS: Dropped table ingredient'
END TRY
BEGIN CATCH
    PRINT 'ERROR: Could not drop table ingredient - ' + ERROR_MESSAGE()
END CATCH
GO

BEGIN TRY
    DROP TABLE product
    PRINT 'SUCCESS: Dropped table product'
END TRY
BEGIN CATCH
    PRINT 'ERROR: Could not drop table product - ' + ERROR_MESSAGE()
END CATCH
GO

PRINT '=== FORCE CLEANUP COMPLETED ==='
PRINT 'Check the output above to see which tables were successfully dropped.'
PRINT 'If any tables still exist, you may need to manually drop them or check for other dependencies.'
