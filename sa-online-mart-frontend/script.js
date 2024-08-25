document.addEventListener('DOMContentLoaded', function() {
    const mainContent = document.getElementById('main-content');

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
        mainContent.innerHTML = '<h2>Homepage</h2><div id="products"></div>';
        fetchProducts();
    }

    function loadCartPage() {
        mainContent.innerHTML = '<h2>Your Cart</h2><div id="cart-items"></div>';
        // Implement cart functionality here
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

        const productsContainer = document.getElementById('main-content');

        const productGrid = document.createElement('div');
        productGrid.id = 'products';
        productsContainer.appendChild(productGrid);

        products.forEach((product, index) => {
            const productCard = document.createElement('div');
            productCard.className = 'product-card';

            productCard.innerHTML = `
                <img src="${product.image}" alt="${product.name}">
                <h3>${product.name}</h3>
                <p>${product.description}</p>
                <p><strong>${product.price}</strong></p>
                <button class="btn">Add to Cart</button>
            `;

            productGrid.appendChild(productCard);
        });
    }
    
    // Function to add a product to the cart
    function addToCart(productId) {
        // Implementation for adding product to cart
        console.log('Add to cart:', productId);
    }
    
    // Fetch and display products when the page loads
    document.addEventListener('DOMContentLoaded', fetchProducts);

    window.addToCart = function(productId) {
        console.log('Adding product to cart:', productId);
    };
});
