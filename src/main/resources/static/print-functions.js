// =====================================================
// PRINT FUNCTIONS FOR MYLAND FOOD MANAGEMENT SYSTEM
// =====================================================

// Helper function to print in the same tab without opening new windows
function printInSameTab(printContent) {
    // Create a hidden iframe for printing
    let printFrame = document.getElementById('print-frame');
    if (!printFrame) {
        printFrame = document.createElement('iframe');
        printFrame.id = 'print-frame';
        printFrame.style.position = 'fixed';
        printFrame.style.right = '0';
        printFrame.style.bottom = '0';
        printFrame.style.width = '0';
        printFrame.style.height = '0';
        printFrame.style.border = '0';
        document.body.appendChild(printFrame);
    }
    
    const printDoc = printFrame.contentWindow.document;
    printDoc.open();
    printDoc.write(printContent);
    printDoc.close();
    
    // Wait for content to load, then print
    printFrame.onload = function() {
        setTimeout(() => {
            printFrame.contentWindow.focus();
            printFrame.contentWindow.print();
        }, 250);
    };
}

function printProducts() {
    const printContent = generateProductsPrintContent();
    printInSameTab(printContent);
}

function generateProductsPrintContent() {
    const currentDate = new Date().toLocaleDateString();
    let html = `
        <!DOCTYPE html>
        <html>
        <head>
            <title>Products Report</title>
            <style>
                body { font-family: Arial, sans-serif; margin: 20px; }
                h1 { text-align: center; color: #333; }
                .header { text-align: center; margin-bottom: 20px; }
                .date { text-align: right; margin-bottom: 10px; color: #666; }
                table { width: 100%; border-collapse: collapse; margin-top: 20px; }
                th, td { border: 1px solid #ddd; padding: 8px; text-align: left; }
                th { background-color: #4CAF50; color: white; }
                tr:nth-child(even) { background-color: #f2f2f2; }
                .footer { margin-top: 30px; text-align: center; color: #666; font-size: 12px; }
                @media print {
                    body { margin: 0; }
                    button { display: none; }
                }
            </style>
        </head>
        <body>
            <div class="header">
                <h1>🍕 Myland Food Management System</h1>
                <h2>Products Report</h2>
            </div>
            <div class="date">Date: ${currentDate}</div>
            <table>
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>Name</th>
                        <th>Price</th>
                        <th>Selling Price</th>
                        <th>Product Cost</th>
                        <th>Storage Quantity</th>
                    </tr>
                </thead>
                <tbody>
    `;
    
    products.forEach(product => {
        html += `
            <tr>
                <td>${product.id}</td>
                <td>${product.name}</td>
                <td>$${product.price.toFixed(2)}</td>
                <td>$${product.sellingPrice.toFixed(2)}</td>
                <td>$${product.productCost.toFixed(2)}</td>
                <td>${product.storageQuantity}</td>
            </tr>
        `;
    });
    
    html += `
                </tbody>
            </table>
            <div class="footer">
                <p>Total Products: ${products.length}</p>
                <p>Generated on ${currentDate}</p>
            </div>
        </body>
        </html>
    `;
    return html;
}

function printIngredients() {
    const printContent = generateIngredientsPrintContent();
    printInSameTab(printContent);
}

