// Global cart array
let cart = [];
let menuItems = [];

// Load menu items on page load
document.addEventListener('DOMContentLoaded', async () => {
    await loadMenu();
    setupEventListeners();
    checkLoginStatus();
    loadCartFromStorage();
});

// Check if user is logged in
async function checkLoginStatus() {
    try {
        const response = await fetch('/api/check-session');
        const data = await response.json();
        
        if (data.logged_in) {
            document.getElementById('login-link').style.display = 'none';
            document.getElementById('dashboard-link').style.display = 'block';
            document.getElementById('logout-btn').style.display = 'block';
        } else {
            document.getElementById('login-link').style.display = 'block';
            document.getElementById('dashboard-link').style.display = 'none';
            document.getElementById('logout-btn').style.display = 'none';
        }
    } catch (error) {
        console.error('Error checking login status:', error);
    }
}

// Logout
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

// Load menu from API
async function loadMenu() {
    try {
        const response = await fetch('/api/menu');
        menuItems = await response.json();
        console.log('Menu items loaded:', menuItems); // Debug log
        displayMenu(menuItems);
    } catch (error) {
        console.error('Error loading menu:', error);
    }
}

// Display menu items
function displayMenu(items) {
    const menuGrid = document.getElementById('menu-grid');
    menuGrid.innerHTML = '';
    
    items.forEach(item => {
        const menuItem = document.createElement('div');
        menuItem.className = 'menu-item';
        menuItem.setAttribute('data-category', item.category);
        
        // Format price - just use the number as is
        const priceText = 'Rs ' + parseInt(item.price);
        console.log('Item:', item.name, 'Price:', item.price, 'Formatted:', priceText); // Debug
        
        menuItem.innerHTML = `
            <img src="${item.image}" alt="${item.name}" class="item-image" onerror="this.src='https://via.placeholder.com/400x300?text=${encodeURIComponent(item.name)}'">
            <div class="item-content">
                <h3 class="item-name">${item.name}</h3>
                <p class="item-description">${item.description}</p>
                <div class="item-footer">
                    <div>
                        <span class="price-label">Price</span>
                        <span class="item-price">${priceText}</span>
                    </div>
                    <button class="add-to-cart-btn" onclick="addToCart(${item.id})">Add to Cart</button>
                </div>
            </div>
        `;
        
        menuGrid.appendChild(menuItem);
    });
}

// Filter menu by category
function setupEventListeners() {
    const filterButtons = document.querySelectorAll('.filter-btn');
    filterButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            filterButtons.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            
            const category = btn.getAttribute('data-category');
            filterMenu(category);
        });
    });
    
    // Cart modal
    document.getElementById('cart-link').addEventListener('click', (e) => {
        e.preventDefault();
        openCart();
    });
    
    document.getElementById('close-cart').addEventListener('click', closeCart);
    
    document.getElementById('cart-modal').addEventListener('click', (e) => {
        if (e.target.id === 'cart-modal') {
            closeCart();
        }
    });
    
    // Checkout
    document.getElementById('checkout-btn').addEventListener('click', checkout);
}

// Filter menu items
function filterMenu(category) {
    const items = document.querySelectorAll('.menu-item');
    items.forEach(item => {
        if (category === 'all' || item.getAttribute('data-category') === category) {
            item.style.display = 'block';
        } else {
            item.style.display = 'none';
        }
    });
}

// Add item to cart
function addToCart(itemId) {
    const item = menuItems.find(i => i.id === itemId);
    if (!item) return;
    
    const existingItem = cart.find(i => i.id === itemId);
    
    if (existingItem) {
        existingItem.quantity++;
    } else {
        cart.push({
            ...item,
            quantity: 1
        });
    }
    
    updateCartUI();
    saveCartToStorage();
    
    // Visual feedback
    showNotification(`${item.name} added to cart! 🎉`);
}

// Update cart UI
function updateCartUI() {
    const cartCount = document.getElementById('cart-count');
    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
    cartCount.textContent = totalItems;
    
    displayCartItems();
}

