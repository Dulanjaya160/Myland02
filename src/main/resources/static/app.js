// Global variables
let currentTab = 'products';
let products = [];
let ingredients = [];
let production = [];
let sales = [];
let shops = [];

// API Base URL
const API_BASE = '/api/myland';

// Initialize the application
document.addEventListener('DOMContentLoaded', function () {
    initializeApp();

    // Register Service Worker
    if ('serviceWorker' in navigator) {
        navigator.serviceWorker.register('/sw.js')
            .then(registration => {
                console.log('ServiceWorker registration successful with scope: ', registration.scope);
            })
            .catch(err => {
                console.log('ServiceWorker registration failed: ', err);
            });
    }
});

function initializeApp() {
    setupTabNavigation();
    setupFormHandlers();
    setCurrentDate();

    // Check if we are on a specific page
    const nav = document.getElementById('navigation');
    const currentPage = nav ? nav.getAttribute('data-current-page') : null;

    if (currentPage) {
        // If on a specific page, load its data
        loadTabData(currentPage);
    } else {
        // Fallback for single-page app style or default
        loadTabData('products');
    }
}

// Tab Navigation
function setupTabNavigation() {
    const tabButtons = document.querySelectorAll('.tab-button');
    const tabContents = document.querySelectorAll('.tab-content');

    tabButtons.forEach(button => {
        button.addEventListener('click', () => {
            const tabName = button.getAttribute('data-tab');
            switchTab(tabName);
        });
    });
}

function switchTab(tabName) {
    // Update tab buttons
    document.querySelectorAll('.tab-button').forEach(btn => {
        btn.classList.remove('active');
    });
    document.querySelector(`[data-tab="${tabName}"]`).classList.add('active');

    // Update tab content
    document.querySelectorAll('.tab-content').forEach(content => {
        content.classList.remove('active');
    });
    document.getElementById(tabName).classList.add('active');

    currentTab = tabName;

    // Load data for the current tab
    loadTabData(tabName);
}

function loadTabData(tabName) {
    switch (tabName) {
        case 'dashboard':
            if (typeof loadDashboardData === 'function') {
                loadDashboardData();
            }
            break;
        case 'products':
            loadProducts();
            break;
        case 'ingredients':
            loadIngredients();
            break;
        case 'production':
            loadProduction();
            loadProductsForSelect('production-product');
            break;
        case 'sales':
            loadSales();
            loadProductsForSelect('sale-product');
            // Load shops for the sale form
            if (shops.length === 0) {
                loadShops().then(() => {
                    loadShopsForSelect('sale-shop');
                });
            } else {
                loadShopsForSelect('sale-shop');
            }

            // Set default dates for reports
            if (typeof setCurrentMonth === 'function') setCurrentMonth();
            if (typeof setCurrentDate === 'function') setCurrentDate('report-date');

            // Delay report generation slightly to ensure data is loaded
            setTimeout(() => {
                if (typeof generateMonthlyReport === 'function') generateMonthlyReport();
                if (typeof generateDailyReport === 'function') generateDailyReport();
            }, 500);
            break;
        case 'storage':
            loadStorageSummary();
            break;
        case 'inventory':
            loadInventory();
            break;
        case 'shops':
            loadShops();
            // Load sales data for shop history feature
            if (sales.length === 0) {
                loadSales();
            }
            break;
    }
}

// Form Handlers
function setupFormHandlers() {
    const attachListener = (id, handler) => {
        const element = document.getElementById(id);
        if (element) {
            element.addEventListener('submit', handler);
        }
    };

    // Product form
    attachListener('product-form', handleProductSubmit);

    // Ingredient form
    attachListener('ingredient-form', handleIngredientSubmit);

    // Production form
    attachListener('production-form', handleProductionSubmit);

    // Sale form
    attachListener('sale-form', handleSaleSubmit);

    // Inventory form
    attachListener('inventory-form', handleInventorySubmit);

    // Shop form
    attachListener('shop-form', handleShopSubmit);
}

// Product Management
function showAddProductForm() {
    document.getElementById('add-product-form').style.display = 'block';
    document.getElementById('product-form').reset();
}

function hideAddProductForm() {
    document.getElementById('add-product-form').style.display = 'none';
    document.getElementById('product-form').reset();
    document.querySelector('#add-product-form h3').textContent = 'Add New Product';
    delete document.getElementById('product-form').dataset.editId;
}

function handleProductSubmit(e) {
    e.preventDefault();
    const formData = new FormData(e.target);
    const product = {
        name: formData.get('name'),
        basePrice: parseFloat(formData.get('basePrice')),
        sellingPrice: parseFloat(formData.get('sellingPrice')),
        productCost: parseFloat(formData.get('productCost'))
    };

    // Validation
    if (product.basePrice < 0 || product.sellingPrice < 0 || product.productCost < 0) {
        showMessage('Prices cannot be negative', 'error');
        return;
    }

    const editId = e.target.dataset.editId;
    if (editId) {
        product.id = parseInt(editId);
    }

    showLoading();
    fetch(`${API_BASE}/product`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(product)
    })
        .then(response => response.json())
        .then(data => {
            hideLoading();
            const message = editId ? 'Product updated successfully!' : 'Product added successfully!';
            showMessage(message, 'success');
            hideAddProductForm();
            loadProducts();
        })
        .catch(error => {
            hideLoading();
            showMessage('Error saving product: ' + error.message, 'error');
        });
}

function loadProducts() {
    showLoading();
    fetch(`${API_BASE}/products`)
        .then(response => response.json())
        .then(data => {
            products = data;
            displayProducts(data);
            hideLoading();
        })
        .catch(error => {
            hideLoading();
            showMessage('Error loading products: ' + error.message, 'error');
            // Display empty table if no products endpoint exists
            displayProducts([]);
        });
}