function generateIngredientsPrintContent() {
    const currentDate = new Date().toLocaleDateString();
    let html = `
        <!DOCTYPE html>
        <html>
        <head>
            <title>Ingredients Report</title>
            <style>
                body { font-family: Arial, sans-serif; margin: 20px; }
                h1 { text-align: center; color: #333; }
                .header { text-align: center; margin-bottom: 20px; }
                .date { text-align: right; margin-bottom: 10px; color: #666; }
                table { width: 100%; border-collapse: collapse; margin-top: 20px; }
                th, td { border: 1px solid #ddd; padding: 8px; text-align: left; }
                th { background-color: #28a745; color: white; }
                tr:nth-child(even) { background-color: #f2f2f2; }
                .low-stock { background-color: #fff3cd !important; }
                .footer { margin-top: 30px; text-align: center; color: #666; font-size: 12px; }
                @media print {
                    body { margin: 0; }
                    button { display: none; }
                }
            </style>
        </head>
        <body>
            <div class="header">
                <h1>🍕 Myland Food Management System</h1>
                <h2>Ingredients Report</h2>
            </div>
            <div class="date">Date: ${currentDate}</div>
            <table>
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>Name</th>
                        <th>Type</th>
                        <th>Quantity</th>
                        <th>Price Per Unit</th>
                        <th>Total Value</th>
                    </tr>
                </thead>
                <tbody>
    `;
    
    let totalValue = 0;
    ingredients.forEach(ingredient => {
        const value = ingredient.quantity * ingredient.pricePerUnit;
        totalValue += value;
        const lowStock = ingredient.quantity < 10 ? 'low-stock' : '';
        html += `
            <tr class="${lowStock}">
                <td>${ingredient.id}</td>
                <td>${ingredient.name}</td>
                <td>${ingredient.ingredientType || 'N/A'}</td>
                <td>${ingredient.quantity}</td>
                <td>$${ingredient.pricePerUnit.toFixed(2)}</td>
                <td>$${value.toFixed(2)}</td>
            </tr>
        `;
    });
    
    html += `
                </tbody>
            </table>
            <div class="footer">
                <p>Total Ingredients: ${ingredients.length}</p>
                <p>Total Inventory Value: $${totalValue.toFixed(2)}</p>
                <p>Generated on ${currentDate}</p>
            </div>
        </body>
        </html>
    `;
    return html;
}

function printProduction() {
    const printContent = generateProductionPrintContent();
    printInSameTab(printContent);
}

function generateProductionPrintContent() {
    const currentDate = new Date().toLocaleDateString();
    let html = `
        <!DOCTYPE html>
        <html>
        <head>
            <title>Production Report</title>
            <style>
                body { font-family: Arial, sans-serif; margin: 20px; }
                h1 { text-align: center; color: #333; }
                .header { text-align: center; margin-bottom: 20px; }
                .date { text-align: right; margin-bottom: 10px; color: #666; }
                table { width: 100%; border-collapse: collapse; margin-top: 20px; }
                th, td { border: 1px solid #ddd; padding: 8px; text-align: left; }
                th { background-color: #007bff; color: white; }
                tr:nth-child(even) { background-color: #f2f2f2; }
                .footer { margin-top: 30px; text-align: center; color: #666; font-size: 12px; }
                .ingredients { font-size: 11px; color: #555; }
                @media print {
                    body { margin: 0; }
                    button { display: none; }
                }
            </style>
        </head>
        <body>
            <div class="header">
                <h1>🍕 Myland Food Management System</h1>
                <h2>Production Report</h2>
            </div>
            <div class="date">Date: ${currentDate}</div>
            <table>
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>Product</th>
                        <th>Date</th>
                        <th>Produced Units</th>
                        <th>Used Ingredients</th>
                    </tr>
                </thead>
                <tbody>
    `;
    
    let totalUnits = 0;
    production.forEach(record => {
        totalUnits += record.producedUnits;
        let ingredientsText = 'None';
        if (record.usedIngredients && record.usedIngredients.length > 0) {
            ingredientsText = record.usedIngredients.map(ui => 
                `${ui.ingredient ? ui.ingredient.name : 'Unknown'}: ${ui.quantityUsed}`
            ).join(', ');
        }
        
        html += `
            <tr>
                <td>${record.id}</td>
                <td>${record.product ? record.product.name : 'N/A'}</td>
                <td>${record.date}</td>
                <td>${record.producedUnits}</td>
                <td class="ingredients">${ingredientsText}</td>
            </tr>
        `;
    });
    
    html += `
                </tbody>
            </table>
            <div class="footer">
                <p>Total Production Records: ${production.length}</p>
                <p>Total Units Produced: ${totalUnits}</p>
                <p>Generated on ${currentDate}</p>
            </div>
        </body>
        </html>
    `;
    return html;
}

function printSales() {
    const printContent = generateSalesPrintContent();
    printInSameTab(printContent);
}

