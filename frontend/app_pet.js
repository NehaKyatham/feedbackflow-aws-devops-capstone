// Application State
const state = {
    currentUser: null,
    pets: [],
    selectedPet: 'dogs',
    currentTheme: localStorage.getItem('theme') || 'light',
    notifications: [
        {
            id: 1,
            title: 'Vaccination Reminder',
            message: "Max's rabies vaccine is due next week",
            time: '2 hours ago',
            read: false,
            icon: 'calendar-check'
        },
        {
            id: 2,
            title: 'Order Shipped',
            message: 'Your pet food order has been shipped',
            time: '5 hours ago',
            read: false,
            icon: 'shopping-cart'
        },
        {
            id: 3,
            title: 'Training Session',
            message: 'Your training session starts in 1 day',
            time: '1 day ago',
            read: true,
            icon: 'graduation-cap'
        }
    ],
    products: [],
    dailyTips: [
        "Regular exercise keeps pets healthy and happy!",
        "Always provide fresh water for your pets daily.",
        "Regular grooming prevents matting and skin issues.",
        "Positive reinforcement works best for training.",
        "Annual vet check-ups are essential for pet health.",
        "Proper nutrition is key to a long, healthy life.",
        "Socialization helps prevent behavioral problems.",
        "Dental care is important for overall health."
    ],
    groomingSteps: [
        {
            step: 1,
            title: "Brushing",
            description: "Regular brushing prevents mats and distributes natural oils.",
            tips: ["Brush in direction of hair growth", "Use proper brush for coat type", "Be gentle around sensitive areas"]
        },
        {
            step: 2,
            title: "Bathing",
            description: "Use pet-safe shampoo and proper water temperature.",
            tips: ["Test water temperature first", "Use pet-specific shampoo", "Rinse thoroughly"]
        },
        {
            step: 3,
            title: "Nail Trimming",
            description: "Trim carefully to avoid cutting the quick.",
            tips: ["Use sharp clippers", "Cut at 45-degree angle", "Stop if you see pink quick"]
        },
        {
            step: 4,
            title: "Ear Cleaning",
            description: "Clean ears weekly to prevent infections.",
            tips: ["Use cotton balls, not swabs", "Use vet-approved solution", "Clean outer ear only"]
        },
        {
            step: 5,
            title: "Dental Care",
            description: "Brush teeth regularly with pet toothpaste.",
            tips: ["Use pet toothpaste only", "Brush gently in circles", "Start slow with young pets"]
        }
    ]
};

// ===============================
// Backend API (ALB Endpoint)
// ===============================
const API_BASE_URL = "http://petcareflow-alb-683703701.us-east-1.elb.amazonaws.com";

// DOM Elements
const elements = {
    loadingScreen: document.getElementById('loadingScreen'),
    themeToggle: document.getElementById('themeToggle'),
    backToTop: document.getElementById('backToTop'),
    html: document.documentElement,
    navMenu: document.getElementById('navMenu'),
    mobileMenuBtn: document.getElementById('mobileMenuBtn'),
    searchBtn: document.getElementById('searchBtn'),
    searchBar: document.getElementById('searchBar'),
    searchClose: document.getElementById('searchClose'),
    notificationBtn: document.getElementById('notificationBtn'),
    userBtn: document.getElementById('userBtn'),
    notificationModal: document.getElementById('notificationModal'),
    loginModal: document.getElementById('loginModal'),
    closeNotificationModal: document.getElementById('closeNotificationModal'),
    closeLoginModal: document.getElementById('closeLoginModal'),
    getStartedBtn: document.getElementById('getStartedBtn'),
    learnMoreBtn: document.getElementById('learnMoreBtn'),
    loginSignupBtn: document.getElementById('loginSignupBtn'),
    petTabs: document.getElementById('petTabs'),
    productsGrid: document.getElementById('productsGrid'),
    shopCategories: document.querySelectorAll('.category-btn'),
    tipOfDay: document.getElementById('tipOfDay'),
    closeTip: document.getElementById('closeTip'),
    dailyTip: document.getElementById('dailyTip')
};

