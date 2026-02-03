// Dashboard-specific JavaScript
const API_BASE = '/api';

let salesChart = null;
let shopChart = null;

// Initialize dashboard
document.addEventListener('DOMContentLoaded', function() {
    loadDashboardData();
});

async function loadDashboardData() {
    try {
        showLoading();
        
        // Load all data in parallel
        const [products, ingredients, production, sales, shops] = await Promise.all([
            fetch(`${API_BASE}/products`).then(r => r.json()),
            fetch(`${API_BASE}/ingredients`).then(r => r.json()),
            fetch(`${API_BASE}/production`).then(r => r.json()),
            fetch(`${API_BASE}/sales`).then(r => r.json()),
            fetch(`${API_BASE}/shops`).then(r => r.json())
        ]);

        // Update statistics
        updateStatistics(products, ingredients, production, sales, shops);
        
        // Update charts
        updateSalesChart(sales);
        updateShopChart(sales, shops);
        
        // Update recent sales
        updateRecentSales(sales);
        
        // Update module counts
        updateModuleCounts(products, ingredients, production, sales, shops);
        
        hideLoading();
    } catch (error) {
        console.error('Error loading dashboard data:', error);
        hideLoading();
        showMessage('Error loading dashboard data: ' + error.message, 'error');
    }
}

function updateStatistics(products, ingredients, production, sales, shops) {
    // Calculate total revenue
    const totalRevenue = sales.reduce((sum, sale) => sum + (sale.income || 0), 0);
    document.getElementById('total-revenue').textContent = `$${totalRevenue.toFixed(2)}`;
    
    // Calculate total profit
    const totalProfit = sales.reduce((sum, sale) => sum + (sale.profit || 0), 0);
    document.getElementById('total-profit').textContent = `$${totalProfit.toFixed(2)}`;
    
    // Calculate products in storage
    const productStorage = {};
    products.forEach(product => {
        productStorage[product.id] = { produced: 0, sold: 0 };
    });
    
    production.forEach(prod => {
        if (prod.product && productStorage[prod.product.id]) {
            productStorage[prod.product.id].produced += prod.producedUnits || 0;
        }
    });
    
    sales.forEach(sale => {
        if (sale.product && productStorage[sale.product.id]) {
            productStorage[sale.product.id].sold += sale.soldUnits || 0;
        }
    });
    
    const totalInStorage = Object.values(productStorage).reduce((sum, item) => 
        sum + Math.max(0, item.produced - item.sold), 0);
    
    document.getElementById('total-products').textContent = products.length;
    document.getElementById('products-in-storage').textContent = totalInStorage;
    
    // Total shops
    document.getElementById('total-shops').textContent = shops.length;
    
    // Today's sales
    const today = new Date().toISOString().split('T')[0];
    const todaySales = sales.filter(sale => sale.date === today).length;
    document.getElementById('today-sales').textContent = todaySales;
    
    // Calculate month-over-month changes (simplified)
    const currentMonth = new Date().getMonth();
    const lastMonthSales = sales.filter(sale => {
        const saleDate = new Date(sale.date);
        return saleDate.getMonth() === currentMonth - 1;
    });
    const currentMonthSales = sales.filter(sale => {
        const saleDate = new Date(sale.date);
        return saleDate.getMonth() === currentMonth;
    });
    
    const lastMonthRevenue = lastMonthSales.reduce((sum, s) => sum + (s.income || 0), 0);
    const currentMonthRevenue = currentMonthSales.reduce((sum, s) => sum + (s.income || 0), 0);
    
    const revenueChange = lastMonthRevenue > 0 
        ? ((currentMonthRevenue - lastMonthRevenue) / lastMonthRevenue * 100).toFixed(1)
        : '0';
    
    const lastMonthProfit = lastMonthSales.reduce((sum, s) => sum + (s.profit || 0), 0);
    const currentMonthProfit = currentMonthSales.reduce((sum, s) => sum + (s.profit || 0), 0);
    
    const profitChange = lastMonthProfit > 0 
        ? ((currentMonthProfit - lastMonthProfit) / lastMonthProfit * 100).toFixed(1)
        : '0';
    
    document.getElementById('revenue-change').textContent = `${revenueChange}%`;
    document.getElementById('profit-change').textContent = `${profitChange}%`;
}

