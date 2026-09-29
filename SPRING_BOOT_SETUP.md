# TableEase – Spring Boot, JdbcTemplate & MySQL Backend Blueprint

This guide contains everything you need to connect **TableEase** to your upcoming **Spring Boot REST API** backend using **JdbcTemplate** and **MySQL**.

---

## 1. 🗄️ MySQL Database Schema

Create your database in MySQL Workbench or MySQL CLI:

```sql
CREATE DATABASE IF NOT EXISTS tableease_db;
USE tableease_db;

-- 1. Customers Table
CREATE TABLE IF NOT EXISTS customers (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(120) NOT NULL UNIQUE,
    phone VARCHAR(25) NOT NULL,
    notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 2. Restaurants Table
CREATE TABLE IF NOT EXISTS restaurants (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(120) NOT NULL,
    location VARCHAR(200) NOT NULL,
    cuisine VARCHAR(80) NOT NULL,
    rating DECIMAL(2,1) DEFAULT 4.5,
    contact VARCHAR(30),
    opening_hours VARCHAR(60),
    description TEXT
);

-- 3. Restaurant Tables Table
CREATE TABLE IF NOT EXISTS restaurant_tables (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    restaurant_id BIGINT NOT NULL,
    table_number VARCHAR(20) NOT NULL,
    capacity INT NOT NULL,
    status ENUM('Available', 'Reserved', 'Occupied', 'Maintenance') DEFAULT 'Available',
    floor_area VARCHAR(50),
    FOREIGN KEY (restaurant_id) REFERENCES restaurants(id) ON DELETE CASCADE
);

-- 4. Reservations Table
CREATE TABLE IF NOT EXISTS reservations (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    customer_id BIGINT NOT NULL,
    restaurant_id BIGINT NOT NULL,
    table_id BIGINT NOT NULL,
    reservation_date DATE NOT NULL,
    reservation_time TIME NOT NULL,
    guest_count INT NOT NULL,
    status ENUM('Reserved', 'Occupied', 'Completed', 'Cancelled') DEFAULT 'Reserved',
    special_requests TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (customer_id) REFERENCES customers(id) ON DELETE CASCADE,
    FOREIGN KEY (restaurant_id) REFERENCES restaurants(id) ON DELETE CASCADE,
    FOREIGN KEY (table_id) REFERENCES restaurant_tables(id) ON DELETE CASCADE
);

-- 5. Menu Items Table
CREATE TABLE IF NOT EXISTS menu_items (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    restaurant_id BIGINT,
    name VARCHAR(120) NOT NULL,
    category VARCHAR(50) NOT NULL,
    price DECIMAL(8,2) NOT NULL,
    is_veg BOOLEAN DEFAULT TRUE,
    rating DECIMAL(2,1) DEFAULT 4.8,
    short_desc VARCHAR(255),
    image_url VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (restaurant_id) REFERENCES restaurants(id) ON DELETE SET NULL
);

```

---

## 2. ☕ Maven `pom.xml` Dependencies

```xml
<dependencies>
    <!-- Spring Web for REST APIs -->
    <dependency>
        <groupId>org.springframework.boot</groupId>
        <artifactId>spring-boot-starter-web</artifactId>
    </dependency>

    <!-- Spring JDBC for JdbcTemplate -->
    <dependency>
        <groupId>org.springframework.boot</groupId>
        <artifactId>spring-boot-starter-jdbc</artifactId>
    </dependency>

    <!-- MySQL Driver -->
    <dependency>
        <groupId>com.mysql</groupId>
        <artifactId>mysql-connector-j</artifactId>
        <scope>runtime</scope>
    </dependency>

    <!-- Swagger / OpenAPI for Live Documentation -->
    <dependency>
        <groupId>org.springdoc</groupId>
        <artifactId>springdoc-openapi-starter-webmvc-ui</artifactId>
        <version>2.5.0</version>
    </dependency>
</dependencies>
```

---

## 3. ⚙️ `application.properties`

```properties
server.port=8080

spring.datasource.url=jdbc:mysql://localhost:3306/tableease_db?useSSL=false&serverTimezone=UTC
spring.datasource.username=root
spring.datasource.password=root_password
spring.datasource.driver-class-name=com.mysql.cj.jdbc.Driver

# Swagger UI Path
springdoc.swagger-ui.path=/swagger-ui.html
```

---

## 4. 🧩 Package Architecture

```
com.tableease
├── TableEaseApplication.java
├── config
│   └── CorsConfig.java           # Allows frontend requests from port 3000 / file origin
├── controller
│   ├── CustomerController.java
│   ├── RestaurantController.java
│   ├── TableController.java
│   └── ReservationController.java
├── service
│   ├── CustomerService.java
│   ├── RestaurantService.java
│   ├── TableService.java
│   └── ReservationService.java
├── dao
│   ├── CustomerDao.java
│   ├── CustomerDaoImpl.java      # Uses JdbcTemplate
│   ├── ReservationDao.java
│   └── ReservationDaoImpl.java
└── model
    ├── Customer.java
    ├── Restaurant.java
    ├── RestaurantTable.java
    └── Reservation.java
```

---

## 5. 🌐 Enabling CORS in Spring Boot

To allow the frontend to talk to the Spring Boot REST API without CORS errors:

```java
package com.tableease.config;

import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@Configuration
public class CorsConfig implements WebMvcConfigurer {
    @Override
    public void addCorsMappings(CorsRegistry registry) {
        registry.addMapping("/api/**")
                .allowedOrigins("*")
                .allowedMethods("GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS");
    }
}
```

---

## 6. 🔌 Connecting Frontend to Spring Boot

Once your Spring Boot app is running on port 8080:
1. Open [`js/api.js`](file:///c:/Users/vijay/OneDrive/Desktop/restaurant/js/api.js).
2. Change:
   ```javascript
   const USE_SPRING_BOOT_API = false;
   ```
   to:
   ```javascript
   const USE_SPRING_BOOT_API = true;
   ```
3. Refresh the web app. TableEase will now make real network requests to:
   - `http://localhost:8080/api/customers`
   - `http://localhost:8080/api/restaurants`
   - `http://localhost:8080/api/tables`
   - `http://localhost:8080/api/reservations`

---

## 7. 🎯 Viva Defense Questions & Answers

| Question | Recommended Answer |
| :--- | :--- |
| **Why use JdbcTemplate instead of Hibernate/JPA?** | `JdbcTemplate` removes tedious boilerplate code (connection opening/closing, SQL exceptions, statement preparation) while maintaining full transparency and direct SQL query optimization, which is ideal for high-throughput reservation queries. |
| **How does TableEase prevent double bookings?** | When booking a reservation, the system queries tables belonging to the selected restaurant that match the required guest capacity and whose current status is `Available`. Upon booking, the table's state is atomically updated to `Reserved`. |
| **What HTTP status codes are used in the REST API?** | `200 OK` for successful fetches and updates, `201 Created` for newly created reservations/customers, `204 No Content` for deletions, and `400 Bad Request` or `404 Not Found` for invalid inputs or missing entities. |
| **How does the multi-tier architecture benefit the project?** | Separation of Concerns: The presentation layer (HTML/CSS/JS) focuses purely on UX; `@RestController` exposes JSON endpoints; the Service layer handles business validations; and the DAO layer abstracts MySQL queries. |