// Initialize Application
document.addEventListener('DOMContentLoaded', () => {
    // Set initial theme - load from localStorage or default to light
    const savedTheme = localStorage.getItem('theme') || 'light';
    state.currentTheme = savedTheme;
    setTheme(savedTheme);
    
    // Simulate loading
    setTimeout(() => {
        elements.loadingScreen.style.opacity = '0';
        setTimeout(() => {
            elements.loadingScreen.style.display = 'none';
            showDailyTip();
        }, 500);
    }, 1500);
    
    // Initialize data
    initializeProducts();
    initializePetData();
    
    // Render initial content
    renderProducts('all');
    renderPetContent('dogs');
    setupGroomingSteps();
    
    // Setup event listeners
    setupEventListeners();
    
    // Initialize Chart.js for health tracker
    initializeHealthChart();
    
    // Show welcome message
    setTimeout(() => {
        showNotification('Welcome to PetCare Companion! 🐾', 'success');
    }, 2000);
});

// Theme Management
function setTheme(theme) {
    state.currentTheme = theme;
    const htmlElement = document.documentElement;
    const bodyElement = document.body;
    
    // Apply theme to html and body
    htmlElement.setAttribute('data-theme', theme);
    bodyElement.setAttribute('data-theme', theme);
    
    // Also update elements.html if it exists
    if (elements.html) {
        elements.html.setAttribute('data-theme', theme);
    }
    
    localStorage.setItem('theme', theme);
}

function toggleTheme() {
    if (!elements.themeToggle) {
        console.error('Theme toggle button not found');
        return;
    }
    const newTheme = state.currentTheme === 'light' ? 'dark' : 'light';
    setTheme(newTheme);
    showNotification(`Switched to ${newTheme} theme`, 'info');
    
    // Force update to ensure theme is applied
    setTimeout(() => {
        document.documentElement.setAttribute('data-theme', newTheme);
        document.body.setAttribute('data-theme', newTheme);
    }, 10);
}

// Initialize Products
function initializeProducts() {
    state.products = [
        {
            id: 1,
            name: "Premium Dog Food",
            category: "food",
            price: 45.99,
            oldPrice: 59.99,
            image: "https://images.unsplash.com/photo-1568640347023-a616a30bc3bd?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
            badge: "BEST SELLER",
            description: "High-protein, grain-free formula for adult dogs"
        },
        {
            id: 2,
            name: "Interactive Cat Toy",
            category: "toys",
            price: 19.99,
            image: "https://images.unsplash.com/photo-1592194996308-7b43878e84a6?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
            description: "Keeps cats engaged and active for hours"
        },
        {
            id: 3,
            name: "Professional Grooming Kit",
            category: "grooming",
            price: 89.99,
            oldPrice: 109.99,
            image: "https://images.unsplash.com/photo-1516734212186-a967f81ad0d7?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
            badge: "NEW",
            description: "Complete grooming set for all pet types"
        },
        {
            id: 4,
            name: "Joint Health Supplement",
            category: "health",
            price: 29.99,
            image: "https://images.unsplash.com/photo-1589923186741-7d1d7c4e8c96?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
            description: "Supports joint health and mobility"
        },
        {
            id: 5,
            name: "Bird Feeding Station",
            category: "food",
            price: 34.99,
            image: "https://images.unsplash.com/photo-1560743641-3914f2c45636?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
            description: "Multi-level feeding station for birds"
        },
        {
            id: 6,
            name: "Pet First Aid Kit",
            category: "health",
            price: 39.99,
            oldPrice: 49.99,
            image: "https://images.unsplash.com/photo-1579202673506-ca3ce28943ef?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
            badge: "ESSENTIAL",
            description: "Emergency supplies for pet care"
        },
        {
            id: 7,
            name: "Cat Scratching Post",
            category: "toys",
            price: 49.99,
            image: "https://images.unsplash.com/photo-1514888286974-6d03bde4ba48?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
            description: "Premium sisal scratching post"
        },
        {
            id: 8,
            name: "Pet Shampoo & Conditioner",
            category: "grooming",
            price: 24.99,
            image: "https://images.unsplash.com/photo-1556228453-efd6c1ff04f6?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
            description: "Organic, tear-free shampoo for pets"
        }
    ];
}

