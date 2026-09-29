/**
 * TableEase - Realistic Mock Dataset for Pune Hotels & Restaurants
 * Pre-populated with verified Pune hotel destinations, tables, reservations, and multi-cuisine menu.
 * Structured to map 1:1 with Spring Boot REST API, JdbcTemplate DAOs & MySQL schema.
 */

const DATA_VERSION = "2.1_pune_hotels_menu";

// ========================================================
// 1. REAL PUNE HOTELS & RESTAURANTS (Verified Pune Addresses)
// ========================================================
const INITIAL_RESTAURANTS = [
    {
        id: 1,
        name: "JW Marriott Hotel Pune",
        location: "Senapati Bapat Road, Pune, Maharashtra 411053",
        shortLocation: "Senapati Bapat Road, Pune",
        cuisine: "North Indian, Italian & Pan-Asian (Spice Kitchen & Paasha)",
        cuisineTags: ["North Indian", "Italian", "Pan-Asian", "Fine Dining"],
        rating: 4.8,
        reviewsCount: 2480,
        priceRange: "₹₹₹₹ (₹3,200 for two)",
        priceLevel: "₹₹₹₹",
        contact: "+91 20 6683 3333",
        openingHours: "06:30 AM - 11:30 PM",
        description: "Iconic 5-star landmark on Senapati Bapat Road featuring award-winning dining at Spice Kitchen, authentic Italian at Alto Vino, and breathtaking skyline views at rooftop lounge Paasha.",
        about: "JW Marriott Pune stands as an epitome of refined luxury in the heart of Pune's business corridor. The culinary program is curated by master chefs offering lavish global buffets, hand-crafted pastas, artisanal cocktails, and traditional dum-cooked Awadhi specialties.",
        badgeColor: "rose",
        heroImage: "https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=1600&q=80",
        interiorImages: [
            "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=800&q=80",
            "https://images.unsplash.com/photo-1550966871-3ed3cdb5ed0c?auto=format&fit=crop&w=800&q=80",
            "https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=800&q=80",
            "https://images.unsplash.com/photo-1559339352-11d035aa65de?auto=format&fit=crop&w=800&q=80"
        ],
        googleMapsUrl: "https://www.google.com/maps/search/?api=1&query=JW+Marriott+Hotel+Pune+Senapati+Bapat+Road+Pune+Maharashtra+411053",
        features: ["Valet Parking", "Rooftop Sky Bar", "Private Dining Suites", "Live Music", "Sommelier on Desk", "Wheelchair Accessible"]
    },
    {
        id: 2,
        name: "Conrad Pune",
        location: "7 Mangaldas Road, Pune, Maharashtra 411001",
        shortLocation: "Mangaldas Road, Pune",
        cuisine: "Modern European, Pan-Asian & Indian (Coriander Kitchen & Koji)",
        cuisineTags: ["Pan-Asian", "Continental", "Indian", "Art Deco Luxury"],
        rating: 4.9,
        reviewsCount: 1940,
        priceRange: "₹₹₹₹ (₹3,500 for two)",
        priceLevel: "₹₹₹₹",
        contact: "+91 20 6745 6745",
        openingHours: "07:00 AM - 11:45 PM",
        description: "Hilton's premier luxury hotel in Pune, celebrated for opulent Art Deco architecture, theatrical open kitchens at Coriander Kitchen, and premier sushi & teppanyaki at Koji.",
        about: "Situated off Bund Garden Road, Conrad Pune delivers intuitive hospitality with dramatic dining venues. Guests enjoy interactive live culinary stations, aged steaks, wood-fired thin crust pizzas, and artisanal Asian delicacies prepared in front of dining guests.",
        badgeColor: "amber",
        heroImage: "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&w=1600&q=80",
        interiorImages: [
            "https://images.unsplash.com/photo-1551632436-cbf8dd35adfa?auto=format&fit=crop&w=800&q=80",
            "https://images.unsplash.com/photo-1578474846511-04ba529f0b88?auto=format&fit=crop&w=800&q=80",
            "https://images.unsplash.com/photo-1552566626-52f8b828add9?auto=format&fit=crop&w=800&q=80",
            "https://images.unsplash.com/photo-1590846406792-0adc7f938f1d?auto=format&fit=crop&w=800&q=80"
        ],
        googleMapsUrl: "https://www.google.com/maps/search/?api=1&query=Conrad+Pune+7+Mangaldas+Road+Pune+Maharashtra+411001",
        features: ["Art Deco Lounge", "Teppanyaki Live Grills", "Full Bar & Cellar", "Valet Parking", "Outdoor Cabanas", "Free High-Speed Wi-Fi"]
    },
    {
        id: 3,
        name: "Hyatt Pune",
        location: "88 Nagar Road, Kalyani Nagar, Pune, Maharashtra 411006",
        shortLocation: "Kalyani Nagar, Pune",
        cuisine: "Pan-Asian, Continental & North Indian (Eighty Eight & Baan Tao)",
        cuisineTags: ["Pan-Asian", "Continental", "Thai & Chinese", "Garden Dining"],
        rating: 4.7,
        reviewsCount: 1680,
        priceRange: "₹₹₹ (₹2,500 for two)",
        priceLevel: "₹₹₹",
        contact: "+91 20 4141 1234",
        openingHours: "06:30 AM - 11:00 PM",
        description: "An oasis of tranquility in upscale Kalyani Nagar known for its serene water gardens and the critically acclaimed Asian restaurant Baan Tao set beneath tranquil bamboo groves.",
        about: "Hyatt Pune merges resort tranquility with business efficiency. Overlooking scenic water bodies and verdant trees, Eighty Eight offers all-day international dining, while Baan Tao enchants food lovers with sensory Chinese, Thai, and Vietnamese culinary journeys.",
        badgeColor: "emerald",
        heroImage: "https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?auto=format&fit=crop&w=1600&q=80",
        interiorImages: [
            "https://images.unsplash.com/photo-1525610553991-2bede1a236e2?auto=format&fit=crop&w=800&q=80",
            "https://images.unsplash.com/photo-1543007630-9710e4a00a20?auto=format&fit=crop&w=800&q=80",
            "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=800&q=80",
            "https://images.unsplash.com/photo-1537047902294-62a40c20a6ae?auto=format&fit=crop&w=800&q=80"
        ],
        googleMapsUrl: "https://www.google.com/maps/search/?api=1&query=Hyatt+Pune+88+Nagar+Road+Kalyani+Nagar+Pune+Maharashtra+411006",
        features: ["Water Garden Dining", "Alfresco Bamboo Patio", "Sunday Brunch", "Private Dining Pods", "Valet Parking", "Pet Friendly Outdoor Area"]
    },
    {
        id: 4,
        name: "The Westin Pune Koregaon Park",
        location: "36/3-B Koregaon Park Annexe, Mundhwa Road, Ghorpadi, Pune, Maharashtra 411001",
        shortLocation: "Koregaon Park Annexe, Pune",
        cuisine: "Contemporary Indian, Grills & Italian (The Market & Asilo)",
        cuisineTags: ["Italian", "Continental", "Gourmet Grills", "Riverfront"],
        rating: 4.8,
        reviewsCount: 2210,
        priceRange: "₹₹₹₹ (₹3,000 for two)",
        priceLevel: "₹₹₹₹",
        contact: "+91 20 6721 0000",
        openingHours: "07:00 AM - 11:30 PM",
        description: "Set gracefully along the Mula-Mutha river in Koregaon Park, offering farm-to-table culinary theatre at The Market and vibrant rooftop nightlife at Asilo Pune.",
        about: "The Westin Pune Koregaon Park is a premier haven for discerning epicures. Boasting signature wellness cuisine, artisanal cocktails, and live artisanal wood-fired kitchens, guests can savor handcrafted pasta, succulent kebabs, and delicate Asian dim sums overlooking lush green riverbanks.",
        badgeColor: "cyan",
        heroImage: "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=1600&q=80",
        interiorImages: [
            "https://images.unsplash.com/photo-1550966871-3ed3cdb5ed0c?auto=format&fit=crop&w=800&q=80",
            "https://images.unsplash.com/photo-1559339352-11d035aa65de?auto=format&fit=crop&w=800&q=80",
            "https://images.unsplash.com/photo-1514933651103-005eec06c04b?auto=format&fit=crop&w=800&q=80",
            "https://images.unsplash.com/photo-1578474846511-04ba529f0b88?auto=format&fit=crop&w=800&q=80"
        ],
        googleMapsUrl: "https://www.google.com/maps/search/?api=1&query=The+Westin+Pune+Koregaon+Park+36+3+B+Koregaon+Park+Annexe+Mundhwa+Road+Ghorpadi+Pune+Maharashtra+411001",
        features: ["Scenic River View", "Asilo Rooftop Lounge", "Farm-to-Fork Concepts", "Live Music Stage", "Valet Parking", "Signature Desserts"]
    },
    {
        id: 5,
        name: "Spice Garden Pune",
        location: "Baner Road, Near Balewadi High Street, Pune, Maharashtra 411045",
        shortLocation: "Baner Road, Pune",
        cuisine: "North Indian, Mughlai & Tandoor Specialties",
        cuisineTags: ["North Indian", "Mughlai", "Biryani", "Family Dining"],
        rating: 4.6,
        reviewsCount: 1420,
        priceRange: "₹₹ (₹1,400 for two)",
        priceLevel: "₹₹",
        contact: "+91 20 2729 8899",
        openingHours: "10:00 AM - 11:00 PM",
        description: "Pune's celebrated heritage dining garden renowned for slow-cooked Dum Biryanis, rich buttery gravies, and lantern-lit open air courtyard seating.",
        about: "Spice Garden combines authentic regional recipes with a warm, welcoming courtyard ambience. Featuring clay-oven tandoors, clay-pot biryanis, and rich Mughlai curries, it remains the favorite destination for family gatherings and celebrations in Baner.",
        badgeColor: "purple",
        heroImage: "https://images.unsplash.com/photo-1550966871-3ed3cdb5ed0c?auto=format&fit=crop&w=1600&q=80",
        interiorImages: [
            "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=800&q=80",
            "https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=800&q=80",
            "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=800&q=80",
            "https://images.unsplash.com/photo-1525610553991-2bede1a236e2?auto=format&fit=crop&w=800&q=80"
        ],
        googleMapsUrl: "https://www.google.com/maps/search/?api=1&query=Spice+Garden+Baner+Road+Balewadi+Pune+Maharashtra",
        features: ["Courtyard Seating", "Live Tandoor Counters", "Family Party Hall", "Valet Parking", "Mocktail Bar", "Child Friendly"]
    },
    {
        id: 6,
        name: "Malaka Spice",
        location: "Siddharth Chambers, Lane 5, Koregaon Park, Pune, Maharashtra 411001",
        shortLocation: "Lane 5, Koregaon Park, Pune",
        cuisine: "South East Asian, Thai, Vietnamese & Indonesian",
        cuisineTags: ["South East Asian", "Thai", "Vietnamese", "Art Cafe"],
        rating: 4.7,
        reviewsCount: 3120,
        priceRange: "₹₹₹ (₹1,800 for two)",
        priceLevel: "₹₹₹",
        contact: "+91 20 2615 1088",
        openingHours: "11:30 AM - 11:30 PM",
        description: "Iconic open-air art cafe in Koregaon Park loved for vibrant South East Asian flavors, farm-sourced organic ingredients, and original artwork on display.",
        about: "Founded in 1997, Malaka Spice is a culinary institution in Pune. Every recipe has been gathered through extensive travels across Thailand, Malaysia, Vietnam, and Singapore, using organic herbs grown on the owner's farm in Cherish Farm, Pune.",
        badgeColor: "amber",
        heroImage: "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=1600&q=80",
        interiorImages: [
            "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=800&q=80",
            "https://images.unsplash.com/photo-1537047902294-62a40c20a6ae?auto=format&fit=crop&w=800&q=80",
            "https://images.unsplash.com/photo-1552566626-52f8b828add9?auto=format&fit=crop&w=800&q=80",
            "https://images.unsplash.com/photo-1590846406792-0adc7f938f1d?auto=format&fit=crop&w=800&q=80"
        ],
        googleMapsUrl: "https://www.google.com/maps/search/?api=1&query=Malaka+Spice+Lane+5+Koregaon+Park+Pune+Maharashtra+411001",
        features: ["Original Art Gallery", "Organic Farm-to-Table", "Outdoor Garden Patio", "Cocktail Bar", "Valet Parking", "Vegan Options"]
    }
];