function generateSalesPrintContent() {
    const currentDate = new Date().toLocaleDateString();
    let html = `
        <!DOCTYPE html>
        <html>
        <head>
            <title>Sales Report</title>
            <style>
                body { font-family: Arial, sans-serif; margin: 20px; }
                h1 { text-align: center; color: #333; }
                .header { text-align: center; margin-bottom: 20px; }
                .date { text-align: right; margin-bottom: 10px; color: #666; }
                table { width: 100%; border-collapse: collapse; margin-top: 20px; }
                th, td { border: 1px solid #ddd; padding: 8px; text-align: left; }
                th { background-color: #ffc107; color: white; }
                tr:nth-child(even) { background-color: #f2f2f2; }
                .footer { margin-top: 30px; text-align: center; color: #666; font-size: 12px; }
                @media print {
                    body { margin: 0; }
                    button { display: none; }
                }
            </style>
        </head>
        <body>
            <div class="header">
                <h1>🍕 Myland Food Management System</h1>
                <h2>Sales Report</h2>
            </div>
            <div class="date">Date: ${currentDate}</div>
            <table>
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>Product</th>
                        <th>Shop</th>
                        <th>Date</th>
                        <th>Sold Units</th>
                        <th>Returned Units</th>
                    </tr>
                </thead>
                <tbody>
    `;
    
    let totalSold = 0;
    let totalReturned = 0;
    sales.forEach(sale => {
        totalSold += sale.soldUnits;
        totalReturned += sale.returnedUnits;
        html += `
            <tr>
                <td>${sale.id}</td>
                <td>${sale.product ? sale.product.name : 'N/A'}</td>
                <td>${sale.shop ? sale.shop.name : 'N/A'}</td>
                <td>${sale.date}</td>
                <td>${sale.soldUnits}</td>
                <td>${sale.returnedUnits}</td>
            </tr>
        `;
    });
    
    html += `
                </tbody>
            </table>
            <div class="footer">
                <p>Total Sales Records: ${sales.length}</p>
                <p>Total Units Sold: ${totalSold} | Total Units Returned: ${totalReturned}</p>
                <p>Generated on ${currentDate}</p>
            </div>
        </body>
        </html>
    `;
    return html;
}

function printShops() {
    const printContent = generateShopsPrintContent();
    printInSameTab(printContent);
}

function generateShopsPrintContent() {
    const currentDate = new Date().toLocaleDateString();
    let html = `
        <!DOCTYPE html>
        <html>
        <head>
            <title>Shops Report</title>
            <style>
                body { font-family: Arial, sans-serif; margin: 20px; }
                h1 { text-align: center; color: #333; }
                .header { text-align: center; margin-bottom: 20px; }
                .date { text-align: right; margin-bottom: 10px; color: #666; }
                table { width: 100%; border-collapse: collapse; margin-top: 20px; }
                th, td { border: 1px solid #ddd; padding: 8px; text-align: left; }
                th { background-color: #17a2b8; color: white; }
                tr:nth-child(even) { background-color: #f2f2f2; }
                .footer { margin-top: 30px; text-align: center; color: #666; font-size: 12px; }
                @media print {
                    body { margin: 0; }
                    button { display: none; }
                }
            </style>
        </head>
        <body>
            <div class="header">
                <h1>🍕 Myland Food Management System</h1>
                <h2>Shops Directory</h2>
            </div>
            <div class="date">Date: ${currentDate}</div>
            <table>
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>Name</th>
                        <th>Address</th>
                        <th>Contact Number</th>
                        <th>Email</th>
                    </tr>
                </thead>
                <tbody>
    `;
    
    shops.forEach(shop => {
        html += `
            <tr>
                <td>${shop.id}</td>
                <td>${shop.name}</td>
                <td>${shop.address || 'N/A'}</td>
                <td>${shop.contactNumber || 'N/A'}</td>
                <td>${shop.email || 'N/A'}</td>
            </tr>
        `;
    });
    
    html += `
                </tbody>
            </table>
            <div class="footer">
                <p>Total Shops: ${shops.length}</p>
                <p>Generated on ${currentDate}</p>
            </div>
        </body>
        </html>
    `;
    return html;
}

function printInventory() {
    const printContent = generateInventoryPrintContent();
    printInSameTab(printContent);
}

