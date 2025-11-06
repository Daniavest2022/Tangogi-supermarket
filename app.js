// js/app.js - MODERN ENHANCED VERSION
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
      shippingCost: 500,
      searchQuery: '',
      activeFilters: {
        category: '',
        sort: 'default'
      },
      recentlyViewed: [],
      compareList: [],
      darkMode: false
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
    this.bindGlobalEvents(); // New: Global event listener setup
  }

  // ========== STORAGE MANAGEMENT ==========

  loadFromStorage() {
    this.loadCart();
    this.loadWishlist();
    this.loadUserPreferences();
    this.loadRecentlyViewed();
    this.loadCompareList();
  }

  loadCart() {
    const savedCart = localStorage.getItem('tangogi-cart');
    if (savedCart) {
      try {
        this.state.cart = JSON.parse(savedCart);
        this.updateCartDisplay();
      } catch (e) {
        console.error('Failed to parse cart from storage:', e);
        this.state.cart = [];
        localStorage.removeItem('tangogi-cart');
      }
    }
  }

  saveCart() {
    try {
      localStorage.setItem('tangogi-cart', JSON.stringify(this.state.cart));
      this.updateCartDisplay();
    } catch (e) {
      console.error('Failed to save cart to storage:', e);
    }
  }

  loadWishlist() {
    const savedWishlist = localStorage.getItem('tangogi-wishlist');
    if (savedWishlist) {
      try {
        this.state.wishlist = JSON.parse(savedWishlist);
        this.updateWishlistDisplay();
      } catch (e) {
        console.error('Failed to parse wishlist from storage:', e);
        this.state.wishlist = [];
        localStorage.removeItem('tangogi-wishlist');
      }
    }
  }

  saveWishlist() {
    try {
      localStorage.setItem('tangogi-wishlist', JSON.stringify(this.state.wishlist));
      this.updateWishlistDisplay();
    } catch (e) {
      console.error('Failed to save wishlist to storage:', e);
    }
  }

  loadUserPreferences() {
    const darkMode = localStorage.getItem('darkMode') === 'true';
    this.state.darkMode = darkMode;
    if (darkMode) {
      document.body.classList.add('dark-mode');
    }

    const location = localStorage.getItem('userLocation');
    if (location) {
      this.state.currentLocation = location;
      this.updateLocationDisplay();
    }
  }

  loadRecentlyViewed() {
    const saved = localStorage.getItem('tangogi-recently-viewed');
    if (saved) {
      try {
        this.state.recentlyViewed = JSON.parse(saved);
      } catch (e) {
        console.error('Failed to parse recently viewed:', e);
        this.state.recentlyViewed = [];
      }
    }
  }

  saveRecentlyViewed() {
    try {
      localStorage.setItem('tangogi-recently-viewed', JSON.stringify(this.state.recentlyViewed));
    } catch (e) {
      console.error('Failed to save recently viewed:', e);
    }
  }

  loadCompareList() {
    const saved = localStorage.getItem('tangogi-compare-list');
    if (saved) {
      try {
        this.state.compareList = JSON.parse(saved);
      } catch (e) {
        console.error('Failed to parse compare list:', e);
        this.state.compareList = [];
      }
    }
  }

  saveCompareList() {
    try {
      localStorage.setItem('tangogi-compare-list', JSON.stringify(this.state.compareList));
    } catch (e) {
      console.error('Failed to save compare list:', e);
    }
  }

  setupStorageSync() {
    window.addEventListener('storage', (e) => {
      const syncHandlers = {
        'tangogi-cart': () => {
          try {
            this.state.cart = e.newValue ? JSON.parse(e.newValue) : [];
            this.updateCartDisplay();
          } catch (err) {
            console.error('Sync cart error:', err);
          }
        },
        'tangogi-wishlist': () => {
          try {
            this.state.wishlist = e.newValue ? JSON.parse(e.newValue) : [];
            this.updateWishlistDisplay();
          } catch (err) {
            console.error('Sync wishlist error:', err);
          }
        },
        'darkMode': () => {
          const isDark = e.newValue === 'true';
          this.state.darkMode = isDark;
          document.body.classList.toggle('dark-mode', isDark);
        },
        'userLocation': () => {
          this.state.currentLocation = e.newValue || 'Lagos';
          this.updateLocationDisplay();
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
      'about.html': () => this.setupAboutPage(),
      'contact.html': () => this.setupContactPage(),
      'wishlist.html': () => this.loadWishlistPage(), // New Page Handler
      'compare.html': () => this.loadComparePage(), // New Page Handler
      'product.html': () => this.loadProductDetailPage() // New Page Handler
    };

    const handler = pageHandlers[filename];
    if (handler) {
      console.log('🚀 Executing handler for:', filename);
      await handler();
    } else {
      console.log('❌ No handler found for:', filename);
      this.showNotification(`Page ${filename} not implemented yet.`, 'info');
    }
  }

  getCurrentPage() {
    const path = window.location.pathname;
    const page = path.substring(path.lastIndexOf('/') + 1) || 'index.html';
    console.log('🔍 Current page detected:', page);
    return page;
  }

  // ========== CORE FEATURES SETUP ==========

  setupCoreFeatures() {
    this.initializeCounters();
    this.initializeLazyLoading();
    this.initializeFloatingActions();
    this.registerServiceWorker();
    this.setupDarkModeToggle();
    this.setupSearchSystem(); // New: Enhanced search
    this.setupProductDetailModal(); // New: Product detail modal
    this.setupComparisonFeature(); // New: Comparison feature
  }

  initializeCounters() {
    console.log('🔢 Initializing counters...');
    this.setupViewCounters();
    this.setupInteractionTracking();
  }

  setupViewCounters() {
    let pageViews = parseInt(localStorage.getItem('tangogi-page-views') || '0');
    pageViews++;
    localStorage.setItem('tangogi-page-views', pageViews.toString());
    console.log('📊 Page views:', pageViews);

    // Update the hero stats dynamically
    const statElements = document.querySelectorAll('.stat-number');
    if (statElements.length >= 3) {
      statElements[0].textContent = pageViews; // Total Visits
      statElements[1].textContent = this.state.cart.reduce((sum, item) => sum + item.quantity, 0); // Items Sold
      statElements[2].textContent = this.state.wishlist.length; // Wishlist Items
    }
  }

  setupInteractionTracking() {
    document.addEventListener('click', (e) => {
      if (e.target.closest('.add-to-cart')) {
        this.trackEvent('products', 'add_to_cart', 'button_click');
      } else if (e.target.closest('.wishlist-btn')) {
        this.trackEvent('products', 'toggle_wishlist', 'button_click');
      } else if (e.target.closest('.search-btn')) {
        this.trackEvent('search', 'perform_search', 'button_click');
      }
    });
  }

  initializeLazyLoading() {
    console.log('🖼️ Initializing lazy loading...');
    if ('IntersectionObserver' in window) {
      const lazyImageObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            const img = entry.target;
            if (img.dataset.src) {
              img.src = img.dataset.src;
              img.removeAttribute('data-src'); // Prevent re-loading
            }
            img.classList.remove('lazy-load');
            img.classList.add('loaded');
            lazyImageObserver.unobserve(img);
          }
        });
      }, {
        threshold: 0.1,
        rootMargin: '50px'
      });

      document.querySelectorAll('img[data-src]').forEach(img => {
        lazyImageObserver.observe(img);
      });
    } else {
      // Fallback: Load all images immediately
      document.querySelectorAll('img[data-src]').forEach(img => {
        img.src = img.dataset.src;
        img.classList.remove('lazy-load');
        img.classList.add('loaded');
      });
    }
  }

  setupDarkModeToggle() {
    const darkModeToggle = document.getElementById('dark-mode-toggle');
    if (!darkModeToggle) return;

    const toggleDarkMode = () => {
      document.body.classList.toggle('dark-mode');
      this.state.darkMode = document.body.classList.contains('dark-mode');
      localStorage.setItem('darkMode', this.state.darkMode);
      darkModeToggle.innerHTML = this.state.darkMode ?
        '<i class="fas fa-sun"></i>' :
        '<i class="fas fa-moon"></i>';
      // Update any dynamic elements that might need theme-specific styling
      this.updateThemeDependentElements();
    };

    darkModeToggle.addEventListener('click', toggleDarkMode);

    // Check system preference
    if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
      document.body.classList.add('dark-mode');
      this.state.darkMode = true;
      localStorage.setItem('darkMode', 'true');
      darkModeToggle.innerHTML = '<i class="fas fa-sun"></i>';
    } else if (localStorage.getItem('darkMode') === 'true') {
      document.body.classList.add('dark-mode');
      darkModeToggle.innerHTML = '<i class="fas fa-sun"></i>';
    }
  }

  updateThemeDependentElements() {
    // Example: Update gradient backgrounds or other theme-sensitive styles
    const heroSection = document.querySelector('.hero-section');
    if (heroSection) {
      if (this.state.darkMode) {
        heroSection.style.background = 'linear-gradient(135deg, #1a1a1a 0%, #2d2d2d 100%)';
      } else {
        heroSection.style.background = 'linear-gradient(135deg, var(--primary-light) 0%, var(--background) 100%)';
      }
    }
  }

  // ========== SEARCH SYSTEM ========== (New Feature)

  setupSearchSystem() {
    const searchInput = document.getElementById('search-input');
    const searchBtn = document.getElementById('search-btn');
    const searchClear = document.getElementById('search-clear');
    const searchSuggestions = document.getElementById('search-suggestions');

    if (!searchInput || !searchBtn) return;

    let searchTimeout;
    let isSearching = false;

    const performSearch = (query = null) => {
      if (!query) query = searchInput.value.trim();
      if (!query) return;

      this.state.searchQuery = query;
      this.showNotification(`Searching for "${query}"...`, 'info');

      // Redirect to products page with query
      window.location.href = `products.html?search=${encodeURIComponent(query)}`;
    };

    searchInput.addEventListener('input', () => {
      clearTimeout(searchTimeout);
      const query = searchInput.value.trim();

      // Show/hide clear button
      if (searchClear) {
        searchClear.style.display = query ? 'block' : 'none';
      }

      // Show suggestions if input has value
      if (query.length > 0) {
        isSearching = true;
        this.showSearchSuggestions(query);
      } else {
        if (searchSuggestions) searchSuggestions.classList.remove('active');
        isSearching = false;
      }
    });

    searchClear?.addEventListener('click', () => {
      searchInput.value = '';
      searchClear.style.display = 'none';
      searchInput.focus();
      if (searchSuggestions) searchSuggestions.classList.remove('active');
      this.state.searchQuery = '';
    });

    searchBtn?.addEventListener('click', () => performSearch());

    searchInput.addEventListener('keypress', (e) => {
      if (e.key === 'Enter') performSearch();
    });

    // Add click outside to hide suggestions
    document.addEventListener('click', (e) => {
      if (searchSuggestions && !e.target.closest('.search-section')) {
        searchSuggestions.classList.remove('active');
      }
    });
  }

  showSearchSuggestions(query) {
    const searchSuggestions = document.getElementById('search-suggestions');
    if (!searchSuggestions) return;

    // Filter products based on query
    const results = this.state.allProducts.filter(product =>
      product.name.toLowerCase().includes(query.toLowerCase())
    ).slice(0, 5); // Limit to 5 suggestions

    if (results.length === 0) {
      searchSuggestions.innerHTML = `<div class="suggestion-item">No results for "${query}"</div>`;
      searchSuggestions.classList.add('active');
      return;
    }

    searchSuggestions.innerHTML = results.map(product => `
      <div class="suggestion-item" data-product-id="${product.id}">
        <img src="${product.image}" alt="${product.name}" class="suggestion-image">
        <div class="suggestion-content">
          <span class="suggestion-name">${product.name}</span>
          <span class="suggestion-price">₦${product.price.toLocaleString()}</span>
        </div>
      </div>
    `).join('');

    searchSuggestions.classList.add('active');

    // Add click handlers to suggestions
    searchSuggestions.querySelectorAll('.suggestion-item').forEach(item => {
      item.addEventListener('click', () => {
        const productId = parseInt(item.dataset.productId);
        this.navigateToProduct(productId);
      });
    });
  }

  // ========== PRODUCT DETAIL MODAL ========== (New Feature)

  setupProductDetailModal() {
    // Create the modal element dynamically if it doesn't exist
    if (!document.getElementById('product-detail-modal')) {
      const modal = document.createElement('div');
      modal.id = 'product-detail-modal';
      modal.className = 'modal';
      modal.innerHTML = `
        <div class="modal-content">
          <button id="modal-close" class="modal-close">&times;</button>
          <div id="product-detail-content"></div>
        </div>
      `;
      document.body.appendChild(modal);
    }

    // Setup close button
    const closeModalBtn = document.getElementById('modal-close');
    closeModalBtn?.addEventListener('click', () => {
      this.closeProductDetailModal();
    });

    // Close modal on click outside
    document.addEventListener('click', (e) => {
      const modal = document.getElementById('product-detail-modal');
      if (modal && modal.classList.contains('active') && e.target === modal) {
        this.closeProductDetailModal();
      }
    });

    // Close modal on escape key
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') {
        this.closeProductDetailModal();
      }
    });
  }

  openProductDetailModal(productId) {
    const product = this.findProductById(productId);
    if (!product) {
      this.showNotification('Product not found.', 'error');
      return;
    }

    // Add to recently viewed
    if (!this.state.recentlyViewed.includes(productId)) {
      this.state.recentlyViewed.unshift(productId);
      if (this.state.recentlyViewed.length > 10) {
        this.state.recentlyViewed.pop();
      }
      this.saveRecentlyViewed();
    }

    const modal = document.getElementById('product-detail-modal');
    const content = document.getElementById('product-detail-content');

    if (!modal || !content) return;

    content.innerHTML = `
      <div class="product-detail-header">
        <h2>${product.name}</h2>
        <div class="product-rating">
          ${this.generateStarRating(product.rating)}
          <span class="rating-value">${product.rating}/5</span>
        </div>
      </div>
      <div class="product-detail-image">
        <img src="${product.image}" alt="${product.name}" loading="lazy">
      </div>
      <div class="product-detail-info">
        <p class="product-description">${product.description || 'No description available.'}</p>
        <div class="product-price">
          <span class="price">₦${product.price.toLocaleString()}</span>
          <span class="unit">/${product.unit}</span>
        </div>
        <div class="product-actions">
          <button class="btn btn-primary add-to-cart" data-product-id="${product.id}">
            <i class="fas fa-shopping-cart"></i> Add to Cart
          </button>
          <button class="btn btn-outline wishlist-btn" data-wishlist-id="${product.id}">
            <i class="${this.state.wishlist.includes(product.id) ? 'fas fa-heart' : 'far fa-heart'}"></i>
            ${this.state.wishlist.includes(product.id) ? 'Remove from Wishlist' : 'Add to Wishlist'}
          </button>
          <button class="btn btn-outline compare-btn" data-product-id="${product.id}">
            <i class="${this.state.compareList.includes(product.id) ? 'fas fa-check' : 'far fa-plus-square'}"></i>
            ${this.state.compareList.includes(product.id) ? 'In Compare List' : 'Compare'}
          </button>
        </div>
      </div>
    `;

    // Add event listeners
    const addToCartBtn = content.querySelector('.add-to-cart');
    addToCartBtn?.addEventListener('click', () => {
      this.addToCart(product);
      this.closeProductDetailModal();
    });

    const wishlistBtn = content.querySelector('.wishlist-btn');
    wishlistBtn?.addEventListener('click', () => {
      this.toggleWishlist(product.id);
      // Update the icon and text
      const icon = wishlistBtn.querySelector('i');
      const text = wishlistBtn.querySelector('span');
      if (this.state.wishlist.includes(product.id)) {
        icon.className = 'fas fa-heart';
        text.textContent = 'Remove from Wishlist';
      } else {
        icon.className = 'far fa-heart';
        text.textContent = 'Add to Wishlist';
      }
    });

    const compareBtn = content.querySelector('.compare-btn');
    compareBtn?.addEventListener('click', () => {
      this.toggleCompare(product.id);
      // Update the icon and text
      const icon = compareBtn.querySelector('i');
      const text = compareBtn.querySelector('span');
      if (this.state.compareList.includes(product.id)) {
        icon.className = 'fas fa-check';
        text.textContent = 'In Compare List';
      } else {
        icon.className = 'far fa-plus-square';
        text.textContent = 'Compare';
      }
    });

    modal.classList.add('active');
  }

  closeProductDetailModal() {
    const modal = document.getElementById('product-detail-modal');
    if (modal) {
      modal.classList.remove('active');
    }
  }

  // ========== COMPARISON FEATURE ========== (New Feature)

  setupComparisonFeature() {
    // Setup compare button on product cards
    document.addEventListener('click', (e) => {
      if (e.target.closest('.compare-btn')) {
        const btn = e.target.closest('.compare-btn');
        const productId = parseInt(btn.dataset.productId);
        this.toggleCompare(productId);
      }
    });
  }

  toggleCompare(productId) {
    const index = this.state.compareList.indexOf(productId);
    if (index > -1) {
      this.state.compareList.splice(index, 1);
      this.showNotification('Removed from comparison list.', 'info');
    } else {
      if (this.state.compareList.length >= 4) {
        this.showNotification('You can only compare up to 4 products.', 'warning');
        return;
      }
      this.state.compareList.push(productId);
      this.showNotification('Added to comparison list.', 'success');
    }
    this.saveCompareList();
    this.updateCompareButton(productId);
    this.updateCompareBadge();
  }

  updateCompareButton(productId) {
    document.querySelectorAll(`[data-product-id="${productId}"].compare-btn`).forEach(btn => {
      const icon = btn.querySelector('i');
      const text = btn.querySelector('span');
      if (this.state.compareList.includes(productId)) {
        icon.className = 'fas fa-check';
        text.textContent = 'In Compare List';
      } else {
        icon.className = 'far fa-plus-square';
        text.textContent = 'Compare';
      }
    });
  }

  updateCompareBadge() {
    const compareBadge = document.getElementById('compare-badge');
    if (compareBadge) {
      compareBadge.textContent = this.state.compareList.length;
      compareBadge.style.display = this.state.compareList.length > 0 ? 'flex' : 'none';
    }
  }

  // ========== HEADER FUNCTIONALITY ==========

  initializeHeaderFunctionality() {
    console.log('🔧 Initializing header functionality...');
    this.setupMobileMenu();
    this.setupSearch();
    this.setupLocationSelector();
    this.setupUserDropdown();
    this.setupQuickCart();
    this.setupCompareIcon(); // New: Compare icon in header
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

    // Close menu when clicking on a link
    mobileNav.querySelectorAll('.nav-link').forEach(link => {
      link.addEventListener('click', () => {
        toggleMenu(false);
      });
    });
  }

  setupSearch() {
    const searchInput = document.getElementById('search-input');
    const searchBtn = document.getElementById('search-btn');
    const searchClear = document.getElementById('search-clear');
    const searchSuggestions = document.getElementById('search-suggestions');

    if (!searchInput) return;

    let searchTimeout;
    searchInput.addEventListener('input', () => {
      if (searchClear) {
        searchClear.style.display = searchInput.value ? 'block' : 'none';
      }

      clearTimeout(searchTimeout);
      searchTimeout = setTimeout(() => {
        // Real-time search suggestions
        this.showSearchSuggestions(searchInput.value);
      }, 300);
    });

    searchClear?.addEventListener('click', () => {
      searchInput.value = '';
      searchClear.style.display = 'none';
      searchInput.focus();
      if (searchSuggestions) searchSuggestions.classList.remove('active');
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
    const locationSearch = document.getElementById('location-search-input');
    const locationOptions = document.getElementById('location-options');

    if (!locationBtn || !locationDropdown) return;

    // Mock locations for demo
    const locations = ['Lagos', 'Abuja', 'Port Harcourt', 'Ibadan', 'Kano', 'Enugu'];

    const renderLocations = (filter = '') => {
      const filtered = locations.filter(loc => loc.toLowerCase().includes(filter.toLowerCase()));
      locationOptions.innerHTML = filtered.map(loc => `
        <div class="location-option ${loc === this.state.currentLocation ? 'active' : ''}" data-location="${loc}">
          <i class="fas fa-map-marker-alt"></i>
          <span>${loc}</span>
        </div>
      `).join('');

      // Add click handlers
      locationOptions.querySelectorAll('.location-option').forEach(option => {
        option.addEventListener('click', () => {
          const location = option.dataset.location;
          this.state.currentLocation = location;
          localStorage.setItem('userLocation', location);
          this.updateLocationDisplay();
          locationDropdown.classList.remove('active');
          this.showNotification(`Location updated to ${location}`, 'success');
        });
      });
    };

    locationBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      locationDropdown.classList.toggle('active');
      if (locationDropdown.classList.contains('active')) {
        renderLocations();
        locationSearch?.focus();
      }
    });

    // Add search functionality to location dropdown
    if (locationSearch) {
      locationSearch.addEventListener('input', () => {
        renderLocations(locationSearch.value);
      });
    }

    document.addEventListener('click', () => {
      locationDropdown.classList.remove('active');
    });
  }

  updateLocationDisplay() {
    const locationText = document.getElementById('location-text');
    if (locationText) {
      locationText.textContent = this.state.currentLocation;
    }
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
      this.updateQuickCart(); // Ensure it's updated when opened
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

  setupCompareIcon() {
    const compareBtn = document.getElementById('compare-btn');
    if (!compareBtn) return;

    compareBtn.addEventListener('click', () => {
      if (this.state.compareList.length === 0) {
        this.showNotification('Your comparison list is empty.', 'info');
        return;
      }
      window.location.href = 'compare.html';
    });

    // Initialize badge
    this.updateCompareBadge();
  }

  // ========== PRODUCTS MANAGEMENT ==========

  getSampleProducts() {
    return [
      { id: 1, name: 'Fresh Tomatoes', price: 1200, image: 'https://via.placeholder.com/300x300?text=Tomatoes', category: 'fruits', rating: 4.5, unit: 'kg', inStock: true, description: 'Juicy and ripe tomatoes perfect for salads and sauces.' },
      { id: 2, name: 'Bananas', price: 800, image: 'https://via.placeholder.com/300x300?text=Bananas', category: 'fruits', rating: 4.3, unit: 'bunch', inStock: true, description: 'Sweet and creamy bananas, great for smoothies or as a snack.' },
      { id: 3, name: 'Oranges', price: 1500, image: 'https://via.placeholder.com/300x300?text=Oranges', category: 'fruits', rating: 4.6, unit: 'kg', inStock: true, description: 'Refreshing oranges, rich in Vitamin C, ideal for juicing.' },
      { id: 4, name: 'Apples', price: 2500, image: 'https://via.placeholder.com/300x300?text=Apples', category: 'fruits', rating: 4.7, unit: 'kg', inStock: true, description: 'Crisp and sweet apples, perfect for eating fresh or baking.' },
      { id: 5, name: 'Mangoes', price: 1800, image: 'https://via.placeholder.com/300x300?text=Mangoes', category: 'fruits', rating: 4.8, unit: 'kg', inStock: true, description: 'Tropical mangoes with a sweet, juicy flavor.' },
      { id: 6, name: 'Pineapples', price: 1200, image: 'https://via.placeholder.com/300x300?text=Pineapples', category: 'fruits', rating: 4.4, unit: 'each', inStock: true, description: 'Tangy and sweet pineapples, excellent for desserts.' },
      { id: 7, name: 'Watermelon', price: 3000, image: 'https://via.placeholder.com/300x300?text=Watermelon', category: 'fruits', rating: 4.6, unit: 'each', inStock: true, description: 'Refreshing watermelons, perfect for hot days.' },
      { id: 8, name: 'Grapes', price: 4000, image: 'https://via.placeholder.com/300x300?text=Grapes', category: 'fruits', rating: 4.5, unit: 'kg', inStock: true, description: 'Sweet and seedless grapes, great for snacking.' },
      { id: 9, name: 'Fresh Carrots', price: 900, image: 'https://via.placeholder.com/300x300?text=Carrots', category: 'vegetables', rating: 4.5, unit: 'kg', inStock: true, description: 'Crunchy and nutritious carrots, ideal for cooking or raw snacks.' },
      { id: 10, name: 'Bell Peppers', price: 1500, image: 'https://via.placeholder.com/300x300?text=Peppers', category: 'vegetables', rating: 4.4, unit: 'kg', inStock: true, description: 'Colorful bell peppers, great for stir-fries and salads.' },
      { id: 11, name: 'Onions', price: 800, image: 'https://via.placeholder.com/300x300?text=Onions', category: 'vegetables', rating: 4.3, unit: 'kg', inStock: true, description: 'Essential onions for adding flavor to any dish.' },
      { id: 12, name: 'Potatoes', price: 700, image: 'https://via.placeholder.com/300x300?text=Potatoes', category: 'vegetables', rating: 4.2, unit: 'kg', inStock: true, description: 'Versatile potatoes, perfect for mashing, roasting, or frying.' },
      { id: 13, name: 'Cabbage', price: 600, image: 'https://via.placeholder.com/300x300?text=Cabbage', category: 'vegetables', rating: 4.1, unit: 'each', inStock: true, description: 'Crunchy cabbage, excellent for coleslaw or stir-frying.' },
      { id: 14, name: 'Lettuce', price: 500, image: 'https://via.placeholder.com/300x300?text=Lettuce', category: 'vegetables', rating: 4.3, unit: 'each', inStock: true, description: 'Fresh lettuce, the perfect base for any salad.' },
      { id: 15, name: 'Broccoli', price: 1200, image: 'https://via.placeholder.com/300x300?text=Broccoli', category: 'vegetables', rating: 4.4, unit: 'kg', inStock: true, description: 'Nutritious broccoli, great steamed or roasted.' },
      { id: 16, name: 'Cauliflower', price: 1100, image: 'https://via.placeholder.com/300x300?text=Cauliflower', category: 'vegetables', rating: 4.2, unit: 'kg', inStock: true, description: 'Versatile cauliflower, can be roasted, mashed, or made into rice.' },
      { id: 17, name: 'Fresh Milk', price: 1200, image: 'https://via.placeholder.com/300x300?text=Milk', category: 'dairy', rating: 4.7, unit: '1L', inStock: true, description: 'Rich and creamy milk, perfect for cereal or drinking.' },
      { id: 18, name: 'Eggs (30 pieces)', price: 2500, image: 'https://via.placeholder.com/300x300?text=Eggs', category: 'dairy', rating: 4.8, unit: 'tray', inStock: true, description: 'High-quality eggs, essential for baking and cooking.' },
      { id: 19, name: 'Butter', price: 1800, image: 'https://via.placeholder.com/300x300?text=Butter', category: 'dairy', rating: 4.6, unit: '500g', inStock: true, description: 'Pure butter for spreading, baking, or cooking.' },
      { id: 20, name: 'Yogurt', price: 800, image: 'https://via.placeholder.com/300x300?text=Yogurt', category: 'dairy', rating: 4.5, unit: '500g', inStock: true, description: 'Creamy yogurt, great for breakfast or as a snack.' },
      { id: 21, name: 'Cheese', price: 2200, image: 'https://via.placeholder.com/300x300?text=Cheese', category: 'dairy', rating: 4.7, unit: '500g', inStock: true, description: 'Delicious cheese, perfect for sandwiches or melting.' },
      { id: 22, name: 'Whipping Cream', price: 1500, image: 'https://via.placeholder.com/300x300?text=Cream', category: 'dairy', rating: 4.4, unit: '250ml', inStock: true, description: 'Rich whipping cream for desserts and coffee.' },
      { id: 23, name: 'Orange Juice', price: 1200, image: 'https://via.placeholder.com/300x300?text=Juice', category: 'beverages', rating: 4.3, unit: '1L', inStock: true, description: 'Freshly squeezed orange juice, full of Vitamin C.' },
      { id: 24, name: 'Coca Cola', price: 300, image: 'https://via.placeholder.com/300x300?text=Coke', category: 'beverages', rating: 4.8, unit: '50cl', inStock: true, description: 'The classic cola, refreshing and fizzy.' },
      { id: 25, name: 'Bottled Water', price: 200, image: 'https://via.placeholder.com/300x300?text=Water', category: 'beverages', rating: 4.9, unit: '75cl', inStock: true, description: 'Pure bottled water, essential for hydration.' },
      { id: 26, name: 'Coffee', price: 3500, image: 'https://via.placeholder.com/300x300?text=Coffee', category: 'beverages', rating: 4.6, unit: '500g', inStock: true, description: 'Premium coffee beans for a rich and aromatic brew.' },
      { id: 27, name: 'Green Tea', price: 2500, image: 'https://via.placeholder.com/300x300?text=Tea', category: 'beverages', rating: 4.5, unit: '100 bags', inStock: true, description: 'Healthy green tea, known for its antioxidant properties.' },
      { id: 28, name: 'Chicken Breast', price: 2800, image: 'https://via.placeholder.com/300x300?text=Chicken', category: 'meat', rating: 4.7, unit: 'kg', inStock: true, description: 'Lean chicken breast, perfect for grilling or baking.' },
      { id: 29, name: 'Beef Steak', price: 4500, image: 'https://via.placeholder.com/300x300?text=Beef', category: 'meat', rating: 4.8, unit: 'kg', inStock: true, description: 'Tender beef steak, ideal for a hearty meal.' },
      { id: 30, name: 'Pork Chops', price: 3800, image: 'https://via.placeholder.com/300x300?text=Pork', category: 'meat', rating: 4.6, unit: 'kg', inStock: true, description: 'Juicy pork chops, great for grilling or pan-frying.' },
      { id: 31, name: 'Turkey', price: 5200, image: 'https://via.placeholder.com/300x300?text=Turkey', category: 'meat', rating: 4.5, unit: 'kg', inStock: true, description: 'Flavorful turkey, perfect for roasting.' },
      { id: 32, name: 'Basmati Rice', price: 4200, image: 'https://via.placeholder.com/300x300?text=Rice', category: 'grains', rating: 4.7, unit: '5kg', inStock: true, description: 'Fragrant Basmati rice, ideal for curries and pilafs.' },
      { id: 33, name: 'Pasta', price: 800, image: 'https://via.placeholder.com/300x300?text=Pasta', category: 'grains', rating: 4.5, unit: '500g', inStock: true, description: 'Italian pasta, versatile for various sauces.' },
      { id: 34, name: 'Wheat Flour', price: 1200, image: 'https://via.placeholder.com/300x300?text=Flour', category: 'grains', rating: 4.4, unit: '2kg', inStock: true, description: 'All-purpose wheat flour for baking and cooking.' },
      { id: 35, name: 'Oats', price: 1500, image: 'https://via.placeholder.com/300x300?text=Oats', category: 'grains', rating: 4.6, unit: '1kg', inStock: true, description: 'Whole grain oats, perfect for a healthy breakfast.' },
      { id: 36, name: 'Potato Chips', price: 500, image: 'https://via.placeholder.com/300x300?text=Chips', category: 'snacks', rating: 4.4, unit: '150g', inStock: true, description: 'Crispy potato chips, a delicious snack.' },
      { id: 37, name: 'Chocolate Bar', price: 400, image: 'https://via.placeholder.com/300x300?text=Chocolate', category: 'snacks', rating: 4.8, unit: '100g', inStock: true, description: 'Rich chocolate bar, perfect for satisfying a sweet tooth.' },
      { id: 38, name: 'Cookies', price: 600, image: 'https://via.placeholder.com/300x300?text=Cookies', category: 'snacks', rating: 4.3, unit: '200g', inStock: true, description: 'Delicious cookies, great with milk or coffee.' },
      { id: 39, name: 'Peanuts', price: 800, image: 'https://via.placeholder.com/300x300?text=Peanuts', category: 'snacks', rating: 4.2, unit: '500g', inStock: true, description: 'Salted peanuts, a savory and crunchy snack.' },
      { id: 40, name: 'Popcorn', price: 300, image: 'https://via.placeholder.com/300x300?text=Popcorn', category: 'snacks', rating: 4.1, unit: '100g', inStock: true, description: 'Buttery popcorn, perfect for movie nights.' }
    ];
  }

  async loadFeaturedProducts() {
    console.log('🏠 Loading featured products for home page');
    const productsGrid = document.getElementById('featured-products');
    const loadingSpinner = document.getElementById('products-loading');

    if (!productsGrid) {
      console.log('❌ Featured products grid not found');
      return;
    }

    try {
      await this.delay(800);
      const products = this.getSampleProducts().slice(0, 8);
      console.log('📦 Featured products loaded:', products.length);
      this.state.featuredProducts = products;
      this.renderProducts(products, productsGrid);
      this.setupProductClickHandlers(productsGrid); // New: Click handlers for featured products
      loadingSpinner && (loadingSpinner.style.display = 'none');
    } catch (error) {
      this.handleProductsLoadError(error, loadingSpinner);
    }
  }

  async loadAllProducts() {
    console.log('🛍️ Loading all products for products page');
    const productsGrid = document.getElementById('products-grid');
    const loadingSpinner = document.getElementById('products-loading');

    if (!productsGrid) {
      console.log('❌ Products grid not found');
      return;
    }

    try {
      await this.delay(600);
      const products = this.getSampleProducts();
      console.log('📦 All products loaded:', products.length);
      this.state.allProducts = products;
      this.renderProducts(products, productsGrid);
      this.setupProductClickHandlers(productsGrid); // New: Click handlers for all products
      this.setupProductFilters(); // Re-setup filters after rendering

      if (loadingSpinner) {
        loadingSpinner.style.display = 'none';
        console.log('✅ Loading spinner hidden');
      }

      this.handleSearchParams(); // Handle search params
    } catch (error) {
      this.handleProductsLoadError(error, loadingSpinner);
    }
  }

  renderProducts(products, container) {
    if (!container) {
      console.log('❌ Container not found for rendering products');
      return;
    }

    console.log('🎨 Rendering', products.length, 'products to container');

    if (products.length === 0) {
      container.innerHTML = '<p class="no-products">No products found. Try a different filter.</p>';
      console.log('ℹ️ No products to render');
      return;
    }

    container.innerHTML = products.map((product, index) => `
      <div class="product-card" data-product-id="${product.id}" data-product-index="${index}">
        <div class="product-image">
          <img src="${product.image}" alt="${product.name}" loading="lazy" data-src="${product.image}">
          <button class="wishlist-btn" data-wishlist-id="${product.id}" 
                  aria-label="${this.state.wishlist.includes(product.id) ? 'Remove from' : 'Add to'} wishlist">
            <i class="${this.state.wishlist.includes(product.id) ? 'fas fa-heart' : 'far fa-heart'}"></i>
          </button>
          ${!product.inStock ? '<div class="out-of-stock">Out of Stock</div>' : ''}
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
          <button class="btn btn-primary add-to-cart" data-product-id="${product.id}" ${!product.inStock ? 'disabled' : ''}>
            <i class="fas fa-shopping-cart"></i> ${!product.inStock ? 'Out of Stock' : 'Add to Cart'}
          </button>
        </div>
      </div>
    `).join('');

    console.log('✅ Products rendered to container');

    // Add event listeners
    this.setupProductClickHandlers(container);
  }

  setupProductClickHandlers(container) {
    // Add to cart
    container.querySelectorAll('.add-to-cart').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.preventDefault();
        const id = parseInt(btn.dataset.productId);
        const product = this.findProductById(id);
        if (product) this.addToCart(product);
      });
    });

    // Toggle wishlist
    container.querySelectorAll('.wishlist-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.preventDefault();
        const id = parseInt(btn.dataset.wishlistId);
        this.toggleWishlist(id);
      });
    });

    // Open product detail modal
    container.querySelectorAll('.product-card').forEach(card => {
      card.addEventListener('click', (e) => {
        if (e.target.closest('.add-to-cart') || e.target.closest('.wishlist-btn') || e.target.closest('.compare-btn')) {
          return; // Don't open modal if clicking a button
        }
        const productId = parseInt(card.dataset.productId);
        this.openProductDetailModal(productId);
      });
    });

    // Keyboard navigation for accessibility
    container.querySelectorAll('.product-card').forEach(card => {
      card.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          const productId = parseInt(card.dataset.productId);
          this.openProductDetailModal(productId);
        }
      });
    });
  }

  // ========== CART FUNCTIONALITY ==========

  addToCart(product) {
    if (!product.inStock) {
      this.showNotification(`${product.name} is out of stock`, 'warning');
      return;
    }

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
    this.updateCartDisplay(); // Force update after removal
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

  // ========== PAGE-SPECIFIC FUNCTIONALITY ==========

  async loadProductsPage() {
    console.log('📄 Loading products page');
    await this.loadAllProducts();
    this.setupProductsPageFunctionality();
    this.setupProductsViewToggle();
    this.setupRecentViews(); // New: Show recently viewed products
  }

  setupProductsViewToggle() {
    const viewBtns = document.querySelectorAll('.view-btn');
    const productsGrid = document.getElementById('products-grid');

    if (!viewBtns.length || !productsGrid) {
      console.log('❌ View toggle elements not found');
      return;
    }

    viewBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        viewBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');

        productsGrid.className = 'products-grid';
        if (btn.dataset.view === 'list') {
          productsGrid.classList.add('list-view');
        }
      });
    });
    console.log('✅ View toggle setup complete');
  }

  setupProductsPageFunctionality() {
    if (!window.location.pathname.includes('products.html')) return;

    console.log('⚙️ Setting up products page functionality');
    this.setupProductFilters();
    this.handleSearchParams();
  }

  setupProductFilters() {
    console.log('🔍 Setting up product filters');
    const categoryFilter = document.getElementById('category-filter');
    const sortFilter = document.getElementById('sort-filter');
    const searchInput = document.getElementById('search-input');

    if (!categoryFilter || !sortFilter) {
      console.log('❌ Filter elements not found');
      return;
    }

    // Apply filters from URL or state
    const urlParams = new URLSearchParams(window.location.search);
    const category = urlParams.get('category') || this.state.activeFilters.category;
    const sortBy = urlParams.get('sort') || this.state.activeFilters.sort;

    if (category) {
      categoryFilter.value = category;
    }
    if (sortBy) {
      sortFilter.value = sortBy;
    }

    const applyFilters = () => {
      console.log('🔄 Applying filters');
      let filtered = [...this.state.allProducts];

      // Category filter
      const selectedCategory = categoryFilter?.value;
      if (selectedCategory) {
        filtered = filtered.filter(p => p.category === selectedCategory);
        this.state.activeFilters.category = selectedCategory;
        // Update URL
        const url = new URL(window.location);
        url.searchParams.set('category', selectedCategory);
        window.history.replaceState({}, '', url);
      } else {
        this.state.activeFilters.category = '';
        const url = new URL(window.location);
        url.searchParams.delete('category');
        window.history.replaceState({}, '', url);
      }

      // Sort filter
      const selectedSort = sortFilter?.value;
      this.state.activeFilters.sort = selectedSort;

      switch (selectedSort) {
        case 'price-asc':
          filtered.sort((a, b) => a.price - b.price);
          break;
        case 'price-desc':
          filtered.sort((a, b) => b.price - a.price);
          break;
        case 'rating':
          filtered.sort((a, b) => b.rating - a.rating);
          break;
        case 'name':
          filtered.sort((a, b) => a.name.localeCompare(b.name));
          break;
        default:
          // Keep original order
          break;
      }

      // Update URL for sort
      const url = new URL(window.location);
      if (selectedSort !== 'default') {
        url.searchParams.set('sort', selectedSort);
      } else {
        url.searchParams.delete('sort');
      }
      window.history.replaceState({}, '', url);

      this.renderProducts(filtered, document.getElementById('products-grid'));
    };

    categoryFilter?.addEventListener('change', applyFilters);
    sortFilter?.addEventListener('change', applyFilters);

    // Also trigger on search input change for real-time filtering
    if (searchInput) {
      searchInput.addEventListener('input', () => {
        const query = searchInput.value.trim();
        if (query) {
          // Clear filters when searching
          categoryFilter.value = '';
          sortFilter.value = 'default';
          this.state.activeFilters.category = '';
          this.state.activeFilters.sort = 'default';
          // Update URL
          const url = new URL(window.location);
          url.searchParams.delete('category');
          url.searchParams.delete('sort');
          window.history.replaceState({}, '', url);
        }
        applyFilters();
      });
    }

    console.log('✅ Filters setup complete');
  }

  handleSearchParams() {
    const urlParams = new URLSearchParams(window.location.search);
    const searchQuery = urlParams.get('search');

    if (searchQuery) {
      console.log('🔎 Handling search query:', searchQuery);
      document.getElementById('search-query').textContent = searchQuery;
      document.getElementById('search-results-header').style.display = 'flex';

      // Set the search input value
      const searchInput = document.getElementById('search-input');
      if (searchInput) {
        searchInput.value = searchQuery;
      }

      // Filter products by search query
      const filtered = this.state.allProducts.filter(product =>
        product.name.toLowerCase().includes(searchQuery.toLowerCase())
      );
      this.renderProducts(filtered, document.getElementById('products-grid'));
    } else {
      // If no search, apply filters
      this.setupProductFilters();
    }
  }

  setupRecentViews() {
    const recentContainer = document.getElementById('recently-viewed');
    if (!recentContainer) return;

    if (this.state.recentlyViewed.length === 0) {
      recentContainer.innerHTML = '<p class="no-products">No recently viewed products.</p>';
      return;
    }

    // Get the actual product objects
    const recentProducts = this.state.recentlyViewed
      .map(id => this.findProductById(id))
      .filter(product => product !== undefined);

    if (recentProducts.length === 0) {
      recentContainer.innerHTML = '<p class="no-products">No recently viewed products.</p>';
      return;
    }

    recentContainer.innerHTML = recentProducts.map(product => `
      <div class="product-card" data-product-id="${product.id}">
        <div class="product-image">
          <img src="${product.image}" alt="${product.name}" loading="lazy">
          <button class="wishlist-btn" data-wishlist-id="${product.id}">
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

    // Add event listeners for recent products
    recentContainer.querySelectorAll('.add-to-cart').forEach(btn => {
      btn.addEventListener('click', () => {
        const id = parseInt(btn.dataset.productId);
        const product = this.findProductById(id);
        if (product) this.addToCart(product);
      });
    });

    recentContainer.querySelectorAll('.wishlist-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const id = parseInt(btn.dataset.wishlistId);
        this.toggleWishlist(id);
      });
    });
  }

  // ========== WISHLIST FUNCTIONALITY ==========

  toggleWishlist(productId) {
    const product = this.findProductById(productId);
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
    this.updateWishlistDisplay();
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

  // ========== WISHLIST PAGE ========== (New Feature)

  async loadWishlistPage() {
    console.log('❤️ Loading wishlist page');
    const wishlistGrid = document.getElementById('wishlist-grid');
    const emptyWishlist = document.getElementById('empty-wishlist');

    if (!wishlistGrid) {
      console.log('❌ Wishlist grid not found');
      return;
    }

    if (this.state.wishlist.length === 0) {
      wishlistGrid.style.display = 'none';
      emptyWishlist.style.display = 'block';
      return;
    }

    wishlistGrid.style.display = 'grid';
    emptyWishlist.style.display = 'none';

    // Get the actual product objects
    const wishlistProducts = this.state.wishlist
      .map(id => this.findProductById(id))
      .filter(product => product !== undefined);

    if (wishlistProducts.length === 0) {
      wishlistGrid.style.display = 'none';
      emptyWishlist.style.display = 'block';
      return;
    }

    wishlistGrid.innerHTML = wishlistProducts.map(product => `
      <div class="product-card" data-product-id="${product.id}">
        <div class="product-image">
          <img src="${product.image}" alt="${product.name}" loading="lazy">
          <button class="wishlist-btn" data-wishlist-id="${product.id}">
            <i class="fas fa-heart"></i>
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
          <button class="btn btn-outline remove-from-wishlist" data-wishlist-id="${product.id}">
            <i class="fas fa-trash"></i> Remove
          </button>
        </div>
      </div>
    `).join('');

    // Add event listeners
    wishlistGrid.querySelectorAll('.add-to-cart').forEach(btn => {
      btn.addEventListener('click', () => {
        const id = parseInt(btn.dataset.productId);
        const product = this.findProductById(id);
        if (product) this.addToCart(product);
      });
    });

    wishlistGrid.querySelectorAll('.remove-from-wishlist').forEach(btn => {
      btn.addEventListener('click', () => {
        const id = parseInt(btn.dataset.wishlistId);
        this.toggleWishlist(id);
      });
    });
  }

  // ========== COMPARE PAGE ========== (New Feature)

  async loadComparePage() {
    console.log('📊 Loading compare page');
    const compareGrid = document.getElementById('compare-grid');
    const emptyCompare = document.getElementById('empty-compare');

    if (!compareGrid) {
      console.log('❌ Compare grid not found');
      return;
    }

    if (this.state.compareList.length === 0) {
      compareGrid.style.display = 'none';
      emptyCompare.style.display = 'block';
      return;
    }

    compareGrid.style.display = 'grid';
    emptyCompare.style.display = 'none';

    // Get the actual product objects
    const compareProducts = this.state.compareList
      .map(id => this.findProductById(id))
      .filter(product => product !== undefined);

    if (compareProducts.length === 0) {
      compareGrid.style.display = 'none';
      emptyCompare.style.display = 'block';
      return;
    }

    // Render comparison table
    compareGrid.innerHTML = `
      <div class="compare-header">
        <div class="product-column">Product</div>
        ${compareProducts.map(product => `
          <div class="product-column">
            <img src="${product.image}" alt="${product.name}" class="compare-image">
            <div class="compare-name">${product.name}</div>
            <button class="btn btn-outline remove-from-compare" data-product-id="${product.id}">
              <i class="fas fa-trash"></i> Remove
            </button>
          </div>
        `).join('')}
      </div>
      <div class="compare-row">
        <div class="feature-label">Price</div>
        ${compareProducts.map(product => `
          <div class="feature-value">₦${product.price.toLocaleString()}</div>
        `).join('')}
      </div>
      <div class="compare-row">
        <div class="feature-label">Rating</div>
        ${compareProducts.map(product => `
          <div class="feature-value">${this.generateStarRating(product.rating)} (${product.rating})</div>
        `).join('')}
      </div>
      <div class="compare-row">
        <div class="feature-label">Unit</div>
        ${compareProducts.map(product => `
          <div class="feature-value">${product.unit}</div>
        `).join('')}
      </div>
      <div class="compare-row">
        <div class="feature-label">In Stock</div>
        ${compareProducts.map(product => `
          <div class="feature-value">${product.inStock ? '<i class="fas fa-check text-success"></i>' : '<i class="fas fa-times text-danger"></i>'}</div>
        `).join('')}
      </div>
      <div class="compare-actions">
        <button class="btn btn-primary add-all-to-cart">Add All to Cart</button>
      </div>
    `;

    // Add event listeners
    compareGrid.querySelectorAll('.remove-from-compare').forEach(btn => {
      btn.addEventListener('click', () => {
        const id = parseInt(btn.dataset.productId);
        this.toggleCompare(id);
        // Refresh the page to update the comparison
        window.location.reload();
      });
    });

    compareGrid.querySelector('.add-all-to-cart')?.addEventListener('click', () => {
      compareProducts.forEach(product => {
        this.addToCart(product);
      });
      this.showNotification('All products added to cart!', 'success');
      // Optionally, clear the compare list
      this.state.compareList = [];
      this.saveCompareList();
      this.updateCompareBadge();
      // Refresh the page
      window.location.reload();
    });
  }

  // ========== CART PAGE ==========

  loadCartPage() {
    console.log('🛒 Loading cart page');
    this.updateCartPage();
  }

  updateCartPage() {
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

  // ========== UTILITY METHODS ==========

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

  showNotification(message, type = 'info') {
    // Remove any existing notifications
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

    // Auto-dismiss after 5 seconds
    setTimeout(() => {
      notification.style.animation = 'slideOutRight 0.3s ease-in';
      setTimeout(() => notification.remove(), 300);
    }, 5000);

    // Allow manual dismissal
    notification.addEventListener('click', () => {
      notification.style.animation = 'slideOutRight 0.3s ease-in';
      setTimeout(() => notification.remove(), 300);
    });
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

  initializeFloatingActions() {
    const quickCartBtn = document.getElementById('quick-cart-btn');
    quickCartBtn?.addEventListener('click', () => {
      const quickCart = document.getElementById('quick-cart');
      if (quickCart) {
        quickCart.classList.add('active');
        this.updateQuickCart();
      }
    });

    // Setup floating action button for "Back to Top"
    const backToTopBtn = document.createElement('button');
    backToTopBtn.className = 'floating-btn';
    backToTopBtn.innerHTML = '<i class="fas fa-arrow-up"></i>';
    backToTopBtn.setAttribute('aria-label', 'Back to top');
    backToTopBtn.addEventListener('click', () => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
    document.body.appendChild(backToTopBtn);

    // Show/hide back to top button on scroll
    window.addEventListener('scroll', () => {
      if (window.scrollY > 300) {
        backToTopBtn.style.opacity = '1';
        backToTopBtn.style.transform = 'scale(1)';
      } else {
        backToTopBtn.style.opacity = '0';
        backToTopBtn.style.transform = 'scale(0.8)';
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
        })
        .catch(error => {
          console.log('SW registration failed:', error);
        });
    }
  }

  setupAboutPage() {
    console.log('📄 Setting up about page');
    // You can add specific logic for the about page here
  }

  setupContactPage() {
    console.log('📄 Setting up contact page');
    // You can add specific logic for the contact page here
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

  bindGlobalEvents() {
    // Bind global events for better maintainability
    document.addEventListener('DOMContentLoaded', () => {
      console.log('🌐 Global events bound');
    });
  }

  navigateToProduct(productId) {
    // Navigate to product detail page
    window.location.href = `product.html?id=${productId}`;
  }

  // ========== ERROR HANDLING ==========

  handleProductsLoadError(error, loadingSpinner) {
    console.error('❌ Failed to load products:', error);
    if (loadingSpinner) {
      loadingSpinner.style.display = 'none';
    }
    const container = document.querySelector('.products-grid') || document.querySelector('.featured-products');
    if (container) {
      container.innerHTML = '<p class="no-products">An error occurred while loading products. Please try again later.</p>';
    }
    this.showNotification('Failed to load products. Please refresh the page.', 'error');
  }
}

// Initialize the app
document.addEventListener('DOMContentLoaded', () => {
  console.log('🚀 DOM Content Loaded - Initializing TangogiApp');
  window.app = new TangogiApp();
});