// ========================================================
// 2. REALISTIC DINING TABLES ACROSS PUNE HOTELS
// ========================================================
const INITIAL_TABLES = [
    // JW Marriott Hotel Pune (ID: 1)
    { id: 1, restaurantId: 1, tableNumber: "JW-T01", capacity: 2, status: "Available", floorArea: "Window Side" },
    { id: 2, restaurantId: 1, tableNumber: "JW-T02", capacity: 4, status: "Reserved", floorArea: "Main Hall" },
    { id: 3, restaurantId: 1, tableNumber: "JW-T03", capacity: 6, status: "Occupied", floorArea: "Spice Kitchen Lounge" },
    { id: 4, restaurantId: 1, tableNumber: "JW-T04", capacity: 8, status: "Available", floorArea: "Paasha Sky Deck" },
    { id: 5, restaurantId: 1, tableNumber: "JW-T05", capacity: 4, status: "Maintenance", floorArea: "Private Suite A" },
    { id: 6, restaurantId: 1, tableNumber: "JW-T06", capacity: 4, status: "Available", floorArea: "Alto Vino Corner" },

    // Conrad Pune (ID: 2)
    { id: 7, restaurantId: 2, tableNumber: "CP-T01", capacity: 2, status: "Available", floorArea: "Art Deco Patio" },
    { id: 8, restaurantId: 2, tableNumber: "CP-T02", capacity: 4, status: "Reserved", floorArea: "Coriander Live Station" },
    { id: 9, restaurantId: 2, tableNumber: "CP-T03", capacity: 6, status: "Available", floorArea: "Koji Teppanyaki Bar" },
    { id: 10, restaurantId: 2, tableNumber: "CP-T04", capacity: 8, status: "Occupied", floorArea: "Grand Ballroom Alcove" },

    // Hyatt Pune (ID: 3)
    { id: 11, restaurantId: 3, tableNumber: "HP-T01", capacity: 2, status: "Available", floorArea: "Baan Tao Water Garden" },
    { id: 12, restaurantId: 3, tableNumber: "HP-T02", capacity: 4, status: "Reserved", floorArea: "Bamboo Pavilion" },
    { id: 13, restaurantId: 3, tableNumber: "HP-T03", capacity: 4, status: "Available", floorArea: "Eighty Eight Indoor" },
    { id: 14, restaurantId: 3, tableNumber: "HP-T04", capacity: 6, status: "Available", floorArea: "Poolside Verandah" },

    // The Westin Pune (ID: 4)
    { id: 15, restaurantId: 4, tableNumber: "WP-T01", capacity: 2, status: "Available", floorArea: "River View Deck" },
    { id: 16, restaurantId: 4, tableNumber: "WP-T02", capacity: 4, status: "Reserved", floorArea: "The Market Central" },
    { id: 17, restaurantId: 4, tableNumber: "WP-T03", capacity: 8, status: "Available", floorArea: "Asilo Sunset Balcony" },
    { id: 18, restaurantId: 4, tableNumber: "WP-T04", capacity: 4, status: "Occupied", floorArea: "Chef's Table" },

    // Spice Garden Pune (ID: 5)
    { id: 19, restaurantId: 5, tableNumber: "SG-T01", capacity: 4, status: "Available", floorArea: "Courtyard Garden" },
    { id: 20, restaurantId: 5, tableNumber: "SG-T02", capacity: 4, status: "Reserved", floorArea: "Main Hall" },
    { id: 21, restaurantId: 5, tableNumber: "SG-T03", capacity: 2, status: "Occupied", floorArea: "Lantern Corner" },
    { id: 22, restaurantId: 5, tableNumber: "SG-T04", capacity: 6, status: "Available", floorArea: "Family Pavilion" },
    { id: 23, restaurantId: 5, tableNumber: "SG-T05", capacity: 4, status: "Maintenance", floorArea: "Terrace Deck" },
    { id: 24, restaurantId: 5, tableNumber: "SG-T06", capacity: 2, status: "Available", floorArea: "Courtyard Garden" },
    { id: 25, restaurantId: 5, tableNumber: "SG-T07", capacity: 4, status: "Reserved", floorArea: "Main Hall" },
    { id: 26, restaurantId: 5, tableNumber: "SG-T08", capacity: 6, status: "Occupied", floorArea: "Gazebo Bay" },
    { id: 27, restaurantId: 5, tableNumber: "SG-T09", capacity: 4, status: "Available", floorArea: "Fountain Side" },
    { id: 28, restaurantId: 5, tableNumber: "SG-T10", capacity: 8, status: "Available", floorArea: "Royal Suite" },

    // Malaka Spice (ID: 6)
    { id: 29, restaurantId: 6, tableNumber: "MS-T01", capacity: 2, status: "Available", floorArea: "Art Verandah" },
    { id: 30, restaurantId: 6, tableNumber: "MS-T02", capacity: 4, status: "Reserved", floorArea: "Garden Courtyard" },
    { id: 31, restaurantId: 6, tableNumber: "MS-T03", capacity: 6, status: "Available", floorArea: "Open Kitchen Bay" }
];