function displayProducts(products) {
    const tbody = document.getElementById('products-tbody');
    if (!tbody) return; // Exit if table not found on this page
    tbody.innerHTML = '';

    if (products.length === 0) {
        tbody.innerHTML = '<tr><td colspan="7" class="text-center">No products found</td></tr>';
        return;
    }

    products.forEach(product => {
        const profitMargin = product.sellingPrice && product.productCost ?
            ((product.sellingPrice - product.productCost) / product.sellingPrice * 100) : 0;
        const profitMarginColor = profitMargin > 0 ? '#28a745' : profitMargin < 0 ? '#dc3545' : '#6c757d';

        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${product.id}</td>
            <td>${product.name}</td>
            <td>$${(product.basePrice || 0).toFixed(2)}</td>
            <td>$${(product.sellingPrice || 0).toFixed(2)}</td>
            <td>$${(product.productCost || 0).toFixed(2)}</td>
            <td style="color: ${profitMarginColor}; font-weight: bold;">
                ${profitMargin.toFixed(1)}%
            </td>
            <td>
                <div class="action-buttons">
                    <button class="action-btn btn-warning" onclick="editProduct(${product.id})">
                        <i class="fas fa-edit"></i>
                    </button>
                    <button class="action-btn btn-danger" onclick="deleteProduct(${product.id})">
                        <i class="fas fa-trash"></i>
                    </button>
                </div>
            </td>
        `;
        tbody.appendChild(row);
    });
}

// Ingredient Management
function showAddIngredientForm() {
    document.getElementById('add-ingredient-form').style.display = 'block';
    document.getElementById('ingredient-form').reset();
}

function hideAddIngredientForm() {
    document.getElementById('add-ingredient-form').style.display = 'none';
    document.getElementById('ingredient-form').reset();
    document.querySelector('#add-ingredient-form h3').textContent = 'Add New Ingredient';
    delete document.getElementById('ingredient-form').dataset.editId;
}

function handleIngredientSubmit(e) {
    e.preventDefault();
    const formData = new FormData(e.target);
    const ingredient = {
        name: formData.get('name'),
        type: formData.get('type'),
        quantity: parseFloat(formData.get('quantity')),
        pricePerUnit: parseFloat(formData.get('pricePerUnit'))
    };

    // Validation
    if (ingredient.quantity < 0) {
        showMessage('Quantity cannot be negative', 'error');
        return;
    }
    if (ingredient.pricePerUnit < 0) {
        showMessage('Price cannot be negative', 'error');
        return;
    }

    const editId = e.target.dataset.editId;
    if (editId) {
        ingredient.id = parseInt(editId);
    }

    const payload = JSON.stringify(ingredient);
    console.log('Sending ingredient payload:', payload);

    showLoading();
    fetch(`${API_BASE}/ingredient`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: payload
    })
        .then(response => response.json())
        .then(data => {
            hideLoading();
            const message = editId ? 'Ingredient updated successfully!' : 'Ingredient added successfully!';
            showMessage(message, 'success');
            hideAddIngredientForm();
            loadIngredients();
        })
        .catch(error => {
            hideLoading();
            showMessage('Error saving ingredient: ' + error.message, 'error');
        });
}

function loadIngredients() {
    return new Promise((resolve, reject) => {
        showLoading();
        fetch(`${API_BASE}/ingredients`)
            .then(response => response.json())
            .then(data => {
                ingredients = data;
                displayIngredients(data);
                hideLoading();
                resolve(data);
            })
            .catch(error => {
                hideLoading();
                showMessage('Error loading ingredients: ' + error.message, 'error');
                displayIngredients([]);
                reject(error);
            });
    });
}

function displayIngredients(ingredients) {
    const tbody = document.getElementById('ingredients-tbody');
    if (!tbody) return;
    tbody.innerHTML = '';

    if (ingredients.length === 0) {
        tbody.innerHTML = '<tr><td colspan="6" class="text-center">No ingredients found</td></tr>';
        return;
    }

    ingredients.forEach(ingredient => {
        const ingredientType = ingredient.type || ingredient.ingredientType || 'Not specified';
        const quantity = ingredient.quantity || 0;
        const pricePerUnit = ingredient.pricePerUnit || 0;

        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${ingredient.id}</td>
            <td>${ingredient.name}</td>
            <td>${ingredientType}</td>
            <td>${quantity.toFixed(2)}</td>
            <td>$${pricePerUnit.toFixed(2)}</td>
            <td>
                <div class="action-buttons">
                    <button class="action-btn btn-warning" onclick="editIngredient(${ingredient.id})">
                        <i class="fas fa-edit"></i>
                    </button>
                    <button class="action-btn btn-danger" onclick="deleteIngredient(${ingredient.id})">
                        <i class="fas fa-trash"></i>
                    </button>
                </div>
            </td>
        `;
        tbody.appendChild(row);
    });
}

// Production Management
function showAddProductionForm() {
    document.getElementById('add-production-form').style.display = 'block';
    document.getElementById('production-form').reset();
    setCurrentDate('production-date');

    // Reset ingredient usage container to have one empty row
    const container = document.getElementById('ingredient-usage-container');
    container.innerHTML = `
        <div class="ingredient-usage-item">
            <select class="ingredient-select" name="ingredientIds[]" required>
                <option value="">Select ingredient</option>
            </select>
            <input type="number" class="ingredient-quantity" name="ingredientQuantities[]" 
                   step="0.01" min="0" placeholder="Quantity used" required>
            <button type="button" class="btn btn-danger btn-sm" onclick="removeIngredientUsage(this)">
                <i class="fas fa-trash"></i>
            </button>
        </div>
    `;

    // Load ingredients first, then populate dropdowns
    if (ingredients && ingredients.length > 0) {
        populateIngredientDropdowns();
    } else {
        loadIngredients().then(() => {
            populateIngredientDropdowns();
        }).catch(() => {
            // If loading fails, still try to populate with empty ingredients
            populateIngredientDropdowns();
        });
    }
}

function addIngredientUsage() {
    const container = document.getElementById('ingredient-usage-container');
    const newItem = document.createElement('div');
    newItem.className = 'ingredient-usage-item';
    newItem.innerHTML = `
        <select class="ingredient-select" name="ingredientIds[]" required>
            <option value="">Select ingredient</option>
        </select>
        <input type="number" class="ingredient-quantity" name="ingredientQuantities[]" 
               step="0.01" min="0" placeholder="Quantity used" required>
        <button type="button" class="btn btn-danger btn-sm" onclick="removeIngredientUsage(this)">
            <i class="fas fa-trash"></i>
        </button>
    `;
    container.appendChild(newItem);

    // Populate the new dropdown
    const newSelect = newItem.querySelector('.ingredient-select');
    ingredients.forEach(ingredient => {
        const option = document.createElement('option');
        option.value = ingredient.id;

        // NEW: Check stock levels
        const isOutOfStock = (ingredient.quantity || 0) <= 0;

        if (isOutOfStock) {
            option.textContent = `${ingredient.name} (Out of Stock)`;
            option.disabled = true;
        } else {
            option.textContent = `${ingredient.name} (Qty: ${ingredient.quantity})`;
        }

        newSelect.appendChild(option);
    });
}

function removeIngredientUsage(button) {
    const container = document.getElementById('ingredient-usage-container');
    if (container.children.length > 1) {
        button.parentElement.remove();
    }
}

function populateIngredientDropdowns() {
    const selects = document.querySelectorAll('.ingredient-select');
    console.log('Populating ingredient dropdowns. Found', selects.length, 'selects');
    console.log('Available ingredients:', ingredients);

    selects.forEach(select => {
        if (select.children.length === 1) { // Only has default option
            ingredients.forEach(ingredient => {
                const option = document.createElement('option');
                option.value = ingredient.id;

                // NEW: Check stock levels
                const isOutOfStock = (ingredient.quantity || 0) <= 0;

                if (isOutOfStock) {
                    option.textContent = `${ingredient.name} (Out of Stock)`;
                    option.disabled = true;
                } else {
                    option.textContent = `${ingredient.name} (Qty: ${ingredient.quantity})`;
                }

                select.appendChild(option);
            });
        }
    });
}

function hideAddProductionForm() {
    document.getElementById('add-production-form').style.display = 'none';
}

function handleProductionSubmit(e) {
    e.preventDefault();
    const formData = new FormData(e.target);
    const productId = formData.get('product');
    const product = products.find(p => p.id == productId);

    // Collect ingredient usage data
    const ingredientIds = formData.getAll('ingredientIds[]');
    const ingredientQuantities = formData.getAll('ingredientQuantities[]');
    const usedIngredients = [];

    for (let i = 0; i < ingredientIds.length; i++) {
        if (ingredientIds[i] && ingredientQuantities[i]) {
            usedIngredients.push({
                ingredientId: parseInt(ingredientIds[i]),
                quantityUsed: parseFloat(ingredientQuantities[i])
            });
        }
    }

    // Validate ingredient availability before submitting
    for (let usedIng of usedIngredients) {
        const ingredient = ingredients.find(ing => ing.id === usedIng.ingredientId);
        if (ingredient) {
            if (ingredient.quantity < usedIng.quantityUsed) {
                showMessage(
                    `Insufficient stock for ingredient '${ingredient.name}'. ` +
                    `Required: ${usedIng.quantityUsed}, Available: ${ingredient.quantity}`,
                    'error'
                );
                return; // Stop submission
            }
        }
    }

    const production = {
        product: product,
        date: formData.get('date'),
        producedUnits: parseInt(formData.get('producedUnits')),
        usedIngredients: usedIngredients
    };

    if (production.producedUnits <= 0) {
        showMessage('Produced units must be greater than 0', 'error');
        return;
    }

    // Debug: Log the production object to see what's being sent
    console.log('=== FRONTEND PRODUCTION DATA ===');
    console.log('Product:', product);
    console.log('Used ingredients:', usedIngredients);
    console.log('Production object:', JSON.stringify(production, null, 2));
    console.log('=== END FRONTEND DEBUG ===');

    showLoading();
    fetch(`${API_BASE}/production`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(production)
    })
        .then(response => {
            if (!response.ok) {
                return response.json().then(err => {
                    throw new Error(err.message || 'Failed to record production');
                });
            }
            return response.json();
        })
        .then(data => {
            hideLoading();
            showMessage('Production recorded successfully! Ingredients have been reduced from inventory.', 'success');
            hideAddProductionForm();
            loadProduction();
            loadIngredients(); // Refresh ingredients to show updated quantities
            // Refresh inventory if we're on the inventory tab
            if (currentTab === 'inventory') {
                loadInventory();
            }
        })
        .catch(error => {
            hideLoading();
            showMessage('Error recording production: ' + error.message, 'error');
        });
}

