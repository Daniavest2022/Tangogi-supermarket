// js/app.js - CLEANED & ORGANIZED VERSION
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
    this.setupPerformanceMonitoring();
    this.setupOfflineDetection();
    this.loadFromStorage();
    this.initializeHeaderFunctionality();
    this.setupCoreFeatures();
    await this.loadPageContent();
    this.setupStorageSync();
  }

  // ========== STORAGE MANAGEMENT ==========
  loadFromStorage() {
    this.loadCart();
    this.loadWishlist();
  }

  loadCart() {
    const savedCart = localStorage.getItem('tangogi-cart');
    if (savedCart) {
      this.state.cart = JSON.parse(savedCart);
      this.updateCartDisplay();
    }
  }

  saveCart() {
    localStorage.setItem('tangogi-cart', JSON.stringify(this.state.cart));
    this.updateCartDisplay();
  }

  loadWishlist() {
    const savedWishlist = localStorage.getItem('tangogi-wishlist');
    if (savedWishlist) {
      this.state.wishlist = JSON.parse(savedWishlist);
      this.updateWishlistDisplay();
    }
  }

  saveWishlist() {
    localStorage.setItem('tangogi-wishlist', JSON.stringify(this.state.wishlist));
    this.updateWishlistDisplay();
  }

  setupStorageSync() {
    window.addEventListener('storage', (e) => {
      const syncHandlers = {
        'tangogi-cart': () => {
          this.state.cart = e.newValue ? JSON.parse(e.newValue) : [];
          this.updateCartDisplay();
        },
        'tangogi-wishlist': () => {
          this.state.wishlist = e.newValue ? JSON.parse(e.newValue) : [];
          this.updateWishlistDisplay();
        }
      };

      if (syncHandlers[e.key]) {
        syncHandlers[e.key]();
      }
    });
  }

  // ========== PAGE MANAGEMENT ==========
  async loadPageContent() {
    const filename = this.getCurrentPage();
    console.log('📄 Detected page:', filename);

    const pageHandlers = {
      'index.html': () => this.loadFeaturedProducts(),
      '': () => this.loadFeaturedProducts(),
      'products.html': () => this.loadProductsPage(),
      'cart.html': () => this.loadCartPage(),
      'about.html': () => this.setupAboutPage()
    };

    const handler = pageHandlers[filename];
    if (handler) await handler();
  }

  getCurrentPage() {
    const path = window.location.pathname;
    return path.substring(path.lastIndexOf('/') + 1) || 'index.html';
  }

  // ========== CORE FEATURES SETUP ==========
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

    const toggleDarkMode = () => {
      document.body.classList.toggle('dark-mode');
      const isDarkMode = document.body.classList.contains('dark-mode');
      localStorage.setItem('darkMode', isDarkMode);
      darkModeToggle.innerHTML = isDarkMode ? 
        '<i class="fas fa-sun"></i>' : 
        '<i class="fas fa-moon"></i>';
    };

    darkModeToggle.addEventListener('click', toggleDarkMode);

    // Initialize dark mode
    if (localStorage.getItem('darkMode') === 'true') {
      document.body.classList.add('dark-mode');
      darkModeToggle.innerHTML = '<i class="fas fa-sun"></i>';
    }
  }

  // ========== ANIMATIONS & UI ==========
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
          if (img.dataset.src) {
            img.src = img.dataset.src;
          }
          img.classList.add('loaded');
          observer.unobserve(img);
        }
      });
    });

    lazyImages.forEach(img => imageObserver.observe(img));
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

  // ========== CART FUNCTIONALITY ==========
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

  updateCartQuantity(cartId, newQuantity) {
    const item = this.state.cart.find(item => item.cartId === cartId);
    if (!item) return;

    if (newQuantity <= 0) {
      this.removeFromCart(cartId);
    } else if (newQuantity > 99) {
      this.showNotification('Maximum quantity reached', 'warning');
    } else {
      item.quantity = newQuantity;
      this.saveCart();
    }
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

    this.updateQuickCart();
    this.updateCartPage();
  }

  // ========== WISHLIST FUNCTIONALITY ==========
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

    this.saveWishlist();
    this.updateWishlistButtons(productId);
  }

  updateWishlistDisplay() {
    const wishlistCount = document.getElementById('wishlist-count');
    if (wishlistCount) {
      wishlistCount.textContent = this.state.wishlist.length;
      wishlistCount.style.display = this.state.wishlist.length > 0 ? 'flex' : 'none';
    }
  }

  updateWishlistButtons(productId) {
    document.querySelectorAll(`[data-wishlist-id="${productId}"]`).forEach(btn => {
      const icon = btn.querySelector('i');
      icon.className = this.state.wishlist.includes(productId) 
        ? 'fas fa-heart' 
        : 'far fa-heart';
    });
  }

  // ========== HEADER FUNCTIONALITY ==========
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

    if (!menuToggle || !mobileNav) return;

    const toggleMenu = (show) => {
      if (show) {
        mobileNav.classList.add('active');
        menuToggle.setAttribute('aria-expanded', 'true');
        document.body.style.overflow = 'hidden';
      } else {
        mobileNav.classList.remove('active');
        menuToggle.setAttribute('aria-expanded', 'false');
        document.body.style.overflow = '';
      }
    };

    menuToggle.addEventListener('click', () => toggleMenu(true));
    closeBtn?.addEventListener('click', () => toggleMenu(false));
  }

  setupSearch() {
    const searchInput = document.getElementById('search-input');
    const searchBtn = document.getElementById('search-btn');
    const searchClear = document.getElementById('search-clear');

    if (!searchInput) return;

    let searchTimeout;
    searchInput.addEventListener('input', () => {
      if (searchClear) {
        searchClear.style.display = searchInput.value ? 'block' : 'none';
      }
      
      clearTimeout(searchTimeout);
      searchTimeout = setTimeout(() => {
        // Real-time search suggestions could go here
      }, 300);
    });

    searchClear?.addEventListener('click', () => {
      searchInput.value = '';
      searchClear.style.display = 'none';
      searchInput.focus();
    });

    const performSearch = () => {
      const query = searchInput.value.trim();
      if (query) {
        window.location.href = `products.html?search=${encodeURIComponent(query)}`;
      }
    };

    searchBtn?.addEventListener('click', performSearch);
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

    if (!cartBtn || !quickCart) return;

    cartBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      quickCart.classList.add('active');
    });

    closeCart?.addEventListener('click', () => {
      quickCart.classList.remove('active');
    });

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
      return;
    }

    cartItems.style.display = 'block';
    emptyCart.style.display = 'none';

    cartItems.innerHTML = this.state.cart.map(item => `
      <div class="cart-item" data-cart-id="${item.cartId}">
        <img src="${item.image}" alt="${item.name}" class="cart-item-image">
        <div class="cart-item-details">
          <div class="cart-item-name">${item.name}</div>
          <div class="cart-item-price">₦${item.price.toLocaleString()}</div>
          <div class="cart-item-quantity">
            <button class="quantity-btn dec" aria-label="Decrease quantity">-</button>
            <span class="quantity-value">${item.quantity}</span>
            <button class="quantity-btn inc" aria-label="Increase quantity">+</button>
          </div>
        </div>
        <button class="remove-item" aria-label="Remove ${item.name}">
          <i class="fas fa-times"></i>
        </button>
      </div>
    `).join('');

    // Add event listeners
    this.state.cart.forEach((item, index) => {
      const removeBtn = cartItems.querySelectorAll('.remove-item')[index];
      const decBtn = cartItems.querySelectorAll('.dec')[index];
      const incBtn = cartItems.querySelectorAll('.inc')[index];

      removeBtn?.addEventListener('click', () => this.removeFromCart(item.cartId));
      decBtn?.addEventListener('click', () => this.updateCartQuantity(item.cartId, item.quantity - 1));
      incBtn?.addEventListener('click', () => this.updateCartQuantity(item.cartId, item.quantity + 1));
    });

    // Update totals
    const subtotal = this.state.cart.reduce((total, item) => total + (item.price * item.quantity), 0);
    const tax = subtotal * this.state.taxRate;
    const total = subtotal + tax + this.state.shippingCost;

    if (cartSubtotal) cartSubtotal.textContent = '₦' + subtotal.toLocaleString();
    if (cartTax) cartTax.textContent = '₦' + tax.toFixed(2);
    if (cartShipping) cartShipping.textContent = '₦' + this.state.shippingCost.toLocaleString();
    if (cartTotal) cartTotal.textContent = '₦' + total.toFixed(2);
  }

  // ========== PRODUCTS MANAGEMENT ==========
  async loadFeaturedProducts() {
    const productsGrid = document.getElementById('featured-products');
    const loadingSpinner = document.getElementById('products-loading');
    
    if (!productsGrid) return;

    try {
      await this.delay(800);
      const products = this.getSampleProducts().slice(0, 4);
      this.state.featuredProducts = products;
      this.renderProducts(products, productsGrid);
      loadingSpinner && (loadingSpinner.style.display = 'none');
    } catch (error) {
      this.handleProductsLoadError(error, loadingSpinner);
    }
  }

  async loadAllProducts() {
    const productsGrid = document.getElementById('products-grid');
    const loadingSpinner = document.getElementById('products-loading');
    
    if (!productsGrid) return;

    try {
      await this.delay(600);
      const products = this.getSampleProducts();
      this.state.allProducts = products;
      this.renderProducts(products, productsGrid);
      loadingSpinner && (loadingSpinner.style.display = 'none');
      this.setupProductFilters();
    } catch (error) {
      this.handleProductsLoadError(error, loadingSpinner);
    }
  }

  getSampleProducts() {
    return [
      // Fruits
      { id: 1, name: 'Fresh Tomatoes', price: 1200, image: 'images/products/tomatoes.jpg', category: 'fruits', rating: 4.5, unit: 'kg' },
      { id: 2, name: 'Bananas', price: 800, image: 'images/products/bananas.jpg', category: 'fruits', rating: 4.3, unit: 'bunch' },
      { id: 3, name: 'Oranges', price: 1500, image: 'images/products/oranges.jpg', category: 'fruits', rating: 4.6, unit: 'kg' },
      // ... add more products as needed
    ];
  }

  handleProductsLoadError(error, loadingSpinner) {
    console.error('Error loading products:', error);
    if (loadingSpinner) {
      loadingSpinner.innerHTML = '<i class="fas fa-exclamation-triangle"></i> <span>Failed to load products.</span>';
    }
    this.showNotification('Failed to load products', 'error');
    this.loadCachedProducts();
  }

  loadCachedProducts() {
    const cached = localStorage.getItem('tangogi-cached-products');
    if (cached) {
      const products = JSON.parse(cached);
      this.state.featuredProducts = products.slice(0, 4);
      this.renderProducts(this.state.featuredProducts, document.getElementById('featured-products'));
    }
  }

  renderProducts(products, container) {
    if (!container) return;

    if (products.length === 0) {
      container.innerHTML = '<p class="no-products">No products found. Try a different filter.</p>';
      return;
    }

    container.innerHTML = products.map((product, index) => `
      <div class="product-card" data-product-id="${product.id}" data-product-index="${index}">
        <div class="product-image">
          <img src="${product.image}" alt="${product.name}" loading="lazy">
          <button class="wishlist-btn" data-wishlist-id="${product.id}" 
                  aria-label="${this.state.wishlist.includes(product.id) ? 'Remove from' : 'Add to'} wishlist">
            <i class="${this.state.wishlist.includes(product.id) ? 'fas fa-heart' : 'far fa-heart'}"></i>
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
          <button class="btn btn-primary add-to-cart" data-product-id="${product.id}">
            <i class="fas fa-shopping-cart"></i> Add to Cart
          </button>
        </div>
      </div>
    `).join('');

    // Add event listeners
    container.querySelectorAll('.add-to-cart').forEach(btn => {
      btn.addEventListener('click', () => {
        const id = parseInt(btn.dataset.productId);
        const product = this.findProductById(id);
        if (product) this.addToCart(product);
      });
    });

    container.querySelectorAll('.wishlist-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const id = parseInt(btn.dataset.wishlistId);
        this.toggleWishlist(id);
      });
    });
  }

  findProductById(id) {
    return this.state.featuredProducts.find(p => p.id === id) || 
           this.state.allProducts.find(p => p.id === id);
  }

  generateStarRating(rating) {
    const fullStars = Math.floor(rating);
    const hasHalf = rating % 1 >= 0.5;
    const emptyStars = 5 - fullStars - (hasHalf ? 1 : 0);

    return '★'.repeat(fullStars) + (hasHalf ? '½' : '') + '☆'.repeat(emptyStars);
  }

  // ========== PAGE-SPECIFIC FUNCTIONALITY ==========
  async loadProductsPage() {
    await this.loadAllProducts();
    this.setupProductsPageFunctionality();
  }

  loadCartPage() {
    this.updateCartPage();
  }

  updateCartPage() {
    const cartItemsContainer = document.getElementById('cart-items-container');
    const emptyCartMessage = document.getElementById('empty-cart-message');

    if (!cartItemsContainer || !emptyCartMessage) return;

    if (this.state.cart.length === 0) {
      cartItemsContainer.style.display = 'none';
      emptyCartMessage.style.display = 'block';
      return;
    }

    cartItemsContainer.style.display = 'block';
    emptyCartMessage.style.display = 'none';

    cartItemsContainer.innerHTML = this.state.cart.map(item => `
      <div class="cart-item" data-cart-id="${item.cartId}">
        <img src="${item.image}" alt="${item.name}" class="cart-item-image">
        <div class="cart-item-details">
          <div class="cart-item-name">${item.name}</div>
          <div class="cart-item-price">₦${item.price.toLocaleString()}</div>
          <div class="cart-item-quantity">
            <button class="quantity-btn dec" aria-label="Decrease quantity">-</button>
            <span class="quantity-value">${item.quantity}</span>
            <button class="quantity-btn inc" aria-label="Increase quantity">+</button>
          </div>
        </div>
        <button class="remove-item" aria-label="Remove ${item.name}">
          <i class="fas fa-times"></i>
        </button>
      </div>
    `).join('');

    // Add event listeners
    this.state.cart.forEach((item, index) => {
      const removeBtn = cartItemsContainer.querySelectorAll('.remove-item')[index];
      const decBtn = cartItemsContainer.querySelectorAll('.dec')[index];
      const incBtn = cartItemsContainer.querySelectorAll('.inc')[index];

      removeBtn?.addEventListener('click', () => this.removeFromCart(item.cartId));
      decBtn?.addEventListener('click', () => this.updateCartQuantity(item.cartId, item.quantity - 1));
      incBtn?.addEventListener('click', () => this.updateCartQuantity(item.cartId, item.quantity + 1));
    });

    // Update totals
    const subtotal = this.state.cart.reduce((total, item) => total + (item.price * item.quantity), 0);
    const tax = subtotal * this.state.taxRate;
    const total = subtotal + tax + this.state.shippingCost;

    document.getElementById('cart-subtotal')?.textContent = '₦' + subtotal.toLocaleString();
    document.getElementById('cart-tax')?.textContent = '₦' + tax.toFixed(2);
    document.getElementById('cart-shipping')?.textContent = '₦' + this.state.shippingCost.toLocaleString();
    document.getElementById('cart-total')?.textContent = '₦' + total.toFixed(2);

    // Setup checkout
    const checkoutBtn = document.getElementById('checkout-btn');
    if (checkoutBtn) {
      checkoutBtn.onclick = () => {
        alert('✅ Checkout functionality will be added soon!\n\nIn a real app, this would connect to a payment gateway.');
      };
    }
  }

  setupProductsPageFunctionality() {
    if (!window.location.pathname.includes('products.html')) return;
    
    this.setupProductFilters();
    this.handleSearchParams();
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

  handleSearchParams() {
    const urlParams = new URLSearchParams(window.location.search);
    const searchQuery = urlParams.get('search');
    
    if (searchQuery) {
      document.getElementById('search-query').textContent = searchQuery;
      document.getElementById('search-results-header').style.display = 'flex';
      
      const filtered = this.state.allProducts.filter(product =>
        product.name.toLowerCase().includes(searchQuery.toLowerCase())
      );
      this.renderProducts(filtered, document.getElementById('products-grid'));
    }
  }

  setupAboutPage() {
    if (!window.location.pathname.includes('about.html')) return;

    const animateNumbers = () => {
      const milestoneNumbers = document.querySelectorAll('.milestone-number');
      milestoneNumbers.forEach(number => {
        const target = parseInt(number.getAttribute('data-count'));
        const suffix = number.getAttribute('data-suffix') || '';
        const duration = 2000;
        const step = target / (duration / 16);
        let current = 0;
        
        const timer = setInterval(() => {
          current += step;
          if (current >= target) {
            current = target;
            clearInterval(timer);
          }
          number.textContent = Math.floor(current) + suffix;
        }, 16);
      });
    };

    const checkScroll = () => {
      const elements = document.querySelectorAll('.fade-in');
      elements.forEach(element => {
        const elementTop = element.getBoundingClientRect().top;
        const windowHeight = window.innerHeight;
        if (elementTop < windowHeight - 100) {
          element.classList.add('visible');
        }
      });
      
      const milestonesSection = document.querySelector('.milestones-section');
      if (milestonesSection && !milestonesSection.classList.contains('animated')) {
        const sectionTop = milestonesSection.getBoundingClientRect().top;
        if (sectionTop < window.innerHeight - 100) {
          milestonesSection.classList.add('animated');
          animateNumbers();
        }
      }
    };

    // Add fade-in classes
    document.querySelectorAll('.value-card, .story-content, .cta-content').forEach(el => {
      el.classList.add('fade-in');
    });

    window.addEventListener('scroll', checkScroll);
    checkScroll();
  }

  // ========== UTILITY METHODS ==========
  initializeFloatingActions() {
    const quickCartBtn = document.getElementById('quick-cart-btn');
    quickCartBtn?.addEventListener('click', () => {
      const quickCart = document.getElementById('quick-cart');
      if (quickCart) {
        quickCart.classList.add('active');
        this.updateQuickCart();
      }
    });
  }

  animateCartButton() {
    const cartBtn = document.getElementById('cart-btn');
    if (cartBtn) {
      cartBtn.classList.add('pulse');
      setTimeout(() => cartBtn.classList.remove('pulse'), 600);
    }
  }

  setupOfflineDetection() {
    window.addEventListener('online', () => {
      this.showNotification('Connection restored', 'success');
    });
    
    window.addEventListener('offline', () => {
      this.showNotification('You are currently offline', 'warning');
    });
  }

  setupPerformanceMonitoring() {
    window.addEventListener('load', () => {
      if (performance.timing) {
        const loadTime = performance.timing.loadEventEnd - performance.timing.navigationStart;
        console.log(`Page loaded in ${loadTime}ms`);
      }
    });
  }

  registerServiceWorker() {
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.register('/sw.js')
        .then(registration => {
          console.log('SW registered:', registration);
          registration.addEventListener('updatefound', () => {
            this.showNotification('New version available', 'info');
          });
        })
        .catch(error => {
          console.log('SW registration failed:', error);
        });
    }
  }

  delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  trackEvent(category, action, label) {
    if (typeof gtag !== 'undefined') {
      gtag('event', action, {
        'event_category': category,
        'event_label': label
      });
    }
  }
}

// Initialize the app
document.addEventListener('DOMContentLoaded', () => {
  window.app = new TangogiApp();
});