function generateInventoryPrintContent() {
    const currentDate = new Date().toLocaleDateString();
    let html = `
        <!DOCTYPE html>
        <html>
        <head>
            <title>Inventory Report</title>
            <style>
                body { font-family: Arial, sans-serif; margin: 20px; }
                h1 { text-align: center; color: #333; }
                .header { text-align: center; margin-bottom: 20px; }
                .date { text-align: right; margin-bottom: 10px; color: #666; }
                h3 { color: #555; margin-top: 30px; border-bottom: 2px solid #333; padding-bottom: 5px; }
                table { width: 100%; border-collapse: collapse; margin-top: 20px; margin-bottom: 30px; }
                th, td { border: 1px solid #ddd; padding: 8px; text-align: left; }
                th { background-color: #6c757d; color: white; }
                tr:nth-child(even) { background-color: #f2f2f2; }
                .footer { margin-top: 30px; text-align: center; color: #666; font-size: 12px; }
                .status-good { color: #28a745; font-weight: bold; }
                .status-low { color: #ffc107; font-weight: bold; }
                .status-critical { color: #dc3545; font-weight: bold; }
                @media print {
                    body { margin: 0; }
                    button { display: none; }
                }
            </style>
        </head>
        <body>
            <div class="header">
                <h1>🍕 Myland Food Management System</h1>
                <h2>Complete Inventory Report</h2>
            </div>
            <div class="date">Date: ${currentDate}</div>
            
            <h3>Product Storage</h3>
            <table>
                <thead>
                    <tr>
                        <th>Product</th>
                        <th>Produced</th>
                        <th>Sold</th>
                        <th>Available</th>
                        <th>Status</th>
                    </tr>
                </thead>
                <tbody>
    `;
    
    // Calculate product storage
    products.forEach(product => {
        const produced = production.filter(p => p.product && p.product.id === product.id)
            .reduce((sum, p) => sum + p.producedUnits, 0);
        const sold = sales.filter(s => s.product && s.product.id === product.id)
            .reduce((sum, s) => sum + s.soldUnits, 0);
        const available = produced - sold;
        
        let status = 'Good';
        let statusClass = 'status-good';
        if (available < 10) {
            status = 'Critical';
            statusClass = 'status-critical';
        } else if (available < 50) {
            status = 'Low';
            statusClass = 'status-low';
        }
        
        html += `
            <tr>
                <td>${product.name}</td>
                <td>${produced}</td>
                <td>${sold}</td>
                <td>${available}</td>
                <td class="${statusClass}">${status}</td>
            </tr>
        `;
    });
    
    html += `
                </tbody>
            </table>
            
            <h3>Ingredient Storage</h3>
            <table>
                <thead>
                    <tr>
                        <th>Ingredient</th>
                        <th>Type</th>
                        <th>Available</th>
                        <th>Status</th>
                    </tr>
                </thead>
                <tbody>
    `;
    
    // Ingredient storage
    ingredients.forEach(ingredient => {
        let status = 'Good';
        let statusClass = 'status-good';
        if (ingredient.quantity < 10) {
            status = 'Critical';
            statusClass = 'status-critical';
        } else if (ingredient.quantity < 50) {
            status = 'Low';
            statusClass = 'status-low';
        }
        
        html += `
            <tr>
                <td>${ingredient.name}</td>
                <td>${ingredient.ingredientType || 'N/A'}</td>
                <td>${ingredient.quantity}</td>
                <td class="${statusClass}">${status}</td>
            </tr>
        `;
    });
    
    html += `
                </tbody>
            </table>
            
            <div class="footer">
                <p>Total Products: ${products.length} | Total Ingredients: ${ingredients.length}</p>
                <p>Generated on ${currentDate}</p>
            </div>
        </body>
        </html>
    `;
    return html;
}

// =====================================================
// SALES REPORTS PRINT FUNCTIONS
// =====================================================

function printMonthlyReport() {
    const reportMonth = document.getElementById('report-month').value;
    if (!reportMonth) {
        alert('Please select a month first!');
        return;
    }
    
    const printContent = generateMonthlyReportPrintContent(reportMonth);
    printInSameTab(printContent);
}