function loadProduction() {
    showLoading();
    fetch(`${API_BASE}/production`)
        .then(response => response.json())
        .then(data => {
            production = data;
            displayProduction(data);
            hideLoading();
        })
        .catch(error => {
            hideLoading();
            showMessage('Error loading production: ' + error.message, 'error');
            displayProduction([]);
        });
}

function displayProduction(production) {
    const tbody = document.getElementById('production-tbody');
    if (!tbody) return;
    tbody.innerHTML = '';

    if (production.length === 0) {
        tbody.innerHTML = '<tr><td colspan="6" class="text-center">No production records found</td></tr>';
        return;
    }

    production.forEach(record => {
        // Format used ingredients
        let ingredientsText = 'None';
        if (record.usedIngredients && record.usedIngredients.length > 0) {
            ingredientsText = record.usedIngredients.map(ui =>
                `${ui.ingredient ? ui.ingredient.name : 'Unknown'}: ${ui.quantityUsed}`
            ).join(', ');
        }

        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${record.id}</td>
            <td>${record.product ? record.product.name : 'N/A'}</td>
            <td>${record.date}</td>
            <td>${record.producedUnits}</td>
            <td style="max-width: 200px; word-wrap: break-word; font-size: 12px;">
                ${ingredientsText}
            </td>
            <td>
                <div class="action-buttons">
                    <button class="action-btn btn-warning" onclick="editProduction(${record.id})">
                        <i class="fas fa-edit"></i>
                    </button>
                    <button class="action-btn btn-danger" onclick="deleteProduction(${record.id})">
                        <i class="fas fa-trash"></i>
                    </button>
                </div>
            </td>
        `;
        tbody.appendChild(row);
    });
}

// Sales Management
function showAddSaleForm() {
    document.getElementById('add-sale-form').style.display = 'block';
    document.getElementById('sale-form').reset();
    setCurrentDate('sale-date');

    // Load shops first, then populate dropdown
    if (shops.length === 0) {
        loadShops().then(() => {
            loadShopsForSelect('sale-shop');
        });
    } else {
        loadShopsForSelect('sale-shop');
    }

    // Add event listeners for real-time calculation
    document.getElementById('sale-product').addEventListener('change', calculateSaleValues);
    document.getElementById('sale-units').addEventListener('input', calculateSaleValues);
}

function calculateSaleValues() {
    const productSelect = document.getElementById('sale-product');
    const unitsInput = document.getElementById('sale-units');
    const incomeDisplay = document.getElementById('calculated-income');
    const profitDisplay = document.getElementById('calculated-profit');

    const selectedProductId = productSelect.value;
    const soldUnits = parseInt(unitsInput.value) || 0;

    if (selectedProductId && soldUnits > 0) {
        const product = products.find(p => p.id == selectedProductId);
        if (product) {
            const sellingPrice = product.sellingPrice || 0;
            const productCost = product.productCost || 0;

            const income = sellingPrice * soldUnits;
            const profit = (sellingPrice - productCost) * soldUnits;

            incomeDisplay.textContent = `$${income.toFixed(2)}`;
            profitDisplay.textContent = `$${profit.toFixed(2)}`;

            // Add styling classes
            incomeDisplay.className = 'calculated-value income';
            profitDisplay.className = 'calculated-value profit';
        }
    } else {
        incomeDisplay.textContent = '$0.00';
        profitDisplay.textContent = '$0.00';
        incomeDisplay.className = 'calculated-value';
        profitDisplay.className = 'calculated-value';
    }
}

function hideAddSaleForm() {
    document.getElementById('add-sale-form').style.display = 'none';
    document.getElementById('sale-form').reset();
    // Reset form title and button text
    document.querySelector('#add-sale-form h3').textContent = 'Record Sale';
    const submitBtn = document.querySelector('#sale-form button[type="submit"]');
    submitBtn.innerHTML = '<i class="fas fa-save"></i> Record Sale';
    // Clear edit ID
    delete document.getElementById('sale-form').dataset.editId;
}

function handleSaleSubmit(e) {
    e.preventDefault();
    const formData = new FormData(e.target);
    const productId = formData.get('product');
    const shopId = formData.get('shop');

    if (!productId) {
        showMessage("Please select a product", "error");
        return;
    }

    const product = products.find(p => p.id == productId);
    if (!product) {
        showMessage("Selected product not found in local data", "error");
        return;
    }

    const shop = shops.find(s => s.id == shopId);

    const sale = {
        product: product,
        shop: shop,
        saleDate: formData.get('saleDate'),
        soldUnits: parseInt(formData.get('soldUnits')) || 0,
        returnedUnits: parseInt(formData.get('returnedUnits')) || 0
    };

    if (sale.soldUnits <= 0) {
        showMessage("Sold units must be greater than 0", "error");
        return;
    }

    // Check if we're editing an existing sale
    const editId = e.target.dataset.editId;
    if (editId) {
        sale.id = parseInt(editId);
    }

    showLoading();
    // Validate stock by fetching fresh data
    Promise.all([
        fetch(`${API_BASE}/production`).then(r => r.json().catch(() => [])),
        fetch(`${API_BASE}/sales`).then(r => r.json().catch(() => []))
    ]).then(([productionData, salesData]) => {

        // Defensive: Ensure we have arrays
        const productions = Array.isArray(productionData) ? productionData : [];
        const allSales = Array.isArray(salesData) ? salesData : [];

        let totalProduced = 0;
        let totalSold = 0;

        productions.forEach(p => {
            if (p.product && p.product.id == productId) {
                totalProduced += (p.producedUnits || 0);
            }
        });

        allSales.forEach(s => {
            if (s.product && s.product.id == productId) {
                // If editing, skip the record we are currently changing
                if (editId && s.id == editId) return;
                totalSold += (s.soldUnits || 0);
            }
        });

        const availableStock = totalProduced - totalSold;

        console.log(`Validation for Product ${productId}: Produced=${totalProduced}, Sold=${totalSold}, Available=${availableStock}, Requested=${sale.soldUnits}`);

        if (sale.soldUnits > availableStock) {
            hideLoading();
            showMessage(`Insufficient stock! Total Produced: ${totalProduced}, Already Sold: ${totalSold}, Available: ${availableStock}, Requested: ${sale.soldUnits}`, 'error');
            return;
        }

        // Proceed if valid
        performSaleSubmission(sale, editId);

    }).catch(err => {
        hideLoading();
        console.error("Stock validation error:", err);
        showMessage("Error validating stock: " + err.message, 'error');
    });
}

function performSaleSubmission(sale, editId) {
    // showLoading is already active from the validation step
    fetch(`${API_BASE}/sale`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(sale)
    })
        .then(response => response.json())
        .then(data => {
            hideLoading();
            const message = editId ? 'Sale updated successfully!' : 'Sale recorded successfully!';
            showMessage(message, 'success');
            hideAddSaleForm();
            loadSales();

            // Show print bill option for new sales (not edits)
            if (!editId) {
                if (confirm('Sale recorded successfully! Do you want to print the bill?')) {
                    printSaleBill(data, sale.product, sale.shop);
                }
            }

            // Refresh reports if we're on the sales tab
            // Refresh reports if we're on the sales tab
            if (currentTab === 'sales') {
                generateMonthlyReport();
                generateDailyReport();
            }
        })
        .catch(error => {
            hideLoading();
            showMessage('Error recording sale: ' + error.message, 'error');
        });
}

function loadSales() {
    showLoading();
    fetch(`${API_BASE}/sales`)
        .then(response => response.json())
        .then(data => {
            console.log('Loaded sales data:', data);
            sales = data;
            displaySales(data);
            hideLoading();
        })
        .catch(error => {
            hideLoading();
            console.error('Error loading sales:', error);
            showMessage('Error loading sales: ' + error.message, 'error');
            displaySales([]);
        });
}

function displaySales(sales) {
    console.log('Displaying sales:', sales);
    const tbody = document.getElementById('sales-tbody');
    if (!tbody) return;
    tbody.innerHTML = '';

    if (sales.length === 0) {
        tbody.innerHTML = '<tr><td colspan="9" class="text-center">No sales records found</td></tr>';
        return;
    }

    sales.forEach(sale => {
        const income = sale.totalIncome || 0;
        const profit = sale.totalProfit || 0;
        const profitColor = profit > 0 ? '#28a745' : profit < 0 ? '#dc3545' : '#6c757d';

        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${sale.id}</td>
            <td>${sale.product ? sale.product.name : 'N/A'}</td>
            <td>${sale.shop ? sale.shop.name : 'N/A'}</td>
            <td>${sale.saleDate}</td>
            <td>${sale.soldUnits}</td>
            <td>${sale.returnedUnits || 0}</td>
            <td>$${income.toFixed(2)}</td>
            <td style="color: ${profitColor}; font-weight: bold;">
                $${profit.toFixed(2)}
            </td>
            <td>
                <div class="action-buttons">
                    <button class="action-btn btn-info" onclick="printSaleBillById(${sale.id})" title="Print Bill">
                        <i class="fas fa-print"></i>
                    </button>
                    <button class="action-btn btn-warning" onclick="editSale(${sale.id})">
                        <i class="fas fa-edit"></i>
                    </button>
                    <button class="action-btn btn-danger" onclick="deleteSale(${sale.id})">
                        <i class="fas fa-trash"></i>
                    </button>
                </div>
            </td>
        `;
        tbody.appendChild(row);
    });
}