// Initialize Pet Data
function initializePetData() {
    state.pets = {
        dogs: {
            title: "Dog Care Guide",
            description: "Comprehensive care for man's best friend. From puppyhood to senior years.",
            checklist: [
                { title: "Daily Exercise", description: "30-60 minutes of physical activity" },
                { title: "Nutrition", description: "High-quality protein diet with proper portions" },
                { title: "Grooming", description: "Weekly brushing, monthly bathing" },
                { title: "Training", description: "Consistent positive reinforcement" },
                { title: "Socialization", description: "Regular interaction with people and other dogs" },
                { title: "Health Check-ups", description: "Annual vet visits and vaccinations" }
            ],
            image: "https://images.unsplash.com/photo-1552053831-71594a27632d?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
        },
        cats: {
            title: "Cat Care Guide",
            description: "Everything you need to know about caring for your feline friend.",
            checklist: [
                { title: "Litter Box", description: "Clean daily, provide one per cat plus extra" },
                { title: "Nutrition", description: "High-protein, low-carb diet" },
                { title: "Grooming", description: "Regular brushing to prevent hairballs" },
                { title: "Play Time", description: "15-30 minutes of interactive play daily" },
                { title: "Scratching Posts", description: "Provide appropriate scratching surfaces" },
                { title: "Veterinary Care", description: "Annual check-ups and vaccinations" }
            ],
            image: "https://images.unsplash.com/photo-1514888286974-6d03bde4ba48?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
        },
        birds: {
            title: "Bird Care Guide",
            description: "Proper care for your feathered companions.",
            checklist: [
                { title: "Cage Size", description: "Minimum 1.5x bird's wingspan in all directions" },
                { title: "Nutrition", description: "Varied diet of pellets, fruits, and vegetables" },
                { title: "Social Interaction", description: "Daily out-of-cage time and interaction" },
                { title: "Mental Stimulation", description: "Toys and foraging opportunities" },
                { title: "Grooming", description: "Regular nail and wing trimming as needed" },
                { title: "Veterinary Care", description: "Annual check-ups with avian vet" }
            ],
            image: "https://images.unsplash.com/photo-1552728089-57bdde30beb3?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
        },
        "small-pets": {
            title: "Small Pet Care Guide",
            description: "Care for rabbits, guinea pigs, hamsters, and other small pets.",
            checklist: [
                { title: "Housing", description: "Spacious enclosure with hiding places" },
                { title: "Nutrition", description: "Species-specific diet with fresh hay/vegetables" },
                { title: "Exercise", description: "Daily supervised out-of-cage time" },
                { title: "Social Needs", description: "Some species require same-species companions" },
                { title: "Grooming", description: "Regular brushing and nail trimming" },
                { title: "Health Monitoring", description: "Regular weight checks and vet visits" }
            ],
            image: "https://images.unsplash.com/photo-1559253664-ca249d4608c6?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
        }
    };
}

