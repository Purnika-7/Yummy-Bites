from flask import Flask, render_template, request, jsonify, session, redirect, url_for
from flask_cors import CORS
import sqlite3
from werkzeug.security import generate_password_hash, check_password_hash
import os
from datetime import datetime

app = Flask(__name__)
app.secret_key = 'your-secret-key-change-this-in-production'
CORS(app)

# Database initialization
def init_db():
    conn = sqlite3.connect('restaurant.db')
    c = conn.cursor()
    
    # Users table
    c.execute('''CREATE TABLE IF NOT EXISTS users
                 (id INTEGER PRIMARY KEY AUTOINCREMENT,
                  username TEXT UNIQUE NOT NULL,
                  email TEXT UNIQUE NOT NULL,
                  password TEXT NOT NULL,
                  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP)''')
    
    # Menu items table
    c.execute('''CREATE TABLE IF NOT EXISTS menu_items
                 (id INTEGER PRIMARY KEY AUTOINCREMENT,
                  name TEXT NOT NULL,
                  description TEXT,
                  price REAL NOT NULL,
                  category TEXT NOT NULL,
                  image TEXT)''')
    
    # Orders table
    c.execute('''CREATE TABLE IF NOT EXISTS orders
                 (id INTEGER PRIMARY KEY AUTOINCREMENT,
                  user_id INTEGER NOT NULL,
                  items TEXT NOT NULL,
                  total REAL NOT NULL,
                  status TEXT DEFAULT 'pending',
                  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                  FOREIGN KEY (user_id) REFERENCES users(id))''')
    
    # Check if menu items exist, if not add sample items
    c.execute('SELECT COUNT(*) FROM menu_items')
    if c.fetchone()[0] == 0:
        sample_items = [
            ('Margherita Pizza', 'Classic tomato sauce, mozzarella, and fresh basil', 1690, 'Main', 'https://images.unsplash.com/photo-1574071318508-1cdbab80d002?w=400&h=300&fit=crop'),
            ('Pepperoni Pizza', 'Tomato sauce, mozzarella, and pepperoni', 1950, 'Main', 'https://images.unsplash.com/photo-1628840042765-356cda07504e?w=400&h=300&fit=crop'),
            ('Caesar Salad', 'Romaine lettuce, croutons, parmesan, Caesar dressing', 1170, 'Starter', 'https://images.unsplash.com/photo-1546793665-c74683f339c1?w=400&h=300&fit=crop'),
            ('Spaghetti Carbonara', 'Creamy pasta with bacon and parmesan', 1820, 'Main', 'https://images.unsplash.com/photo-1612874742237-6526221588e3?w=400&h=300&fit=crop'),
            ('Chocolate Cake', 'Rich chocolate cake with ganache', 910, 'Dessert', 'https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=400&h=300&fit=crop'),
            ('Tiramisu', 'Classic Italian dessert with coffee and mascarpone', 1040, 'Dessert', 'https://images.unsplash.com/photo-1571877227200-a0d98ea607e9?w=400&h=300&fit=crop'),
            ('Garlic Bread', 'Toasted bread with garlic butter', 650, 'Starter', 'https://images.unsplash.com/photo-1573140401552-388e29d6b370?w=400&h=300&fit=crop'),
            ('Lemonade', 'Fresh homemade lemonade', 520, 'Drink', 'https://images.unsplash.com/photo-1523677011781-c91d1bbe2f0d?w=400&h=300&fit=crop'),
            ('Iced Tea', 'Refreshing iced tea', 390, 'Drink', 'https://images.unsplash.com/photo-1556679343-c7306c1976bc?w=400&h=300&fit=crop'),
            ('Burger Deluxe', 'Beef patty, lettuce, tomato, special sauce', 1560, 'Main', 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=400&h=300&fit=crop'),
            ('Grilled Salmon', 'Fresh Atlantic salmon with herbs', 2470, 'Main', 'https://images.unsplash.com/photo-1485921325833-c519f76c4927?w=400&h=300&fit=crop'),
            ('Bruschetta', 'Toasted bread with tomatoes and basil', 910, 'Starter', 'https://images.unsplash.com/photo-1572695157366-5e585ab2b69f?w=400&h=300&fit=crop'),
            ('Chicken Wings', 'Crispy wings with BBQ sauce', 1300, 'Starter', 'https://images.unsplash.com/photo-1608039755401-742074f0548d?w=400&h=300&fit=crop'),
            ('Cheesecake', 'New York style cheesecake with berry sauce', 1040, 'Dessert', 'https://images.unsplash.com/photo-1533134486753-c833f0ed4866?w=400&h=300&fit=crop'),
            ('Smoothie Bowl', 'Acai bowl with fresh fruits and granola', 1170, 'Drink', 'https://images.unsplash.com/photo-1590301157890-4810ed352733?w=400&h=300&fit=crop'),
            ('Tacos', 'Three soft tacos with your choice of filling', 1430, 'Main', 'https://images.unsplash.com/photo-1565299585323-38d6b0865b47?w=400&h=300&fit=crop')
        ]
        c.executemany('INSERT INTO menu_items (name, description, price, category, image) VALUES (?, ?, ?, ?, ?)', 
                      sample_items)
    
    conn.commit()
    conn.close()

# Initialize database on startup
init_db()

# Routes
@app.route('/')
def index():
    return render_template('index.html')

@app.route('/login')
def login_page():
    return render_template('login.html')

@app.route('/dashboard')
def dashboard():
    if 'user_id' not in session:
        return redirect(url_for('login_page'))
    return render_template('dashboard.html')

# API Routes
@app.route('/api/register', methods=['POST'])
def register():
    data = request.json
    username = data.get('username')
    email = data.get('email')
    password = data.get('password')
    
    if not username or not email or not password:
        return jsonify({'success': False, 'message': 'All fields are required'}), 400
    
    conn = sqlite3.connect('restaurant.db')
    c = conn.cursor()
    
    try:
        hashed_password = generate_password_hash(password)
        c.execute('INSERT INTO users (username, email, password) VALUES (?, ?, ?)',
                  (username, email, hashed_password))
        conn.commit()
        return jsonify({'success': True, 'message': 'Registration successful!'})
    except sqlite3.IntegrityError:
        return jsonify({'success': False, 'message': 'Username or email already exists'}), 400
    finally:
        conn.close()

@app.route('/api/login', methods=['POST'])
def login():
    data = request.json
    username = data.get('username')
    password = data.get('password')
    
    conn = sqlite3.connect('restaurant.db')
    c = conn.cursor()
    c.execute('SELECT id, username, password FROM users WHERE username = ?', (username,))
    user = c.fetchone()
    conn.close()
    
    if user and check_password_hash(user[2], password):
        session['user_id'] = user[0]
        session['username'] = user[1]
        return jsonify({'success': True, 'message': 'Login successful!', 'username': user[1]})
    else:
        return jsonify({'success': False, 'message': 'Invalid credentials'}), 401

@app.route('/api/logout', methods=['POST'])
def logout():
    session.clear()
    return jsonify({'success': True, 'message': 'Logged out successfully'})

@app.route('/api/menu', methods=['GET'])
def get_menu():
    conn = sqlite3.connect('restaurant.db')
    c = conn.cursor()
    c.execute('SELECT id, name, description, price, category, image FROM menu_items')
    items = c.fetchall()
    conn.close()
    
    menu = []
    for item in items:
        menu.append({
            'id': item[0],
            'name': item[1],
            'description': item[2],
            'price': item[3],
            'category': item[4],
            'image': item[5]
        })
    
    return jsonify(menu)

@app.route('/api/order', methods=['POST'])
def place_order():
    if 'user_id' not in session:
        return jsonify({'success': False, 'message': 'Please login first'}), 401
    
    data = request.json
    items = data.get('items')
    total = data.get('total')
    
    if not items or not total:
        return jsonify({'success': False, 'message': 'Invalid order data'}), 400
    
    conn = sqlite3.connect('restaurant.db')
    c = conn.cursor()
    
    import json
    c.execute('INSERT INTO orders (user_id, items, total) VALUES (?, ?, ?)',
              (session['user_id'], json.dumps(items), total))
    conn.commit()
    conn.close()
    
    return jsonify({'success': True, 'message': 'Order placed successfully!'})

@app.route('/api/orders', methods=['GET'])
def get_orders():
    if 'user_id' not in session:
        return jsonify({'success': False, 'message': 'Please login first'}), 401
    
    conn = sqlite3.connect('restaurant.db')
    c = conn.cursor()
    c.execute('SELECT id, items, total, status, created_at FROM orders WHERE user_id = ? ORDER BY created_at DESC',
              (session['user_id'],))
    orders = c.fetchall()
    conn.close()
    
    import json
    order_list = []
    for order in orders:
        order_list.append({
            'id': order[0],
            'items': json.loads(order[1]),
            'total': order[2],
            'status': order[3],
            'created_at': order[4]
        })
    
    return jsonify(order_list)

@app.route('/api/check-session', methods=['GET'])
def check_session():
    if 'user_id' in session:
        return jsonify({'logged_in': True, 'username': session['username']})
    return jsonify({'logged_in': False})

if __name__ == '__main__':
    app.run(debug=True, port=5000)