function generateMonthlyReportPrintContent(reportMonth) {
    const currentDate = new Date().toLocaleDateString();
    const monthDate = new Date(reportMonth + '-01');
    const monthName = monthDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
    
    // Get summary data from the page
    const totalSales = document.getElementById('total-sales').textContent;
    const totalReturns = document.getElementById('total-returns').textContent;
    const netProfit = document.getElementById('net-profit').textContent;
    
    // Get table data
    const tbody = document.getElementById('monthly-report-tbody');
    const rows = tbody.querySelectorAll('tr');
    
    let html = `
        <!DOCTYPE html>
        <html>
        <head>
            <title>Monthly Sales Report - ${monthName}</title>
            <style>
                body { font-family: Arial, sans-serif; margin: 20px; }
                h1 { text-align: center; color: #333; }
                .header { text-align: center; margin-bottom: 20px; }
                .date { text-align: right; margin-bottom: 10px; color: #666; }
                .summary { display: flex; justify-content: space-around; margin: 20px 0; padding: 20px; background: #f8f9fa; border-radius: 8px; }
                .summary-item { text-align: center; }
                .summary-item h3 { margin: 0; color: #666; font-size: 14px; }
                .summary-item p { margin: 10px 0 0 0; font-size: 24px; font-weight: bold; color: #333; }
                table { width: 100%; border-collapse: collapse; margin-top: 20px; }
                th, td { border: 1px solid #ddd; padding: 10px; text-align: left; }
                th { background-color: #ffc107; color: white; }
                tr:nth-child(even) { background-color: #f2f2f2; }
                .footer { margin-top: 30px; text-align: center; color: #666; font-size: 12px; }
                @media print {
                    body { margin: 0; }
                    button { display: none; }
                }
            </style>
        </head>
        <body>
            <div class="header">
                <h1>🍕 Myland Food Management System</h1>
                <h2>Monthly Sales Report</h2>
                <h3>${monthName}</h3>
            </div>
            <div class="date">Generated: ${currentDate}</div>
            
            <div class="summary">
                <div class="summary-item">
                    <h3>Total Sales</h3>
                    <p>${totalSales}</p>
                </div>
                <div class="summary-item">
                    <h3>Total Returns</h3>
                    <p>${totalReturns}</p>
                </div>
                <div class="summary-item">
                    <h3>Net Profit</h3>
                    <p>${netProfit}</p>
                </div>
            </div>
            
            <table>
                <thead>
                    <tr>
                        <th>Shop Name</th>
                        <th>Total Sold Units</th>
                        <th>Total Returned Units</th>
                        <th>Total Income</th>
                        <th>Total Profit</th>
                        <th>Return Rate (%)</th>
                    </tr>
                </thead>
                <tbody>
    `;
    
    if (rows.length === 0) {
        html += '<tr><td colspan="6" style="text-align: center;">No data available for this month</td></tr>';
    } else {
        rows.forEach(row => {
            const cells = row.querySelectorAll('td');
            if (cells.length > 0) {
                html += '<tr>';
                cells.forEach(cell => {
                    html += `<td>${cell.textContent}</td>`;
                });
                html += '</tr>';
            }
        });
    }
    
    html += `
                </tbody>
            </table>
            
            <div class="footer">
                <p>Monthly Sales Report for ${monthName}</p>
                <p>Generated on ${currentDate}</p>
            </div>
        </body>
        </html>
    `;
    return html;
}

function printDailyReport() {
    const reportDate = document.getElementById('report-date').value;
    if (!reportDate) {
        alert('Please select a date first!');
        return;
    }
    
    const printContent = generateDailyReportPrintContent(reportDate);
    printInSameTab(printContent);
}