// Setup Event Listeners
function setupEventListeners() {
    // Theme toggle
    elements.themeToggle.addEventListener('click', toggleTheme);
    
    // Back to top
    elements.backToTop.addEventListener('click', () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });
    
    // Mobile menu
    elements.mobileMenuBtn.addEventListener('click', () => {
        elements.navMenu.classList.toggle('active');
    });
    
    // Search functionality
    elements.searchBtn.addEventListener('click', () => {
        elements.searchBar.style.display = 'block';
        setTimeout(() => elements.searchBar.querySelector('.search-input').focus(), 10);
    });
    
    elements.searchClose.addEventListener('click', () => {
        elements.searchBar.style.display = 'none';
    });
    
    // Notifications
    elements.notificationBtn.addEventListener('click', () => {
        elements.notificationModal.classList.add('active');
        renderNotifications();
    });
    
    elements.closeNotificationModal.addEventListener('click', () => {
        elements.notificationModal.classList.remove('active');
    });
    
    // User/login modal
    elements.userBtn.addEventListener('click', () => {
        elements.loginModal.classList.add('active');
    });
    
    elements.closeLoginModal.addEventListener('click', () => {
        elements.loginModal.classList.remove('active');
    });
    
    // Get Started button
    elements.getStartedBtn.addEventListener('click', () => {
        document.getElementById('services').scrollIntoView({ behavior: 'smooth' });
    });
    
    // Learn More button
    elements.learnMoreBtn.addEventListener('click', () => {
        showNotification('Coming soon: Video introduction!', 'info');
    });
    
    // Login/Signup button
    if (elements.loginSignupBtn) {
        elements.loginSignupBtn.addEventListener('click', () => {
            elements.loginModal.classList.add('active');
        });
    }
    
    // Pet tabs
    elements.petTabs.addEventListener('click', (e) => {
        if (e.target.classList.contains('pet-tab')) {
            const petType = e.target.dataset.pet;
            document.querySelectorAll('.pet-tab').forEach(tab => tab.classList.remove('active'));
            e.target.classList.add('active');
            renderPetContent(petType);
        }
    });
    
    // Shop categories
    elements.shopCategories.forEach(btn => {
        btn.addEventListener('click', () => {
            elements.shopCategories.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            renderProducts(btn.dataset.category);
        });
    });
    
    // Tip of the day
    elements.closeTip.addEventListener('click', () => {
        elements.tipOfDay.classList.remove('show');
        localStorage.setItem('tipClosed', 'true');
    });
    
    // Grooming steps
    document.querySelectorAll('.step').forEach(step => {
        step.addEventListener('click', () => {
            document.querySelectorAll('.step').forEach(s => s.classList.remove('active'));
            step.classList.add('active');
            const stepNum = step.dataset.step;
            showGroomingStepDetails(stepNum);
        });
    });
    
    // Add to cart buttons
    document.addEventListener('click', (e) => {
        if (e.target.classList.contains('add-to-cart') || e.target.closest('.add-to-cart')) {
            const productCard = e.target.closest('.product-card');
            const productId = productCard ? productCard.dataset.id : null;
            if (productId) {
                addToCart(productId);
            }
        }
    });
    
    // Scroll events
    window.addEventListener('scroll', handleScroll);
    
    // Close modals when clicking outside
    window.addEventListener('click', (e) => {
        if (e.target === elements.notificationModal) {
            elements.notificationModal.classList.remove('active');
        }
        if (e.target === elements.loginModal) {
            elements.loginModal.classList.remove('active');
        }
    });
    
    // Login/Signup Toggle
    const loginToggle = document.getElementById('loginToggle');
    const signupToggle = document.getElementById('signupToggle');
    const loginForm = document.getElementById('loginForm');
    const signupForm = document.getElementById('signupForm');
    
    if (loginToggle && signupToggle) {
        loginToggle.addEventListener('click', () => {
            loginToggle.classList.add('active');
            signupToggle.classList.remove('active');
            loginForm.classList.add('active');
            signupForm.classList.remove('active');
        });
        
        signupToggle.addEventListener('click', () => {
            signupToggle.classList.add('active');
            loginToggle.classList.remove('active');
            signupForm.classList.add('active');
            loginForm.classList.remove('active');
        });
    }
    
    // Login form submission
    if (loginForm) {
        loginForm.addEventListener('submit', (e) => {
            e.preventDefault();
            showNotification('Successfully signed in! Welcome back!', 'success');
            elements.loginModal.classList.remove('active');
        });
    }
    
    // Signup form submission
    if (signupForm) {
        signupForm.addEventListener('submit', (e) => {
            e.preventDefault();
            showNotification('Account created successfully! Welcome to PetCare Companion! 🎉', 'success');
            elements.loginModal.classList.remove('active');
            // Switch to login after signup
            setTimeout(() => {
                if (loginToggle && signupToggle) {
                    loginToggle.click();
                }
            }, 100);
        });
    }
    
    // Nav link clicks
    document.querySelectorAll('.nav-link').forEach(link => {
        link.addEventListener('click', (e) => {
            if (link.hash) {
                document.querySelectorAll('.nav-link').forEach(l => l.classList.remove('active'));
                link.classList.add('active');
                elements.navMenu.classList.remove('active');
            }
        });
    });


// ===============================
// Newsletter Subscribe (Backend Integration)
// ===============================
const newsletterContainer = document.querySelector('.newsletter-form');

if (newsletterContainer) {
    const newsletterInput = newsletterContainer.querySelector('input[type="email"]');
    const newsletterButton = newsletterContainer.querySelector('button');

    if (newsletterButton && newsletterInput) {
        newsletterButton.addEventListener('click', async (e) => {
            e.preventDefault();

            const email = newsletterInput.value.trim();

            if (!email) {
                showNotification("❌ Please enter your email", "error");
                return;
            }

            try {
                const res = await fetch(`${API_BASE_URL}/subscribe`, {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ email })
                });

                // ✅ Read raw response first (safe)
                const rawText = await res.text();

                let data;
                try {
                    data = JSON.parse(rawText);
                } catch (err) {
                    console.error("Non-JSON response from backend:", rawText);
                    throw new Error("Backend returned non-JSON response (check backend logs / DB connection).");
                }

                if (!res.ok) {
                    throw new Error(data.error || "Subscription failed");
                }

                showNotification(`✅ ${data.result}: ${data.email}`, "success");
                newsletterInput.value = "";

            } catch (err) {
                showNotification(`❌ ${err.message}`, "error");
            }
        });
    }
}

}

