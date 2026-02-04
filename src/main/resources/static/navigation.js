// Shared Navigation Component for Professional Theme
const navItems = [
    { id: 'dashboard', icon: 'fa-chart-line', label: 'Dashboard', page: 'index.html' },
    { id: 'products', icon: 'fa-box', label: 'Products', page: 'products.html' },
    { id: 'ingredients', icon: 'fa-leaf', label: 'Ingredients', page: 'ingredients.html' },
    { id: 'inventory', icon: 'fa-boxes', label: 'Inventory', page: 'inventory.html' },
    { id: 'production', icon: 'fa-industry', label: 'Production', page: 'production.html' },
    { id: 'sales', icon: 'fa-chart-bar', label: 'Sales', page: 'sales.html' },
    { id: 'shops', icon: 'fa-store', label: 'Shops', page: 'shops.html' },
    { id: 'storage', icon: 'fa-warehouse', label: 'Storage', page: 'storage.html' }
];

function createNavbar(currentPage = '') {
    let menuHtml = '';
    // Use first 6 items for top nav
    navItems.slice(0, 6).forEach(item => {
        const isActive = currentPage === item.id ? 'active' : '';
        menuHtml += `<a href="${item.page}" class="${isActive}">${item.label}</a>`;
    });

    return `
    <nav class="navbar">
        <div class="navbar-brand">
            <i class="fas fa-utensils"></i>
            Myland Food Management
        </div>
        <div class="navbar-menu">
            ${menuHtml}
        </div>
        <div class="navbar-right">
            <i class="fas fa-bell"></i>
            <i class="fas fa-user-circle"></i>
        </div>
    </nav>`;
}

function createSidebar(currentPage = '') {
    let sidebarHtml = '<aside class="sidebar"><ul class="sidebar-menu">';
    
    navItems.forEach(item => {
        const isActive = currentPage === item.id ? 'active' : '';
        sidebarHtml += `
            <li>
                <a href="${item.page}" class="${isActive}">
                    <i class="fas ${item.icon}"></i> ${item.label}
                </a>
            </li>`;
    });
    
    sidebarHtml += '</ul></aside>';
    return sidebarHtml;
}

// Insert navigation components into page
document.addEventListener('DOMContentLoaded', function() {
    const navPlaceholder = document.getElementById('navigation');
    if (navPlaceholder) {
        const currentPage = navPlaceholder.getAttribute('data-current-page') || '';
        
        // Create components
        const navbar = createNavbar(currentPage);
        const sidebar = createSidebar(currentPage);
        
        // Insert into body
        document.body.insertAdjacentHTML('afterbegin', navbar);
        const navbarElement = document.querySelector('.navbar');
        navbarElement.insertAdjacentHTML('afterend', sidebar);
        
        // Remove the placeholder if it was just a marker
        if (navPlaceholder.innerHTML.trim() === '') {
            navPlaceholder.remove();
        }
    }
});