function generateDailyReportPrintContent(reportDate) {
    const currentDate = new Date().toLocaleDateString();
    const selectedDate = new Date(reportDate).toLocaleDateString();
    
    // Get summary data from the page
    const dailyTotalSales = document.getElementById('daily-total-sales').textContent;
    const dailyTotalReturns = document.getElementById('daily-total-returns').textContent;
    const dailyNetProfit = document.getElementById('daily-net-profit').textContent;
    const dailyActiveShops = document.getElementById('daily-active-shops').textContent;
    
    // Get table data
    const tbody = document.getElementById('daily-report-tbody');
    const rows = tbody.querySelectorAll('tr');
    
    let html = `
        <!DOCTYPE html>
        <html>
        <head>
            <title>Daily Sales Report - ${selectedDate}</title>
            <style>
                body { font-family: Arial, sans-serif; margin: 20px; }
                h1 { text-align: center; color: #333; }
                .header { text-align: center; margin-bottom: 20px; }
                .date { text-align: right; margin-bottom: 10px; color: #666; }
                .summary { display: flex; justify-content: space-around; margin: 20px 0; padding: 20px; background: #f8f9fa; border-radius: 8px; }
                .summary-item { text-align: center; }
                .summary-item h3 { margin: 0; color: #666; font-size: 14px; }
                .summary-item p { margin: 10px 0 0 0; font-size: 24px; font-weight: bold; color: #333; }
                table { width: 100%; border-collapse: collapse; margin-top: 20px; }
                th, td { border: 1px solid #ddd; padding: 10px; text-align: left; }
                th { background-color: #007bff; color: white; }
                tr:nth-child(even) { background-color: #f2f2f2; }
                .footer { margin-top: 30px; text-align: center; color: #666; font-size: 12px; }
                @media print {
                    body { margin: 0; }
                    button { display: none; }
                }
            </style>
        </head>
        <body>
            <div class="header">
                <h1>🍕 Myland Food Management System</h1>
                <h2>Daily Sales Report</h2>
                <h3>${selectedDate}</h3>
            </div>
            <div class="date">Generated: ${currentDate}</div>
            
            <div class="summary">
                <div class="summary-item">
                    <h3>Daily Sales</h3>
                    <p>${dailyTotalSales}</p>
                </div>
                <div class="summary-item">
                    <h3>Daily Returns</h3>
                    <p>${dailyTotalReturns}</p>
                </div>
                <div class="summary-item">
                    <h3>Net Profit</h3>
                    <p>${dailyNetProfit}</p>
                </div>
                <div class="summary-item">
                    <h3>Active Shops</h3>
                    <p>${dailyActiveShops}</p>
                </div>
            </div>
            
            <table>
                <thead>
                    <tr>
                        <th>Shop</th>
                        <th>Product</th>
                        <th>Sold Units</th>
                        <th>Returned Units</th>
                        <th>Income</th>
                        <th>Profit</th>
                        <th>Time</th>
                    </tr>
                </thead>
                <tbody>
    `;
    
    if (rows.length === 0 || (rows.length === 1 && rows[0].textContent.includes('No sales data'))) {
        html += '<tr><td colspan="7" style="text-align: center;">No sales data for the selected date</td></tr>';
    } else {
        rows.forEach(row => {
            const cells = row.querySelectorAll('td');
            if (cells.length > 0 && !row.textContent.includes('No sales data')) {
                html += '<tr>';
                cells.forEach(cell => {
                    html += `<td>${cell.textContent}</td>`;
                });
                html += '</tr>';
            }
        });
    }
    
    html += `
                </tbody>
            </table>
            
            <div class="footer">
                <p>Daily Sales Report for ${selectedDate}</p>
                <p>Generated on ${currentDate}</p>
            </div>
        </body>
        </html>
    `;
    return html;
}

// =====================================================
// SHOP SALES HISTORY PRINT FUNCTION
// =====================================================

function printShopHistory() {
    const shopId = document.getElementById('shop-history-select').value;
    if (!shopId) {
        alert('Please select a shop first!');
        return;
    }
    
    const printContent = generateShopHistoryPrintContent(shopId);
    printInSameTab(printContent);
}

