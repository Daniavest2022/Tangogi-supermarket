// js/app.js - CLEANED & FIXED VERSION
class TangogiApp {
  constructor() {
    this.state = {
      cart: [],
      wishlist: [],
      user: null,
      currentLocation: 'Lagos',
      featuredProducts: [],
      allProducts: [],
      taxRate: 0.05,
      shippingCost: 500
    };

    this.init();
  }

  async init() {
    console.log('🛒 Tangogi Supermarket Initialized');
    this.loadCart();
    this.loadWishlist();
    this.initializeHeaderFunctionality(); // ✅ Works with inline header
    this.setupCoreFeatures();
    await this.loadPageContent();
    this.loadCartPage();
    this.setupStorageSync();
  }

  async loadPageContent() {
    const path = window.location.pathname;
    const filename = path.substring(path.lastIndexOf('/') + 1) || 'index.html';
    
    console.log('📄 Detected page:', filename);

    const pageHandlers = {
      'index.html': () => this.loadFeaturedProducts(),
      '': () => this.loadFeaturedProducts(),
      'products.html': () => this.loadAllProducts(),
      'cart.html': () => this.loadCartPage()
    };

    const handler = pageHandlers[filename];
    if (handler) await handler();
  }

  setupCoreFeatures() {
    this.initializeCounters();
    this.initializeLazyLoading();
    this.initializeFloatingActions();
    this.registerServiceWorker();
    this.setupDarkModeToggle();
  }

  setupDarkModeToggle() {
    const darkModeToggle = document.getElementById('dark-mode-toggle');
    if (!darkModeToggle) return;

    darkModeToggle.addEventListener('click', () => {
      document.body.classList.toggle('dark-mode');
      const isDarkMode = document.body.classList.contains('dark-mode');
      localStorage.setItem('darkMode', isDarkMode);
      darkModeToggle.innerHTML = isDarkMode ? 
        '<i class="fas fa-sun"></i>' : 
        '<i class="fas fa-moon"></i>';
    });

    if (localStorage.getItem('darkMode') === 'true') {
      document.body.classList.add('dark-mode');
      darkModeToggle.innerHTML = '<i class="fas fa-sun"></i>';
    }
  }

  setupStorageSync() {
    window.addEventListener('storage', (e) => {
      if (e.key === 'tangogi-cart') {
        this.state.cart = e.newValue ? JSON.parse(e.newValue) : [];
        this.updateCartDisplay();
        this.updateQuickCart();
      } else if (e.key === 'tangogi-wishlist') {
        this.state.wishlist = e.newValue ? JSON.parse(e.newValue) : [];
        this.updateWishlistDisplay();
      }
    });
  }

