document.addEventListener('DOMContentLoaded', function() {
    const mainContent = document.getElementById('products');

    if (window.location.pathname.includes('index.html')) {
        loadHomepage();
    } else if (window.location.pathname.includes('cart.html')) {
        loadCartPage();
    } else if (window.location.pathname.includes('checkout.html')) {
        loadCheckoutPage();
    } else if (window.location.pathname.includes('admin.html')) {
        loadAdminPage();
    }

// Define an array to hold the cart items
let cart = [];

// Check if there's an existing cart in localStorage
if (localStorage.getItem('cart')) {
    cart = JSON.parse(localStorage.getItem('cart'));
}

// Function to add items to the cart
function addToCart(product) {
    console.log('Adding to cart:', product); // Log the product object

    if (!product || !product.id || !product.name || !product.imageUrl || !product.description || !product.price) {
        console.error('Invalid product data:', product);
        return;
    }

    // Check if product already exists in the cart
    const existingProductIndex = cart.findIndex(item => item.id === product.id);
    if (existingProductIndex > -1) {
        // Update quantity if product already in cart
        cart[existingProductIndex].quantity = (cart[existingProductIndex].quantity || 1) + 1;
    } else {
        // Add new product to cart with default quantity of 1
        product.quantity = 1;
        cart.push(product);
    }

    localStorage.setItem('cart', JSON.stringify(cart));
    alert(`${product.name} has been added to your cart!`);
}

function loadCartPage() {
    const cartItemsContainer = document.getElementById('cart-items');

    const storedCart = JSON.parse(localStorage.getItem('cart')) || [];
    console.log('Retrieved cart:', storedCart); // Log the retrieved cart

    if (storedCart.length > 0) {
        cartItemsContainer.innerHTML = '';
        storedCart.forEach(item => {
            console.log('Cart item:', item); // Log each item

            // Check for missing properties
            if (!item || !item.imageUrl || !item.name || !item.description || !item.price || !item.quantity) {
                console.error('Cart item is missing properties:', item);
                return;
            }

            const cartItem = document.createElement('div');
            cartItem.className = 'col-md-4 mb-4';
            cartItem.innerHTML = `
                <div class="card">
                    <img src="${item.imageUrl}" class="card-img-top" alt="${item.name}">
                    <div class="card-body">
                        <h5 class="card-title">${item.name}</h5>
                        <p class="card-text">${item.description}</p>
                        <p class="card-text"><strong>${item.price}</strong></p>
                        <p class="card-text">Quantity: ${item.quantity}</p>
                    </div>
                </div>
            `;
            cartItemsContainer.appendChild(cartItem);
        });
    } else {
        cartItemsContainer.innerHTML = '<p>Your cart is empty.</p>';
    }
}

function loadCheckoutPage() {
    const totalAmountContainer = document.getElementById('total-amount');
    const storedCart = JSON.parse(localStorage.getItem('cart')) || [];

    if (storedCart.length > 0) {
        let totalAmount = 0;
        storedCart.forEach(item => {
            totalAmount += item.price * (item.quantity || 1);
        });
        totalAmountContainer.innerHTML = `<h3>Total Amount: $${totalAmount.toFixed(2)}</h3>`;
    } else {
        totalAmountContainer.innerHTML = '<h3>Your cart is empty.</h3>';
    }

    const checkoutForm = document.getElementById('checkout-form');
    checkoutForm.addEventListener('submit', function(event) {
        event.preventDefault();

        // Clear the cart
        localStorage.removeItem('cart');

        // Display success message or redirect to a confirmation page
        alert('Thank you for your purchase!');
        window.location.href = 'index.html'; // Redirect to homepage or another page
    });
}

// Call loadCartPage on page load
document.addEventListener('DOMContentLoaded', loadCartPage);


    // Function to load the homepage and fetch products
    function loadHomepage() {
        mainContent.innerHTML = '<div id="products"></div>';
        fetchProducts();
    }

    function loadCheckoutPage() {
        mainContent.innerHTML = '<h2>Checkout</h2>';
        // Implement checkout functionality here
    }

    function loadAdminPage() {
        mainContent.innerHTML = `
            <h2>Admin Panel</h2>
            <h3>Manage Products</h3>
            <form id="admin-form">
                <label for="product-id">Product ID:</label>
                <input type="number" id="product-id" name="product-id" required><br><br>
                <label for="product-name">Product Name:</label>
                <input type="text" id="product-name" name="product-name" required><br><br>
                <label for="product-description">Description:</label>
                <textarea id="product-description" name="product-description" required></textarea><br><br>
                <label for="product-price">Price:</label>
                <input type="number" step="0.01" id="product-price" name="product-price" required><br><br>
                <label for="product-image">Image URL:</label>
                <input type="text" id="product-image" name="product-image" required><br><br>
                <label for="product-stock">Stock:</label>
                <input type="number" id="product-stock" name="product-stock" required><br><br>
                <button type="submit">Add/Update Product</button>
            </form>
            <h3>Delete Products</h3>
            <form id="delete-form">
                <label for="delete-id">Product ID:</label>
                <input type="number" id="delete-id" name="delete-id" required><br><br>
                <button type="submit">Delete Product</button>
            </form>
        `;

        const adminForm = document.getElementById('admin-form');
        const deleteForm = document.getElementById('delete-form');

        if (adminForm) {
            adminForm.addEventListener('submit', function(event) {
                event.preventDefault();
                const id = document.getElementById('product-id').value;
                const name = document.getElementById('product-name').value;
                const description = document.getElementById('product-description').value;
                const price = document.getElementById('product-price').value;
                const image = document.getElementById('product-image').value;
                const stock = document.getElementById('product-stock').value;

                fetch('http://localhost:5295/api/product', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({ id, name, description, price, image, stock })
                }).then(response => response.json())
                  .then(data => {
                      alert('Product added/updated successfully!');
                  })
                  .catch(error => {
                      console.error('Error:', error);
                  });
            });
        }

        if (deleteForm) {
            deleteForm.addEventListener('submit', function(event) {
                event.preventDefault();
                const id = document.getElementById('delete-id').value;

                fetch(`http://localhost:5295/api/product/${id}`, {
                    method: 'DELETE'
                }).then(response => response.json())
                  .then(data => {
                      alert('Product deleted successfully!');
                  })
                  .catch(error => {
                      console.error('Error:', error);
                  });
            });
        }
    }

    async function fetchProducts() {
        try {
            const response = await fetch('http://localhost:5295/api/product');
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            const products = await response.json();
            displayProducts(products);
        } catch (error) {
            console.error('Error fetching products:', error);
        }
    }

    function displayProducts(products) {
        const productsContainer = document.getElementById('products');

        products.forEach(product => {
            const productCard = document.createElement('div');
            productCard.className = 'product-card col-md-4';

            productCard.innerHTML = `
                <img src="${product.image}" alt="${product.name}">
                <h3>${product.name}</h3>
                <p>${product.description}</p>
                <p><strong>${product.price}</strong></p>
                <button class="btn btn-success">Add to Cart</button>
            `;

            // Add event listener to the "Add to Cart" button
            const addToCartButton = productCard.querySelector('.btn-success');
            addToCartButton.addEventListener('click', () => addToCart(product));

            productsContainer.appendChild(productCard);
        });
    }
});