// Storage Management
function loadStorageSummary() {
    showLoading();

    // Load all data needed for storage calculations
    Promise.all([
        fetch(`${API_BASE}/products`).then(response => response.json()),
        fetch(`${API_BASE}/ingredients`).then(response => response.json()),
        fetch(`${API_BASE}/production`).then(response => response.json()),
        fetch(`${API_BASE}/sales`).then(response => response.json())
    ])
        .then(([productsData, ingredientsData, productionData, salesData]) => {
            products = productsData;
            ingredients = ingredientsData;

            // Calculate storage levels
            calculateProductStorage(productsData, productionData, salesData);
            calculateIngredientStorage(ingredientsData, productionData);

            hideLoading();
        })
        .catch(error => {
            hideLoading();
            showMessage('Error loading storage data: ' + error.message, 'error');
        });
}

function calculateProductStorage(products, production, sales) {
    const productStorage = {};

    // Initialize all products with 0 storage
    products.forEach(product => {
        productStorage[product.id] = {
            product: product,
            produced: 0,
            sold: 0,
            inStorage: 0
        };
    });

    // Calculate produced quantities
    production.forEach(prod => {
        if (prod.product && productStorage[prod.product.id]) {
            productStorage[prod.product.id].produced += prod.producedUnits;
        }
    });

    // Calculate sold quantities
    sales.forEach(sale => {
        if (sale.product && productStorage[sale.product.id]) {
            productStorage[sale.product.id].sold += sale.soldUnits;
        }
    });

    // Calculate in storage (produced - sold)
    Object.values(productStorage).forEach(item => {
        item.inStorage = item.produced - item.sold;
    });

    // Display product storage summary
    displayProductStorageSummary(productStorage);
    displayProductStorageTable(productStorage);
}

function calculateIngredientStorage(ingredients, production) {
    const ingredientUsage = {};

    // Initialize all ingredients with their current quantities
    ingredients.forEach(ingredient => {
        ingredientUsage[ingredient.id] = {
            ingredient: ingredient,
            used: 0,
            available: ingredient.quantity || 0 // Use actual quantity from database
        };
    });

    // Calculate used quantities from production
    production.forEach(prod => {
        if (prod.usedIngredients) {
            prod.usedIngredients.forEach(usage => {
                if (usage.ingredient && ingredientUsage[usage.ingredient.id]) {
                    ingredientUsage[usage.ingredient.id].used += usage.quantityUsed;
                }
            });
        }
    });

    // Display ingredient storage summary
    displayIngredientStorageSummary(ingredientUsage);
    displayIngredientStorageTable(ingredientUsage);
}

function displayProductStorageSummary(storageData) {
    const summary = document.getElementById('products-storage-summary');
    const totalProducts = Object.keys(storageData).length;
    const totalProduced = Object.values(storageData).reduce((sum, item) => sum + item.produced, 0);
    const totalSold = Object.values(storageData).reduce((sum, item) => sum + item.sold, 0);
    const totalInStorage = Object.values(storageData).reduce((sum, item) => sum + item.inStorage, 0);

    summary.innerHTML = `
        <div class="summary-item">
            <span>Total Products:</span>
            <span>${totalProducts}</span>
        </div>
        <div class="summary-item">
            <span>Total Produced:</span>
            <span>${totalProduced} units</span>
        </div>
        <div class="summary-item">
            <span>Total Sold:</span>
            <span>${totalSold} units</span>
        </div>
        <div class="summary-item">
            <span>In Storage:</span>
            <span>${totalInStorage} units</span>
        </div>
    `;
}

function displayIngredientStorageSummary(storageData) {
    const summary = document.getElementById('ingredients-storage-summary');
    const totalIngredients = Object.keys(storageData).length;
    const totalUsed = Object.values(storageData).reduce((sum, item) => sum + item.used, 0);

    summary.innerHTML = `
        <div class="summary-item">
            <span>Total Ingredients:</span>
            <span>${totalIngredients}</span>
        </div>
        <div class="summary-item">
            <span>Total Used:</span>
            <span>${totalUsed.toFixed(2)} units</span>
        </div>
        <div class="summary-item">
            <span>Types Available:</span>
            <span>${new Set(Object.values(storageData).map(item => item.ingredient.type)).size}</span>
        </div>
    `;
}

function displayProductStorageTable(storageData) {
    const tbody = document.getElementById('storage-products-tbody');
    tbody.innerHTML = '';

    Object.values(storageData).forEach(item => {
        const status = getStorageStatus(item.inStorage);
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${item.product.name}</td>
            <td>${item.produced}</td>
            <td>${item.sold}</td>
            <td>${item.inStorage}</td>
            <td><span class="storage-status ${status.class}">${status.text}</span></td>
        `;
        tbody.appendChild(row);
    });
}

function displayIngredientStorageTable(storageData) {
    const tbody = document.getElementById('storage-ingredients-tbody');
    tbody.innerHTML = '';

    Object.values(storageData).forEach(item => {
        const status = getIngredientStatus(item.used);
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${item.ingredient.name}</td>
            <td>${item.ingredient.type || 'Not specified'}</td>
            <td>${item.used.toFixed(2)}</td>
            <td>${item.available.toFixed(2)}</td>
            <td><span class="storage-status ${status.class}">${status.text}</span></td>
        `;
        tbody.appendChild(row);
    });
}

function getStorageStatus(quantity) {
    if (quantity <= 0) return { class: 'out', text: 'Out of Stock' };
    if (quantity <= 5) return { class: 'low', text: 'Low Stock' };
    if (quantity <= 20) return { class: 'medium', text: 'Medium Stock' };
    return { class: 'high', text: 'High Stock' };
}

function getIngredientStatus(used) {
    if (used === 0) return { class: 'high', text: 'Not Used' };
    if (used <= 10) return { class: 'low', text: 'Low Usage' };
    if (used <= 50) return { class: 'medium', text: 'Medium Usage' };
    return { class: 'out', text: 'High Usage' };
}

function refreshStorageSummary() {
    loadStorageSummary();
}

// Inventory Management
function loadInventory() {
    showLoading();
    fetch(`${API_BASE}/ingredients`)
        .then(response => response.json())
        .then(data => {
            ingredients = data;
            displayInventory(data);
            populateInventoryIngredientSelect();
            calculateInventorySummary(data);
            hideLoading();
        })
        .catch(error => {
            hideLoading();
            showMessage('Error loading inventory: ' + error.message, 'error');
            displayInventory([]);
        });
}

