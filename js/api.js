/**
 * TableEase - API & Data Access Layer
 * 
 * ARCHITECTURE FOR COLLEGE MINI PROJECT:
 * Currently runs via LocalStorage Service Layer with simulated network latency.
 * Prepared for plug-and-play connection to Spring Boot REST API:
 *   [Browser UI] -> [TableEase API Client] -> [Spring Boot @RestController]
 *   -> [@Service Layer] -> [DAO / JdbcTemplate] -> [MySQL Database]
 */

const TableEaseAPI = (() => {
    // Configuration: Toggle to true when Spring Boot backend is running on port 8080
    const USE_SPRING_BOOT_API = false;
    const BACKEND_BASE_URL = 'http://localhost:8080/api';

    // Local Storage Keys
    const STORAGE_KEYS = {
        VERSION: 'tableease_data_version',
        CUSTOMERS: 'tableease_customers',
        RESTAURANTS: 'tableease_restaurants',
        TABLES: 'tableease_tables',
        RESERVATIONS: 'tableease_reservations',
        MENU: 'tableease_menu_items',
        ORDER_TRAY: 'tableease_order_tray'
    };

    // Helper: Initialize or Upgrade LocalStorage to Pune dataset
    const initStorage = () => {
        const currentVersion = localStorage.getItem(STORAGE_KEYS.VERSION);
        const shouldMigrate = currentVersion !== DATA_VERSION;

        if (shouldMigrate || !localStorage.getItem(STORAGE_KEYS.RESTAURANTS)) {
            localStorage.setItem(STORAGE_KEYS.RESTAURANTS, JSON.stringify(INITIAL_RESTAURANTS));
            localStorage.setItem(STORAGE_KEYS.TABLES, JSON.stringify(INITIAL_TABLES));
            localStorage.setItem(STORAGE_KEYS.CUSTOMERS, JSON.stringify(INITIAL_CUSTOMERS));
            localStorage.setItem(STORAGE_KEYS.RESERVATIONS, JSON.stringify(INITIAL_RESERVATIONS));
            localStorage.setItem(STORAGE_KEYS.MENU, JSON.stringify(INITIAL_MENU_ITEMS));
            localStorage.setItem(STORAGE_KEYS.VERSION, DATA_VERSION);
            if (!localStorage.getItem(STORAGE_KEYS.ORDER_TRAY)) {
                localStorage.setItem(STORAGE_KEYS.ORDER_TRAY, JSON.stringify([]));
            }
        }
    };

    // Low-level LocalStorage helpers
    const getStored = (key) => {
        try {
            return JSON.parse(localStorage.getItem(key) || '[]');
        } catch (e) {
            return [];
        }
    };
    const setStored = (key, data) => localStorage.setItem(key, JSON.stringify(data));

    // Simulated network delay for realistic SaaS loading states
    const mockLatency = (ms = 80) => new Promise(resolve => setTimeout(resolve, ms));

    // Initialize on script load
    initStorage();

    // ==========================================
    // 1. CUSTOMERS API (Matches /api/customers)
    // ==========================================
    const Customers = {
        async getAll() {
            if (USE_SPRING_BOOT_API) {
                const res = await fetch(`${BACKEND_BASE_URL}/customers`);
                return await res.json();
            }
            await mockLatency();
            return getStored(STORAGE_KEYS.CUSTOMERS);
        },

        async getById(id) {
            if (USE_SPRING_BOOT_API) {
                const res = await fetch(`${BACKEND_BASE_URL}/customers/${id}`);
                return await res.json();
            }
            await mockLatency();
            const customers = getStored(STORAGE_KEYS.CUSTOMERS);
            return customers.find(c => Number(c.id) === Number(id)) || null;
        },

        async create(customerData) {
            if (USE_SPRING_BOOT_API) {
                const res = await fetch(`${BACKEND_BASE_URL}/customers`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(customerData)
                });
                return await res.json();
            }
            await mockLatency();
            const customers = getStored(STORAGE_KEYS.CUSTOMERS);
            const newCustomer = {
                id: Date.now(),
                name: customerData.name.trim(),
                email: customerData.email.trim(),
                phone: customerData.phone.trim(),
                notes: customerData.notes ? customerData.notes.trim() : '',
                createdAt: new Date().toISOString().split('T')[0]
            };
            customers.unshift(newCustomer);
            setStored(STORAGE_KEYS.CUSTOMERS, customers);
            return newCustomer;
        },

        async update(id, customerData) {
            if (USE_SPRING_BOOT_API) {
                const res = await fetch(`${BACKEND_BASE_URL}/customers/${id}`, {
                    method: 'PUT',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(customerData)
                });
                return await res.json();
            }
            await mockLatency();
            const customers = getStored(STORAGE_KEYS.CUSTOMERS);
            const index = customers.findIndex(c => Number(c.id) === Number(id));
            if (index === -1) throw new Error("Customer not found");
            
            customers[index] = {
                ...customers[index],
                name: customerData.name.trim(),
                email: customerData.email.trim(),
                phone: customerData.phone.trim(),
                notes: customerData.notes !== undefined ? customerData.notes.trim() : customers[index].notes
            };
            setStored(STORAGE_KEYS.CUSTOMERS, customers);
            return customers[index];
        },

        async delete(id) {
            if (USE_SPRING_BOOT_API) {
                await fetch(`${BACKEND_BASE_URL}/customers/${id}`, { method: 'DELETE' });
                return true;
            }
            await mockLatency();
            const customers = getStored(STORAGE_KEYS.CUSTOMERS);
            const filtered = customers.filter(c => Number(c.id) !== Number(id));
            setStored(STORAGE_KEYS.CUSTOMERS, filtered);

            // Clean up dependent reservations
            const reservations = getStored(STORAGE_KEYS.RESERVATIONS);
            const updatedReservations = reservations.filter(r => Number(r.customerId) !== Number(id));
            setStored(STORAGE_KEYS.RESERVATIONS, updatedReservations);

            return true;
        }
    };

    // ==========================================
    // 2. RESTAURANTS / HOTELS API (Matches /api/restaurants)
    // ==========================================
    const Restaurants = {
        async getAll() {
            if (USE_SPRING_BOOT_API) {
                const res = await fetch(`${BACKEND_BASE_URL}/restaurants`);
                return await res.json();
            }
            await mockLatency();
            return getStored(STORAGE_KEYS.RESTAURANTS);
        },

        async getById(id) {
            if (USE_SPRING_BOOT_API) {
                const res = await fetch(`${BACKEND_BASE_URL}/restaurants/${id}`);
                return await res.json();
            }
            await mockLatency();
            const list = getStored(STORAGE_KEYS.RESTAURANTS);
            return list.find(r => Number(r.id) === Number(id)) || null;
        },

        async create(data) {
            if (USE_SPRING_BOOT_API) {
                const res = await fetch(`${BACKEND_BASE_URL}/restaurants`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(data)
                });
                return await res.json();
            }
            await mockLatency();
            const list = getStored(STORAGE_KEYS.RESTAURANTS);
            const colors = ['rose', 'amber', 'emerald', 'cyan', 'purple', 'indigo'];
            const randomColor = colors[list.length % colors.length];

            const name = data.name.trim();
            const location = data.location.trim();
            const gMapUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(name + ' ' + location)}`;

            const newRestaurant = {
                id: Date.now(),
                name: name,
                location: location,
                shortLocation: location.split(',')[0] || location,
                cuisine: data.cuisine.trim(),
                cuisineTags: data.cuisine.split(',').map(s => s.trim()).filter(Boolean),
                rating: data.rating ? parseFloat(data.rating) : 4.5,
                reviewsCount: 120,
                priceRange: data.priceRange || "₹₹₹ (₹2,000 for two)",
                priceLevel: data.priceLevel || "₹₹₹",
                contact: data.contact ? data.contact.trim() : '+91 20 0000 0000',
                openingHours: data.openingHours ? data.openingHours.trim() : '11:00 AM - 11:00 PM',
                description: data.description ? data.description.trim() : 'Exquisite dining ambiance with chef-curated culinary specials.',
                about: data.description ? data.description.trim() : 'Exquisite dining ambiance with chef-curated culinary specials and attentive hospitality.',
                badgeColor: randomColor,
                heroImage: data.heroImage || "https://images.unsplash.com/photo-1550966871-3ed3cdb5ed0c?auto=format&fit=crop&w=1600&q=80",
                interiorImages: [
                    "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=800&q=80",
                    "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=800&q=80"
                ],
                googleMapsUrl: gMapUrl,
                features: ["Valet Parking", "Fine Dining", "Air Conditioned", "High-speed Wi-Fi"]
            };
            list.unshift(newRestaurant);
            setStored(STORAGE_KEYS.RESTAURANTS, list);
            return newRestaurant;
        },

        async update(id, data) {
            if (USE_SPRING_BOOT_API) {
                const res = await fetch(`${BACKEND_BASE_URL}/restaurants/${id}`, {
                    method: 'PUT',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(data)
                });
                return await res.json();
            }
            await mockLatency();
            const list = getStored(STORAGE_KEYS.RESTAURANTS);
            const idx = list.findIndex(r => Number(r.id) === Number(id));
            if (idx === -1) throw new Error("Restaurant not found");

            const name = data.name.trim();
            const location = data.location.trim();
            const gMapUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(name + ' ' + location)}`;

            list[idx] = {
                ...list[idx],
                name: name,
                location: location,
                cuisine: data.cuisine.trim(),
                contact: data.contact ? data.contact.trim() : list[idx].contact,
                openingHours: data.openingHours ? data.openingHours.trim() : list[idx].openingHours,
                description: data.description ? data.description.trim() : list[idx].description,
                googleMapsUrl: gMapUrl
            };
            setStored(STORAGE_KEYS.RESTAURANTS, list);
            return list[idx];
        },

        async delete(id) {
            if (USE_SPRING_BOOT_API) {
                await fetch(`${BACKEND_BASE_URL}/restaurants/${id}`, { method: 'DELETE' });
                return true;
            }
            await mockLatency();
            const list = getStored(STORAGE_KEYS.RESTAURANTS);
            const filtered = list.filter(r => Number(r.id) !== Number(id));
            setStored(STORAGE_KEYS.RESTAURANTS, filtered);

            // Cascade delete tables
            const tables = getStored(STORAGE_KEYS.TABLES).filter(t => Number(t.restaurantId) !== Number(id));
            setStored(STORAGE_KEYS.TABLES, tables);

            // Cascade delete reservations
            const res = getStored(STORAGE_KEYS.RESERVATIONS).filter(r => Number(r.restaurantId) !== Number(id));
            setStored(STORAGE_KEYS.RESERVATIONS, res);

            return true;
        }
    };

    // ==========================================
    // 3. TABLES API (Matches /api/tables)
    // ==========================================
    const Tables = {
        async getAll() {
            if (USE_SPRING_BOOT_API) {
                const res = await fetch(`${BACKEND_BASE_URL}/tables`);
                return await res.json();
            }
            await mockLatency();
            return getStored(STORAGE_KEYS.TABLES);
        },

        async getByRestaurant(restaurantId) {
            const all = await this.getAll();
            if (!restaurantId || restaurantId === 'ALL') return all;
            return all.filter(t => Number(t.restaurantId) === Number(restaurantId));
        },

        async create(data) {
            if (USE_SPRING_BOOT_API) {
                const res = await fetch(`${BACKEND_BASE_URL}/tables`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(data)
                });
                return await res.json();
            }
            await mockLatency();
            const list = getStored(STORAGE_KEYS.TABLES);
            const newTable = {
                id: Date.now(),
                restaurantId: Number(data.restaurantId),
                tableNumber: data.tableNumber.trim().toUpperCase(),
                capacity: Number(data.capacity),
                status: data.status || 'Available',
                floorArea: data.floorArea ? data.floorArea.trim() : 'Main Dining'
            };
            list.unshift(newTable);
            setStored(STORAGE_KEYS.TABLES, list);
            return newTable;
        },

        async update(id, data) {
            if (USE_SPRING_BOOT_API) {
                const res = await fetch(`${BACKEND_BASE_URL}/tables/${id}`, {
                    method: 'PUT',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(data)
                });
                return await res.json();
            }
            await mockLatency();
            const list = getStored(STORAGE_KEYS.TABLES);
            const idx = list.findIndex(t => Number(t.id) === Number(id));
            if (idx === -1) throw new Error("Table not found");

            list[idx] = {
                ...list[idx],
                restaurantId: Number(data.restaurantId),
                tableNumber: data.tableNumber.trim().toUpperCase(),
                capacity: Number(data.capacity),
                status: data.status || list[idx].status,
                floorArea: data.floorArea ? data.floorArea.trim() : list[idx].floorArea
            };
            setStored(STORAGE_KEYS.TABLES, list);
            return list[idx];
        },

        async updateStatus(id, newStatus) {
            if (USE_SPRING_BOOT_API) {
                const res = await fetch(`${BACKEND_BASE_URL}/tables/${id}/status?status=${newStatus}`, {
                    method: 'PATCH'
                });
                return await res.json();
            }
            await mockLatency();
            const list = getStored(STORAGE_KEYS.TABLES);
            const idx = list.findIndex(t => Number(t.id) === Number(id));
            if (idx === -1) return null;

            list[idx].status = newStatus;
            setStored(STORAGE_KEYS.TABLES, list);
            return list[idx];
        },

        async delete(id) {
            if (USE_SPRING_BOOT_API) {
                await fetch(`${BACKEND_BASE_URL}/tables/${id}`, { method: 'DELETE' });
                return true;
            }
            await mockLatency();
            const list = getStored(STORAGE_KEYS.TABLES);
            const filtered = list.filter(t => Number(t.id) !== Number(id));
            setStored(STORAGE_KEYS.TABLES, filtered);
            return true;
        }
    };

    // ==========================================
    // 4. RESERVATIONS API (Matches /api/reservations)
    // ==========================================
    const Reservations = {
        async getAll() {
            if (USE_SPRING_BOOT_API) {
                const res = await fetch(`${BACKEND_BASE_URL}/reservations`);
                return await res.json();
            }
            await mockLatency();
            return getStored(STORAGE_KEYS.RESERVATIONS);
        },

        async create(data) {
            if (USE_SPRING_BOOT_API) {
                const res = await fetch(`${BACKEND_BASE_URL}/reservations`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(data)
                });
                return await res.json();
            }
            await mockLatency();
            const list = getStored(STORAGE_KEYS.RESERVATIONS);
            
            const newReservation = {
                id: Date.now(),
                customerId: Number(data.customerId),
                restaurantId: Number(data.restaurantId),
                tableId: Number(data.tableId),
                reservationDate: data.reservationDate,
                reservationTime: data.reservationTime,
                guestCount: Number(data.guestCount),
                status: data.status || 'Reserved',
                specialRequests: data.specialRequests ? data.specialRequests.trim() : '',
                createdAt: new Date().toISOString()
            };

            list.unshift(newReservation);
            setStored(STORAGE_KEYS.RESERVATIONS, list);

            // Mark table as reserved if date matches today
            if (newReservation.status === 'Reserved' || newReservation.status === 'Occupied') {
                await Tables.updateStatus(newReservation.tableId, newReservation.status);
            }

            return newReservation;
        },

        async update(id, data) {
            if (USE_SPRING_BOOT_API) {
                const res = await fetch(`${BACKEND_BASE_URL}/reservations/${id}`, {
                    method: 'PUT',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(data)
                });
                return await res.json();
            }
            await mockLatency();
            const list = getStored(STORAGE_KEYS.RESERVATIONS);
            const idx = list.findIndex(r => Number(r.id) === Number(id));
            if (idx === -1) throw new Error("Reservation not found");

            const oldTableId = list[idx].tableId;
            const newTableId = Number(data.tableId);

            list[idx] = {
                ...list[idx],
                customerId: Number(data.customerId),
                restaurantId: Number(data.restaurantId),
                tableId: newTableId,
                reservationDate: data.reservationDate,
                reservationTime: data.reservationTime,
                guestCount: Number(data.guestCount),
                status: data.status || list[idx].status,
                specialRequests: data.specialRequests ? data.specialRequests.trim() : ''
            };

            setStored(STORAGE_KEYS.RESERVATIONS, list);

            if (oldTableId !== newTableId) {
                await Tables.updateStatus(oldTableId, 'Available');
                await Tables.updateStatus(newTableId, list[idx].status === 'Cancelled' ? 'Available' : 'Reserved');
            }

            return list[idx];
        },

        async updateStatus(id, newStatus) {
            if (USE_SPRING_BOOT_API) {
                const res = await fetch(`${BACKEND_BASE_URL}/reservations/${id}/status?status=${newStatus}`, {
                    method: 'PATCH'
                });
                return await res.json();
            }
            await mockLatency();
            const list = getStored(STORAGE_KEYS.RESERVATIONS);
            const idx = list.findIndex(r => Number(r.id) === Number(id));
            if (idx === -1) throw new Error("Reservation not found");

            list[idx].status = newStatus;
            setStored(STORAGE_KEYS.RESERVATIONS, list);

            const tableId = list[idx].tableId;
            if (newStatus === 'Cancelled' || newStatus === 'Completed') {
                await Tables.updateStatus(tableId, 'Available');
            } else if (newStatus === 'Occupied') {
                await Tables.updateStatus(tableId, 'Occupied');
            } else if (newStatus === 'Reserved') {
                await Tables.updateStatus(tableId, 'Reserved');
            }

            return list[idx];
        },

        async delete(id) {
            if (USE_SPRING_BOOT_API) {
                await fetch(`${BACKEND_BASE_URL}/reservations/${id}`, { method: 'DELETE' });
                return true;
            }
            await mockLatency();
            const list = getStored(STORAGE_KEYS.RESERVATIONS);
            const res = list.find(r => Number(r.id) === Number(id));
            if (res && res.tableId) {
                await Tables.updateStatus(res.tableId, 'Available');
            }
            const filtered = list.filter(r => Number(r.id) !== Number(id));
            setStored(STORAGE_KEYS.RESERVATIONS, filtered);
            return true;
        }
    };

    // ==========================================
    // 5. MENU ITEMS API (Matches /api/menu)
    // ==========================================
    const Menu = {
        async getAll() {
            if (USE_SPRING_BOOT_API) {
                const res = await fetch(`${BACKEND_BASE_URL}/menu`);
                return await res.json();
            }
            await mockLatency();
            return getStored(STORAGE_KEYS.MENU);
        },

        async getById(id) {
            if (USE_SPRING_BOOT_API) {
                const res = await fetch(`${BACKEND_BASE_URL}/menu/${id}`);
                return await res.json();
            }
            await mockLatency();
            const items = getStored(STORAGE_KEYS.MENU);
            return items.find(m => Number(m.id) === Number(id)) || null;
        },

        async getByCategory(category) {
            const all = await this.getAll();
            if (!category || category === 'All') return all;
            return all.filter(m => m.category === category || m.subCategory === category);
        },

        async create(data) {
            if (USE_SPRING_BOOT_API) {
                const res = await fetch(`${BACKEND_BASE_URL}/menu`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(data)
                });
                return await res.json();
            }
            await mockLatency();
            const items = getStored(STORAGE_KEYS.MENU);
            const newItem = {
                id: Date.now(),
                name: data.name.trim(),
                category: data.category || 'Main Course',
                subCategory: data.subCategory || data.category || 'Indian',
                price: Number(data.price),
                isVeg: data.isVeg === true || data.isVeg === 'true',
                rating: 4.8,
                reviewsCount: 1,
                isPopular: data.isPopular === true || data.isPopular === 'true',
                shortDesc: data.shortDesc ? data.shortDesc.trim() : '',
                description: data.description ? data.description.trim() : (data.shortDesc || ''),
                image: data.image || "https://images.unsplash.com/photo-1546833999-b9f581a1996d?auto=format&fit=crop&w=600&q=80",
                prepTime: data.prepTime || "15 mins",
                calories: data.calories || "300 kcal"
            };
            items.unshift(newItem);
            setStored(STORAGE_KEYS.MENU, items);
            return newItem;
        },

        async update(id, data) {
            await mockLatency();
            const items = getStored(STORAGE_KEYS.MENU);
            const idx = items.findIndex(m => Number(m.id) === Number(id));
            if (idx === -1) throw new Error("Menu item not found");

            items[idx] = {
                ...items[idx],
                name: data.name.trim(),
                category: data.category || items[idx].category,
                price: Number(data.price),
                isVeg: data.isVeg !== undefined ? (data.isVeg === true || data.isVeg === 'true') : items[idx].isVeg,
                shortDesc: data.shortDesc !== undefined ? data.shortDesc.trim() : items[idx].shortDesc
            };
            setStored(STORAGE_KEYS.MENU, items);
            return items[idx];
        },

        async delete(id) {
            await mockLatency();
            const items = getStored(STORAGE_KEYS.MENU);
            const filtered = items.filter(m => Number(m.id) !== Number(id));
            setStored(STORAGE_KEYS.MENU, filtered);
            return true;
        }
    };

    // ==========================================
    // 6. ORDER TRAY / TABLE ORDER HELPER
    // ==========================================
    const Orders = {
        getTray() {
            return getStored(STORAGE_KEYS.ORDER_TRAY);
        },
        addItem(menuItem) {
            const tray = getStored(STORAGE_KEYS.ORDER_TRAY);
            const existing = tray.find(item => Number(item.id) === Number(menuItem.id));
            if (existing) {
                existing.quantity = (existing.quantity || 1) + 1;
            } else {
                tray.push({
                    id: menuItem.id,
                    name: menuItem.name,
                    price: menuItem.price,
                    isVeg: menuItem.isVeg,
                    quantity: 1
                });
            }
            setStored(STORAGE_KEYS.ORDER_TRAY, tray);
            return tray;
        },
        removeItem(id) {
            const tray = getStored(STORAGE_KEYS.ORDER_TRAY);
            const idx = tray.findIndex(i => Number(i.id) === Number(id));
            if (idx > -1) {
                if (tray[idx].quantity > 1) {
                    tray[idx].quantity -= 1;
                } else {
                    tray.splice(idx, 1);
                }
            }
            setStored(STORAGE_KEYS.ORDER_TRAY, tray);
            return tray;
        },
        clearTray() {
            setStored(STORAGE_KEYS.ORDER_TRAY, []);
            return [];
        }
    };

    // ==========================================
    // 7. STATS & ANALYTICS HELPER (For Dashboard)
    // ==========================================
    const Stats = {
        async getDashboardSummary() {
            const customers = await Customers.getAll();
            const restaurants = await Restaurants.getAll();
            const tables = await Tables.getAll();
            const reservations = await Reservations.getAll();
            const menuItems = await Menu.getAll();

            const todayStr = new Date().toISOString().split('T')[0];

            const availableTables = tables.filter(t => t.status === 'Available').length;
            const reservedTables = tables.filter(t => t.status === 'Reserved').length;
            const occupiedTables = tables.filter(t => t.status === 'Occupied').length;
            const maintenanceTables = tables.filter(t => t.status === 'Maintenance').length;

            const todayReservations = reservations.filter(r => r.reservationDate === todayStr);

            return {
                totalCustomers: customers.length,
                totalRestaurants: restaurants.length,
                totalTables: tables.length,
                availableTables,
                reservedTables,
                occupiedTables,
                maintenanceTables,
                totalMenuItems: menuItems.length,
                todayReservationsCount: todayReservations.length,
                todayReservations
            };
        }
    };

    // Reset storage to pristine initial demo state
    const resetAllData = () => {
        localStorage.setItem(STORAGE_KEYS.CUSTOMERS, JSON.stringify(INITIAL_CUSTOMERS));
        localStorage.setItem(STORAGE_KEYS.RESTAURANTS, JSON.stringify(INITIAL_RESTAURANTS));
        localStorage.setItem(STORAGE_KEYS.TABLES, JSON.stringify(INITIAL_TABLES));
        localStorage.setItem(STORAGE_KEYS.RESERVATIONS, JSON.stringify(INITIAL_RESERVATIONS));
        localStorage.setItem(STORAGE_KEYS.MENU, JSON.stringify(INITIAL_MENU_ITEMS));
        localStorage.setItem(STORAGE_KEYS.ORDER_TRAY, JSON.stringify([]));
        localStorage.setItem(STORAGE_KEYS.VERSION, DATA_VERSION);
        return true;
    };

    return {
        Customers,
        Restaurants,
        Tables,
        Reservations,
        Menu,
        Orders,
        Stats,
        resetAllData,
        isUsingSpringBoot: () => USE_SPRING_BOOT_API
    };
})();