// ========================================================
// 3. SAMPLE REGISTERED CUSTOMERS
// ========================================================
const INITIAL_CUSTOMERS = [
    {
        id: 1,
        name: "Rahul Sharma",
        email: "rahul.sharma@example.com",
        phone: "+91 98220 12345",
        notes: "Prefers window seating, celebrating wedding anniversary",
        createdAt: "2026-09-10"
    },
    {
        id: 2,
        name: "Anjali Patil",
        email: "anjali.patil@example.com",
        phone: "+91 98901 23456",
        notes: "Vegetarian, prefers quiet corner table",
        createdAt: "2026-09-12"
    },
    {
        id: 3,
        name: "Vikram Kulkarni",
        email: "vikram.k@example.com",
        phone: "+91 97644 34567",
        notes: "High corporate VIP desk, wine pairings requested",
        createdAt: "2026-09-15"
    },
    {
        id: 4,
        name: "Sneha Gupta",
        email: "sneha.gupta@example.com",
        phone: "+91 99230 45678",
        notes: "Requires baby high chair for toddler",
        createdAt: "2026-09-18"
    },
    {
        id: 5,
        name: "Amit More",
        email: "amit.more@example.com",
        phone: "+91 98500 56789",
        notes: "Celebrating birthday with college friends",
        createdAt: "2026-09-20"
    },
    {
        id: 6,
        name: "Pooja Deshmukh",
        email: "pooja.d@example.com",
        phone: "+91 98231 67890",
        notes: "Allergic to shellfish, prefer outdoor patio",
        createdAt: "2026-09-22"
    },
    {
        id: 7,
        name: "Tanmay Joshi",
        email: "tanmay.j@example.com",
        phone: "+91 98812 78901",
        notes: "Regular dinner guest at JW Marriott and Conrad",
        createdAt: "2026-09-25"
    }
];