// Handle Scroll
function handleScroll() {
    // Back to top button
    if (window.pageYOffset > 300) {
        elements.backToTop.classList.add('visible');
    } else {
        elements.backToTop.classList.remove('visible');
    }
    
    // Update active nav link based on scroll position
    updateActiveNavLink();
}

// Update Active Nav Link
function updateActiveNavLink() {
    const sections = document.querySelectorAll('section[id]');
    const scrollPos = window.pageYOffset + 100;
    
    sections.forEach(section => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.clientHeight;
        const sectionId = section.getAttribute('id');
        
        if (scrollPos >= sectionTop && scrollPos < sectionTop + sectionHeight) {
            document.querySelectorAll('.nav-link').forEach(link => {
                link.classList.remove('active');
                if (link.getAttribute('href') === `#${sectionId}`) {
                    link.classList.add('active');
                }
            });
        }
    });
}

// Render Products
function renderProducts(category = 'all') {
    elements.productsGrid.innerHTML = '';
    
    const filteredProducts = category === 'all' 
        ? state.products 
        : state.products.filter(p => p.category === category);
    
    filteredProducts.forEach(product => {
        const productCard = document.createElement('div');
        productCard.className = 'product-card';
        productCard.dataset.id = product.id;
        productCard.innerHTML = `
            <div class="product-image">
                <img src="${product.image}" alt="${product.name}" 
                     onerror="this.src='https://via.placeholder.com/800x600?text=${product.name.replace(' ', '+')}'">
                ${product.badge ? `<span class="product-badge">${product.badge}</span>` : ''}
            </div>
            <div class="product-info">
                <div class="product-category">${product.category.toUpperCase()}</div>
                <h3 class="product-title">${product.name}</h3>
                <p class="product-description">${product.description}</p>
                <div class="product-price">
                    <div class="price">
                        $${product.price.toFixed(2)}
                        ${product.oldPrice ? `<span class="old-price">$${product.oldPrice.toFixed(2)}</span>` : ''}
                    </div>
                    <button class="add-to-cart">
                        <i class="fas fa-shopping-cart"></i> Add to Cart
                    </button>
                </div>
            </div>
        `;
        
        elements.productsGrid.appendChild(productCard);
    });
}

// Render Pet Content
function renderPetContent(petType) {
    const pet = state.pets[petType];
    if (!pet) return;
    
    const profileElement = document.getElementById(`${petType}Profile`);
    if (!profileElement) return;
    
    profileElement.innerHTML = `
        <div class="profile-content">
            <h3>${pet.title}</h3>
            <p>${pet.description}</p>
            
            <div class="care-checklist">
                ${pet.checklist.map(item => `
                    <div class="checklist-item">
                        <i class="fas fa-check-circle"></i>
                        <div>
                            <h4>${item.title}</h4>
                            <p>${item.description}</p>
                        </div>
                    </div>
                `).join('')}
            </div>
        </div>
        <div class="profile-image">
            <img src="${pet.image}" alt="${pet.title}">
        </div>
    `;
    
    // Show active profile
    document.querySelectorAll('.pet-profile').forEach(profile => {
        profile.classList.remove('active');
    });
    profileElement.classList.add('active');
}

// Setup Grooming Steps
function setupGroomingSteps() {
    const groomingSteps = document.querySelector('.grooming-steps');
    if (!groomingSteps) return;
    
    groomingSteps.innerHTML = state.groomingSteps.map(step => `
        <div class="step ${step.step === 1 ? 'active' : ''}" data-step="${step.step}">
            <div class="step-number">${step.step}</div>
            <div class="step-content">
                <h4>${step.title}</h4>
                <p>${step.description}</p>
            </div>
        </div>
    `).join('');
}

// Show Grooming Step Details
function showGroomingStepDetails(stepNum) {
    const step = state.groomingSteps.find(s => s.step == stepNum);
    if (!step) return;
    
    const groomingTips = document.querySelector('.grooming-tips ul');
    if (groomingTips) {
        groomingTips.innerHTML = step.tips.map(tip => `
            <li>${tip}</li>
        `).join('');
    }
}