// Dashboard Management
function loadDashboardData() {
    // showLoading(); // Optional: might clash with initial load, but good for feedback

    Promise.all([
        fetch(`${API_BASE}/sales`).then(r => r.json()).catch(err => { console.error("Sales fetch failed", err); return []; }),
        fetch(`${API_BASE}/products`).then(r => r.json()).catch(err => { console.error("Products fetch failed", err); return []; }),
        fetch(`${API_BASE}/shops`).then(r => r.json()).catch(err => { console.error("Shops fetch failed", err); return []; })
    ]).then(([salesData, productsData, shopsData]) => {

        // Populate global state
        sales = salesData;
        products = productsData;
        shops = shopsData;

        console.log("Dashboard state populated:", { sales: sales.length, products: products.length, shops: shops.length });

        // Calculate Totals
        const totalRevenue = sales.reduce((sum, sale) => sum + (sale.totalIncome || 0), 0);
        const totalProfit = sales.reduce((sum, sale) => sum + (sale.totalProfit || 0), 0);
        const totalProducts = products.length;
        const totalShops = shops.length;

        // Update DOM
        const revenueEl = document.getElementById('total-revenue');
        const profitEl = document.getElementById('total-profit');
        const productsEl = document.getElementById('total-products');
        const shopsEl = document.getElementById('total-shops');

        if (revenueEl) revenueEl.textContent = `$${totalRevenue.toFixed(2)}`;
        if (profitEl) profitEl.textContent = `$${totalProfit.toFixed(2)}`;
        if (productsEl) productsEl.textContent = totalProducts;
        if (shopsEl) shopsEl.textContent = totalShops;

        // Update Recent Sales Table
        updateRecentSalesTable(sales);

        // Update Chart
        updateDashboardChart(sales);

    }).catch(err => {
        console.error("Critical error loading dashboard data:", err);
    });
}

function updateRecentSalesTable(salesData) {
    const tbody = document.querySelector('.table tbody');
    if (!tbody) return;

    // Sort by date desc (assuming ID correlates with time or date field exists)
    // The salesData might need sorting.
    const sortedSales = [...salesData].sort((a, b) => {
        return new Date(b.saleDate) - new Date(a.saleDate) || b.id - a.id;
    });

    const recentSales = sortedSales.slice(0, 5);

    tbody.innerHTML = '';

    if (recentSales.length === 0) {
        tbody.innerHTML = '<tr><td colspan="6" class="text-center">No recent sales</td></tr>';
        return;
    }

    recentSales.forEach(sale => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${sale.saleDate}</td>
            <td>${sale.product ? sale.product.name : 'Unknown'}</td>
            <td>${sale.shop ? sale.shop.name : 'Unknown'}</td>
            <td>${sale.soldUnits}</td>
            <td>$${(sale.totalIncome || 0).toFixed(2)}</td>
            <td><span class="badge badge-success">Completed</span></td>
        `;
        tbody.appendChild(row);
    });
}

function updateDashboardChart(salesData) {
    if (typeof Chart === 'undefined') return;

    const canvas = document.getElementById('salesChart');
    if (!canvas) return;

    // Aggregate income by month (simplified)
    const monthlyIncome = {};
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

    // Initialize current year months
    const currentYear = new Date().getFullYear();
    for (let i = 0; i < 12; i++) {
        monthlyIncome[months[i]] = 0;
    }

    salesData.forEach(sale => {
        const date = new Date(sale.saleDate);
        if (date.getFullYear() === currentYear) {
            const monthName = months[date.getMonth()];
            monthlyIncome[monthName] += (sale.totalIncome || 0);
        }
    });

    const data = months.map(m => monthlyIncome[m]);

    // Check if chart instance exists (we need to find it or recreate it)
    // Often it's better to just destroy and recreate if we don't store the instance.
    // However, index.html creates it. Let's try to update it if global or just let it be.
    // For now, let's just log that we calculated the data.
    console.log("Monthly Sales Data for Chart:", monthlyIncome);

    // If we want to really update it, we need the chart object. 
    // Let's assume the user might have others, so we will try to find it on the canvas
    const chart = Chart.getChart(canvas);
    if (chart) {
        chart.data.datasets[0].data = data;
        chart.update();
    }
}

function showAddInventoryForm() {
    document.getElementById('add-inventory-form').style.display = 'block';
    document.getElementById('inventory-form').reset();
    populateInventoryIngredientSelect();
}

function hideAddInventoryForm() {
    document.getElementById('add-inventory-form').style.display = 'none';
}

function populateInventoryIngredientSelect() {
    const select = document.getElementById('inventory-ingredient');
    select.innerHTML = '<option value="">Select an ingredient</option>';

    ingredients.forEach(ingredient => {
        const option = document.createElement('option');
        option.value = ingredient.id;
        option.textContent = `${ingredient.name} (${ingredient.type || 'No type'})`;
        select.appendChild(option);
    });
}

function handleInventorySubmit(e) {
    e.preventDefault();
    const formData = new FormData(e.target);
    const ingredientId = formData.get('ingredientId');
    const quantity = parseFloat(formData.get('quantity'));
    const pricePerUnit = parseFloat(formData.get('pricePerUnit'));
    const operation = formData.get('operation');

    const ingredient = ingredients.find(ing => ing.id == ingredientId);
    if (!ingredient) {
        showMessage('Ingredient not found', 'error');
        return;
    }

    // Calculate new quantity based on operation
    let newQuantity = quantity;
    if (operation === 'add') {
        newQuantity = (ingredient.quantity || 0) + quantity;
    } else if (operation === 'subtract') {
        newQuantity = Math.max(0, (ingredient.quantity || 0) - quantity);
    }

    const updatedIngredient = {
        ...ingredient,
        quantity: newQuantity,
        pricePerUnit: pricePerUnit
    };

    showLoading();
    fetch(`${API_BASE}/ingredient`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(updatedIngredient)
    })
        .then(response => response.json())
        .then(data => {
            hideLoading();
            showMessage('Inventory updated successfully!', 'success');
            hideAddInventoryForm();
            loadInventory();
        })
        .catch(error => {
            hideLoading();
            showMessage('Error updating inventory: ' + error.message, 'error');
        });
}

function displayInventory(ingredients) {
    const tbody = document.getElementById('inventory-tbody');
    tbody.innerHTML = '';

    if (ingredients.length === 0) {
        tbody.innerHTML = '<tr><td colspan="7" class="text-center">No inventory data found</td></tr>';
        return;
    }

    ingredients.forEach(ingredient => {
        const quantity = ingredient.quantity || 0;
        const pricePerUnit = ingredient.pricePerUnit || 0;
        const totalValue = quantity * pricePerUnit;
        const status = getInventoryStatus(quantity);

        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${ingredient.name}</td>
            <td>${ingredient.type || 'Not specified'}</td>
            <td>${quantity.toFixed(2)}</td>
            <td>$${pricePerUnit.toFixed(2)}</td>
            <td>$${totalValue.toFixed(2)}</td>
            <td><span class="storage-status ${status.class}">${status.text}</span></td>
            <td>
                <div class="action-buttons">
                    <button class="action-btn btn-warning" onclick="editInventoryItem(${ingredient.id})">
                        <i class="fas fa-edit"></i>
                    </button>
                </div>
            </td>
        `;
        tbody.appendChild(row);
    });
}

function calculateInventorySummary(ingredients) {
    const totalValue = ingredients.reduce((sum, ingredient) => {
        const quantity = ingredient.quantity || 0;
        const pricePerUnit = ingredient.pricePerUnit || 0;
        return sum + (quantity * pricePerUnit);
    }, 0);

    const totalItems = ingredients.length;
    const itemsWithStock = ingredients.filter(ing => (ing.quantity || 0) > 0).length;
    const lowStockItems = ingredients.filter(ing => {
        const qty = ing.quantity || 0;
        return qty > 0 && qty <= 10;
    }).length;

    // Display total inventory value
    const valueElement = document.getElementById('total-inventory-value');
    valueElement.innerHTML = `
        <div class="inventory-value">$${totalValue.toFixed(2)}</div>
    `;

    // Display inventory summary
    const summaryElement = document.getElementById('inventory-summary');
    summaryElement.innerHTML = `
        <div class="summary-item">
            <span>Total Items:</span>
            <span>${totalItems}</span>
        </div>
        <div class="summary-item">
            <span>In Stock:</span>
            <span>${itemsWithStock}</span>
        </div>
        <div class="summary-item">
            <span>Low Stock:</span>
            <span>${lowStockItems}</span>
        </div>
        <div class="summary-item">
            <span>Out of Stock:</span>
            <span>${totalItems - itemsWithStock}</span>
        </div>
    `;
}