function generateShopHistoryPrintContent(shopId) {
    const currentDate = new Date().toLocaleDateString();
    const shop = shops.find(s => s.id == shopId);
    if (!shop) return '';
    
    // Get summary data from the page
    const totalSales = document.getElementById('shop-total-sales').textContent;
    const totalUnits = document.getElementById('shop-total-units').textContent;
    const totalReturns = document.getElementById('shop-total-returns').textContent;
    const totalTransactions = document.getElementById('shop-total-transactions').textContent;
    
    // Get table data
    const tbody = document.getElementById('shop-history-tbody');
    const rows = tbody.querySelectorAll('tr');
    
    let html = `
        <!DOCTYPE html>
        <html>
        <head>
            <title>Shop Sales History - ${shop.name}</title>
            <style>
                body { font-family: Arial, sans-serif; margin: 20px; }
                h1 { text-align: center; color: #333; }
                .header { text-align: center; margin-bottom: 20px; }
                .date { text-align: right; margin-bottom: 10px; color: #666; }
                .shop-info { background: #f8f9fa; padding: 15px; border-radius: 8px; margin: 20px 0; }
                .shop-info h3 { margin: 0 0 10px 0; color: #333; }
                .shop-info p { margin: 5px 0; color: #666; }
                .summary { display: flex; justify-content: space-around; margin: 20px 0; padding: 20px; background: #f8f9fa; border-radius: 8px; }
                .summary-item { text-align: center; }
                .summary-item h3 { margin: 0; color: #666; font-size: 14px; }
                .summary-item p { margin: 10px 0 0 0; font-size: 24px; font-weight: bold; color: #333; }
                table { width: 100%; border-collapse: collapse; margin-top: 20px; }
                th, td { border: 1px solid #ddd; padding: 10px; text-align: left; }
                th { background-color: #17a2b8; color: white; }
                tr:nth-child(even) { background-color: #f2f2f2; }
                .footer { margin-top: 30px; text-align: center; color: #666; font-size: 12px; }
                @media print {
                    body { margin: 0; }
                    button { display: none; }
                }
            </style>
        </head>
        <body>
            <div class="header">
                <h1>🍕 Myland Food Management System</h1>
                <h2>Shop Sales History Report</h2>
            </div>
            <div class="date">Generated: ${currentDate}</div>
            
            <div class="shop-info">
                <h3>📍 ${shop.name}</h3>
                <p><strong>Address:</strong> ${shop.address}</p>
                <p><strong>Contact:</strong> ${shop.contactNumber}</p>
                <p><strong>Email:</strong> ${shop.email || 'N/A'}</p>
            </div>
            
            <div class="summary">
                <div class="summary-item">
                    <h3>Total Sales</h3>
                    <p>${totalSales}</p>
                </div>
                <div class="summary-item">
                    <h3>Total Units Sold</h3>
                    <p>${totalUnits}</p>
                </div>
                <div class="summary-item">
                    <h3>Total Returns</h3>
                    <p>${totalReturns}</p>
                </div>
                <div class="summary-item">
                    <h3>Total Transactions</h3>
                    <p>${totalTransactions}</p>
                </div>
            </div>
            
            <table>
                <thead>
                    <tr>
                        <th>Date</th>
                        <th>Product</th>
                        <th>Sold Units</th>
                        <th>Returned Units</th>
                        <th>Income</th>
                        <th>Profit</th>
                    </tr>
                </thead>
                <tbody>
    `;
    
    if (rows.length === 0 || (rows.length === 1 && rows[0].textContent.includes('No sales history'))) {
        html += '<tr><td colspan="6" style="text-align: center;">No sales history found for this shop</td></tr>';
    } else {
        rows.forEach(row => {
            const cells = row.querySelectorAll('td');
            if (cells.length > 0 && !row.textContent.includes('No sales history')) {
                html += '<tr>';
                cells.forEach(cell => {
                    html += `<td>${cell.textContent}</td>`;
                });
                html += '</tr>';
            }
        });
    }
    
    html += `
                </tbody>
            </table>
            
            <div class="footer">
                <p>Shop Sales History Report for ${shop.name}</p>
                <p>Generated on ${currentDate}</p>
            </div>
        </body>
        </html>
    `;
    return html;
}

// =====================================================
// SALE BILL PRINT FUNCTION
// =====================================================

function printSaleBill(sale, product, shop) {
    const printContent = generateSaleBillContent(sale, product, shop);
    printInSameTab(printContent);
}

