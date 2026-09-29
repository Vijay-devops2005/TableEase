/**
 * TableEase - Main Application Controller
 * Handles Navigation, State Management, Pune Hotels & Restaurant Discovery,
 * Dynamic Hotel Detail Views, Menu Catalog, Interactive Floor Plan,
 * Modal Controls, Global Search, Order Tray, and Toast Notifications.
 */

const App = (() => {
    // Current Active View State
    let currentView = 'dashboard';
    let pendingDeleteCallback = null;

    // Cache of current data in memory
    let state = {
        customers: [],
        restaurants: [],
        tables: [],
        reservations: [],
        menu: [],
        activeHotelId: 1,
        activeDashRestaurantId: 5, // Defaults to Spice Garden (or first)
        dashMenuCategory: 'All',
        menuViewCategory: 'All',
        orderTray: []
    };

    // ==========================================
    // INITIALIZATION
    // ==========================================
    const init = async () => {
        setupEventListeners();
        startLiveClock();
        await loadAllData();
        renderDashRestaurantSelector();
        renderView(currentView);

        // Check URL hash for direct links (e.g. #hotels, #menu, #reservations)
        const hash = window.location.hash.replace('#', '');
        const validViews = ['dashboard', 'hotels', 'hotel-detail', 'menu', 'customers', 'restaurants', 'tables', 'reservations', 'viva'];
        if (hash && validViews.includes(hash)) {
            navigateTo(hash);
        }
    };

    // Start live date & time clock in header
    const startLiveClock = () => {
        const updateClock = () => {
            const now = new Date();
            const dateStr = now.toLocaleDateString('en-US', { weekday: 'short', day: 'numeric', month: 'short', year: 'numeric' });
            const timeStr = now.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true });
            const el = document.getElementById('currentDateDisplay');
            if (el) el.textContent = `${dateStr} | ${timeStr}`;
        };
        updateClock();
        setInterval(updateClock, 30000);
    };

    const setupEventListeners = () => {
        // Mobile sidebar toggle
        const toggleBtn = document.getElementById('sidebarToggle');
        const sidebar = document.getElementById('sidebar');
        if (toggleBtn && sidebar) {
            toggleBtn.addEventListener('click', () => {
                sidebar.classList.toggle('open');
            });

            document.addEventListener('click', (e) => {
                if (window.innerWidth <= 768 && sidebar.classList.contains('open')) {
                    if (!sidebar.contains(e.target) && !toggleBtn.contains(e.target)) {
                        sidebar.classList.remove('open');
                    }
                }
            });
        }

        // Close modal when clicking outside dialog container
        document.querySelectorAll('.modal-overlay').forEach(overlay => {
            overlay.addEventListener('click', (e) => {
                if (e.target === overlay) {
                    closeModal(overlay.id);
                }
            });
        });

        // Close search dropdown on click outside
        document.addEventListener('click', (e) => {
            const searchContainer = document.querySelector('.global-search-container');
            const searchResults = document.getElementById('global-search-results');
            if (searchContainer && searchResults && !searchContainer.contains(e.target)) {
                searchResults.style.display = 'none';
            }
        });

        // Set default minimum date for reservation form to today
        const resDateInput = document.getElementById('res-date');
        if (resDateInput) {
            resDateInput.min = new Date().toISOString().split('T')[0];
            resDateInput.value = new Date().toISOString().split('T')[0];
        }

        const resTimeInput = document.getElementById('res-time');
        if (resTimeInput && !resTimeInput.value) {
            resTimeInput.value = "19:30";
        }
    };

    // Load full dataset from API layer into state
    const loadAllData = async () => {
        try {
            state.customers = await TableEaseAPI.Customers.getAll();
            state.restaurants = await TableEaseAPI.Restaurants.getAll();
            state.tables = await TableEaseAPI.Tables.getAll();
            state.reservations = await TableEaseAPI.Reservations.getAll();
            state.menu = await TableEaseAPI.Menu.getAll();
            state.orderTray = TableEaseAPI.Orders.getTray();
            
            updateSidebarBadges();
            updateOrderTrayCount();
        } catch (err) {
            console.error("Failed to load data:", err);
            showToast("Data Sync", "Using cached demonstration data", "info");
        }
    };

    const updateSidebarBadges = () => {
        const todayStr = new Date().toISOString().split('T')[0];
        const todayRes = state.reservations.filter(r => r.reservationDate === todayStr);

        const badgeToday = document.getElementById('sidebar-badge-today');
        const badgeRes = document.getElementById('sidebar-badge-reservations');
        const badgeTables = document.getElementById('sidebar-badge-tables');
        const badgeRest = document.getElementById('sidebar-badge-restaurants');
        const badgeCust = document.getElementById('sidebar-badge-customers');
        const badgeMenu = document.getElementById('sidebar-badge-menu');

        if (badgeToday) badgeToday.textContent = todayRes.length;
        if (badgeRes) badgeRes.textContent = state.reservations.length;
        if (badgeTables) badgeTables.textContent = state.tables.length;
        if (badgeRest) badgeRest.textContent = state.restaurants.length;
        if (badgeCust) badgeCust.textContent = state.customers.length;
        if (badgeMenu) badgeMenu.textContent = state.menu.length;
    };

    const updateOrderTrayCount = () => {
        const el = document.getElementById('order-tray-count');
        if (el) {
            const total = state.orderTray.reduce((acc, cur) => acc + (cur.quantity || 1), 0);
            el.textContent = total;
        }
    };

    // ==========================================
    // VIEW NAVIGATION ROUTER
    // ==========================================
    const navigateTo = (viewName) => {
        currentView = viewName;
        window.location.hash = viewName;

        // Update active nav items
        document.querySelectorAll('.sidebar-nav .nav-item').forEach(item => {
            if (item.dataset.view === viewName) {
                item.classList.add('active');
            } else {
                item.classList.remove('active');
            }
        });

        // Hide all views and show the active one
        document.querySelectorAll('.view-section').forEach(sec => sec.classList.remove('active'));
        const targetSec = document.getElementById(`view-${viewName}`);
        if (targetSec) {
            targetSec.classList.add('active');
        }

        // Close sidebar on mobile after navigation
        const sidebar = document.getElementById('sidebar');
        if (sidebar && window.innerWidth <= 768) {
            sidebar.classList.remove('open');
        }

        // Render contents of selected view
        renderView(viewName);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const renderView = (viewName) => {
        switch (viewName) {
            case 'dashboard':
                renderDashboard();
                break;
            case 'hotels':
                renderHotelsDiscovery();
                break;
            case 'hotel-detail':
                renderHotelDetailPage(state.activeHotelId);
                break;
            case 'menu':
                renderFullMenuCatalog();
                break;
            case 'customers':
                renderCustomersTable();
                break;
            case 'restaurants':
                renderRestaurantsGrid();
                break;
            case 'tables':
                renderTablesGrid();
                break;
            case 'reservations':
                renderReservationsTable();
                break;
            case 'viva':
                // Viva tab is static reference content
                break;
        }
        lucide.createIcons();
    };

    // ==========================================
    // 1. DASHBOARD CONTROLLER
    // ==========================================
    const renderDashRestaurantSelector = () => {
        const sel = document.getElementById('dash-restaurant-selector');
        const floorSel = document.getElementById('floor-restaurant-select');
        if (!sel && !floorSel) return;

        let options = '';
        state.restaurants.forEach(r => {
            options += `<option value="${r.id}">${r.name}</option>`;
        });

        if (sel) {
            sel.innerHTML = options;
            if (state.restaurants.some(r => Number(r.id) === Number(state.activeDashRestaurantId))) {
                sel.value = state.activeDashRestaurantId;
            }
        }
        if (floorSel) {
            floorSel.innerHTML = options;
            if (state.restaurants.some(r => Number(r.id) === Number(state.activeDashRestaurantId))) {
                floorSel.value = state.activeDashRestaurantId;
            }
        }
    };

    const handleDashRestaurantChange = (restaurantId) => {
        state.activeDashRestaurantId = Number(restaurantId);
        const floorSel = document.getElementById('floor-restaurant-select');
        if (floorSel) floorSel.value = restaurantId;

        const rest = state.restaurants.find(r => Number(r.id) === Number(restaurantId));
        if (rest) {
            const hoursEl = document.getElementById('dash-open-status-text');
            if (hoursEl) hoursEl.textContent = `Open Now (${rest.openingHours})`;
        }

        renderFloorPlan();
        renderFeaturedRestaurantCard();
        lucide.createIcons();
    };

    const handleFloorChange = (restaurantId) => {
        state.activeDashRestaurantId = Number(restaurantId);
        const dashSel = document.getElementById('dash-restaurant-selector');
        if (dashSel) dashSel.value = restaurantId;
        renderFloorPlan();
        renderFeaturedRestaurantCard();
        lucide.createIcons();
    };

    const renderDashboard = () => {
        renderDashRestaurantSelector();
        renderDashStats();
        renderTodayReservationsFeed();
        renderFloorPlan();
        renderFeaturedRestaurantCard();
        renderDashMenuSection();
    };

    const renderDashStats = () => {
        const todayStr = new Date().toISOString().split('T')[0];
        const todayRes = state.reservations.filter(r => r.reservationDate === todayStr);

        const custEl = document.getElementById('dash-total-customers');
        const restEl = document.getElementById('dash-total-restaurants');
        const tblEl = document.getElementById('dash-total-tables');
        const resEl = document.getElementById('dash-today-reservations');
        const menuEl = document.getElementById('dash-menu-items');

        if (custEl) custEl.textContent = state.customers.length;
        if (restEl) restEl.textContent = state.restaurants.length;
        if (tblEl) tblEl.textContent = state.tables.length;
        if (resEl) resEl.textContent = todayRes.length;
        if (menuEl) menuEl.textContent = state.menu.length;

        const availCount = state.tables.filter(t => t.status === 'Available').length;
        const resCount = state.tables.filter(t => t.status === 'Reserved').length;
        const occCount = state.tables.filter(t => t.status === 'Occupied').length;

        const tblMetaEl = document.getElementById('dash-tables-avail-summary');
        if (tblMetaEl) tblMetaEl.textContent = `${availCount} available • ${resCount + occCount} busy`;

        const upcomingCount = todayRes.filter(r => r.status === 'Reserved').length;
        const seatedCount = todayRes.filter(r => r.status === 'Occupied').length;
        const resMetaEl = document.getElementById('dash-reservations-breakdown');
        if (resMetaEl) resMetaEl.textContent = `${upcomingCount} upcoming • ${seatedCount} seated`;
    };

    const renderTodayReservationsFeed = () => {
        const tbody = document.getElementById('dash-today-table-body');
        if (!tbody) return;

        const todayStr = new Date().toISOString().split('T')[0];
        let todayRes = state.reservations.filter(r => r.reservationDate === todayStr);

        // Fallback: If no reservations for today, show top recent reservations
        if (todayRes.length === 0) {
            todayRes = state.reservations.slice(0, 5);
        }

        if (todayRes.length === 0) {
            tbody.innerHTML = `<tr><td colspan="7" style="text-align: center; padding: 24px; color: var(--text-muted);">No reservations scheduled for today.</td></tr>`;
            return;
        }

        tbody.innerHTML = todayRes.slice(0, 6).map((res, index) => {
            const cust = state.customers.find(c => Number(c.id) === Number(res.customerId)) || { name: 'Guest' };
            const tbl = state.tables.find(t => Number(t.id) === Number(res.tableId)) || { tableNumber: 'T-01' };
            const rest = state.restaurants.find(r => Number(r.id) === Number(res.restaurantId)) || { name: 'Restaurant' };

            const initials = cust.name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase();

            let statusClass = 'status-confirmed';
            let statusLabel = 'Confirmed';
            if (res.status === 'Occupied') {
                statusClass = 'status-pending';
                statusLabel = 'Seated';
            } else if (res.status === 'Completed') {
                statusClass = 'status-confirmed';
                statusLabel = 'Completed';
            } else if (res.status === 'Cancelled') {
                statusClass = 'status-maintenance';
                statusLabel = 'Cancelled';
            } else if (index % 2 === 1) {
                statusClass = 'status-upcoming';
                statusLabel = 'Upcoming';
            }

            return `
                <tr>
                    <td>${index + 1}</td>
                    <td>
                        <div class="cust-cell">
                            <div class="cust-avatar-circle">${initials}</div>
                            <div>
                                <div class="cust-name-bold">${cust.name}</div>
                                <div style="font-size: 0.72rem; color: var(--text-muted);">${rest.name.split(' ')[0]}</div>
                            </div>
                        </div>
                    </td>
                    <td><span class="table-tag">${tbl.tableNumber}</span></td>
                    <td>
                        <div style="font-weight: 500; color: var(--text-primary);">${res.reservationDate}</div>
                        <div style="font-size: 0.72rem; color: var(--text-muted);">${formatTime12Hour(res.reservationTime)}</div>
                    </td>
                    <td>${res.guestCount} Guests</td>
                    <td><span class="status-pill ${statusClass}">${statusLabel}</span></td>
                    <td style="text-align: right;">
                        <div class="table-action-btns">
                            <button class="action-icon-btn" onclick="App.openReservationPass(${res.id})" title="View Ticket Pass">
                                <i data-lucide="ticket"></i>
                            </button>
                            <button class="action-icon-btn" onclick="App.openReservationModal(${res.id})" title="Edit Reservation">
                                <i data-lucide="edit-2"></i>
                            </button>
                            <button class="action-icon-btn danger" onclick="App.confirmDeleteReservation(${res.id})" title="Cancel / Delete">
                                <i data-lucide="trash-2"></i>
                            </button>
                        </div>
                    </td>
                </tr>
            `;
        }).join('');

        lucide.createIcons();
    };

    const renderFloorPlan = () => {
        const container = document.getElementById('dash-floor-grid');
        if (!container) return;

        const currentRestId = Number(state.activeDashRestaurantId);
        let tables = state.tables.filter(t => Number(t.restaurantId) === currentRestId);

        if (tables.length === 0) {
            tables = state.tables.slice(0, 10);
        }

        container.innerHTML = tables.slice(0, 10).map(t => {
            let statusClass = 'status-tile-available';
            if (t.status === 'Reserved') statusClass = 'status-tile-reserved';
            if (t.status === 'Occupied') statusClass = 'status-tile-occupied';
            if (t.status === 'Maintenance') statusClass = 'status-tile-maintenance';

            return `
                <div class="floor-table-tile ${statusClass}" onclick="App.handleFloorTableClick(${t.id}, '${t.status}', '${t.tableNumber}')" title="Click to manage ${t.tableNumber} (${t.status})">
                    <span class="tbl-code">${t.tableNumber}</span>
                    <span class="tbl-cap">${t.capacity} Seats</span>
                </div>
            `;
        }).join('');
    };

    const handleFloorTableClick = (tableId, status, tableNum) => {
        if (status === 'Available') {
            openReservationModalWithTable(tableId);
        } else {
            showToast(`Table ${tableNum}`, `Current status: ${status}. Modify in Tables & Floor view.`, 'info');
        }
    };

    const renderFeaturedRestaurantCard = () => {
        const container = document.getElementById('dash-featured-restaurant-card');
        if (!container) return;

        const rest = state.restaurants.find(r => Number(r.id) === Number(state.activeDashRestaurantId)) || state.restaurants[0];
        if (!rest) return;

        const tables = state.tables.filter(t => Number(t.restaurantId) === Number(rest.id));
        const tableCount = tables.length || 12;

        container.innerHTML = `
            <div class="featured-img-box">
                <img src="${rest.heroImage}" alt="${rest.name}">
                <div class="featured-badge-overlay">
                    <i data-lucide="sparkles" style="width: 12px; height: 12px; display: inline;"></i> Featured Destination
                </div>
            </div>
            <div class="featured-card-body">
                <h4 class="featured-name">${rest.name}</h4>
                <div class="featured-location">
                    <i data-lucide="map-pin" style="width: 14px; height: 14px; color: var(--primary);"></i>
                    <span>${rest.location}</span>
                </div>
                <div class="featured-tags-row">
                    ${(rest.cuisineTags || [rest.cuisine]).slice(0, 3).map(tag => `<span class="tag-cuisine-mini">${tag}</span>`).join('')}
                </div>
                <div class="featured-meta-row">
                    <span><i data-lucide="grid-3x3" style="width: 13px; height: 13px;"></i> ${tableCount} Tables</span>
                    <span><i data-lucide="users" style="width: 13px; height: 13px;"></i> 2-8 Capacity</span>
                    <span class="rating-star-badge"><i data-lucide="star" style="width: 12px; height: 12px; fill: #d97706;"></i> ${rest.rating}</span>
                </div>
                <button class="btn btn-primary-burgundy btn-block" onclick="App.openHotelDetail(${rest.id})">
                    <span>View Details</span>
                    <i data-lucide="arrow-right" style="width: 14px; height: 14px;"></i>
                </button>
            </div>
        `;
        lucide.createIcons();
    };

    const renderDashMenuSection = () => {
        const container = document.getElementById('dash-menu-cards-container');
        if (!container) return;

        let items = state.menu;
        if (state.dashMenuCategory && state.dashMenuCategory !== 'All') {
            items = items.filter(m => m.category === state.dashMenuCategory || m.subCategory === state.dashMenuCategory);
        }

        container.innerHTML = items.slice(0, 6).map(item => `
            <div class="menu-item-card-mini">
                <div class="menu-thumb-box">
                    <img src="${item.image}" alt="${item.name}" loading="lazy">
                </div>
                <div class="menu-info-body">
                    <div class="menu-dish-title">${item.name}</div>
                    <div class="menu-dish-desc">${item.shortDesc || item.description}</div>
                    <div class="menu-price-action-row">
                        <div class="menu-price-wrap">
                            <span class="price-text">₹${item.price}</span>
                            <span class="diet-indicator ${item.isVeg ? 'diet-veg' : 'diet-nonveg'}" title="${item.isVeg ? 'Vegetarian' : 'Non-Vegetarian'}"></span>
                        </div>
                        <button class="btn-add-menu" onclick="App.addToOrder(${item.id})">
                            Add +
                        </button>
                    </div>
                </div>
            </div>
        `).join('');

        lucide.createIcons();
    };

    const filterDashMenu = (category) => {
        state.dashMenuCategory = category;
        document.querySelectorAll('#dash-menu-category-tabs .cat-pill').forEach(btn => {
            if (btn.textContent.trim() === category) {
                btn.classList.add('active');
            } else {
                btn.classList.remove('active');
            }
        });
        renderDashMenuSection();
    };

    // ==========================================
    // 2. HOTELS & RESTAURANTS DISCOVERY
    // ==========================================
    const renderHotelsDiscovery = () => {
        const container = document.getElementById('hotels-cards-container');
        if (!container) return;

        const searchVal = (document.getElementById('hotels-search-input')?.value || '').toLowerCase().trim();
        const locVal = document.getElementById('hotels-location-filter')?.value || 'ALL';
        const cuisVal = document.getElementById('hotels-cuisine-filter')?.value || 'ALL';
        const ratVal = document.getElementById('hotels-rating-filter')?.value || 'ALL';
        const priceVal = document.getElementById('hotels-price-filter')?.value || 'ALL';

        let filtered = state.restaurants.filter(r => {
            const matchesSearch = !searchVal || 
                r.name.toLowerCase().includes(searchVal) ||
                r.location.toLowerCase().includes(searchVal) ||
                r.cuisine.toLowerCase().includes(searchVal);

            const matchesLoc = locVal === 'ALL' || r.location.toLowerCase().includes(locVal.toLowerCase());
            const matchesCuis = cuisVal === 'ALL' || r.cuisine.toLowerCase().includes(cuisVal.toLowerCase());
            const matchesRat = ratVal === 'ALL' || Number(r.rating) >= parseFloat(ratVal);
            const matchesPrice = priceVal === 'ALL' || (r.priceLevel && r.priceLevel === priceVal) || (r.priceRange && r.priceRange.includes(priceVal));

            return matchesSearch && matchesLoc && matchesCuis && matchesRat && matchesPrice;
        });

        if (filtered.length === 0) {
            container.innerHTML = `
                <div style="grid-column: 1 / -1; text-align: center; padding: 48px; background: #ffffff; border-radius: var(--radius-lg); border: 1px solid var(--border-card);">
                    <i data-lucide="compass" style="width: 48px; height: 48px; color: var(--text-muted); margin-bottom: 12px;"></i>
                    <h3 style="font-size: 1.15rem; color: var(--text-primary); margin-bottom: 6px;">No hotels match your filters</h3>
                    <p style="font-size: 0.86rem; color: var(--text-muted); margin-bottom: 16px;">Try adjusting your location, cuisine, or price range filters.</p>
                    <button class="btn btn-secondary btn-sm" onclick="App.resetHotelsFilters()">Reset Filters</button>
                </div>
            `;
            lucide.createIcons();
            return;
        }

        container.innerHTML = filtered.map(hotel => {
            const tables = state.tables.filter(t => Number(t.restaurantId) === Number(hotel.id));
            const tableCount = tables.length || 12;

            return `
                <div class="hotel-card">
                    <div class="hotel-card-hero-img">
                        <img src="${hotel.heroImage}" alt="${hotel.name}" loading="lazy">
                        <div class="hotel-card-badges-overlay">
                            <span class="hotel-rating-pill">
                                <i data-lucide="star" style="width: 13px; height: 13px; fill: #fbbf24;"></i> ${hotel.rating} (${hotel.reviewsCount || 120})
                            </span>
                            <span class="hotel-price-pill">${hotel.priceLevel || '₹₹₹'}</span>
                        </div>
                    </div>
                    <div class="hotel-card-body">
                        <h3 class="hotel-name">${hotel.name}</h3>
                        <div class="hotel-location-text">
                            <i data-lucide="map-pin"></i>
                            <span>${hotel.location}</span>
                        </div>

                        <div class="hotel-cuisine-badge-row">
                            ${(hotel.cuisineTags || [hotel.cuisine]).slice(0, 3).map(tag => `<span class="cuisine-badge">${tag}</span>`).join('')}
                        </div>

                        <div class="hotel-quick-meta">
                            <div class="hotel-meta-item">
                                <i data-lucide="clock"></i>
                                <span>${hotel.openingHours}</span>
                            </div>
                            <div class="hotel-meta-item">
                                <i data-lucide="grid-3x3"></i>
                                <span>${tableCount} Dining Tables</span>
                            </div>
                        </div>

                        <p class="hotel-desc-short">${hotel.description}</p>

                        <div class="hotel-card-actions">
                            <button class="btn btn-secondary btn-sm" onclick="App.openHotelDetail(${hotel.id})">
                                <i data-lucide="eye"></i>
                                <span>View Details</span>
                            </button>
                            <button class="btn btn-primary btn-sm" onclick="App.openReservationModalWithHotel(${hotel.id})">
                                <i data-lucide="calendar-plus"></i>
                                <span>Book a Table</span>
                            </button>
                            <a href="${hotel.googleMapsUrl}" target="_blank" rel="noopener noreferrer" class="btn btn-action-tile btn-sm btn-full-map">
                                <i data-lucide="map"></i>
                                <span>View on Google Maps</span>
                            </a>
                        </div>
                    </div>
                </div>
            `;
        }).join('');

        lucide.createIcons();
    };

    const handleHotelsSearch = () => renderHotelsDiscovery();
    const handleHotelsFilter = () => renderHotelsDiscovery();

    const resetHotelsFilters = () => {
        const s = document.getElementById('hotels-search-input');
        const l = document.getElementById('hotels-location-filter');
        const c = document.getElementById('hotels-cuisine-filter');
        const r = document.getElementById('hotels-rating-filter');
        const p = document.getElementById('hotels-price-filter');
        if (s) s.value = '';
        if (l) l.value = 'ALL';
        if (c) c.value = 'ALL';
        if (r) r.value = 'ALL';
        if (p) p.value = 'ALL';
        renderHotelsDiscovery();
    };

    // ==========================================
    // 3. HOTEL DETAIL PAGE (Comprehensive Dedicated View)
    // ==========================================
    const openHotelDetail = (hotelId) => {
        state.activeHotelId = Number(hotelId);
        navigateTo('hotel-detail');
    };

    const renderHotelDetailPage = (hotelId) => {
        const wrapper = document.getElementById('hotel-detail-wrapper');
        if (!wrapper) return;

        const hotel = state.restaurants.find(r => Number(r.id) === Number(hotelId)) || state.restaurants[0];
        if (!hotel) return;

        const tables = state.tables.filter(t => Number(t.restaurantId) === Number(hotel.id));
        const availableTables = tables.filter(t => t.status === 'Available');

        // Gallery photos
        const galleryPhotos = hotel.interiorImages || [
            "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=800&q=80",
            "https://images.unsplash.com/photo-1550966871-3ed3cdb5ed0c?auto=format&fit=crop&w=800&q=80",
            "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=800&q=80",
            "https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=800&q=80"
        ];

        // Maps embed search query
        const mapEmbedQuery = encodeURIComponent(hotel.name + ' ' + hotel.location);

        wrapper.innerHTML = `
            <div class="hotel-detail-container">
                
                <!-- Large Hero Background with Overlay (Requested in prompt) -->
                <div class="hotel-detail-hero" style="background-image: url('${hotel.heroImage}');">
                    <div class="hotel-detail-hero-overlay"></div>

                    <div class="detail-hero-top">
                        <button class="back-btn-pill" onclick="App.navigateTo('hotels')">
                            <i data-lucide="arrow-left"></i>
                            <span>Back to Hotels & Discovery</span>
                        </button>
                        <span class="detail-pill" style="background: rgba(15, 23, 42, 0.7);">
                            <i data-lucide="shield-check" style="color: #34d399;"></i> Verified Pune Destination
                        </span>
                    </div>

                    <div class="detail-hero-bottom">
                        <h1 class="detail-hotel-name">${hotel.name}</h1>
                        <div class="detail-hotel-location">
                            <i data-lucide="map-pin" style="color: var(--gold-accent);"></i>
                            <span>${hotel.location}</span>
                        </div>

                        <div class="detail-meta-pill-group">
                            <span class="detail-pill">
                                <i data-lucide="star" style="color: #fbbf24; fill: #fbbf24;"></i> ${hotel.rating} (${hotel.reviewsCount || 1800}+ Reviews)
                            </span>
                            <span class="detail-pill">
                                <i data-lucide="utensils"></i> ${hotel.cuisine}
                            </span>
                            <span class="detail-pill">
                                <i data-lucide="clock"></i> ${hotel.openingHours}
                            </span>
                            <span class="detail-pill">
                                <i data-lucide="wallet"></i> ${hotel.priceRange || '₹₹₹₹'}
                            </span>
                        </div>

                        <div class="detail-hero-cta-row">
                            <button class="btn btn-primary-burgundy btn-lg" onclick="App.openReservationModalWithHotel(${hotel.id})">
                                <i data-lucide="calendar-plus"></i>
                                <span>Reserve a Table</span>
                            </button>
                            <a href="${hotel.googleMapsUrl}" target="_blank" rel="noopener noreferrer" class="btn btn-secondary">
                                <i data-lucide="map-pin"></i>
                                <span>Open in Google Maps</span>
                            </a>
                        </div>
                    </div>
                </div>

                <!-- 2-Column Main Detail Layout -->
                <div class="detail-main-layout">
                    
                    <!-- Left Column: About, Menu, Tables, Gallery -->
                    <div class="detail-col-content">
                        
                        <!-- 1. About the Restaurant -->
                        <div class="content-card">
                            <h3 class="detail-section-title"><i data-lucide="info"></i> About the Restaurant</h3>
                            <p style="font-size: 0.92rem; color: var(--text-secondary); line-height: 1.6; margin-bottom: 16px;">
                                ${hotel.about || hotel.description}
                            </p>
                            
                            <h4 style="font-size: 0.88rem; font-weight: 700; color: var(--text-primary); margin-top: 16px;">Features & Amenities</h4>
                            <div class="amenities-chips-grid">
                                ${(hotel.features || ["Valet Parking", "Fine Dining", "Air Conditioned", "High-speed Wi-Fi"]).map(feat => `
                                    <div class="amenity-chip">
                                        <i data-lucide="check-circle-2"></i>
                                        <span>${feat}</span>
                                    </div>
                                `).join('')}
                            </div>
                        </div>

                        <!-- 2. Available Tables on Floor -->
                        <div class="content-card">
                            <div class="content-card-header">
                                <div>
                                    <h3 class="detail-section-title" style="margin-bottom: 2px;"><i data-lucide="grid-3x3"></i> Available Tables</h3>
                                    <p class="card-subtitle">${availableTables.length} tables currently open for reservation</p>
                                </div>
                            </div>

                            <div class="detail-tables-grid">
                                ${tables.map(t => `
                                    <div class="detail-table-card">
                                        <div class="tbl-num">${t.tableNumber}</div>
                                        <div class="tbl-meta">${t.capacity} Guests • ${t.floorArea || 'Main Hall'}</div>
                                        <div style="margin-bottom: 10px;">
                                            <span class="status-pill ${t.status === 'Available' ? 'status-available' : 'status-reserved'}">${t.status}</span>
                                        </div>
                                        ${t.status === 'Available' ? `
                                            <button class="btn btn-outline-burgundy btn-sm btn-block" onclick="App.openReservationModalWithTable(${t.id})">
                                                Book Table
                                            </button>
                                        ` : `
                                            <button class="btn btn-secondary btn-sm btn-block" disabled style="opacity: 0.6;">
                                                Reserved
                                            </button>
                                        `}
                                    </div>
                                `).join('')}
                            </div>
                        </div>

                        <!-- 3. Popular Menu -->
                        <div class="content-card">
                            <div class="content-card-header">
                                <div>
                                    <h3 class="detail-section-title" style="margin-bottom: 2px;"><i data-lucide="utensils"></i> Popular Menu Signatures</h3>
                                    <p class="card-subtitle">Celebrated dishes recommended by host chefs</p>
                                </div>
                                <button class="btn btn-outline-burgundy btn-sm" onclick="App.navigateTo('menu')">
                                    <span>Browse All Menu</span>
                                </button>
                            </div>

                            <div class="menu-cards-showcase-grid">
                                ${state.menu.slice(0, 4).map(item => `
                                    <div class="menu-item-card-mini">
                                        <div class="menu-thumb-box">
                                            <img src="${item.image}" alt="${item.name}" loading="lazy">
                                        </div>
                                        <div class="menu-info-body">
                                            <div class="menu-dish-title">${item.name}</div>
                                            <div class="menu-dish-desc">${item.shortDesc}</div>
                                            <div class="menu-price-action-row">
                                                <div class="menu-price-wrap">
                                                    <span class="price-text">₹${item.price}</span>
                                                    <span class="diet-indicator ${item.isVeg ? 'diet-veg' : 'diet-nonveg'}"></span>
                                                </div>
                                                <button class="btn-add-menu" onclick="App.addToOrder(${item.id})">
                                                    Add +
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                `).join('')}
                            </div>
                        </div>

                        <!-- 4. Photo Gallery -->
                        <div class="content-card">
                            <h3 class="detail-section-title"><i data-lucide="image"></i> Restaurant Gallery & Ambience</h3>
                            <div class="hotel-gallery-grid">
                                ${galleryPhotos.map(photo => `
                                    <div class="gallery-photo-item">
                                        <img src="${photo}" alt="${hotel.name} ambience" loading="lazy">
                                    </div>
                                `).join('')}
                            </div>
                        </div>

                    </div>

                    <!-- Right Column: Location, Map & Contact -->
                    <div class="detail-col-sidebar">
                        
                        <!-- Map & Location Section (Requested in Prompt) -->
                        <div class="content-card">
                            <h3 class="detail-section-title"><i data-lucide="map-pin"></i> Location & Map</h3>
                            
                            <!-- Embedded Interactive Map (Free, No paid API key required) -->
                            <div class="map-embed-wrapper">
                                <iframe src="https://maps.google.com/maps?q=${mapEmbedQuery}&t=&z=15&ie=UTF8&iwloc=&output=embed" loading="lazy"></iframe>
                            </div>

                            <div style="font-size: 0.85rem; color: var(--text-primary); font-weight: 600; margin-bottom: 6px;">
                                Exact Address:
                            </div>
                            <p style="font-size: 0.82rem; color: var(--text-secondary); line-height: 1.45; margin-bottom: 16px;">
                                ${hotel.location}
                            </p>

                            <a href="${hotel.googleMapsUrl}" target="_blank" rel="noopener noreferrer" class="btn btn-primary-burgundy btn-block">
                                <i data-lucide="navigation"></i>
                                <span>Open in Google Maps</span>
                            </a>
                        </div>

                        <!-- Quick Reservation Box -->
                        <div class="content-card" style="background: linear-gradient(135deg, #fff7ed 0%, #ffffff 100%); border-color: #ffedd5;">
                            <h3 class="detail-section-title" style="color: #9a3412;"><i data-lucide="calendar"></i> Instant Reservation</h3>
                            <p style="font-size: 0.82rem; color: var(--text-secondary); margin-bottom: 16px;">
                                Reserve your table in seconds. Immediate confirmation and pass ticket generation.
                            </p>
                            <button class="btn btn-primary btn-block" onclick="App.openReservationModalWithHotel(${hotel.id})">
                                <i data-lucide="plus"></i>
                                <span>Book Table at ${hotel.name.split(' ')[0]}</span>
                            </button>
                        </div>

                        <!-- Contact & Desk Details -->
                        <div class="content-card">
                            <h4 style="font-size: 0.9rem; font-weight: 700; color: var(--text-primary); margin-bottom: 12px;">Contact Information</h4>
                            <div style="display: flex; flex-direction: column; gap: 10px; font-size: 0.82rem; color: var(--text-secondary);">
                                <div style="display: flex; align-items: center; gap: 8px;">
                                    <i data-lucide="phone" style="width: 14px; height: 14px; color: var(--primary);"></i>
                                    <span>${hotel.contact}</span>
                                </div>
                                <div style="display: flex; align-items: center; gap: 8px;">
                                    <i data-lucide="clock" style="width: 14px; height: 14px; color: var(--gold-accent);"></i>
                                    <span>${hotel.openingHours}</span>
                                </div>
                                <div style="display: flex; align-items: center; gap: 8px;">
                                    <i data-lucide="check" style="width: 14px; height: 14px; color: #10b981;"></i>
                                    <span>Instant Host Desk Confirmation</span>
                                </div>
                            </div>
                        </div>

                    </div>
                </div>

            </div>
        `;
        lucide.createIcons();
    };

    // ==========================================
    // 4. FULL MENU ITEMS CATALOG
    // ==========================================
    const renderFullMenuCatalog = () => {
        const container = document.getElementById('full-menu-cards-container');
        if (!container) return;

        const searchVal = (document.getElementById('menu-search-input')?.value || '').toLowerCase().trim();
        const dietVal = document.getElementById('menu-diet-filter')?.value || 'ALL';
        const sortVal = document.getElementById('menu-sort-filter')?.value || 'POPULAR';

        let items = [...state.menu];

        // Filter by category
        if (state.menuViewCategory && state.menuViewCategory !== 'All') {
            items = items.filter(m => m.category === state.menuViewCategory || m.subCategory === state.menuViewCategory);
        }

        // Filter by search
        if (searchVal) {
            items = items.filter(m => 
                m.name.toLowerCase().includes(searchVal) ||
                m.description.toLowerCase().includes(searchVal) ||
                m.category.toLowerCase().includes(searchVal)
            );
        }

        // Filter by diet
        if (dietVal === 'VEG') items = items.filter(m => m.isVeg === true);
        if (dietVal === 'NONVEG') items = items.filter(m => m.isVeg === false);

        // Sort items
        if (sortVal === 'PRICE_LOW') items.sort((a, b) => a.price - b.price);
        if (sortVal === 'PRICE_HIGH') items.sort((a, b) => b.price - a.price);
        if (sortVal === 'RATING') items.sort((a, b) => b.rating - a.rating);

        if (items.length === 0) {
            container.innerHTML = `
                <div style="grid-column: 1 / -1; text-align: center; padding: 48px; background: #ffffff; border-radius: var(--radius-lg); border: 1px solid var(--border-card);">
                    <i data-lucide="utensils" style="width: 48px; height: 48px; color: var(--text-muted); margin-bottom: 12px;"></i>
                    <h3 style="font-size: 1.15rem; color: var(--text-primary); margin-bottom: 6px;">No menu items found</h3>
                    <p style="font-size: 0.86rem; color: var(--text-muted); margin-bottom: 16px;">Try adjusting your search or category filter.</p>
                </div>
            `;
            lucide.createIcons();
            return;
        }

        container.innerHTML = items.map(item => `
            <div class="menu-card-full">
                <div class="menu-card-full-img">
                    <img src="${item.image}" alt="${item.name}" loading="lazy">
                    <div class="menu-badge-corner">
                        <span class="diet-indicator ${item.isVeg ? 'diet-veg' : 'diet-nonveg'}"></span>
                        <span>${item.category}</span>
                    </div>
                    <div class="menu-rating-corner">
                        <i data-lucide="star" style="width: 12px; height: 12px; fill: #fbbf24;"></i> ${item.rating}
                    </div>
                </div>
                <div class="menu-card-full-body">
                    <h4 class="menu-card-full-title">${item.name}</h4>
                    <p class="menu-card-full-desc">${item.shortDesc || item.description}</p>
                    
                    <div class="menu-price-action-row">
                        <div>
                            <span class="price-text" style="font-size: 1.15rem;">₹${item.price}</span>
                            <span style="font-size: 0.72rem; color: var(--text-muted); display: block;">${item.prepTime || '15 mins'}</span>
                        </div>
                        <button class="btn btn-outline-burgundy btn-sm" onclick="App.addToOrder(${item.id})">
                            <i data-lucide="plus"></i>
                            <span>Add</span>
                        </button>
                    </div>
                </div>
            </div>
        `).join('');

        lucide.createIcons();
    };

    const selectMenuCategory = (cat) => {
        state.menuViewCategory = cat;
        document.querySelectorAll('#menu-view-cat-pills .menu-cat-btn').forEach(btn => {
            if (btn.dataset.cat === cat) {
                btn.classList.add('active');
            } else {
                btn.classList.remove('active');
            }
        });
        renderFullMenuCatalog();
    };

    const handleMenuSearch = () => renderFullMenuCatalog();
    const handleMenuFilterChange = () => renderFullMenuCatalog();

    // ==========================================
    // 5. ORDER TRAY MANAGEMENT
    // ==========================================
    const addToOrder = (dishId) => {
        const dish = state.menu.find(m => Number(m.id) === Number(dishId));
        if (!dish) return;

        state.orderTray = TableEaseAPI.Orders.addItem(dish);
        updateOrderTrayCount();
        showToast("Added to Table Order", `${dish.name} (₹${dish.price}) added to tray`, "success");
    };

    const openOrderTrayModal = () => {
        const content = document.getElementById('order-tray-content');
        if (!content) return;

        if (state.orderTray.length === 0) {
            content.innerHTML = `
                <div style="text-align: center; padding: 32px 16px; color: var(--text-muted);">
                    <i data-lucide="shopping-bag" style="width: 44px; height: 44px; margin-bottom: 10px; color: var(--text-muted);"></i>
                    <p style="font-size: 0.92rem; color: var(--text-primary); font-weight: 600;">Your Order Tray is Empty</p>
                    <p style="font-size: 0.78rem;">Click [Add +] on any menu item or hotel signature dish.</p>
                </div>
            `;
            openModal('modal-order-tray');
            lucide.createIcons();
            return;
        }

        const total = state.orderTray.reduce((acc, cur) => acc + (cur.price * cur.quantity), 0);

        content.innerHTML = `
            <div style="display: flex; flex-direction: column; gap: 12px; margin-bottom: 20px;">
                ${state.orderTray.map(item => `
                    <div style="display: flex; justify-content: space-between; align-items: center; padding: 10px; background: #f8fafc; border-radius: var(--radius-sm); border: 1px solid var(--border-subtle);">
                        <div>
                            <div style="font-weight: 600; font-size: 0.88rem; color: var(--text-primary);">${item.name}</div>
                            <div style="font-size: 0.76rem; color: var(--text-muted);">₹${item.price} each</div>
                        </div>
                        <div style="display: flex; align-items: center; gap: 10px;">
                            <button class="action-icon-btn" onclick="App.decrementTrayItem(${item.id})">-</button>
                            <span style="font-weight: 700; font-size: 0.88rem;">${item.quantity}</span>
                            <button class="action-icon-btn" onclick="App.incrementTrayItem(${item.id})">+</button>
                            <span style="font-weight: 700; min-width: 60px; text-align: right; color: var(--text-primary);">₹${item.price * item.quantity}</span>
                        </div>
                    </div>
                `).join('')}
            </div>

            <div style="display: flex; justify-content: space-between; align-items: center; padding-top: 14px; border-top: 1px solid var(--border-subtle);">
                <span style="font-size: 1rem; font-weight: 700; color: var(--text-primary);">Total Bill Amount:</span>
                <span style="font-size: 1.25rem; font-weight: 800; color: var(--primary);">₹${total}</span>
            </div>
        `;

        openModal('modal-order-tray');
        lucide.createIcons();
    };

    const incrementTrayItem = (id) => {
        const dish = state.menu.find(m => Number(m.id) === Number(id));
        if (dish) {
            state.orderTray = TableEaseAPI.Orders.addItem(dish);
            updateOrderTrayCount();
            openOrderTrayModal();
        }
    };

    const decrementTrayItem = (id) => {
        state.orderTray = TableEaseAPI.Orders.removeItem(id);
        updateOrderTrayCount();
        openOrderTrayModal();
    };

    const clearOrderTray = () => {
        state.orderTray = TableEaseAPI.Orders.clearTray();
        updateOrderTrayCount();
        closeModal('modal-order-tray');
        showToast("Order Tray", "Tray items cleared", "info");
    };

    const checkoutOrderTray = () => {
        if (state.orderTray.length === 0) return;
        closeModal('modal-order-tray');
        state.orderTray = TableEaseAPI.Orders.clearTray();
        updateOrderTrayCount();
        showToast("Kitchen Order Placed", "Your table order was sent to the chef kitchen display!", "success");
    };

    // ==========================================
    // 6. GLOBAL UNIFIED SEARCH
    // ==========================================
    const handleGlobalSearch = (event) => {
        const query = event.target.value.toLowerCase().trim();
        const resultsBox = document.getElementById('global-search-results');
        if (!resultsBox) return;

        if (!query || query.length < 2) {
            resultsBox.style.display = 'none';
            return;
        }

        const matchHotels = state.restaurants.filter(r => r.name.toLowerCase().includes(query) || r.location.toLowerCase().includes(query));
        const matchMenu = state.menu.filter(m => m.name.toLowerCase().includes(query) || m.category.toLowerCase().includes(query));
        const matchCust = state.customers.filter(c => c.name.toLowerCase().includes(query) || c.email.toLowerCase().includes(query));
        const matchRes = state.reservations.filter(r => (r.specialRequests && r.specialRequests.toLowerCase().includes(query)));

        let html = '';

        if (matchHotels.length > 0) {
            html += `<div class="search-result-group-title">Hotels & Restaurants</div>`;
            html += matchHotels.slice(0, 3).map(h => `
                <div class="search-result-item" onclick="App.openHotelDetail(${h.id}); document.getElementById('global-search-results').style.display='none';">
                    <i data-lucide="store" style="width: 16px; height: 16px; color: var(--gold-accent);"></i>
                    <div>
                        <div class="item-title">${h.name}</div>
                        <div class="item-subtitle">${h.location}</div>
                    </div>
                </div>
            `).join('');
        }

        if (matchMenu.length > 0) {
            html += `<div class="search-result-group-title">Menu Items</div>`;
            html += matchMenu.slice(0, 3).map(m => `
                <div class="search-result-item" onclick="App.navigateTo('menu'); document.getElementById('global-search-results').style.display='none';">
                    <i data-lucide="utensils" style="width: 16px; height: 16px; color: var(--primary);"></i>
                    <div>
                        <div class="item-title">${m.name} (₹${m.price})</div>
                        <div class="item-subtitle">${m.category}</div>
                    </div>
                </div>
            `).join('');
        }

        if (matchCust.length > 0) {
            html += `<div class="search-result-group-title">Customers</div>`;
            html += matchCust.slice(0, 3).map(c => `
                <div class="search-result-item" onclick="App.navigateTo('customers'); document.getElementById('global-search-results').style.display='none';">
                    <i data-lucide="user" style="width: 16px; height: 16px; color: #2563eb;"></i>
                    <div>
                        <div class="item-title">${c.name}</div>
                        <div class="item-subtitle">${c.email} • ${c.phone}</div>
                    </div>
                </div>
            `).join('');
        }

        if (html === '') {
            html = `<div style="padding: 16px; text-align: center; color: var(--text-muted); font-size: 0.84rem;">No matching results found for "${query}"</div>`;
        }

        resultsBox.innerHTML = html;
        resultsBox.style.display = 'block';
        lucide.createIcons();
    };

    // ==========================================
    // 7. CUSTOMERS CRUD
    // ==========================================
    const renderCustomersTable = () => {
        const tbody = document.getElementById('customers-table-body');
        if (!tbody) return;

        const searchVal = (document.getElementById('customer-search-input')?.value || '').toLowerCase().trim();
        let list = state.customers;

        if (searchVal) {
            list = list.filter(c => 
                c.name.toLowerCase().includes(searchVal) ||
                c.email.toLowerCase().includes(searchVal) ||
                c.phone.toLowerCase().includes(searchVal)
            );
        }

        if (list.length === 0) {
            tbody.innerHTML = `<tr><td colspan="6" style="text-align: center; padding: 24px; color: var(--text-muted);">No customers found.</td></tr>`;
            return;
        }

        tbody.innerHTML = list.map(c => `
            <tr>
                <td>
                    <div style="font-weight: 600; color: var(--text-primary);">${c.name}</div>
                    <div style="font-size: 0.72rem; color: var(--text-muted);">ID: #${c.id}</div>
                </td>
                <td>${c.email}</td>
                <td>${c.phone}</td>
                <td style="max-width: 240px; font-size: 0.8rem; color: var(--text-muted);">${c.notes || '—'}</td>
                <td>${c.createdAt || '2026-09-20'}</td>
                <td style="text-align: right;">
                    <div class="table-action-btns">
                        <button class="action-icon-btn" onclick="App.openCustomerModal(${c.id})" title="Edit Customer">
                            <i data-lucide="edit-2"></i>
                        </button>
                        <button class="action-icon-btn danger" onclick="App.confirmDeleteCustomer(${c.id})" title="Delete Customer">
                            <i data-lucide="trash-2"></i>
                        </button>
                    </div>
                </td>
            </tr>
        `).join('');

        lucide.createIcons();
    };

    const handleCustomerSearch = () => renderCustomersTable();
    const resetCustomerSearch = () => {
        const input = document.getElementById('customer-search-input');
        if (input) input.value = '';
        renderCustomersTable();
    };

    const openCustomerModal = (id = null) => {
        const form = document.getElementById('form-customer');
        form.reset();
        document.getElementById('cust-id').value = '';
        document.getElementById('modal-customer-title').textContent = id ? 'Edit Customer' : 'Add New Customer';

        if (id) {
            const cust = state.customers.find(c => Number(c.id) === Number(id));
            if (cust) {
                document.getElementById('cust-id').value = cust.id;
                document.getElementById('cust-name').value = cust.name;
                document.getElementById('cust-email').value = cust.email;
                document.getElementById('cust-phone').value = cust.phone;
                document.getElementById('cust-notes').value = cust.notes || '';
            }
        }
        openModal('modal-customer');
    };

    const handleSaveCustomer = async (e) => {
        e.preventDefault();
        const id = document.getElementById('cust-id').value;
        const data = {
            name: document.getElementById('cust-name').value,
            email: document.getElementById('cust-email').value,
            phone: document.getElementById('cust-phone').value,
            notes: document.getElementById('cust-notes').value
        };

        try {
            if (id) {
                await TableEaseAPI.Customers.update(id, data);
                showToast("Updated", "Customer record updated successfully", "success");
            } else {
                await TableEaseAPI.Customers.create(data);
                showToast("Created", "New customer added to database", "success");
            }
            closeModal('modal-customer');
            await loadAllData();
            renderView(currentView);
        } catch (err) {
            showToast("Error", err.message, "error");
        }
    };

    const confirmDeleteCustomer = (id) => {
        const cust = state.customers.find(c => Number(c.id) === Number(id));
        document.getElementById('delete-confirm-message').textContent = 
            `Are you sure you want to permanently delete customer "${cust?.name}"? All associated reservations will also be removed.`;
        pendingDeleteCallback = async () => {
            await TableEaseAPI.Customers.delete(id);
            showToast("Deleted", "Customer was removed", "success");
            await loadAllData();
            renderView(currentView);
        };
        openModal('modal-confirm-delete');
    };

    // ==========================================
    // 8. RESTAURANTS MANAGEMENT CRUD
    // ==========================================
    const renderRestaurantsGrid = () => {
        const container = document.getElementById('restaurants-cards-container');
        if (!container) return;

        const searchVal = (document.getElementById('restaurant-search-input')?.value || '').toLowerCase().trim();
        const cuisineVal = document.getElementById('restaurant-cuisine-filter')?.value || 'ALL';

        let list = state.restaurants;

        if (searchVal) {
            list = list.filter(r => 
                r.name.toLowerCase().includes(searchVal) ||
                r.location.toLowerCase().includes(searchVal) ||
                r.cuisine.toLowerCase().includes(searchVal)
            );
        }

        if (cuisineVal !== 'ALL') {
            list = list.filter(r => r.cuisine.toLowerCase().includes(cuisineVal.toLowerCase()));
        }

        container.innerHTML = list.map(r => {
            const tables = state.tables.filter(t => Number(t.restaurantId) === Number(r.id));
            return `
                <div class="content-card">
                    <div style="height: 140px; border-radius: var(--radius-sm); overflow: hidden; margin-bottom: 14px;">
                        <img src="${r.heroImage}" alt="${r.name}" style="width: 100%; height: 100%; object-fit: cover;">
                    </div>
                    <div style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 8px;">
                        <h4 style="font-size: 1.1rem; font-weight: 700; color: var(--text-primary);">${r.name}</h4>
                        <span class="rating-star-badge"><i data-lucide="star" style="width: 12px; height: 12px; fill: #d97706;"></i> ${r.rating}</span>
                    </div>
                    <div style="font-size: 0.8rem; color: var(--text-secondary); margin-bottom: 10px;">
                        <i data-lucide="map-pin" style="width: 13px; height: 13px; display: inline;"></i> ${r.location}
                    </div>
                    <div style="font-size: 0.78rem; color: var(--text-muted); margin-bottom: 14px;">
                        ${r.cuisine} • ${tables.length} Tables Registered
                    </div>
                    <div style="display: flex; gap: 8px; border-top: 1px solid var(--border-subtle); padding-top: 12px;">
                        <button class="btn btn-secondary btn-sm" style="flex: 1;" onclick="App.openRestaurantModal(${r.id})">Edit</button>
                        <button class="btn btn-outline-burgundy btn-sm" style="flex: 1;" onclick="App.openHotelDetail(${r.id})">Details</button>
                        <button class="action-icon-btn danger" onclick="App.confirmDeleteRestaurant(${r.id})" title="Delete Outlet">
                            <i data-lucide="trash-2"></i>
                        </button>
                    </div>
                </div>
            `;
        }).join('');

        lucide.createIcons();
    };

    const handleRestaurantSearch = () => renderRestaurantsGrid();
    const handleRestaurantFilter = () => renderRestaurantsGrid();

    const openRestaurantModal = (id = null) => {
        const form = document.getElementById('form-restaurant');
        form.reset();
        document.getElementById('rest-id').value = '';
        document.getElementById('modal-restaurant-title').textContent = id ? 'Edit Restaurant / Hotel' : 'Add New Restaurant / Hotel';

        if (id) {
            const rest = state.restaurants.find(r => Number(r.id) === Number(id));
            if (rest) {
                document.getElementById('rest-id').value = rest.id;
                document.getElementById('rest-name').value = rest.name;
                document.getElementById('rest-location').value = rest.location;
                document.getElementById('rest-cuisine').value = rest.cuisine;
                document.getElementById('rest-contact').value = rest.contact || '';
                document.getElementById('rest-hours').value = rest.openingHours || '';
                document.getElementById('rest-desc').value = rest.description || '';
            }
        }
        openModal('modal-restaurant');
    };

    const handleSaveRestaurant = async (e) => {
        e.preventDefault();
        const id = document.getElementById('rest-id').value;
        const data = {
            name: document.getElementById('rest-name').value,
            location: document.getElementById('rest-location').value,
            cuisine: document.getElementById('rest-cuisine').value,
            contact: document.getElementById('rest-contact').value,
            openingHours: document.getElementById('rest-hours').value,
            description: document.getElementById('rest-desc').value
        };

        try {
            if (id) {
                await TableEaseAPI.Restaurants.update(id, data);
                showToast("Updated", "Restaurant details saved", "success");
            } else {
                await TableEaseAPI.Restaurants.create(data);
                showToast("Created", "New Pune restaurant registered", "success");
            }
            closeModal('modal-restaurant');
            await loadAllData();
            renderDashRestaurantSelector();
            renderView(currentView);
        } catch (err) {
            showToast("Error", err.message, "error");
        }
    };

    const confirmDeleteRestaurant = (id) => {
        const rest = state.restaurants.find(r => Number(r.id) === Number(id));
        document.getElementById('delete-confirm-message').textContent = 
            `Permanently delete "${rest?.name}"? All tables and reservations for this venue will be removed.`;
        pendingDeleteCallback = async () => {
            await TableEaseAPI.Restaurants.delete(id);
            showToast("Deleted", "Restaurant branch removed", "success");
            await loadAllData();
            renderDashRestaurantSelector();
            renderView(currentView);
        };
        openModal('modal-confirm-delete');
    };

    // ==========================================
    // 9. TABLES & FLOOR CRUD
    // ==========================================
    const renderTablesGrid = () => {
        const container = document.getElementById('tables-grid-container');
        const filterSel = document.getElementById('tables-restaurant-filter');
        if (!container) return;

        // Populate filter dropdown if empty
        if (filterSel && filterSel.options.length <= 1) {
            let opts = '<option value="ALL">All Restaurants</option>';
            state.restaurants.forEach(r => opts += `<option value="${r.id}">${r.name}</option>`);
            filterSel.innerHTML = opts;
        }

        const restFilter = filterSel?.value || 'ALL';
        const statusFilter = document.getElementById('tables-status-filter')?.value || 'ALL';
        const searchVal = (document.getElementById('tables-search-input')?.value || '').toLowerCase().trim();

        let list = state.tables;
        if (restFilter !== 'ALL') list = list.filter(t => Number(t.restaurantId) === Number(restFilter));
        if (statusFilter !== 'ALL') list = list.filter(t => t.status === statusFilter);
        if (searchVal) list = list.filter(t => t.tableNumber.toLowerCase().includes(searchVal));

        container.innerHTML = list.map(t => {
            const rest = state.restaurants.find(r => Number(r.id) === Number(t.restaurantId)) || { name: 'Restaurant' };
            let statusBadgeClass = 'status-available';
            if (t.status === 'Reserved') statusBadgeClass = 'status-reserved';
            if (t.status === 'Occupied') statusBadgeClass = 'status-pending';
            if (t.status === 'Maintenance') statusBadgeClass = 'status-maintenance';

            return `
                <div class="content-card" style="text-align: center;">
                    <div style="font-family: 'JetBrains Mono', monospace; font-size: 1.25rem; font-weight: 800; color: var(--text-primary); margin-bottom: 4px;">
                        ${t.tableNumber}
                    </div>
                    <div style="font-size: 0.78rem; color: var(--text-muted); margin-bottom: 8px;">
                        ${rest.name}
                    </div>
                    <div style="font-size: 0.85rem; font-weight: 600; color: var(--text-secondary); margin-bottom: 12px;">
                        Capacity: ${t.capacity} Guests • ${t.floorArea || 'Main Hall'}
                    </div>
                    <div style="margin-bottom: 16px;">
                        <span class="status-pill ${statusBadgeClass}">${t.status}</span>
                    </div>
                    <div style="display: flex; gap: 8px; justify-content: center;">
                        <button class="btn btn-secondary btn-sm" onclick="App.openTableModal(${t.id})">Edit</button>
                        <button class="action-icon-btn danger" onclick="App.confirmDeleteTable(${t.id})">
                            <i data-lucide="trash-2"></i>
                        </button>
                    </div>
                </div>
            `;
        }).join('');

        lucide.createIcons();
    };

    const handleTableFilter = () => renderTablesGrid();

    const openTableModal = (id = null) => {
        const form = document.getElementById('form-table');
        form.reset();
        document.getElementById('tbl-id').value = '';
        document.getElementById('modal-table-title').textContent = id ? 'Edit Table' : 'Add Dining Table';

        const restSelect = document.getElementById('tbl-restaurant');
        restSelect.innerHTML = state.restaurants.map(r => `<option value="${r.id}">${r.name}</option>`).join('');

        if (id) {
            const tbl = state.tables.find(t => Number(t.id) === Number(id));
            if (tbl) {
                document.getElementById('tbl-id').value = tbl.id;
                restSelect.value = tbl.restaurantId;
                document.getElementById('tbl-number').value = tbl.tableNumber;
                document.getElementById('tbl-capacity').value = tbl.capacity;
                document.getElementById('tbl-status').value = tbl.status;
                document.getElementById('tbl-floor').value = tbl.floorArea || '';
            }
        }
        openModal('modal-table');
    };

    const handleSaveTable = async (e) => {
        e.preventDefault();
        const id = document.getElementById('tbl-id').value;
        const data = {
            restaurantId: document.getElementById('tbl-restaurant').value,
            tableNumber: document.getElementById('tbl-number').value,
            capacity: document.getElementById('tbl-capacity').value,
            status: document.getElementById('tbl-status').value,
            floorArea: document.getElementById('tbl-floor').value
        };

        try {
            if (id) {
                await TableEaseAPI.Tables.update(id, data);
                showToast("Updated", "Table updated", "success");
            } else {
                await TableEaseAPI.Tables.create(data);
                showToast("Created", "Table added to floor plan", "success");
            }
            closeModal('modal-table');
            await loadAllData();
            renderView(currentView);
        } catch (err) {
            showToast("Error", err.message, "error");
        }
    };

    const confirmDeleteTable = (id) => {
        const tbl = state.tables.find(t => Number(t.id) === Number(id));
        document.getElementById('delete-confirm-message').textContent = 
            `Permanently delete table "${tbl?.tableNumber}"? Any existing reservations for this table will be affected.`;
        pendingDeleteCallback = async () => {
            await TableEaseAPI.Tables.delete(id);
            showToast("Deleted", "Table removed from floor plan", "success");
            await loadAllData();
            renderView(currentView);
        };
        openModal('modal-confirm-delete');
    };

    // ==========================================
    // 10. RESERVATIONS MANAGEMENT CRUD
    // ==========================================
    const renderReservationsTable = () => {
        const tbody = document.getElementById('reservations-table-body');
        const restFilterSel = document.getElementById('reservation-restaurant-filter');
        if (!tbody) return;

        if (restFilterSel && restFilterSel.options.length <= 1) {
            let opts = '<option value="ALL">All Restaurants</option>';
            state.restaurants.forEach(r => opts += `<option value="${r.id}">${r.name}</option>`);
            restFilterSel.innerHTML = opts;
        }

        const restFilter = restFilterSel?.value || 'ALL';
        const statusFilter = document.getElementById('reservation-status-filter')?.value || 'ALL';
        const dateFilter = document.getElementById('reservation-date-filter')?.value || '';
        const searchVal = (document.getElementById('reservation-search-input')?.value || '').toLowerCase().trim();

        let list = state.reservations;
        if (restFilter !== 'ALL') list = list.filter(r => Number(r.restaurantId) === Number(restFilter));
        if (statusFilter !== 'ALL') list = list.filter(r => r.status === statusFilter);
        if (dateFilter) list = list.filter(r => r.reservationDate === dateFilter);

        if (searchVal) {
            list = list.filter(r => {
                const cust = state.customers.find(c => Number(c.id) === Number(r.customerId));
                return cust && cust.name.toLowerCase().includes(searchVal);
            });
        }

        if (list.length === 0) {
            tbody.innerHTML = `<tr><td colspan="7" style="text-align: center; padding: 24px; color: var(--text-muted);">No reservations found matching criteria.</td></tr>`;
            return;
        }

        tbody.innerHTML = list.map(res => {
            const cust = state.customers.find(c => Number(c.id) === Number(res.customerId)) || { name: 'Guest' };
            const tbl = state.tables.find(t => Number(t.id) === Number(res.tableId)) || { tableNumber: 'T-01', capacity: 4 };
            const rest = state.restaurants.find(r => Number(r.id) === Number(res.restaurantId)) || { name: 'Restaurant' };

            let statusClass = 'status-confirmed';
            if (res.status === 'Occupied') statusClass = 'status-pending';
            if (res.status === 'Completed') statusClass = 'status-confirmed';
            if (res.status === 'Cancelled') statusClass = 'status-maintenance';

            return `
                <tr>
                    <td style="font-family: 'JetBrains Mono', monospace; font-size: 0.8rem; font-weight: 700;">#RES-${res.id}</td>
                    <td>
                        <div style="font-weight: 600; color: var(--text-primary);">${cust.name}</div>
                        <div style="font-size: 0.72rem; color: var(--text-muted);">${cust.phone || ''}</div>
                    </td>
                    <td>${rest.name}</td>
                    <td><span class="table-tag">${tbl.tableNumber}</span> (${res.guestCount} / ${tbl.capacity} Seats)</td>
                    <td>
                        <div>${res.reservationDate}</div>
                        <div style="font-size: 0.72rem; color: var(--text-muted);">${formatTime12Hour(res.reservationTime)}</div>
                    </td>
                    <td><span class="status-pill ${statusClass}">${res.status}</span></td>
                    <td style="text-align: right;">
                        <div class="table-action-btns">
                            <button class="action-icon-btn" onclick="App.openReservationPass(${res.id})" title="View Ticket Pass">
                                <i data-lucide="printer"></i>
                            </button>
                            <button class="action-icon-btn" onclick="App.openReservationModal(${res.id})" title="Edit">
                                <i data-lucide="edit-2"></i>
                            </button>
                            <button class="action-icon-btn danger" onclick="App.confirmDeleteReservation(${res.id})" title="Cancel">
                                <i data-lucide="trash-2"></i>
                            </button>
                        </div>
                    </td>
                </tr>
            `;
        }).join('');

        lucide.createIcons();
    };

    const handleReservationFilter = () => renderReservationsTable();
    const resetReservationFilters = () => {
        const s = document.getElementById('reservation-search-input');
        const r = document.getElementById('reservation-restaurant-filter');
        const st = document.getElementById('reservation-status-filter');
        const d = document.getElementById('reservation-date-filter');
        if (s) s.value = '';
        if (r) r.value = 'ALL';
        if (st) st.value = 'ALL';
        if (d) d.value = '';
        renderReservationsTable();
    };

    const openReservationModal = (id = null) => {
        const form = document.getElementById('form-reservation');
        form.reset();
        document.getElementById('res-id').value = '';
        document.getElementById('modal-reservation-title').textContent = id ? 'Edit Reservation' : 'Book Table Reservation';

        // Populate customers dropdown
        const custSelect = document.getElementById('res-customer');
        custSelect.innerHTML = state.customers.map(c => `<option value="${c.id}">${c.name} (${c.phone})</option>`).join('');

        // Populate restaurants dropdown
        const restSelect = document.getElementById('res-restaurant');
        restSelect.innerHTML = state.restaurants.map(r => `<option value="${r.id}">${r.name} - ${r.shortLocation}</option>`).join('');

        if (id) {
            const res = state.reservations.find(r => Number(r.id) === Number(id));
            if (res) {
                document.getElementById('res-id').value = res.id;
                custSelect.value = res.customerId;
                restSelect.value = res.restaurantId;
                document.getElementById('res-date').value = res.reservationDate;
                document.getElementById('res-time').value = res.reservationTime;
                document.getElementById('res-guests').value = res.guestCount;
                document.getElementById('res-status').value = res.status;
                document.getElementById('res-notes').value = res.specialRequests || '';

                handleReservationRestaurantChange(res.tableId);
            }
        } else {
            document.getElementById('res-date').value = new Date().toISOString().split('T')[0];
            document.getElementById('res-time').value = "19:30";
            handleReservationRestaurantChange();
        }

        openModal('modal-reservation');
    };

    const openReservationModalWithHotel = (hotelId) => {
        openReservationModal();
        const restSelect = document.getElementById('res-restaurant');
        if (restSelect) {
            restSelect.value = hotelId;
            handleReservationRestaurantChange();
        }
    };

    const openReservationModalWithTable = (tableId) => {
        const tbl = state.tables.find(t => Number(t.id) === Number(tableId));
        if (!tbl) return;
        openReservationModal();
        const restSelect = document.getElementById('res-restaurant');
        if (restSelect) {
            restSelect.value = tbl.restaurantId;
            handleReservationRestaurantChange(tableId);
        }
    };

    const handleReservationRestaurantChange = (selectedTableId = null) => {
        const restId = Number(document.getElementById('res-restaurant').value);
        const guests = Number(document.getElementById('res-guests').value) || 2;
        const tblSelect = document.getElementById('res-table');

        const matchingTables = state.tables.filter(t => Number(t.restaurantId) === restId);

        if (matchingTables.length === 0) {
            tblSelect.innerHTML = `<option value="">-- No Tables at this Hotel --</option>`;
            return;
        }

        tblSelect.innerHTML = matchingTables.map(t => {
            const isFit = t.capacity >= guests;
            return `<option value="${t.id}" ${t.status === 'Reserved' && Number(t.id) !== Number(selectedTableId) ? 'style="color: red;"' : ''}>
                ${t.tableNumber} (${t.capacity} Seats - ${t.floorArea || 'Main Hall'}) [${t.status}] ${isFit ? '✓' : '(Smaller)'}
            </option>`;
        }).join('');

        if (selectedTableId) {
            tblSelect.value = selectedTableId;
        }
    };

    const handleSaveReservation = async (e) => {
        e.preventDefault();
        const id = document.getElementById('res-id').value;
        const data = {
            customerId: document.getElementById('res-customer').value,
            restaurantId: document.getElementById('res-restaurant').value,
            tableId: document.getElementById('res-table').value,
            reservationDate: document.getElementById('res-date').value,
            reservationTime: document.getElementById('res-time').value,
            guestCount: document.getElementById('res-guests').value,
            status: document.getElementById('res-status').value,
            specialRequests: document.getElementById('res-notes').value
        };

        if (!data.tableId) {
            showToast("Missing Table", "Please select a table to proceed", "error");
            return;
        }

        try {
            let savedRes;
            if (id) {
                savedRes = await TableEaseAPI.Reservations.update(id, data);
                showToast("Updated", "Reservation hold confirmed", "success");
            } else {
                savedRes = await TableEaseAPI.Reservations.create(data);
                showToast("Table Confirmed!", "Your reservation pass is generated", "success");
            }
            closeModal('modal-reservation');
            await loadAllData();
            renderView(currentView);

            // Automatically open ticket pass for new bookings
            if (!id && savedRes) {
                setTimeout(() => openReservationPass(savedRes.id), 400);
            }
        } catch (err) {
            showToast("Booking Error", err.message, "error");
        }
    };

    const confirmDeleteReservation = (id) => {
        document.getElementById('delete-confirm-message').textContent = 
            `Are you sure you want to cancel reservation #RES-${id}? The reserved table will immediately become Available.`;
        pendingDeleteCallback = async () => {
            await TableEaseAPI.Reservations.delete(id);
            showToast("Cancelled", "Reservation cancelled and table freed", "info");
            await loadAllData();
            renderView(currentView);
        };
        openModal('modal-confirm-delete');
    };

    // Printable Pass Receipt Modal
    const openReservationPass = (resId) => {
        const res = state.reservations.find(r => Number(r.id) === Number(resId));
        if (!res) return;

        const cust = state.customers.find(c => Number(c.id) === Number(res.customerId)) || { name: 'Valued Guest', phone: '+91' };
        const rest = state.restaurants.find(r => Number(r.id) === Number(res.restaurantId)) || { name: 'Restaurant' };
        const tbl = state.tables.find(t => Number(t.id) === Number(res.tableId)) || { tableNumber: 'T-01' };

        const content = document.getElementById('reservation-pass-content');
        if (!content) return;

        content.innerHTML = `
            <div style="border: 2px dashed #cbd5e1; border-radius: var(--radius-md); padding: 22px; background: #fafbfd; text-align: center;">
                <div style="display: flex; align-items: center; justify-content: center; gap: 8px; margin-bottom: 4px;">
                    <div class="brand-icon-box" style="width: 32px; height: 32px; font-size: 0.9rem;">
                        <i data-lucide="chef-hat" style="width: 16px; height: 16px;"></i>
                    </div>
                    <span style="font-family: 'Outfit', sans-serif; font-size: 1.25rem; font-weight: 800; color: var(--primary);">TableEase</span>
                </div>
                <div style="font-size: 0.72rem; letter-spacing: 0.1em; color: var(--text-muted); text-transform: uppercase; margin-bottom: 16px;">
                    Official Table Reservation Pass
                </div>

                <div style="background: #ffffff; border-radius: var(--radius-sm); border: 1px solid var(--border-subtle); padding: 14px; margin-bottom: 16px; text-align: left;">
                    <div style="font-size: 0.75rem; color: var(--text-muted); text-transform: uppercase;">Destination</div>
                    <div style="font-size: 1.05rem; font-weight: 700; color: var(--text-primary); margin-bottom: 8px;">${rest.name}</div>
                    <div style="font-size: 0.76rem; color: var(--text-secondary);"><i data-lucide="map-pin" style="width: 12px; height: 12px; display: inline;"></i> ${rest.location}</div>
                </div>

                <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 10px; text-align: left; margin-bottom: 16px;">
                    <div style="background: #ffffff; border: 1px solid var(--border-subtle); border-radius: var(--radius-sm); padding: 10px;">
                        <span style="font-size: 0.7rem; color: var(--text-muted); display: block;">Guest Name</span>
                        <strong style="font-size: 0.88rem; color: var(--text-primary);">${cust.name}</strong>
                    </div>
                    <div style="background: #ffffff; border: 1px solid var(--border-subtle); border-radius: var(--radius-sm); padding: 10px;">
                        <span style="font-size: 0.7rem; color: var(--text-muted); display: block;">Table Allocated</span>
                        <strong style="font-size: 0.88rem; color: var(--primary); font-family: 'JetBrains Mono', monospace;">${tbl.tableNumber}</strong>
                    </div>
                    <div style="background: #ffffff; border: 1px solid var(--border-subtle); border-radius: var(--radius-sm); padding: 10px;">
                        <span style="font-size: 0.7rem; color: var(--text-muted); display: block;">Date</span>
                        <strong style="font-size: 0.88rem; color: var(--text-primary);">${res.reservationDate}</strong>
                    </div>
                    <div style="background: #ffffff; border: 1px solid var(--border-subtle); border-radius: var(--radius-sm); padding: 10px;">
                        <span style="font-size: 0.7rem; color: var(--text-muted); display: block;">Arrival Time</span>
                        <strong style="font-size: 0.88rem; color: var(--text-primary);">${formatTime12Hour(res.reservationTime)}</strong>
                    </div>
                </div>

                <div style="font-size: 0.74rem; color: var(--text-muted); border-top: 1px dashed var(--border-subtle); padding-top: 12px;">
                    Pass ID: <strong>RES-${res.id}</strong> • Party of <strong>${res.guestCount} Guests</strong> • Status: <strong>${res.status}</strong>
                </div>
            </div>
        `;

        openModal('modal-pass');
        lucide.createIcons();
    };

    // ==========================================
    // 11. MENU MODAL (Add Dish)
    // ==========================================
    const openMenuModal = () => {
        document.getElementById('form-menu').reset();
        document.getElementById('menu-id').value = '';
        openModal('modal-menu');
    };

    const handleSaveMenu = async (e) => {
        e.preventDefault();
        const data = {
            name: document.getElementById('menu-name').value,
            category: document.getElementById('menu-category').value,
            price: document.getElementById('menu-price').value,
            isVeg: document.getElementById('menu-isveg').value === 'true',
            prepTime: document.getElementById('menu-preptime').value,
            shortDesc: document.getElementById('menu-desc').value,
            image: document.getElementById('menu-image').value
        };

        try {
            await TableEaseAPI.Menu.create(data);
            showToast("Added", "New dish added to menu catalog", "success");
            closeModal('modal-menu');
            await loadAllData();
            renderView(currentView);
        } catch (err) {
            showToast("Error", err.message, "error");
        }
    };

    // ==========================================
    // 12. GENERAL MODAL & TOAST HELPERS
    // ==========================================
    const openModal = (modalId) => {
        const modal = document.getElementById(modalId);
        if (modal) modal.classList.add('active');
    };

    const closeModal = (modalId) => {
        const modal = document.getElementById(modalId);
        if (modal) modal.classList.remove('active');
    };

    // Confirm Delete Action Dispatcher
    document.getElementById('btn-confirm-delete-action')?.addEventListener('click', () => {
        if (pendingDeleteCallback) {
            pendingDeleteCallback();
            pendingDeleteCallback = null;
        }
        closeModal('modal-confirm-delete');
    });

    const showToast = (title, message, type = 'info') => {
        const container = document.getElementById('toastContainer');
        if (!container) return;

        const toast = document.createElement('div');
        toast.className = `toast toast-${type}`;

        let iconName = 'info';
        if (type === 'success') iconName = 'check-circle';
        if (type === 'error') iconName = 'alert-triangle';

        toast.innerHTML = `
            <i data-lucide="${iconName}"></i>
            <div>
                <strong style="font-size: 0.85rem; display: block; color: var(--text-primary);">${title}</strong>
                <span style="font-size: 0.78rem; color: var(--text-secondary);">${message}</span>
            </div>
        `;

        container.appendChild(toast);
        lucide.createIcons();

        setTimeout(() => {
            toast.style.opacity = '0';
            toast.style.transform = 'translateY(10px)';
            toast.style.transition = 'all 0.3s ease';
            setTimeout(() => toast.remove(), 300);
        }, 4000);
    };

    const resetDemoData = async () => {
        TableEaseAPI.resetAllData();
        await loadAllData();
        renderView(currentView);
        showToast("Demo Data Restored", "Pune hotels and menu dataset reset to factory state", "success");
    };

    const formatTime12Hour = (time24) => {
        if (!time24) return '';
        const [hours, minutes] = time24.split(':');
        let h = parseInt(hours, 10);
        const ampm = h >= 12 ? 'PM' : 'AM';
        h = h % 12;
        h = h ? h : 12;
        return `${h}:${minutes} ${ampm}`;
    };

    // Public API
    return {
        init,
        navigateTo,
        handleGlobalSearch,
        handleDashRestaurantChange,
        handleFloorChange,
        handleFloorTableClick,
        filterDashMenu,
        handleHotelsSearch,
        handleHotelsFilter,
        resetHotelsFilters,
        openHotelDetail,
        selectMenuCategory,
        handleMenuSearch,
        handleMenuFilterChange,
        addToOrder,
        openOrderTrayModal,
        incrementTrayItem,
        decrementTrayItem,
        clearOrderTray,
        checkoutOrderTray,
        openCustomerModal,
        handleSaveCustomer,
        confirmDeleteCustomer,
        handleCustomerSearch,
        resetCustomerSearch,
        openRestaurantModal,
        handleSaveRestaurant,
        confirmDeleteRestaurant,
        handleRestaurantSearch,
        handleRestaurantFilter,
        openTableModal,
        handleSaveTable,
        confirmDeleteTable,
        handleTableFilter,
        openReservationModal,
        openReservationModalWithHotel,
        openReservationModalWithTable,
        handleReservationRestaurantChange,
        handleSaveReservation,
        confirmDeleteReservation,
        openReservationPass,
        handleReservationFilter,
        resetReservationFilters,
        openMenuModal,
        handleSaveMenu,
        openModal,
        closeModal,
        showToast,
        resetDemoData
    };
})();

// Boot TableEase when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    App.init();
});