// Helper to format ISO date strings for today and offsets
const getTodayDateStr = (offsetDays = 0) => {
    const d = new Date();
    d.setDate(d.getDate() + offsetDays);
    return d.toISOString().split('T')[0];
};

// ========================================================
// 4. RESERVATIONS (Matching Dashboard Feed & Statuses)
// ========================================================
const INITIAL_RESERVATIONS = [
    {
        id: 1,
        customerId: 1, // Rahul Sharma
        restaurantId: 5, // Spice Garden
        tableId: 22, // SG-T04
        reservationDate: getTodayDateStr(0),
        reservationTime: "19:00",
        guestCount: 4,
        status: "Reserved", // Displayed as Confirmed in UI
        specialRequests: "Anniversary table with flower petals arrangement",
        createdAt: "2026-09-28T14:15:00"
    },
    {
        id: 2,
        customerId: 2, // Anjali Patil
        restaurantId: 5, // Spice Garden
        tableId: 25, // SG-T07
        reservationDate: getTodayDateStr(0),
        reservationTime: "19:30",
        guestCount: 2,
        status: "Reserved", // Displayed as Upcoming
        specialRequests: "Strictly vegetarian preparations. Corner booth.",
        createdAt: "2026-09-28T15:20:00"
    },
    {
        id: 3,
        customerId: 3, // Vikram Kulkarni
        restaurantId: 1, // JW Marriott
        tableId: 2, // JW-T02
        reservationDate: getTodayDateStr(0),
        reservationTime: "20:00",
        guestCount: 6,
        status: "Reserved",
        specialRequests: "Executive business dinner. Pre-chilled sparkling water.",
        createdAt: "2026-09-27T10:00:00"
    },
    {
        id: 4,
        customerId: 4, // Sneha Gupta
        restaurantId: 5, // Spice Garden
        tableId: 20, // SG-T02
        reservationDate: getTodayDateStr(0),
        reservationTime: "20:30",
        guestCount: 3,
        status: "Reserved",
        specialRequests: "High chair near aisle for easy stroller access.",
        createdAt: "2026-09-28T16:00:00"
    },
    {
        id: 5,
        customerId: 5, // Amit More
        restaurantId: 2, // Conrad Pune
        tableId: 8, // CP-T02
        reservationDate: getTodayDateStr(0),
        reservationTime: "21:00",
        guestCount: 2,
        status: "Reserved",
        specialRequests: "Romantic booth for anniversary toast.",
        createdAt: "2026-09-28T17:10:00"
    },
    {
        id: 6,
        customerId: 6, // Pooja Deshmukh
        restaurantId: 3, // Hyatt Pune
        tableId: 12, // HP-T02
        reservationDate: getTodayDateStr(1),
        reservationTime: "13:30",
        guestCount: 4,
        status: "Reserved",
        specialRequests: "Baan Tao outdoor water garden seating.",
        createdAt: "2026-09-28T11:45:00"
    },
    {
        id: 7,
        customerId: 7, // Tanmay Joshi
        restaurantId: 4, // The Westin
        tableId: 16, // WP-T02
        reservationDate: getTodayDateStr(0),
        reservationTime: "18:45",
        guestCount: 4,
        status: "Occupied",
        specialRequests: "Guests arrived early and seated.",
        createdAt: "2026-09-28T12:00:00"
    }
];