function getInventoryStatus(quantity) {
    if (quantity <= 0) return { class: 'out', text: 'Out of Stock' };
    if (quantity <= 10) return { class: 'low', text: 'Low Stock' };
    if (quantity <= 50) return { class: 'medium', text: 'Medium Stock' };
    return { class: 'high', text: 'High Stock' };
}

function editInventoryItem(ingredientId) {
    const ingredient = ingredients.find(ing => ing.id == ingredientId);
    if (!ingredient) return;

    showAddInventoryForm();
    document.getElementById('inventory-ingredient').value = ingredient.id;
    document.getElementById('inventory-quantity').value = ingredient.quantity || 0;
    document.getElementById('inventory-price').value = ingredient.pricePerUnit || 0;
    document.getElementById('inventory-operation').value = 'set';
}

// Utility Functions
function loadAllData() {
    loadProducts();
    loadIngredients();
    loadProduction();
    loadSales();
    loadShops();
}

function loadProductsForSelect(selectId) {
    const select = document.getElementById(selectId);
    if (!select) return;

    const populate = () => {
        select.innerHTML = '<option value="">Select a product</option>';
        products.forEach(product => {
            const option = document.createElement('option');
            option.value = product.id;
            option.textContent = product.name;
            select.appendChild(option);
        });
    };

    if (products.length > 0) {
        populate();
    } else {
        fetch(`${API_BASE}/products`)
            .then(response => response.json())
            .then(data => {
                products = data;
                populate();
            })
            .catch(error => {
                console.error('Error loading products for select:', error);
                // Optionally show error in select
                select.innerHTML = '<option value="">Error loading products</option>';
            });
    }
}

function loadShopsForSelect(selectId) {
    const select = document.getElementById(selectId);
    select.innerHTML = '<option value="">Select a shop</option>';

    shops.forEach(shop => {
        const option = document.createElement('option');
        option.value = shop.id;
        option.textContent = shop.name;
        select.appendChild(option);
    });
}

function setCurrentDate(inputId = null) {
    const today = new Date().toISOString().split('T')[0];
    if (inputId) {
        const input = document.getElementById(inputId);
        if (input) {
            input.value = today;
        }
    }
}

function setCurrentMonth() {
    const today = new Date();
    const currentMonth = today.getFullYear() + '-' + String(today.getMonth() + 1).padStart(2, '0');
    const monthInput = document.getElementById('report-month');
    if (monthInput) {
        monthInput.value = currentMonth;
        // Generate report for current month
        generateMonthlyReport();
    }
}

function showLoading() {
    document.getElementById('loading').style.display = 'block';
}

function hideLoading() {
    document.getElementById('loading').style.display = 'none';
}

function showMessage(text, type) {
    const messageDiv = document.getElementById('message');
    messageDiv.textContent = text;
    messageDiv.className = `message ${type}`;
    messageDiv.style.display = 'block';

    setTimeout(() => {
        messageDiv.style.display = 'none';
    }, 3000);
}

// Placeholder functions for edit/delete operations
function editProduct(id) {
    const product = products.find(p => p.id === id);
    if (!product) {
        showMessage('Product not found!', 'error');
        return;
    }

    showAddProductForm();
    document.getElementById('product-name').value = product.name;
    document.getElementById('product-price').value = product.basePrice;
    document.getElementById('product-selling-price').value = product.sellingPrice;
    document.getElementById('product-cost').value = product.productCost;

    document.querySelector('#add-product-form h3').textContent = 'Edit Product';
    document.getElementById('product-form').dataset.editId = id;
}

function deleteProduct(id) {
    if (confirm('Are you sure you want to delete this product?')) {
        showLoading();
        fetch(`${API_BASE}/product/${id}`, {
            method: 'DELETE'
        })
            .then(() => {
                hideLoading();
                showMessage('Product deleted successfully!', 'success');
                loadProducts();
            })
            .catch(error => {
                hideLoading();
                showMessage('Error deleting product: ' + error.message, 'error');
            });
    }
}

function editIngredient(id) {
    const ingredient = ingredients.find(i => i.id === id);
    if (!ingredient) {
        showMessage('Ingredient not found!', 'error');
        return;
    }

    showAddIngredientForm();
    document.getElementById('ingredient-name').value = ingredient.name;
    document.getElementById('ingredient-type').value = ingredient.type || '';
    document.getElementById('ingredient-quantity').value = ingredient.quantity;
    document.getElementById('ingredient-price').value = ingredient.pricePerUnit;

    document.querySelector('#add-ingredient-form h3').textContent = 'Edit Ingredient';
    document.getElementById('ingredient-form').dataset.editId = id;
}

function deleteIngredient(id) {
    if (confirm('Are you sure you want to delete this ingredient?')) {
        showLoading();
        fetch(`${API_BASE}/ingredient/${id}`, {
            method: 'DELETE'
        })
            .then(() => {
                hideLoading();
                showMessage('Ingredient deleted successfully!', 'success');
                loadIngredients();
            })
            .catch(error => {
                hideLoading();
                showMessage('Error deleting ingredient: ' + error.message, 'error');
            });
    }
}

function editProduction(id) {
    showMessage('Production edit functionality coming soon!', 'info');
}

function deleteProduction(id) {
    if (confirm('Are you sure you want to delete this production record?')) {
        showLoading();
        fetch(`${API_BASE}/production/${id}`, {
            method: 'DELETE'
        })
            .then(() => {
                hideLoading();
                showMessage('Production record deleted successfully!', 'success');
                loadProduction();
            })
            .catch(error => {
                hideLoading();
                showMessage('Error deleting production: ' + error.message, 'error');
            });
    }
}

function editSale(id) {
    const sale = sales.find(s => s.id === id);
    if (!sale) {
        showMessage('Sale not found!', 'error');
        return;
    }

    // Show the form
    showAddSaleForm();

    // Populate the form with sale data
    document.getElementById('sale-product').value = sale.product ? sale.product.id : '';
    document.getElementById('sale-shop').value = sale.shop ? sale.shop.id : '';
    document.getElementById('sale-date').value = sale.saleDate;
    document.getElementById('sale-units').value = sale.soldUnits;
    document.getElementById('sale-returns').value = sale.returnedUnits;

    // Change form title and button text
    document.querySelector('#add-sale-form h3').textContent = 'Edit Sale';
    const submitBtn = document.querySelector('#sale-form button[type="submit"]');
    submitBtn.innerHTML = '<i class="fas fa-save"></i> Update Sale';

    // Store the sale ID for update
    document.getElementById('sale-form').dataset.editId = id;

    // Update calculated values
    if (typeof calculateSaleValues === 'function') {
        calculateSaleValues();
    }
}

function printSaleBillById(id) {
    const sale = sales.find(s => s.id === id);
    if (!sale) {
        showMessage('Sale not found!', 'error');
        return;
    }

    const product = sale.product;
    const shop = sale.shop;
    printSaleBill(sale, product, shop);
}

function deleteSale(id) {
    if (confirm('Are you sure you want to delete this sale record?')) {
        showLoading();
        fetch(`${API_BASE}/sale/${id}`, {
            method: 'DELETE'
        })
            .then(() => {
                hideLoading();
                showMessage('Sale deleted successfully!', 'success');
                loadSales();
                // Refresh reports if we're on the sales tab
                if (currentTab === 'sales') {
                    generateMonthlyReport();
                    generateDailyReport();
                }
            })
            .catch(error => {
                hideLoading();
                showMessage('Error deleting sale: ' + error.message, 'error');
            });
    }
}

// Shop Management
function showAddShopForm() {
    document.getElementById('add-shop-form').style.display = 'block';
    document.getElementById('shop-form').reset();
}