// Render Notifications
function renderNotifications() {
    const notificationList = document.querySelector('.notification-list');
    if (!notificationList) return;
    
    notificationList.innerHTML = state.notifications.map(notification => `
        <div class="notification-item ${!notification.read ? 'unread' : ''}">
            <div class="notification-icon">
                <i class="fas fa-${notification.icon}"></i>
            </div>
            <div class="notification-content">
                <h5>${notification.title}</h5>
                <p>${notification.message}</p>
                <span class="notification-time">${notification.time}</span>
            </div>
        </div>
    `).join('');
    
    // Mark as read
    state.notifications.forEach(notification => {
        notification.read = true;
    });
    
    // Update notification count
    updateNotificationCount();
}

// Update Notification Count
function updateNotificationCount() {
    const unreadCount = state.notifications.filter(n => !n.read).length;
    const countElement = document.querySelector('.notification-count');
    if (countElement) {
        countElement.textContent = unreadCount;
        countElement.style.display = unreadCount > 0 ? 'flex' : 'none';
    }
}

// Add to Cart
function addToCart(productId) {
    const product = state.products.find(p => p.id == productId);
    if (product) {
        showNotification(`Added "${product.name}" to cart!`, 'success');
        // In a real app, you would update cart state here
    }
}

// Show Daily Tip
function showDailyTip() {
    const tipClosed = localStorage.getItem('tipClosed');
    if (tipClosed === 'true') return;
    
    const randomTip = state.dailyTips[Math.floor(Math.random() * state.dailyTips.length)];
    if (elements.dailyTip) {
        elements.dailyTip.textContent = randomTip;
    }
    
    setTimeout(() => {
        elements.tipOfDay.classList.add('show');
    }, 3000);
}

// Initialize Health Chart
function initializeHealthChart() {
    const ctx = document.getElementById('healthChart');
    if (!ctx) return;
    
    const chart = new Chart(ctx.getContext('2d'), {
        type: 'line',
        data: {
            labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
            datasets: [{
                label: 'Weight (kg)',
                data: [22, 22.5, 23, 23.5, 24, 24],
                borderColor: 'rgb(139, 92, 246)',
                backgroundColor: 'rgba(139, 92, 246, 0.1)',
                tension: 0.4,
                fill: true
            }, {
                label: 'Activity Level',
                data: [80, 85, 82, 88, 85, 90],
                borderColor: 'rgb(16, 185, 129)',
                backgroundColor: 'rgba(16, 185, 129, 0.1)',
                tension: 0.4,
                fill: true
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    position: 'top',
                    labels: {
                        color: getComputedStyle(document.documentElement).getPropertyValue('--text-primary').trim()
                    }
                }
            },
            scales: {
                y: {
                    beginAtZero: false,
                    grid: {
                        color: getComputedStyle(document.documentElement).getPropertyValue('--border-color').trim()
                    },
                    ticks: {
                        color: getComputedStyle(document.documentElement).getPropertyValue('--text-secondary').trim()
                    }
                },
                x: {
                    grid: {
                        color: getComputedStyle(document.documentElement).getPropertyValue('--border-color').trim()
                    },
                    ticks: {
                        color: getComputedStyle(document.documentElement).getPropertyValue('--text-secondary').trim()
                    }
                }
            }
        }
    });
    
    // Update chart colors on theme change
    elements.html.addEventListener('themechange', () => {
        setTimeout(() => {
            chart.options.scales.y.grid.color = getComputedStyle(document.documentElement).getPropertyValue('--border-color').trim();
            chart.options.scales.y.ticks.color = getComputedStyle(document.documentElement).getPropertyValue('--text-secondary').trim();
            chart.options.scales.x.grid.color = getComputedStyle(document.documentElement).getPropertyValue('--border-color').trim();
            chart.options.scales.x.ticks.color = getComputedStyle(document.documentElement).getPropertyValue('--text-secondary').trim();
            chart.options.plugins.legend.labels.color = getComputedStyle(document.documentElement).getPropertyValue('--text-primary').trim();
            chart.update();
        }, 100);
    });
}