  initializeCounters() {
    const counters = document.querySelectorAll('[data-count]');
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          this.animateCounter(entry.target);
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.5 });

    counters.forEach(counter => observer.observe(counter));
  }

  animateCounter(element) {
    const target = parseInt(element.getAttribute('data-count'));
    const suffix = element.getAttribute('data-suffix') || '';
    const duration = 2000;
    const step = target / (duration / 16);
    let current = 0;

    const timer = setInterval(() => {
      current += step;
      if (current >= target) {
        current = target;
        clearInterval(timer);
      }
      element.textContent = Math.floor(current) + suffix;
    }, 16);
  }

  initializeLazyLoading() {
    const lazyImages = document.querySelectorAll('.lazy-load');
    const imageObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const img = entry.target;
          img.src = img.dataset.src || img.src;
          img.classList.add('loaded');
          observer.unobserve(img);
        }
      });
    });

    lazyImages.forEach(img => imageObserver.observe(img));
  }

  // Cart functionality
  loadCart() {
    const savedCart = localStorage.getItem('tangogi-cart');
    if (savedCart) {
      this.state.cart = JSON.parse(savedCart);
      this.updateCartDisplay();
      this.updateQuickCart();
    }
  }

  saveCart() {
    localStorage.setItem('tangogi-cart', JSON.stringify(this.state.cart));
    this.updateCartDisplay();
  }

  addToCart(product) {
    const existingItem = this.state.cart.find(item => item.id === product.id);
    
    if (existingItem) {
      existingItem.quantity += 1;
    } else {
      this.state.cart.push({
        ...product,
        quantity: 1,
        cartId: Date.now()
      });
    }
    
    this.saveCart();
    this.showNotification(`${product.name} added to cart!`, 'success');
    this.animateCartButton();
  }

  removeFromCart(cartId) {
    this.state.cart = this.state.cart.filter(item => item.cartId !== cartId);
    this.saveCart();
    this.showNotification('Item removed from cart', 'info');
  }

  updateCartDisplay() {
    const cartCountElements = document.querySelectorAll('#cart-count, #floating-cart-count');
    const totalItems = this.state.cart.reduce((sum, item) => sum + item.quantity, 0);
    
    cartCountElements.forEach(element => {
      if (element) {
        element.textContent = totalItems;
        element.style.display = totalItems > 0 ? 'flex' : 'none';
      }
    });
  }

  updateCartQuantity(cartId, newQuantity) {
    const item = this.state.cart.find(item => item.cartId === cartId);
    if (!item) return;

    if (newQuantity <= 0) {
      this.removeFromCart(cartId);
    } else {
      item.quantity = newQuantity;
      this.saveCart();
      this.updateQuickCart();
    }
  }

  // Wishlist functionality
  loadWishlist() {
    const savedWishlist = localStorage.getItem('tangogi-wishlist');
    if (savedWishlist) {
      this.state.wishlist = JSON.parse(savedWishlist);
      this.updateWishlistDisplay();
    }
  }

  toggleWishlist(productId) {
    const product = this.state.featuredProducts.find(p => p.id === productId) ||
                   this.state.allProducts.find(p => p.id === productId);
    
    if (!product) return;

    const existingIndex = this.state.wishlist.findIndex(id => id === productId);
    
    if (existingIndex > -1) {
      this.state.wishlist.splice(existingIndex, 1);
      this.showNotification(`${product.name} removed from wishlist`, 'info');
    } else {
      this.state.wishlist.push(productId);
      this.showNotification(`${product.name} added to wishlist`, 'success');
    }

    localStorage.setItem('tangogi-wishlist', JSON.stringify(this.state.wishlist));
    this.updateWishlistDisplay();
  }

  updateWishlistDisplay() {
    const wishlistCount = document.getElementById('wishlist-count');
    if (wishlistCount) {
      wishlistCount.textContent = this.state.wishlist.length;
      wishlistCount.style.display = this.state.wishlist.length > 0 ? 'flex' : 'none';
    }
  }

  // Header functionality (for inline header)
  initializeHeaderFunctionality() {
    console.log('🔧 Initializing header functionality...');
    this.setupMobileMenu();
    this.setupSearch();
    this.setupLocationSelector();
    this.setupUserDropdown();
    this.setupQuickCart();
  }

  setupMobileMenu() {
    const menuToggle = document.getElementById('mobile-menu-toggle');
    const mobileNav = document.getElementById('mobile-navigation');
    const closeBtn = document.getElementById('close-mobile-nav');

    if (menuToggle && mobileNav) {
      menuToggle.addEventListener('click', () => {
        mobileNav.classList.add('active');
        document.body.style.overflow = 'hidden';
      });
    }

    if (closeBtn && mobileNav) {
      closeBtn.addEventListener('click', () => {
        mobileNav.classList.remove('active');
        document.body.style.overflow = '';
      });
    }
  }

  setupSearch() {
    const searchInput = document.getElementById('search-input');
    const searchBtn = document.getElementById('search-btn');
    const searchClear = document.getElementById('search-clear');

    if (!searchInput) return;

    searchInput.addEventListener('input', () => {
      if (searchClear) {
        searchClear.style.display = searchInput.value ? 'block' : 'none';
      }
    });

    if (searchClear) {
      searchClear.addEventListener('click', () => {
        searchInput.value = '';
        searchClear.style.display = 'none';
        searchInput.focus();
      });
    }

    const performSearch = () => {
      const query = searchInput.value.trim();
      if (query) {
        window.location.href = `products.html?search=${encodeURIComponent(query)}`;
      }
    };

    if (searchBtn) searchBtn.addEventListener('click', performSearch);
    searchInput.addEventListener('keypress', (e) => {
      if (e.key === 'Enter') performSearch();
    });
  }

  setupLocationSelector() {
    const locationBtn = document.getElementById('location-btn');
    const locationDropdown = document.getElementById('location-dropdown');

    if (!locationBtn || !locationDropdown) return;

    locationBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      locationDropdown.classList.toggle('active');
    });

    document.addEventListener('click', () => {
      locationDropdown.classList.remove('active');
    });

    document.querySelectorAll('.location-option').forEach(option => {
      option.addEventListener('click', () => {
        const location = option.dataset.location;
        if (location === 'use-current') {
          this.getCurrentLocation();
        } else {
          this.selectLocation(option.textContent.trim());
        }
        locationDropdown.classList.remove('active');
      });
    });
  }

  selectLocation(locationName) {
    this.state.currentLocation = locationName;
    const locationText = document.querySelector('.location-text');
    if (locationText) locationText.textContent = locationName;
    this.showNotification(`Location set to ${locationName}`, 'success');
  }

  getCurrentLocation() {
    if (!navigator.geolocation) {
      this.showNotification('Geolocation not supported', 'error');
      return;
    }

    navigator.geolocation.getCurrentPosition(
      () => this.selectLocation('Current Location'),
      () => this.showNotification('Unable to get current location', 'error')
    );
  }

  setupUserDropdown() {
    const userBtn = document.getElementById('user-btn');
    const userDropdown = document.getElementById('user-dropdown');

    if (!userBtn || !userDropdown) return;

    userBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      userDropdown.classList.toggle('active');
    });

    document.addEventListener('click', () => {
      userDropdown.classList.remove('active');
    });
  }

  setupQuickCart() {
    const cartBtn = document.getElementById('cart-btn');
    const quickCart = document.getElementById('quick-cart');
    const closeCart = document.getElementById('close-cart');
    const checkoutBtn = document.getElementById('checkout-btn');

    if (!cartBtn || !quickCart) return;

    cartBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      quickCart.classList.add('active');
      this.updateQuickCart();
    });

    if (closeCart) {
      closeCart.addEventListener('click', () => {
        quickCart.classList.remove('active');
      });
    }

    if (checkoutBtn) {
      checkoutBtn.addEventListener('click', () => {
        window.location.href = 'cart.html';
      });
    }

    document.addEventListener('click', (e) => {
      if (!e.target.closest('.cart-section') && !e.target.closest('.quick-cart')) {
        quickCart.classList.remove('active');
      }
    });
  }

  updateQuickCart() {
    const cartItems = document.getElementById('cart-items');
    const emptyCart = document.getElementById('empty-cart');
    const cartSubtotal = document.getElementById('cart-subtotal');
    const cartTax = document.getElementById('cart-tax');
    const cartShipping = document.getElementById('cart-shipping');
    const cartTotal = document.getElementById('cart-total');

    if (!cartItems || !emptyCart) return;

    if (this.state.cart.length === 0) {
      cartItems.style.display = 'none';
      emptyCart.style.display = 'block';
    } else {
      cartItems.style.display = 'block';
      emptyCart.style.display = 'none';

      cartItems.innerHTML = this.state.cart.map(item => `
        <div class="cart-item">
          <img src="${item.image}" alt="${item.name}" class="cart-item-image">
          <div class="cart-item-details">
            <div class="cart-item-name">${item.name}</div>
            <div class="cart-item-price">₦${item.price.toLocaleString()}</div>
            <div class="cart-item-quantity">
              <button class="quantity-btn" onclick="app.updateCartQuantity(${item.cartId}, ${item.quantity - 1})">-</button>
              <span>${item.quantity}</span>
              <button class="quantity-btn" onclick="app.updateCartQuantity(${item.cartId}, ${item.quantity + 1})">+</button>
            </div>
          </div>
          <button class="remove-item" onclick="app.removeFromCart(${item.cartId})" aria-label="Remove ${item.name}">
            <i class="fas fa-times"></i>
          </button>
        </div>
      `).join('');

      const subtotal = this.state.cart.reduce((total, item) => total + (item.price * item.quantity), 0);
      const tax = subtotal * this.state.taxRate;
      const total = subtotal + tax + this.state.shippingCost;

      if (cartSubtotal) cartSubtotal.textContent = '₦' + subtotal.toLocaleString();
      if (cartTax) cartTax.textContent = '₦' + tax.toFixed(2);
      if (cartShipping) cartShipping.textContent = '₦' + this.state.shippingCost.toLocaleString();
      if (cartTotal) cartTotal.textContent = '₦' + total.toFixed(2);
    }
  }

  // Products
  async loadFeaturedProducts() {
    const productsGrid = document.getElementById('featured-products');
    const loadingSpinner = document.getElementById('products-loading');
    
    if (!productsGrid) return;

    try {
      await new Promise(resolve => setTimeout(resolve, 800));

      const products = [
        { id: 1, name: 'Fresh Tomatoes', price: 1200, image: 'images/products/tomatoes.jpg', category: 'fruits', rating: 4.5, unit: 'kg' },
        { id: 2, name: 'Chicken Breast', price: 3500, image: 'images/products/chicken-breast.jpg', category: 'meat', rating: 4.8, unit: 'kg' },
        { id: 3, name: 'Fresh Milk', price: 1800, image: 'images/products/milk.jpg', category: 'dairy', rating: 4.3, unit: '1L' },
        { id: 4, name: 'Brown Rice', price: 4200, image: 'images/products/rice.jpg', category: 'grains', rating: 4.6, unit: '5kg' }
      ];

      this.state.featuredProducts = products;
      this.renderProducts(products, productsGrid);

      if (loadingSpinner) loadingSpinner.style.display = 'none';

    } catch (error) {
      console.error('Error loading featured products:', error);
      if (loadingSpinner) {
        loadingSpinner.innerHTML = '<i class="fas fa-exclamation-triangle"></i> <span>Failed to load products.</span>';
      }
    }
  }

  async loadAllProducts() {
    const productsGrid = document.getElementById('products-grid');
    const loadingSpinner = document.getElementById('products-loading');
    
    if (!productsGrid) return;

    try {
      await new Promise(resolve => setTimeout(resolve, 600));

      const allProducts = [
        // Fruits
        { id: 1, name: 'Fresh Tomatoes', price: 1200, image: 'images/products/tomatoes.jpg', category: 'fruits', rating: 4.5, unit: 'kg' },
        { id: 2, name: 'Bananas', price: 800, image: 'images/products/bananas.jpg', category: 'fruits', rating: 4.3, unit: 'bunch' },
        { id: 3, name: 'Oranges', price: 1500, image: 'images/products/oranges.jpg', category: 'fruits', rating: 4.6, unit: 'kg' },
        { id: 4, name: 'Pineapple', price: 2000, image: 'images/products/pineapple.jpg', category: 'fruits', rating: 4.4, unit: 'piece' },

        // Vegetables
        { id: 5, name: 'Spinach', price: 600, image: 'images/products/spinach.jpg', category: 'vegetables', rating: 4.2, unit: 'bunch' },
        { id: 6, name: 'Carrots', price: 900, image: 'images/products/carrots.jpg', category: 'vegetables', rating: 4.5, unit: 'kg' },
        { id: 7, name: 'Onions', price: 700, image: 'images/products/onions.jpg', category: 'vegetables', rating: 4.1, unit: 'kg' },

        // Meat
        { id: 8, name: 'Chicken Breast', price: 3500, image: 'images/products/chicken-breast.jpg', category: 'meat', rating: 4.8, unit: 'kg' },
        { id: 9, name: 'Beef', price: 4200, image: 'images/products/beef.jpg', category: 'meat', rating: 4.7, unit: 'kg' },
        { id: 10, name: 'Turkey', price: 3800, image: 'images/products/turkey.jpg', category: 'meat', rating: 4.5, unit: 'kg' },

        // Dairy
        { id: 11, name: 'Fresh Milk', price: 1800, image: 'images/products/milk.jpg', category: 'dairy', rating: 4.3, unit: '1L' },
        { id: 12, name: 'Cheese', price: 2500, image: 'images/products/cheese.jpg', category: 'dairy', rating: 4.6, unit: '500g' },
        { id: 13, name: 'Yogurt', price: 1200, image: 'images/products/yogurt.jpg', category: 'dairy', rating: 4.4, unit: 'pack' },

        // Grains
        { id: 14, name: 'Brown Rice', price: 4200, image: 'images/products/rice.jpg', category: 'grains', rating: 4.6, unit: '5kg' },
        { id: 15, name: 'Wheat Flour', price: 2800, image: 'images/products/flour.jpg', category: 'grains', rating: 4.2, unit: '2kg' }
      ];

      this.state.allProducts = allProducts;
      this.renderProducts(allProducts, productsGrid);

      if (loadingSpinner) loadingSpinner.style.display = 'none';
      this.setupProductFilters();

    } catch (error) {
      console.error('Error loading products:', error);
      if (loadingSpinner) {
        loadingSpinner.innerHTML = '<i class="fas fa-exclamation-triangle"></i> <span>Failed to load products.</span>';
      }
    }
  }

  setupProductFilters() {
    const categoryFilter = document.getElementById('category-filter');
    const sortFilter = document.getElementById('sort-filter');

    const applyFilters = () => {
      let filtered = [...this.state.allProducts];

      const category = categoryFilter?.value;
      if (category) {
        filtered = filtered.filter(p => p.category === category);
      }

      const sortBy = sortFilter?.value;
      if (sortBy === 'price-asc') {
        filtered.sort((a, b) => a.price - b.price);
      } else if (sortBy === 'price-desc') {
        filtered.sort((a, b) => b.price - a.price);
      } else if (sortBy === 'rating') {
        filtered.sort((a, b) => b.rating - a.rating);
      }

      this.renderProducts(filtered, document.getElementById('products-grid'));
    };

    categoryFilter?.addEventListener('change', applyFilters);
    sortFilter?.addEventListener('change', applyFilters);
  }

  renderProducts(products, container) {
    if (!container) return;

    if (products.length === 0) {
      container.innerHTML = '<p class="no-products">No products found. Try a different filter.</p>';
      return;
    }

    container.innerHTML = products.map(product => `
      <div class="product-card" data-product-id="${product.id}">
        <div class="product-image">
          <img src="${product.image}" alt="${product.name}" loading="lazy">
          <button class="wishlist-btn" onclick="app.toggleWishlist(${product.id})" aria-label="Add ${product.name} to wishlist">
            <i class="far fa-heart"></i>
          </button>
        </div>
        <div class="product-info">
          <h3 class="product-name">${product.name}</h3>
          <div class="product-rating">
            ${this.generateStarRating(product.rating)}
            <span class="rating-value">${product.rating}</span>
          </div>
          <div class="product-price">
            <span class="price">₦${product.price.toLocaleString()}</span>
            <span class="unit">/${product.unit}</span>
          </div>
          <button class="btn btn-primary add-to-cart" onclick="app.addToCart(${JSON.stringify(product).replace(/"/g, '&quot;')})">
            <i class="fas fa-shopping-cart"></i> Add to Cart
          </button>
        </div>
      </div>
    `).join('');
  }

  loadCartPage() {
    const isCartPage = window.location.pathname.split('/').pop() === 'cart.html';
    if (!isCartPage) return;

    this.updateCartDisplay();
    this.updateCartPage();
  }

  updateCartPage() {
    const cartItemsContainer = document.getElementById('cart-items-container');
    const emptyCartMessage = document.getElementById('empty-cart-message');

    if (!cartItemsContainer || !emptyCartMessage) return;

    if (this.state.cart.length === 0) {
      cartItemsContainer.style.display = 'none';
      emptyCartMessage.style.display = 'block';
    } else {
      cartItemsContainer.style.display = 'block';
      emptyCartMessage.style.display = 'none';

      cartItemsContainer.innerHTML = this.state.cart.map(item => `
        <div class="cart-item">
          <img src="${item.image}" alt="${item.name}" class="cart-item-image">
          <div class="cart-item-details">
            <div class="cart-item-name">${item.name}</div>
            <div class="cart-item-price">₦${item.price.toLocaleString()}</div>
            <div class="cart-item-quantity">
              <button class="quantity-btn" onclick="app.updateCartQuantity(${item.cartId}, ${item.quantity - 1})">-</button>
              <span>${item.quantity}</span>
              <button class="quantity-btn" onclick="app.updateCartQuantity(${item.cartId}, ${item.quantity + 1})">+</button>
            </div>
          </div>
          <button class="remove-item" onclick="app.removeFromCart(${item.cartId})" aria-label="Remove ${item.name}">
            <i class="fas fa-times"></i>
          </button>
        </div>
      `).join('');

      const subtotal = this.state.cart.reduce((total, item) => total + (item.price * item.quantity), 0);
      const tax = subtotal * this.state.taxRate;
      const total = subtotal + tax + this.state.shippingCost;

      document.getElementById('cart-subtotal')?.textContent = '₦' + subtotal.toLocaleString();
      document.getElementById('cart-tax')?.textContent = '₦' + tax.toFixed(2);
      document.getElementById('cart-shipping')?.textContent = '₦' + this.state.shippingCost.toLocaleString();
      document.getElementById('cart-total')?.textContent = '₦' + total.toFixed(2);

      const checkoutBtn = document.getElementById('checkout-btn');
      if (checkoutBtn) {
        checkoutBtn.onclick = () => {
          alert('✅ Checkout functionality will be added soon!\n\nIn a real app, this would connect to a payment gateway.');
        };
      }
    }
  }

  generateStarRating(rating) {
    let stars = '';
    const full = Math.floor(rating);
    const hasHalf = rating % 1 >= 0.5;
    for (let i = 0; i < full; i++) stars += '<i class="fas fa-star"></i>';
    if (hasHalf) stars += '<i class="fas fa-star-half-alt"></i>';
    const empty = 5 - stars.replace(/<[^>]*>/g, '').length;
    for (let i = 0; i < empty; i++) stars += '<i class="far fa-star"></i>';
    return stars;
  }

  initializeFloatingActions() {
    const quickCartBtn = document.getElementById('quick-cart-btn');
    if (quickCartBtn) {
      quickCartBtn.addEventListener('click', () => {
        const quickCart = document.getElementById('quick-cart');
        if (quickCart) {
          quickCart.classList.add('active');
          this.updateQuickCart();
        }
      });
    }
  }

  animateCartButton() {
    const cartBtn = document.getElementById('cart-btn');
    if (cartBtn) {
      cartBtn.classList.add('pulse');
      setTimeout(() => cartBtn.classList.remove('pulse'), 600);
    }
  }

  showNotification(message, type = 'info') {
    document.querySelectorAll('.tangogi-notification').forEach(el => el.remove());
    
    const notification = document.createElement('div');
    notification.className = `tangogi-notification notification-${type}`;
    notification.innerHTML = `
      <div class="notification-content">
        <i class="fas fa-${this.getNotificationIcon(type)}"></i>
        <span>${message}</span>
      </div>
    `;
    
    document.body.appendChild(notification);

    setTimeout(() => {
      notification.style.animation = 'slideOutRight 0.3s ease-in';
      setTimeout(() => notification.remove(), 300);
    }, 3000);
  }

  getNotificationIcon(type) {
    const icons = {
      success: 'check-circle',
      error: 'exclamation-circle',
      warning: 'exclamation-triangle',
      info: 'info-circle'
    };
    return icons[type] || 'info-circle';
  }

  registerServiceWorker() {
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.register('/sw.js')
        .then(registration => {
          console.log('SW registered:', registration);
        })
        .catch(error => {
          console.log('SW registration failed:', error);
        });
    }
  }
}

document.addEventListener('DOMContentLoaded', () => {
  window.app = new TangogiApp();
});