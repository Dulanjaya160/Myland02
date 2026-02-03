// Shared Navigation Component
function createNavigation(currentPage = '') {
    const navItems = [
        { id: 'products', icon: 'fa-box', label: 'Products', page: 'products.html' },
        { id: 'ingredients', icon: 'fa-leaf', label: 'Ingredients', page: 'ingredients.html' },
        { id: 'production', icon: 'fa-industry', label: 'Production', page: 'production.html' },
        { id: 'sales', icon: 'fa-chart-line', label: 'Sales', page: 'sales.html' },
        { id: 'storage', icon: 'fa-warehouse', label: 'Storage', page: 'storage.html' },
        { id: 'inventory', icon: 'fa-boxes', label: 'Inventory', page: 'inventory.html' },
        { id: 'shops', icon: 'fa-store', label: 'Shops', page: 'shops.html' }
    ];
    
    let navHTML = '<nav class="nav-menu">';
    navHTML += '<a href="index.html" class="nav-brand"><i class="fas fa-utensils"></i> Myland Food</a>';
    navHTML += '<div class="nav-links">';
    
    navItems.forEach(item => {
        const isActive = currentPage === item.id ? 'active' : '';
        navHTML += `<a href="${item.page}" class="nav-link ${isActive}">
            <i class="fas ${item.icon}"></i> ${item.label}
        </a>`;
    });
    
    navHTML += '</div>';
    navHTML += '</nav>';
    
    return navHTML;
}

// Insert navigation into page
document.addEventListener('DOMContentLoaded', function() {
    const navContainer = document.getElementById('navigation');
    if (navContainer) {
        const currentPage = navContainer.getAttribute('data-current-page') || '';
        navContainer.innerHTML = createNavigation(currentPage);
    }
});