// Show Notification
function showNotification(message, type = 'info') {
    // Remove existing notification
    const existingNotification = document.querySelector('.notification-toast');
    if (existingNotification) {
        existingNotification.remove();
    }
    
    const notification = document.createElement('div');
    notification.className = `notification-toast ${type}`;
    
    const icons = {
        success: 'fa-check-circle',
        error: 'fa-exclamation-circle',
        info: 'fa-info-circle',
        warning: 'fa-exclamation-triangle'
    };
    
    notification.innerHTML = `
        <i class="fas ${icons[type] || 'fa-info-circle'}"></i>
        <span>${message}</span>
        <button class="notification-close">
            <i class="fas fa-times"></i>
        </button>
    `;
    
    document.body.appendChild(notification);
    
    // Add styles if not already present
    if (!document.querySelector('#notification-toast-styles')) {
        const style = document.createElement('style');
        style.id = 'notification-toast-styles';
        style.textContent = `
            .notification-toast {
                position: fixed;
                top: 100px;
                right: 20px;
                background: var(--card-bg);
                padding: 15px 20px;
                border-radius: var(--border-radius);
                box-shadow: var(--shadow-xl);
                display: flex;
                align-items: center;
                gap: 15px;
                z-index: 10000;
                transform: translateX(120%);
                transition: transform 0.3s ease;
                border-left: 4px solid var(--primary-color);
                max-width: 350px;
                border: 1px solid var(--border-color);
            }
            .notification-toast.success {
                border-left-color: var(--secondary-color);
            }
            .notification-toast.error {
                border-left-color: var(--danger-color);
            }
            .notification-toast.info {
                border-left-color: var(--info-color);
            }
            .notification-toast.warning {
                border-left-color: var(--accent-color);
            }
            .notification-toast i {
                font-size: 1.2rem;
            }
            .notification-toast.success i {
                color: var(--secondary-color);
            }
            .notification-toast.error i {
                color: var(--danger-color);
            }
            .notification-toast.info i {
                color: var(--info-color);
            }
            .notification-toast.warning i {
                color: var(--accent-color);
            }
            .notification-close {
                background: none;
                border: none;
                color: var(--text-tertiary);
                cursor: pointer;
                margin-left: auto;
            }
        `;
        document.head.appendChild(style);
    }
    
    // Show notification
    setTimeout(() => {
        notification.style.transform = 'translateX(0)';
    }, 10);
    
    // Auto remove after 5 seconds
    setTimeout(() => {
        notification.style.transform = 'translateX(120%)';
        setTimeout(() => notification.remove(), 300);
    }, 5000);
    
    // Close button
    notification.querySelector('.notification-close').addEventListener('click', () => {
        notification.style.transform = 'translateX(120%)';
        setTimeout(() => notification.remove(), 300);
    });
}

// Dispatch theme change event for Chart.js updates
Object.defineProperty(elements.html, 'themechange', {
    set(value) {
        this.setAttribute('data-theme', value);
        this.dispatchEvent(new CustomEvent('themechange'));
    },
    get() {
        return this.getAttribute('data-theme');
    }
});

// Handle Pet Photo Upload
function setupPetPhotoUpload() {
    const petImage = document.getElementById('userPetImage');
    const photoBadge = document.getElementById('photoBadge');
    const photoWrapper = document.querySelector('.pet-photo-wrapper');
    
    if (!petImage) return;
    
    // Create file input
    const fileInput = document.createElement('input');
    fileInput.type = 'file';
    fileInput.accept = 'image/*';
    fileInput.style.display = 'none';
    document.body.appendChild(fileInput);
    
    // Make wrapper clickable to upload
    if (photoWrapper) {
        photoWrapper.style.cursor = 'pointer';
        photoWrapper.title = 'Click to upload your pet photo';
        
        photoWrapper.addEventListener('click', () => {
            fileInput.click();
        });
    }
    
    fileInput.addEventListener('change', (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (event) => {
                petImage.src = event.target.result;
                if (photoBadge) photoBadge.style.display = 'flex';
                localStorage.setItem('userPetPhoto', event.target.result);
                showNotification('Pet photo uploaded successfully! 🎉', 'success');
            };
            reader.readAsDataURL(file);
        }
    });
    
    // Load saved photo or use default
    const savedPhoto = localStorage.getItem('userPetPhoto');
    if (savedPhoto) {
        petImage.src = savedPhoto;
        if (photoBadge) photoBadge.style.display = 'flex';
    } else {
        // Set default image
        petImage.src = 'tysen.jpeg';
        if (photoBadge) photoBadge.style.display = 'flex';
    }
}

// Initialize on load
window.addEventListener('load', () => {
    // Update notification count
    updateNotificationCount();
    
    // Set initial active nav link
    updateActiveNavLink();
    
    // Setup pet photo upload
    setupPetPhotoUpload();
});