function hideAddShopForm() {
    document.getElementById('add-shop-form').style.display = 'none';
    document.getElementById('shop-form').reset();
    delete document.getElementById('shop-form').dataset.editId;
    // Reset Header
    const header = document.querySelector('#add-shop-form .card-header h3');
    if (header) header.innerHTML = '<i class="fas fa-plus-circle"></i> Add Shop';
}

function handleShopSubmit(e) {
    e.preventDefault();
    const formData = new FormData(e.target);

    const shop = {
        name: formData.get('name'),
        address: formData.get('address'),
        contactNumber: formData.get('contactNumber'),
        email: formData.get('email')
    };

    const editId = e.target.dataset.editId;
    if (editId) {
        shop.id = parseInt(editId);
        console.log('Updating existing shop. ID:', shop.id);
    } else {
        console.log('Creating new shop.');
    }

    console.log('Sending shop payload:', JSON.stringify(shop));

    showLoading();
    fetch(`${API_BASE}/shop`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(shop)
    })
        .then(response => response.json())
        .then(data => {
            hideLoading();
            const message = editId ? 'Shop updated successfully!' : 'Shop added successfully!';
            showMessage(message, 'success');
            hideAddShopForm();
            loadShops(); // Reload list
        })
        .catch(error => {
            hideLoading();
            console.error('Error saving shop:', error);
            showMessage('Error saving shop: ' + error.message, 'error');
        });
}

function loadShops() {
    console.log('Loading shops...');
    return new Promise((resolve, reject) => {
        showLoading();
        fetch(`${API_BASE}/shops`)
            .then(response => {
                if (!response.ok) {
                    throw new Error('Network response was not ok ' + response.statusText);
                }
                return response.json();
            })
            .then(data => {
                console.log('Shops loaded:', data);
                shops = data || []; // Ensure it's an array
                displayShops();
                hideLoading();
                resolve(data);
            })
            .catch(error => {
                hideLoading();
                console.error('Error loading shops:', error);
                showMessage('Error loading shops: ' + error.message, 'error');
                shops = []; // Reset on error
                displayShops(); // Clear table
                reject(error);
            });
    });
}

function displayShops() {
    const tbody = document.getElementById('shops-tbody');
    if (!tbody) {
        console.error('shops-tbody not found!');
        return;
    }
    tbody.innerHTML = '';

    if (!shops || shops.length === 0) {
        tbody.innerHTML = '<tr><td colspan="6" class="text-center">No shops found</td></tr>';
        return;
    }

    shops.forEach(shop => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${shop.id}</td>
            <td>${shop.name}</td>
            <td>${shop.address || ''}</td>
            <td>${shop.contactNumber || ''}</td>
            <td>${shop.email || 'N/A'}</td>
            <td>
                <button class="btn btn-sm btn-primary" onclick="editShop(${shop.id})">
                    <i class="fas fa-edit"></i> Edit
                </button>
                <button class="btn btn-sm btn-danger" onclick="deleteShop(${shop.id})">
                    <i class="fas fa-trash"></i> Delete
                </button>
            </td>
        `;
        tbody.appendChild(row);
    });

    // Populate shop history dropdown
    if (typeof populateShopHistoryDropdown === 'function') {
        populateShopHistoryDropdown();
    }
}

function populateShopHistoryDropdown() {
    const select = document.getElementById('shop-history-select');
    select.innerHTML = '<option value="">-- Select a Shop --</option>';

    shops.forEach(shop => {
        const option = document.createElement('option');
        option.value = shop.id;
        option.textContent = shop.name;
        select.appendChild(option);
    });
}

function loadShopSalesHistory() {
    const shopId = document.getElementById('shop-history-select').value;

    if (!shopId) {
        document.getElementById('shop-sales-history').style.display = 'none';
        document.getElementById('print-shop-history-btn').disabled = true;
        return;
    }

    const shop = shops.find(s => s.id == shopId);
    if (!shop) return;

    // Filter sales for this shop
    const shopSales = sales.filter(sale => sale.shop && sale.shop.id == shopId);

    // Calculate totals
    let totalSales = 0;
    let totalUnits = 0;
    let totalReturns = 0;

    shopSales.forEach(sale => {
        totalSales += sale.totalIncome || (sale.soldUnits * (sale.product ? sale.product.sellingPrice : 0));
        totalUnits += sale.soldUnits;
        totalReturns += sale.returnedUnits;
    });

    // Update summary cards
    document.getElementById('shop-total-sales').textContent = `$${totalSales.toFixed(2)}`;
    document.getElementById('shop-total-units').textContent = totalUnits;
    document.getElementById('shop-total-returns').textContent = totalReturns;
    document.getElementById('shop-total-transactions').textContent = shopSales.length;

    // Display sales history table
    displayShopSalesHistory(shopSales, shop);

    // Show the history section and enable print button
    document.getElementById('shop-sales-history').style.display = 'block';
    document.getElementById('print-shop-history-btn').disabled = false;
}

function displayShopSalesHistory(shopSales, shop) {
    const tbody = document.getElementById('shop-history-tbody');
    tbody.innerHTML = '';

    if (shopSales.length === 0) {
        tbody.innerHTML = '<tr><td colspan="6" class="text-center">No sales history found for this shop</td></tr>';
        return;
    }

    // Sort by date (newest first)
    shopSales.sort((a, b) => new Date(b.saleDate) - new Date(a.saleDate));

    shopSales.forEach(sale => {
        const income = sale.totalIncome || (sale.soldUnits * (sale.product ? sale.product.sellingPrice : 0));
        const profit = sale.totalProfit || 0;
        const profitColor = profit > 0 ? '#28a745' : profit < 0 ? '#dc3545' : '#6c757d';

        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${sale.saleDate}</td>
            <td>${sale.product ? sale.product.name : 'N/A'}</td>
            <td>${sale.soldUnits}</td>
            <td>${sale.returnedUnits}</td>
            <td>$${income.toFixed(2)}</td>
            <td style="color: ${profitColor}; font-weight: bold;">$${profit.toFixed(2)}</td>
        `;
        tbody.appendChild(row);
    });
}

function editShop(id) {
    console.log('editShop called with ID:', id, 'Type:', typeof id);
    console.log('Current shops array:', shops);

    // Use loose equality == to match string/number IDs just in case
    const shop = shops.find(s => s.id == id);

    if (shop) {
        console.log('Found shop:', shop);
        document.getElementById('shop-name').value = shop.name;
        document.getElementById('shop-address').value = shop.address;
        document.getElementById('shop-contact').value = shop.contactNumber;
        document.getElementById('shop-email').value = shop.email || '';

        const form = document.getElementById('shop-form');
        form.dataset.editId = id;

        const header = document.querySelector('#add-shop-form .card-header h3');
        if (header) header.innerHTML = '<i class="fas fa-edit"></i> Edit Shop';

        document.getElementById('add-shop-form').style.display = 'block';
    } else {
        console.error('Shop not found for ID:', id);
        // Fallback: Try to fetch if not found locally
        fetch(`${API_BASE}/shops`)
            .then(response => response.json())
            .then(data => {
                shops = data;
                const fetchedShop = shops.find(s => s.id == id);
                if (fetchedShop) {
                    editShop(id); // Retry
                } else {
                    showMessage('Error: Shop not found', 'error');
                }
            });
    }
}

function deleteShop(id) {
    if (confirm('Are you sure you want to delete this shop?')) {
        showLoading();
        fetch(`${API_BASE}/shop/${id}`, {
            method: 'DELETE'
        })
            .then(() => {
                hideLoading();
                showMessage('Shop deleted successfully!', 'success');
                loadShops();
            })
            .catch(error => {
                hideLoading();
                showMessage('Error deleting shop: ' + error.message, 'error');
            });
    }
}

// Monthly Report Functions
function generateMonthlyReport() {
    const monthInput = document.getElementById('report-month');
    const selectedMonth = monthInput.value;

    if (!selectedMonth) {
        showMessage('Please select a month to generate the report', 'error');
        return;
    }

    const [year, month] = selectedMonth.split('-');
    const startDate = new Date(year, month - 1, 1);
    const endDate = new Date(year, month, 0);

    // Filter sales for the selected month
    const monthlySales = sales.filter(sale => {
        const saleDate = new Date(sale.saleDate);
        return saleDate >= startDate && saleDate <= endDate;
    });

    generateMonthlyReportData(monthlySales);
}