function generateSaleBillContent(sale, product, shop) {
    const currentDate = new Date().toLocaleDateString();
    const currentTime = new Date().toLocaleTimeString();
    
    // Calculate values
    const soldUnits = sale.soldUnits || 0;
    const returnedUnits = sale.returnedUnits || 0;
    const netUnits = soldUnits - returnedUnits;
    const unitPrice = product ? product.sellingPrice : 0;
    const subtotal = soldUnits * unitPrice;
    const returnAmount = returnedUnits * unitPrice;
    const total = subtotal - returnAmount;
    const profit = sale.profit || 0;
    
    let html = `
        <!DOCTYPE html>
        <html>
        <head>
            <title>Sale Bill - ${sale.id || 'New'}</title>
            <style>
                @page { margin: 0; }
                body { 
                    font-family: 'Courier New', monospace; 
                    margin: 0;
                    padding: 20px;
                    max-width: 300px;
                }
                .bill-container {
                    border: 2px solid #000;
                    padding: 15px;
                }
                .header { 
                    text-align: center; 
                    border-bottom: 2px dashed #000;
                    padding-bottom: 10px;
                    margin-bottom: 10px;
                }
                .header h1 { 
                    margin: 0;
                    font-size: 20px;
                }
                .header p { 
                    margin: 5px 0;
                    font-size: 12px;
                }
                .bill-info {
                    margin: 15px 0;
                    font-size: 12px;
                }
                .bill-info .row {
                    display: flex;
                    justify-content: space-between;
                    margin: 5px 0;
                }
                .bill-info .label {
                    font-weight: bold;
                }
                .items {
                    border-top: 2px dashed #000;
                    border-bottom: 2px dashed #000;
                    padding: 10px 0;
                    margin: 15px 0;
                }
                .item-row {
                    display: flex;
                    justify-content: space-between;
                    margin: 8px 0;
                    font-size: 12px;
                }
                .item-name {
                    font-weight: bold;
                }
                .totals {
                    margin: 15px 0;
                    font-size: 13px;
                }
                .totals .row {
                    display: flex;
                    justify-content: space-between;
                    margin: 5px 0;
                }
                .totals .total-row {
                    font-weight: bold;
                    font-size: 16px;
                    border-top: 2px solid #000;
                    padding-top: 8px;
                    margin-top: 8px;
                }
                .footer {
                    text-align: center;
                    margin-top: 20px;
                    padding-top: 10px;
                    border-top: 2px dashed #000;
                    font-size: 11px;
                }
                @media print {
                    body { margin: 0; padding: 10px; }
                }
            </style>
        </head>
        <body>
            <div class="bill-container">
                <div class="header">
                    <h1>🍕 MYLAND FOOD</h1>
                    <p>Food Management System</p>
                    <p>Sale Receipt</p>
                </div>
                
                <div class="bill-info">
                    <div class="row">
                        <span class="label">Bill No:</span>
                        <span>#${sale.id || 'NEW'}</span>
                    </div>
                    <div class="row">
                        <span class="label">Date:</span>
                        <span>${sale.date || currentDate}</span>
                    </div>
                    <div class="row">
                        <span class="label">Time:</span>
                        <span>${currentTime}</span>
                    </div>
                    <div class="row">
                        <span class="label">Shop:</span>
                        <span>${shop ? shop.name : 'N/A'}</span>
                    </div>
                </div>
                
                <div class="items">
                    <div class="item-row">
                        <span class="item-name">${product ? product.name : 'Product'}</span>
                    </div>
                    <div class="item-row">
                        <span>${soldUnits} units × $${unitPrice.toFixed(2)}</span>
                        <span>$${subtotal.toFixed(2)}</span>
                    </div>
                    ${returnedUnits > 0 ? `
                    <div class="item-row" style="color: #dc3545;">
                        <span>Returns: ${returnedUnits} units</span>
                        <span>-$${returnAmount.toFixed(2)}</span>
                    </div>
                    ` : ''}
                </div>
                
                <div class="totals">
                    <div class="row">
                        <span>Subtotal:</span>
                        <span>$${subtotal.toFixed(2)}</span>
                    </div>
                    ${returnedUnits > 0 ? `
                    <div class="row" style="color: #dc3545;">
                        <span>Returns:</span>
                        <span>-$${returnAmount.toFixed(2)}</span>
                    </div>
                    ` : ''}
                    <div class="row">
                        <span>Net Units:</span>
                        <span>${netUnits} units</span>
                    </div>
                    <div class="row total-row">
                        <span>TOTAL:</span>
                        <span>$${total.toFixed(2)}</span>
                    </div>
                </div>
                
                <div class="footer">
                    <p>Thank you for your business!</p>
                    <p>Generated: ${currentDate} ${currentTime}</p>
                </div>
            </div>
        </body>
        </html>
    `;
    return html;
}
