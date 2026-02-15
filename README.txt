# 🍽️ Yummy Bites Restaurant - Full Stack Web Application

A cute, simple, and attractive restaurant web application with a complete full-stack implementation!

## ✨ Features

- 🏠 **Beautiful Homepage** with animated hero section
- 📖 **Interactive Menu** with category filtering
- 🛒 **Shopping Cart** with add/remove/quantity controls
- 👤 **User Authentication** (Login & Register)
- 📊 **User Dashboard** with order history
- 🎨 **Cute & Modern UI** with gradient colors and smooth animations
- 💾 **SQLite Database** for data persistence
- 🔒 **Secure Password Hashing**

## 🛠️ Tech Stack

### Frontend
- HTML5
- CSS3 (with animations and gradients)
- Vanilla JavaScript (no frameworks!)

### Backend
- Python Flask
- SQLite Database
- Werkzeug (for password hashing)
- Flask-CORS

## 📁 Project Structure

```
restaurant-webapp/
├── app.py                 # Main Flask application
├── requirements.txt       # Python dependencies
├── restaurant.db         # SQLite database (auto-created)
├── templates/
│   ├── index.html        # Homepage
│   ├── login.html        # Login/Register page
│   └── dashboard.html    # User dashboard
└── static/
    ├── style.css         # Main stylesheet
    ├── script.js         # Homepage functionality
    ├── auth.js           # Authentication logic
    └── dashboard.js      # Dashboard functionality
```

## 🚀 Quick Start

### Prerequisites
- Python 3.8 or higher
- pip (Python package manager)

### Installation Steps

1. **Install Dependencies**
   ```bash
   pip install -r requirements.txt
   ```

2. **Run the Application**
   ```bash
   python app.py
   ```

3. **Open in Browser**
   Navigate to: `http://localhost:5000`

## 📖 How to Use

### 1. Browse Menu
- Visit the homepage
- Scroll to the menu section
- Filter items by category (Starters, Main Course, Desserts, Drinks)

### 2. Add to Cart
- Click "Add to Cart" on any menu item
- Click the Cart icon in navigation to view your cart
- Adjust quantities with +/- buttons
- Remove items with the trash icon

### 3. Create Account
- Click "Login" in the navigation
- Switch to "Register" tab
- Fill in username, email, and password
- Click "Register"

### 4. Login
- Enter your username and password
- Click "Login"
- You'll be redirected to the homepage

### 5. Place Order
- Add items to cart
- Click "Checkout"
- You must be logged in to place orders
- Orders are saved to your account

### 6. View Dashboard
- Click "Dashboard" in navigation (after logging in)
- View your order history
- See your profile information
- Track order status

## 🎨 Features in Detail

### Menu System
- 10 pre-loaded sample items
- Categories: Starters, Main Course, Desserts, Drinks
- Each item has emoji icon, name, description, and price
- Real-time filtering

### Shopping Cart
- Persistent cart (saved in localStorage)
- Quantity controls
- Real-time total calculation
- Empty cart detection
- Smooth animations

### User Authentication
- Secure password hashing with Werkzeug
- Session management
- Protected routes
- Error handling

### Dashboard
- Order history with timestamps
- Order status tracking
- Profile information
- Total orders count

## 🎯 Sample Menu Items (WITH REAL PHOTOS!)

- 🍕 Margherita Pizza - $12.99
- 🍕 Pepperoni Pizza - $14.99
- 🥗 Caesar Salad - $8.99
- 🍝 Spaghetti Carbonara - $13.99
- 🍰 Chocolate Cake - $6.99
- 🍮 Tiramisu - $7.99
- 🥖 Garlic Bread - $4.99
- 🍋 Lemonade - $3.99
- 🧃 Iced Tea - $2.99
- 🍔 Burger Deluxe - $11.99
- 🐟 Grilled Salmon - $18.99
- 🍞 Bruschetta - $6.99
- 🍗 Chicken Wings - $9.99
- 🍰 Cheesecake - $7.99
- 🥤 Smoothie Bowl - $8.99
- 🌮 Tacos - $10.99

**All items include beautiful, high-quality food photos from Unsplash!**

## 🔐 Security Features

- Password hashing with Werkzeug
- Session-based authentication
- Protected API routes
- SQL injection prevention with parameterized queries
- CORS enabled for API security

## 🐛 Troubleshooting

### Database Issues
If you encounter database errors, delete `restaurant.db` and restart the app. It will auto-create a fresh database.

### Port Already in Use
If port 5000 is busy, edit `app.py` and change:
```python
app.run(debug=True, port=5001)  # Change to different port
```

### Module Not Found
Make sure all dependencies are installed:
```bash
pip install -r requirements.txt --upgrade
```

## 🎨 Customization

### Change Colors
Edit `static/style.css` and modify the gradient colors:
```css
background: linear-gradient(135deg, #YOUR_COLOR_1 0%, #YOUR_COLOR_2 100%);
```

### Add Menu Items
Edit the `sample_items` list in `app.py`:
```python
sample_items = [
    ('Item Name', 'Description', price, 'Category', 'Emoji'),
]
```

### Modify Database
The database automatically initializes with tables for:
- users
- menu_items
- orders

## 📱 Responsive Design

The application is fully responsive and works on:
- Desktop computers
- Tablets
- Mobile phones

## 🚀 Production Deployment

Before deploying to production:

1. Change the secret key in `app.py`:
   ```python
   app.secret_key = 'your-random-secure-key-here'
   ```

2. Set `debug=False`:
   ```python
   app.run(debug=False)
   ```

3. Use a production WSGI server like Gunicorn:
   ```bash
   pip install gunicorn
   gunicorn app:app
   ```

## 🤝 Contributing

Feel free to fork this project and make improvements! Some ideas:
- Add payment integration
- Email notifications
- Admin panel
- Real-time order tracking
- Food ratings and reviews

## 📄 License

This project is free to use for learning and personal projects!

## 💖 Made with Love

Created with ❤️ for learning full-stack web development!

---

**Enjoy your Yummy Bites! 🍕🍰🍔**