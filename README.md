# TableEase – Luxury Pune Restaurant & Hotel Reservation Suite

A professional, responsive, and portfolio-ready restaurant and luxury hotel table reservation web application. Designed to look like modern industry platforms (Zomato / OpenTable meets enterprise hospitality SaaS) while remaining clean, robust, and simple to present for college mini projects and academic vivas.

---

## 🌟 Key Highlights & New Upgrades

### 1. 🏨 Hotels & Restaurants Discovery Hub
- **Pune Luxury Dining Collection**: Real sample entries featuring verified Pune addresses:
  1. **JW Marriott Hotel Pune** – *Senapati Bapat Road, Pune, Maharashtra 411053*
  2. **Conrad Pune** – *7 Mangaldas Road, Pune, Maharashtra 411001*
  3. **Hyatt Pune** – *88 Nagar Road, Kalyani Nagar, Pune, Maharashtra 411006*
  4. **The Westin Pune Koregaon Park** – *36/3-B Koregaon Park Annexe, Mundhwa Road, Ghorpadi, Pune, Maharashtra 411001*
  5. **Spice Garden Pune** – *Baner Road, Near Balewadi High Street, Pune, Maharashtra 411045*
  6. **Malaka Spice** – *Siddharth Chambers, Lane 5, Koregaon Park, Pune, Maharashtra 411001*
- **Rich Hotel Cards**:
  - High-resolution imagery of hotel exteriors and fine dining halls
  - Verified Pune address with location pin
  - Multi-cuisine tags & price range indicators (₹₹ to ₹₹₹₹)
  - Rating badge with star & review count
  - Opening hours & table count
  - 3 Action buttons: **"View Details"**, **"Book a Table"**, and **"View on Google Maps"**
- **Dynamic Search & Multi-Filters**:
  - Filter by Pune area (*Senapati Bapat Road*, *Koregaon Park*, *Kalyani Nagar*, *Baner*)
  - Filter by Cuisine (*North Indian*, *Pan-Asian*, *Italian*, *Mughlai*, *South East Asian*)
  - Filter by Rating (*4.8+*, *4.6+*, *4.5+*)
  - Filter by Price (*₹₹*, *₹₹₹*, *₹₹₹₹*)

### 2. 🏛️ Hotel Detail Page
- **Hero Section**:
  - Large professional hero background photo with dark transparent overlay
  - Hotel name, verified address, rating badge, cuisine, price, and opening hours
  - Primary CTA buttons: **"Reserve a Table"** and **"Open in Google Maps"**
- **About the Venue**: Curated overview with amenities badges (*Valet Parking*, *Rooftop Sky Bar*, *Private Dining*, *Live Music*, *Sommelier*, etc.).
- **Available Tables on Floor**: Live cards showing table number, seating capacity, floor area zone, and 1-click booking.
- **Popular & Signature Menu**: Highlighting chef's recommended dishes with food photos and prices.
- **Ambiance Photo Gallery**: 4-photo curated gallery displaying exterior, dining spaces, and mood lighting.
- **Location & Google Maps Integration**:
  - Embedded interactive map preview (free, no paid Google Maps API required)
  - Direct Google Maps search link button for 1-click external navigation.

### 3. 🍱 Master Menu Catalog & Category Tabs
- **9 Realistic Categories**:
  * Starters
  * Main Course
  * Indian
  * Chinese
  * Continental
  * Biryani
  * South Indian
  * Desserts
  * Beverages
- **Rich Dish Cards**:
  - Professional food photography
  - Dish name and mouth-watering short description
  - Price (e.g. ₹280)
  - Dietary Badges: 🟢 Vegetarian or 🔺 Non-Vegetarian
  - Rating & preparation time
  - **[ Add + ]** Action button linked to Table Order Tray
- **Order Tray Modal**: Floating counter in header, item quantity increment/decrement, subtotal calculation, and "Send Order to Kitchen" action.

### 4. 📊 Executive Dashboard (Matches SaaS Reference Mockup)
- **Welcome Hero Banner**:
  - Nighttime restaurant interior background with dark overlay
  - Restaurant switcher dropdown (e.g. *Spice Garden*, *JW Marriott*)
  - Live status indicator: `● Open Now (10:00 AM - 11:00 PM)`
  - Atmospheric quote: *“Good food brings people together.” — TableEase*