// ========================================================
// 5. MASTER MENU CATALOG (All Requested & Signature Items)
// Categories:
// Starters | Main Course | Indian | Chinese | Continental |
// Biryani | South Indian | Desserts | Beverages
// ========================================================
const INITIAL_MENU_ITEMS = [
    {
        id: 1,
        name: "Paneer Butter Masala",
        category: "Main Course",
        subCategory: "Indian",
        price: 280,
        isVeg: true,
        rating: 4.9,
        reviewsCount: 384,
        isPopular: true,
        shortDesc: "Rich & creamy tomato gravy with velvety cottage cheese cubes and butter glaze.",
        description: "Fresh artisanal malai paneer simmered in a luscious cashew, ripe tomato and butter reduction spiced with aromatic kasuri methi and green cardamom.",
        image: "https://images.unsplash.com/photo-1631452180519-c014fe946bc7?auto=format&fit=crop&w=600&q=80",
        prepTime: "20 mins",
        calories: "380 kcal"
    },
    {
        id: 2,
        name: "Chicken Biryani",
        category: "Biryani",
        subCategory: "Indian",
        price: 320,
        isVeg: false,
        rating: 4.9,
        reviewsCount: 512,
        isPopular: true,
        shortDesc: "Aromatic aged basmati rice dum-cooked with tender chicken and royal spices.",
        description: "Classic royal dum biryani layered with marinated farm-fresh chicken, saffron-infused long grain basmati rice, caramelized onions (birista), and mint leaves served with burani raita.",
        image: "https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?auto=format&fit=crop&w=600&q=80",
        prepTime: "25 mins",
        calories: "540 kcal"
    },
    {
        id: 3,
        name: "Masala Dosa",
        category: "South Indian",
        subCategory: "South Indian",
        price: 160,
        isVeg: true,
        rating: 4.8,
        reviewsCount: 290,
        isPopular: true,
        shortDesc: "Crispy golden crepe with spiced tempered potato mash, chutneys & piping hot sambar.",
        description: "Hand-poured fermented rice and lentil crepe crisped in pure cow ghee, stuffed with mustard-scented potato bhaji, paired with coconut chutney and tomato rasam.",
        image: "https://images.unsplash.com/photo-1668236543090-82eba5ee5976?auto=format&fit=crop&w=600&q=80",
        prepTime: "12 mins",
        calories: "290 kcal"
    },
    {
        id: 4,
        name: "Margherita Pizza",
        category: "Continental",
        subCategory: "Continental",
        price: 350,
        isVeg: true,
        rating: 4.8,
        reviewsCount: 310,
        isPopular: true,
        shortDesc: "Artisanal hand-stretched sourdough crust with San Marzano sauce, fresh mozzarella & basil.",
        description: "Baked at 450°C in an authentic wood-fired oven featuring imported Italian San Marzano tomato puree, buffalo mozzarella fior di latte, and cold-pressed extra virgin olive oil.",
        image: "https://images.unsplash.com/photo-1604382355076-af4b0eb60143?auto=format&fit=crop&w=600&q=80",
        prepTime: "18 mins",
        calories: "460 kcal"
    },
    {
        id: 5,
        name: "Pasta Alfredo",
        category: "Continental",
        subCategory: "Continental",
        price: 290,
        isVeg: true,
        rating: 4.7,
        reviewsCount: 245,
        isPopular: true,
        shortDesc: "Tender fettuccine tossed in a rich, velvety Parmesan garlic cream sauce.",
        description: "Bronze-cut fettuccine cooked al dente, tossed in aged Parmigiano Reggiano, French butter, garlic cream, wild sautéed mushrooms, and fresh garden herbs.",
        image: "https://images.unsplash.com/photo-1645112411341-6c4fd023714a?auto=format&fit=crop&w=600&q=80",
        prepTime: "15 mins",
        calories: "480 kcal"
    },
    {
        id: 6,
        name: "Veg Manchurian",
        category: "Chinese",
        subCategory: "Chinese",
        price: 240,
        isVeg: true,
        rating: 4.6,
        reviewsCount: 198,
        isPopular: true,
        shortDesc: "Crisp vegetable dumplings simmered in dark, garlicky Indo-Chinese soy-chilli gravy.",
        description: "Minced cabbage, carrot, and scallion fritters wok-tossed in pungent ginger, dark soya, toasted sesame oil, and fiery green chillies.",
        image: "https://images.unsplash.com/photo-1585032226651-759b368d7246?auto=format&fit=crop&w=600&q=80",
        prepTime: "15 mins",
        calories: "320 kcal"
    },
    {
        id: 7,
        name: "Dal Tadka",
        category: "Main Course",
        subCategory: "Indian",
        price: 210,
        isVeg: true,
        rating: 4.7,
        reviewsCount: 340,
        isPopular: true,
        shortDesc: "Slow-simmered yellow lentils finished with a smoking ghee, cumin & red chilli tempering.",
        description: "Arhar and moong dal simmered with turmeric and tomatoes, finished dhaba-style with pure desi ghee, browned garlic flakes, hing, and whole Kashmiri chillies.",
        image: "https://images.unsplash.com/photo-1546833999-b9f581a1996d?auto=format&fit=crop&w=600&q=80",
        prepTime: "15 mins",
        calories: "240 kcal"
    },
    {
        id: 8,
        name: "Butter Naan",
        category: "Main Course",
        subCategory: "Indian",
        price: 60,
        isVeg: true,
        rating: 4.9,
        reviewsCount: 620,
        isPopular: false,
        shortDesc: "Pillowy clay-oven tandoori flatbread brushed generously with churned butter.",
        description: "Traditional refined flour flatbread slapped onto hot tandoor walls, baked till blistered and golden, then glazed with salted butter.",
        image: "https://images.unsplash.com/photo-1601050690597-df0568f70950?auto=format&fit=crop&w=600&q=80",
        prepTime: "8 mins",
        calories: "160 kcal"
    },
    {
        id: 9,
        name: "Gulab Jamun",
        category: "Desserts",
        subCategory: "Desserts",
        price: 120,
        isVeg: true,
        rating: 4.9,
        reviewsCount: 480,
        isPopular: true,
        shortDesc: "Warm, melt-in-mouth milk solids dumplings soaked in rose and saffron syrup.",
        description: "Handcrafted khoya dumplings fried gently to deep mahogany perfection, soaked in warm rosewater and saffron nectar, garnished with slivered pistachios.",
        image: "https://images.unsplash.com/photo-1601050690117-94f5f6fa8bd7?auto=format&fit=crop&w=600&q=80",
        prepTime: "5 mins",
        calories: "280 kcal"
    },
    {
        id: 10,
        name: "Fresh Lime Soda",
        category: "Beverages",
        subCategory: "Beverages",
        price: 90,
        isVeg: true,
        rating: 4.8,
        reviewsCount: 390,
        isPopular: true,
        shortDesc: "Sparkling effervescent cooler made with fresh lime juice, mint & rock salt.",
        description: "Freshly squeezed Kagzi lime juice stirred with crushed ice, fresh garden mint, chilled sparkling soda, and your choice of sweet, salted, or mixed seasoning.",
        image: "https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?auto=format&fit=crop&w=600&q=80",
        prepTime: "5 mins",
        calories: "85 kcal"
    },
    {
        id: 11,
        name: "Paneer Tikka Sunhari",
        category: "Starters",
        subCategory: "Indian",
        price: 290,
        isVeg: true,
        rating: 4.8,
        reviewsCount: 220,
        isPopular: true,
        shortDesc: "Charcoal grilled cottage cheese skewers marinated in mustard oil & crushed tandoori spices.",
        description: "Chunk cottage cheese steeped in Greek yogurt, Kashmiri deghi mirch, carom seeds (ajwain), and mustard oil, skewered with bell peppers and roasted over red-hot coals.",
        image: "https://images.unsplash.com/photo-1599488615731-7e5c2823ff28?auto=format&fit=crop&w=600&q=80",
        prepTime: "18 mins",
        calories: "340 kcal"
    },
    {
        id: 12,
        name: "Tandoori Murgh",
        category: "Starters",
        subCategory: "Indian",
        price: 360,
        isVeg: false,
        rating: 4.9,
        reviewsCount: 310,
        isPopular: true,
        shortDesc: "Whole succulent chicken legs roasted in clay tandoor with aromatic spice rub.",
        description: "Tender chicken marinated overnight in spiced curd, ginger-garlic paste, and crushed garam masala, grilled over charcoal and served with mint-coriander chutney.",
        image: "https://images.unsplash.com/photo-1626777552726-4a6b54c97e46?auto=format&fit=crop&w=600&q=80",
        prepTime: "22 mins",
        calories: "420 kcal"
    },
    {
        id: 13,
        name: "Mutton Dum Biryani",
        category: "Biryani",
        subCategory: "Indian",
        price: 420,
        isVeg: false,
        rating: 4.9,
        reviewsCount: 420,
        isPopular: false,
        shortDesc: "Tender pot-roasted baby goat pieces layered with aged saffron basmati rice.",
        description: "Traditional Lucknowi style gosht dum biryani sealed with dough and slow cooked for 4 hours to let meat juices permeate every single grain of rice.",
        image: "https://images.unsplash.com/photo-1589302168068-964664d93dc0?auto=format&fit=crop&w=600&q=80",
        prepTime: "25 mins",
        calories: "620 kcal"
    },
    {
        id: 14,
        name: "Chilli Paneer Dry",
        category: "Chinese",
        subCategory: "Chinese",
        price: 260,
        isVeg: true,
        rating: 4.7,
        reviewsCount: 180,
        isPopular: false,
        shortDesc: "Crisp cottage cheese tossed with bell peppers, green chillies & dark soy sauce.",
        description: "Battered paneer crisped in smoking wok with spring onions, julienned capsicum, garlic slivers, and fiery Szechuan chilli paste.",
        image: "https://images.unsplash.com/photo-1563379926898-05f4575a45d8?auto=format&fit=crop&w=600&q=80",
        prepTime: "15 mins",
        calories: "350 kcal"
    },
    {
        id: 15,
        name: "Medu Vada Sambar",
        category: "South Indian",
        subCategory: "South Indian",
        price: 140,
        isVeg: true,
        rating: 4.6,
        reviewsCount: 160,
        isPopular: false,
        shortDesc: "Crisp golden black gram fritters dunked in spiced shallot sambar.",
        description: "Classic Udupi style donut-shaped lentil fritters crunchy on the outside and airy inside, served with fresh coconut chutney and hot lentil vegetable sambar.",
        image: "https://images.unsplash.com/photo-1589301760014-d929f3979dbc?auto=format&fit=crop&w=600&q=80",
        prepTime: "10 mins",
        calories: "260 kcal"
    },
    {
        id: 16,
        name: "Chocolate Lava Cake",
        category: "Desserts",
        subCategory: "Continental",
        price: 180,
        isVeg: true,
        rating: 4.9,
        reviewsCount: 390,
        isPopular: false,
        shortDesc: "Warm decadent Belgian chocolate sponge with a molten flowing ganache center.",
        description: "Freshly baked 70% dark Belgian cocoa fondant with an oozing liquid core, served with vanilla bean ice cream and fresh mint leaf.",
        image: "https://images.unsplash.com/photo-1606313564200-e75d5e30476c?auto=format&fit=crop&w=600&q=80",
        prepTime: "12 mins",
        calories: "410 kcal"
    },
    {
        id: 17,
        name: "Mango Lassi",
        category: "Beverages",
        subCategory: "Indian",
        price: 110,
        isVeg: true,
        rating: 4.8,
        reviewsCount: 340,
        isPopular: false,
        shortDesc: "Thick chilled yogurt beverage churned with Ratnagiri Alphonso mango pulp.",
        description: "Creamy whole milk yogurt blended with premium Alphonso mango pulp, green cardamom, and a touch of saffron, garnished with crushed almonds.",
        image: "https://images.unsplash.com/photo-1546173159-315724a31696?auto=format&fit=crop&w=600&q=80",
        prepTime: "5 mins",
        calories: "190 kcal"
    },
    {
        id: 18,
        name: "South Indian Filter Coffee",
        category: "Beverages",
        subCategory: "South Indian",
        price: 80,
        isVeg: true,
        rating: 4.9,
        reviewsCount: 420,
        isPopular: false,
        shortDesc: "Traditional decoction coffee frothed with boiling whole milk in brass davarah.",
        description: "Coorg Arabica and Robusta dark roast grounds brewed in traditional stainless steel drip filters, poured vigorously between brass tumbler and davarah for frothy bliss.",
        image: "https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?auto=format&fit=crop&w=600&q=80",
        prepTime: "5 mins",
        calories: "90 kcal"
    }
];
