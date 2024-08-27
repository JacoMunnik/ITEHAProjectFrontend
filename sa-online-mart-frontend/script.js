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

    function loadHomepage() {
        mainContent.innerHTML = '<div id="products"></div>';
        fetchProducts();
    }

    // Define an array to hold the cart items
    let cart = [];

    // Check if there's an existing cart in localStorage
    if (localStorage.getItem('cart')) {
        cart = JSON.parse(localStorage.getItem('cart'));
    }

    // Function to add items to the cart
    function addToCart(product) {
        // Add the product to the cart array
        cart.push(product);

        // Save the updated cart to localStorage
        localStorage.setItem('cart', JSON.stringify(cart));

        // Optional: Alert the user or update the cart count
        alert(`${product.name} has been added to your cart!`);
    }

    function loadCartPage() {
        mainContent.innerHTML = '<h2>Your Cart</h2><div id="cart-items" class="row"></div>';
        
        const cartItemsContainer = document.getElementById('cart-items');

        // Retrieve the cart from localStorage
        const storedCart = JSON.parse(localStorage.getItem('cart')) || [];

        if (storedCart.length > 0) {
            storedCart.forEach(item => {
                const cartItem = document.createElement('div');
                cartItem.className = 'col-md-4';
                cartItem.innerHTML = `
                    <div class="card mb-4">
                        <img src="${item.image}" class="card-img-top" alt="${item.name}">
                        <div class="card-body">
                            <h5 class="card-title">${item.name}</h5>
                            <p class="card-text">${item.description}</p>
                            <p class="card-text"><strong>${item.price}</strong></p>
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
        mainContent.innerHTML = '<h2>Checkout</h2>';
        // Implement checkout functionality here
    }

    function loadAdminPage() {
        mainContent.innerHTML = '<h2>Admin Panel</h2>';
        // Implement admin functionality here
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

                // Call your API to add/update product
                fetch('http://localhost:5295/api/product', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        id, name, description, price, image, stock
                    })
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

                // Call your API to delete product
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
            console.log('Response status:', response.status); // Debugging line
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            const products = await response.json();
            console.log('Fetched products:', products); // Debugging line
            displayProducts(products);
        } catch (error) {
            console.error('Error fetching products:', error);
        }
    }
    
    // Function to display products on the page
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
            const addToCartButton = productCard.querySelector('.btn');
            addToCartButton.addEventListener('click', () => addToCart(product));

            productsContainer.appendChild(productCard);
        });
    }

    window.addToCart = function(productId) {
        console.log('Adding product to cart:', productId);
    };
});