// Display cart items
function displayCartItems() {
    const cartItemsContainer = document.getElementById('cart-items');
    const totalPrice = document.getElementById('total-price');
    
    if (cart.length === 0) {
        cartItemsContainer.innerHTML = '<div class="empty-cart">Your cart is empty 🛒</div>';
        totalPrice.textContent = 'Rs 0';
        return;
    }
    
    cartItemsContainer.innerHTML = '';
    let total = 0;
    
    cart.forEach(item => {
        const itemTotal = item.price * item.quantity;
        total += itemTotal;
        
        const cartItem = document.createElement('div');
        cartItem.className = 'cart-item';
        
        const priceText = 'Rs ' + parseInt(item.price);
        
        cartItem.innerHTML = `
            <div class="cart-item-info">
                <h4>${item.name}</h4>
                <p class="cart-item-price">${priceText} each</p>
            </div>
            <div class="cart-item-controls">
                <button class="quantity-btn" onclick="decreaseQuantity(${item.id})">-</button>
                <span class="quantity">${item.quantity}</span>
                <button class="quantity-btn" onclick="increaseQuantity(${item.id})">+</button>
                <button class="remove-btn" onclick="removeFromCart(${item.id})">🗑️</button>
            </div>
        `;
        
        cartItemsContainer.appendChild(cartItem);
    });
    
    totalPrice.textContent = 'Rs ' + parseInt(total);
}

// Increase quantity
function increaseQuantity(itemId) {
    const item = cart.find(i => i.id === itemId);
    if (item) {
        item.quantity++;
        updateCartUI();
        saveCartToStorage();
    }
}

// Decrease quantity
function decreaseQuantity(itemId) {
    const item = cart.find(i => i.id === itemId);
    if (item && item.quantity > 1) {
        item.quantity--;
        updateCartUI();
        saveCartToStorage();
    }
}

// Remove from cart
function removeFromCart(itemId) {
    cart = cart.filter(i => i.id !== itemId);
    updateCartUI();
    saveCartToStorage();
    showNotification('Item removed from cart');
}

// Open cart modal
function openCart() {
    document.getElementById('cart-modal').classList.add('active');
}

// Close cart modal
function closeCart() {
    document.getElementById('cart-modal').classList.remove('active');
}

// Checkout
async function checkout() {
    if (cart.length === 0) {
        showNotification('Your cart is empty!', 'error');
        return;
    }
    
    // Check if user is logged in
    try {
        const sessionResponse = await fetch('/api/check-session');
        const sessionData = await sessionResponse.json();
        
        if (!sessionData.logged_in) {
            showNotification('Please login to place an order', 'error');
            setTimeout(() => {
                window.location.href = '/login';
            }, 1500);
            return;
        }
        
        // Calculate total
        const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
        
        // Prepare order data
        const orderData = {
            items: cart.map(item => ({
                id: item.id,
                name: item.name,
                quantity: item.quantity,
                price: item.price
            })),
            total: total
        };
        
        const response = await fetch('/api/order', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(orderData)
        });
        
        const data = await response.json();
        
        if (data.success) {
            showNotification('Order placed successfully! 🎉');
            cart = [];
            updateCartUI();
            saveCartToStorage();
            closeCart();
            
            setTimeout(() => {
                window.location.href = '/dashboard';
            }, 1500);
        } else {
            showNotification(data.message || 'Error placing order', 'error');
        }
    } catch (error) {
        console.error('Checkout error:', error);
        showNotification('Error placing order', 'error');
    }
}

// Save cart to localStorage
function saveCartToStorage() {
    localStorage.setItem('cart', JSON.stringify(cart));
}

// Load cart from localStorage
function loadCartFromStorage() {
    const savedCart = localStorage.getItem('cart');
    if (savedCart) {
        cart = JSON.parse(savedCart);
        updateCartUI();
    }
}

// Show notification
function showNotification(message, type = 'success') {
    const notification = document.createElement('div');
    notification.style.cssText = `
        position: fixed;
        top: 100px;
        right: 20px;
        background: ${type === 'success' ? '#4caf50' : '#f44336'};
        color: white;
        padding: 1rem 2rem;
        border-radius: 10px;
        box-shadow: 0 5px 15px rgba(0,0,0,0.2);
        z-index: 3000;
        animation: slideIn 0.3s;
    `;
    notification.textContent = message;
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.style.animation = 'fadeOut 0.3s';
        setTimeout(() => {
            notification.remove();
        }, 300);
    }, 3000);
}