function generateMonthlyReportData(monthlySales) {
    const shopData = {};
    let totalSales = 0;
    let totalReturns = 0;
    let totalProfit = 0;

    // Group sales by shop
    monthlySales.forEach(sale => {
        const shopName = sale.shop ? sale.shop.name : 'Unknown Shop';

        if (!shopData[shopName]) {
            shopData[shopName] = {
                shopName: shopName,
                totalSoldUnits: 0,
                totalReturnedUnits: 0,
                totalIncome: 0,
                totalProfit: 0
            };
        }

        shopData[shopName].totalSoldUnits += sale.soldUnits || 0;
        shopData[shopName].totalReturnedUnits += sale.returnedUnits || 0;
        shopData[shopName].totalIncome += sale.totalIncome || 0;
        shopData[shopName].totalProfit += sale.totalProfit || 0;

        totalSales += sale.totalIncome || 0;
        totalReturns += sale.returnedUnits || 0;
        totalProfit += sale.totalProfit || 0;
    });

    // Update summary cards
    document.getElementById('total-sales').textContent = `$${totalSales.toFixed(2)}`;
    document.getElementById('total-returns').textContent = `${totalReturns} units`;
    document.getElementById('net-profit').textContent = `$${totalProfit.toFixed(2)}`;

    // Display shop data in table
    displayMonthlyReportTable(shopData);
}

function displayMonthlyReportTable(shopData) {
    const tbody = document.getElementById('monthly-report-tbody');
    tbody.innerHTML = '';

    if (Object.keys(shopData).length === 0) {
        tbody.innerHTML = '<tr><td colspan="6" class="text-center">No sales data for the selected month</td></tr>';
        return;
    }

    Object.values(shopData).forEach(shop => {
        const returnRate = shop.totalSoldUnits > 0 ?
            ((shop.totalReturnedUnits / shop.totalSoldUnits) * 100) : 0;

        let returnRateClass = 'low';
        if (returnRate > 10) returnRateClass = 'medium';
        if (returnRate > 20) returnRateClass = 'high';

        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${shop.shopName}</td>
            <td>${shop.totalSoldUnits}</td>
            <td>${shop.totalReturnedUnits}</td>
            <td>$${shop.totalIncome.toFixed(2)}</td>
            <td>$${shop.totalProfit.toFixed(2)}</td>
            <td class="return-rate ${returnRateClass}">${returnRate.toFixed(1)}%</td>
        `;
        tbody.appendChild(row);
    });
}

// Daily Report Functions
function generateDailyReport() {
    const dateInput = document.getElementById('report-date');
    const selectedDate = dateInput.value;

    if (!selectedDate) {
        showMessage('Please select a date to generate the daily report', 'error');
        return;
    }

    // Filter sales for the selected date
    const dailySales = sales.filter(sale => {
        return sale.saleDate === selectedDate;
    });

    generateDailyReportData(dailySales, selectedDate);
}

function generateTodayReport() {
    const today = new Date().toISOString().split('T')[0];
    document.getElementById('report-date').value = today;
    generateDailyReport();
}

function generateDailyReportData(dailySales, selectedDate) {
    let totalSales = 0;
    let totalReturns = 0;
    let totalProfit = 0;
    const activeShops = new Set();

    // Calculate totals
    dailySales.forEach(sale => {
        totalSales += sale.totalIncome || 0;
        totalReturns += sale.returnedUnits || 0;
        totalProfit += sale.totalProfit || 0;
        if (sale.shop) {
            activeShops.add(sale.shop.name);
        }
    });

    // Update summary cards
    document.getElementById('daily-total-sales').textContent = `$${totalSales.toFixed(2)}`;
    document.getElementById('daily-total-returns').textContent = `${totalReturns} units`;
    document.getElementById('daily-net-profit').textContent = `$${totalProfit.toFixed(2)}`;
    document.getElementById('daily-active-shops').textContent = activeShops.size;

    // Display daily sales in table
    displayDailyReportTable(dailySales);
}

function displayDailyReportTable(dailySales) {
    const tbody = document.getElementById('daily-report-tbody');
    tbody.innerHTML = '';

    if (dailySales.length === 0) {
        tbody.innerHTML = '<tr><td colspan="7" class="text-center">No sales data for the selected date</td></tr>';
        return;
    }

    // Sort by time (assuming we have time information)
    dailySales.sort((a, b) => {
        const timeA = a.time || '00:00';
        const timeB = b.time || '00:00';
        return timeA.localeCompare(timeB);
    });

    dailySales.forEach(sale => {
        const income = sale.totalIncome || 0;
        const profit = sale.totalProfit || 0;
        const profitColor = profit > 0 ? '#28a745' : profit < 0 ? '#dc3545' : '#6c757d';
        const time = sale.time || 'N/A';

        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${sale.shop ? sale.shop.name : 'N/A'}</td>
            <td>${sale.product ? sale.product.name : 'N/A'}</td>
            <td>${sale.soldUnits || 0}</td>
            <td>${sale.returnedUnits || 0}</td>
            <td>$${income.toFixed(2)}</td>
            <td style="color: ${profitColor}; font-weight: bold;">$${profit.toFixed(2)}</td>
            <td>${time}</td>
        `;
        tbody.appendChild(row);
    });
}

function handleProductSubmit(e) {
    e.preventDefault();
    const form = e.target;
    const formData = new FormData(form);

    const name = (formData.get('name') || '').trim();
    const basePriceRaw = formData.get('basePrice');
    const sellingPriceRaw = formData.get('sellingPrice');
    const productCostRaw = formData.get('productCost');

    const basePrice = basePriceRaw !== null && basePriceRaw !== '' ? parseFloat(basePriceRaw) : null;
    const sellingPrice = sellingPriceRaw !== null && sellingPriceRaw !== '' ? parseFloat(sellingPriceRaw) : 0;
    const productCost = productCostRaw !== null && productCostRaw !== '' ? parseFloat(productCostRaw) : 0;

    // Basic client validation
    if (!name) {
        showMessage('Product name is required', 'error');
        return;
    }
    if (basePrice === null || isNaN(basePrice)) {
        showMessage('Base price is required and must be a number', 'error');
        return;
    }

    const product = {
        name: name,
        basePrice: basePrice,
        sellingPrice: isNaN(sellingPrice) ? 0 : sellingPrice,
        productCost: isNaN(productCost) ? 0 : productCost
    };

    const editId = form.dataset.editId;
    if (editId) {
        product.id = parseInt(editId);
    }

    // Debug/logging to verify payload
    console.log('Saving product payload:', JSON.stringify(product));

    showLoading();
    fetch(`${API_BASE}/product`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(product)
    })
        .then(response => {
            hideLoading();
            if (!response.ok) {
                return response.json().then(err => { throw new Error(err.message || 'Failed saving product'); });
            }
            return response.json();
        })
        .then(data => {
            const message = editId ? 'Product updated successfully!' : 'Product added successfully!';
            showMessage(message, 'success');
            hideAddProductForm();
            loadProducts();
        })
        .catch(error => {
            hideLoading();
            showMessage('Error saving product: ' + error.message, 'error');
            console.error('Product save error:', error);
        });
}

// Robust loadProducts
function loadProducts() {
    showLoading();
    fetch(`${API_BASE}/products`)
        .then(async response => {
            if (!response.ok) {
                let err = `Failed to load products: ${response.status}`;
                try {
                    const j = await response.json();
                    err = j.message || JSON.stringify(j);
                } catch (e) { }
                throw new Error(err);
            }
            return response.json();
        })
        .then(data => {
            hideLoading();
            // defensive: ensure an array
            products = Array.isArray(data) ? data : (data ? [data] : []);
            console.info('Loaded products:', products);
            displayProducts(products);
        })
        .catch(error => {
            hideLoading();
            console.error('Error loading products:', error);
            showMessage('Error loading products: ' + error.message, 'error');
            displayProducts([]); // show empty table
        });
}