function updateSalesChart(sales) {
    const period = parseInt(document.getElementById('chart-period').value) || 7;
    const today = new Date();
    const labels = [];
    const revenueData = [];
    const profitData = [];
    
    for (let i = period - 1; i >= 0; i--) {
        const date = new Date(today);
        date.setDate(date.getDate() - i);
        const dateStr = date.toISOString().split('T')[0];
        labels.push(date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }));
        
        const daySales = sales.filter(sale => sale.date === dateStr);
        const dayRevenue = daySales.reduce((sum, s) => sum + (s.income || 0), 0);
        const dayProfit = daySales.reduce((sum, s) => sum + (s.profit || 0), 0);
        
        revenueData.push(dayRevenue);
        profitData.push(dayProfit);
    }
    
    const ctx = document.getElementById('salesChart').getContext('2d');
    
    if (salesChart) {
        salesChart.destroy();
    }
    
    salesChart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: labels,
            datasets: [{
                label: 'Revenue',
                data: revenueData,
                borderColor: '#667eea',
                backgroundColor: 'rgba(102, 126, 234, 0.1)',
                tension: 0.4,
                fill: true
            }, {
                label: 'Profit',
                data: profitData,
                borderColor: '#56ab2f',
                backgroundColor: 'rgba(86, 171, 47, 0.1)',
                tension: 0.4,
                fill: true
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    position: 'top',
                },
                tooltip: {
                    mode: 'index',
                    intersect: false,
                }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    ticks: {
                        callback: function(value) {
                            return '$' + value.toFixed(0);
                        }
                    }
                }
            }
        }
    });
}

function updateShopChart(sales, shops) {
    const shopData = {};
    
    sales.forEach(sale => {
        const shopName = sale.shop ? sale.shop.name : 'Unknown';
        if (!shopData[shopName]) {
            shopData[shopName] = 0;
        }
        shopData[shopName] += sale.income || 0;
    });
    
    const labels = Object.keys(shopData);
    const data = Object.values(shopData);
    
    const colors = [
        '#667eea', '#764ba2', '#56ab2f', '#f093fb', 
        '#f5576c', '#4facfe', '#00f2fe', '#ffc107'
    ];
    
    const ctx = document.getElementById('shopChart').getContext('2d');
    
    if (shopChart) {
        shopChart.destroy();
    }
    
    shopChart = new Chart(ctx, {
        type: 'doughnut',
        data: {
            labels: labels,
            datasets: [{
                data: data,
                backgroundColor: colors.slice(0, labels.length),
                borderWidth: 2,
                borderColor: '#fff'
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    position: 'right',
                },
                tooltip: {
                    callbacks: {
                        label: function(context) {
                            const label = context.label || '';
                            const value = context.parsed || 0;
                            const total = context.dataset.data.reduce((a, b) => a + b, 0);
                            const percentage = ((value / total) * 100).toFixed(1);
                            return `${label}: $${value.toFixed(2)} (${percentage}%)`;
                        }
                    }
                }
            }
        }
    });
}

function updateRecentSales(sales) {
    const recentSales = sales
        .sort((a, b) => new Date(b.date) - new Date(a.date))
        .slice(0, 5);
    
    const container = document.getElementById('recent-sales');
    
    if (recentSales.length === 0) {
        container.innerHTML = '<div class="activity-item">No sales recorded yet</div>';
        return;
    }
    
    container.innerHTML = recentSales.map(sale => {
        const income = sale.income || 0;
        const profit = sale.profit || 0;
        const date = new Date(sale.date).toLocaleDateString('en-US', { 
            month: 'short', 
            day: 'numeric',
            year: 'numeric'
        });
        
        return `
            <div class="activity-item">
                <div class="activity-icon success">
                    <i class="fas fa-shopping-cart"></i>
                </div>
                <div class="activity-content">
                    <div class="activity-title">
                        ${sale.product ? sale.product.name : 'Unknown Product'}
                    </div>
                    <div class="activity-details">
                        ${sale.shop ? sale.shop.name : 'Unknown Shop'} • ${sale.soldUnits} units
                    </div>
                </div>
                <div class="activity-amount">
                    <div class="amount-value">$${income.toFixed(2)}</div>
                    <div class="amount-label">Profit: $${profit.toFixed(2)}</div>
                </div>
                <div class="activity-date">${date}</div>
            </div>
        `;
    }).join('');
}

function updateModuleCounts(products, ingredients, production, sales, shops) {
    document.getElementById('module-products-count').textContent = products.length;
    document.getElementById('module-ingredients-count').textContent = ingredients.length;
    document.getElementById('module-production-count').textContent = production.length;
    document.getElementById('module-sales-count').textContent = sales.length;
    document.getElementById('module-shops-count').textContent = shops.length;
    
    // Calculate inventory value
    const inventoryValue = ingredients.reduce((sum, ing) => 
        sum + ((ing.quantity || 0) * (ing.pricePerUnit || 0)), 0);
    document.getElementById('module-inventory-value').textContent = `$${inventoryValue.toFixed(0)}`;
}

function updateCharts() {
    // Reload data to update charts with new period
    loadDashboardData();
}

function showLoading() {
    const loading = document.getElementById('loading');
    if (loading) loading.style.display = 'block';
}

function hideLoading() {
    const loading = document.getElementById('loading');
    if (loading) loading.style.display = 'none';
}

function showMessage(text, type) {
    const messageDiv = document.getElementById('message');
    if (messageDiv) {
        messageDiv.textContent = text;
        messageDiv.className = `message ${type}`;
        messageDiv.style.display = 'block';
        
        setTimeout(() => {
            messageDiv.style.display = 'none';
        }, 3000);
    }
}
