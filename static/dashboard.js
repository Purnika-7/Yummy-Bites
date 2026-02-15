// Load dashboard data on page load
document.addEventListener('DOMContentLoaded', async () => {
    await checkAuth();
    await loadUserData();
    await loadOrders();
    setupDashboardNavigation();
});

// Check if user is authenticated
async function checkAuth() {
    try {
        const response = await fetch('/api/check-session');
        const data = await response.json();
        
        if (!data.logged_in) {
            window.location.href = '/login';
            return;
        }
        
        // Display username
        document.getElementById('username-display').textContent = data.username;
        document.getElementById('profile-username').textContent = data.username;
    } catch (error) {
        console.error('Auth check error:', error);
        window.location.href = '/login';
    }
}

// Load user data
async function loadUserData() {
    try {
        const response = await fetch('/api/check-session');
        const data = await response.json();
        
        if (data.logged_in) {
            document.getElementById('username-display').textContent = data.username;
            document.getElementById('profile-username').textContent = data.username;
        }
    } catch (error) {
        console.error('Error loading user data:', error);
    }
}

// Load orders
async function loadOrders() {
    try {
        const response = await fetch('/api/orders');
        const orders = await response.json();
        
        displayOrders(orders);
        
        // Update total orders count
        document.getElementById('total-orders').textContent = orders.length;
    } catch (error) {
        console.error('Error loading orders:', error);
    }
}

// Display orders
function displayOrders(orders) {
    const ordersContainer = document.getElementById('orders-container');
    
    if (orders.length === 0) {
        ordersContainer.innerHTML = `
            <div class="empty-orders">
                <h3>No orders yet 📦</h3>
                <p>Start ordering delicious food from our menu!</p>
                <a href="/#menu" class="cta-button" style="margin-top: 1rem; display: inline-block;">View Menu</a>
            </div>
        `;
        return;
    }
    
    ordersContainer.innerHTML = '';
    
    orders.forEach(order => {
        const orderCard = document.createElement('div');
        orderCard.className = 'order-card';
        
        // Format date
        const date = new Date(order.created_at);
        const formattedDate = date.toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
        
        // Build items HTML
        let itemsHTML = '';
        order.items.forEach(item => {
            const itemTotal = item.price * item.quantity;
            const itemPriceText = 'Rs ' + parseInt(itemTotal);
            
            itemsHTML += `
                <div class="order-item">
                    <span>${item.name} x${item.quantity}</span>
                    <span>${itemPriceText}</span>
                </div>
            `;
        });
        
        const totalPriceText = 'Rs ' + parseInt(order.total);
        
        orderCard.innerHTML = `
            <div class="order-header">
                <div class="order-id">Order #${order.id}</div>
                <div class="order-status ${order.status}">${order.status}</div>
            </div>
            <div class="order-items">
                ${itemsHTML}
            </div>
            <div class="order-footer">
                <div class="order-date">${formattedDate}</div>
                <div class="order-total">Total: ${totalPriceText}</div>
            </div>
        `;
        
        ordersContainer.appendChild(orderCard);
    });
}

// Setup dashboard navigation
function setupDashboardNavigation() {
    const navLinks = document.querySelectorAll('.sidebar-link');
    const sections = document.querySelectorAll('.dashboard-section');
    
    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            
            const sectionId = link.getAttribute('data-section');
            
            // Update active states
            navLinks.forEach(l => l.classList.remove('active'));
            link.classList.add('active');
            
            // Show correct section
            sections.forEach(section => {
                section.classList.remove('active');
            });
            
            document.getElementById(`${sectionId}-section`).classList.add('active');
        });
    });
}

// Logout functionality
document.getElementById('logout-btn')?.addEventListener('click', async () => {
    try {
        await fetch('/api/logout', {
            method: 'POST'
        });
        window.location.href = '/';
    } catch (error) {
        console.error('Logout error:', error);
    }
});