- **5 Trend Stat Cards**:
  1. **Total Customers** (124 registered guests, +12% this month)
  2. **Total Restaurants** (6 verified Pune properties)
  3. **Total Tables** (31 dining tables across venues)
  4. **Today's Reservations** (7 bookings today with status breakdown)
  5. **Menu Items** (18 items across 9 categories)
- **Today's Reservations Feed**: Customer initials avatar, table number tag, formatted time, party size, status badge (*Confirmed*, *Upcoming*, *Seated*), and action buttons.
- **Interactive Table Layout (Floor Plan Visualizer)**:
  - Realistic floor layout with table tiles (`T-01` to `T-10`)
  - Color-coded legend: Available (Green), Reserved (Red), Occupied (Amber), Maintenance (Slate)
  - Clicking an available table launches the booking wizard pre-selected to that table!
- **Featured Restaurant Showcase**: Spotlight card with photo, address, tags, and 1-click view.
- **Popular Menu Carousel**: Category tabs with horizontal cards and instant **[ Add + ]** buttons.

### 5. 👥 Preserved Core Management Features
- **Customer Management**: Full CRUD, search by name/email/phone, dietary preferences, notes.
- **Restaurant Management**: Add/edit/delete branch details, cuisine filters, contact information.
- **Table Management**: Table identifier, seating capacity (1-30 guests), floor zone, status toggle.
- **Reservation Wizard**: Dynamic table filtering (ensures table belongs to chosen restaurant and fits guest count), reservation hold status, and printable **TableEase Reservation Pass / Ticket**.

### 6. 🎓 Academic & Viva Defense Tab
- System architecture diagram (`Frontend` ➔ `Spring Boot REST API` ➔ `Service` ➔ `JdbcTemplate DAO` ➔ `MySQL`).
- Complete MySQL DDL schema including `customers`, `restaurants`, `restaurant_tables`, `reservations`, and `menu_items`.
- Spring Boot `@RestController` & `JdbcTemplate` DAO code snippet.
- Viva examination cheat-sheet with frequently asked faculty questions and answers.

---

## 🎨 Visual Design Aesthetics
- **Sidebar**: Dark charcoal navy (`#0f141f`), burgundy active pill highlight (`#8b1e2f`), TableEase logo with red chef hat icon, and bottom restaurant banner.
- **Content Area**: Clean warm slate backdrop (`#f4f6fa`), crisp white card surfaces (`#ffffff`), subtle borders (`#e8ecf2`), and soft elevation shadows.
- **Color Accents**:
  - Primary: Deep Burgundy / Ruby (`#8b1e2f`)
  - Secondary: Warm Royal Gold (`#d97706`)
  - Semantic Status: Emerald (`#10b981`), Ruby (`#e11d48`), Amber (`#d97706`)
- **Typography**: Google Fonts *Outfit* (headings) + *Plus Jakarta Sans* (body) + *JetBrains Mono* (codes/tags).
- **Responsive Layout**: Works seamlessly across mobile devices, tablets, and desktop displays.

---

## 💻 Architecture for College Project

```
Browser UI (HTML5 / Vanilla CSS3 / JavaScript ES6)
                      ↓ (JSON over HTTP)
Spring Boot 3.x REST API (@RestController)
                      ↓
Service Layer (Availability & Overbooking Checks)
                      ↓
DAO Layer (Spring JdbcTemplate)
                      ↓
MySQL 8.0 Database (tableease_db)
```

> **Note**: The frontend includes a simulated latency data store in `js/api.js`. When ready to connect to a live Spring Boot server running on `localhost:8080`, simply set `USE_SPRING_BOOT_API = true` in `js/api.js`.

---

## 🚀 How to Run Locally

### Option 1: Direct File Opening
Double-click or open `index.html` in Google Chrome, Microsoft Edge, Brave, or Firefox.

### Option 2: Local HTTP Server (Recommended)
From this project directory:
```bash
# Python
python -m http.server 8000

# OR Node.js
npx serve .
```
Then visit: `http://localhost:8000`

---

## 📁 Project Structure

```
restaurant/
├── css/
│   └── styles.css          # Burgundy & Gold luxury SaaS design system
├── js/
│   ├── mockData.js         # Real Pune hotels, menu catalog, tables, reservations
│   ├── api.js              # Data access layer, Order Tray manager, migration
│   └── app.js              # Application controller, view router, modals & search
├── index.html              # Main application shell with all views and modals
├── SPRING_BOOT_SETUP.md    # Complete Spring Boot backend guide for mini project
└── README.md               # Project documentation
```
