# Hirfa Platform — Full-Stack Technical Architecture & Showcase

**Hirfa Platform** is an course management and ticketing platform tailored for instructors to design, manage, and  educational workshops. 

The project demonstrates high-throughput RESTful API engineering, robust security integrations (Keycloak / OAuth2 / JWT), local payment gateway processing (Chargily Pay V2), dynamic QR code generation, and transactional database management with Spring Boot 3 and PostgreSQL.

---

##  Key Engineering Highlights & Recruiter Summary

* **Spring Boot 3 & Clean Architecture:** Implemented Controllers, Services, DTOs, Custom Mappers, and Repositories.
* **OAuth2 / OIDC Security & Keycloak:** Built role-based access control utilizing JWT tokens issued by Keycloak.
* **Local Payment Gateway Integration:** Built asynchronous payment processing using **Chargily Pay V2** (EDAHABIA & CIB cards).
* **Dynamic QR Code Engine:** Integrated ZXing library to generate real-time, encrypted QR code tickets for pass verification at event check-ins.
* **Frontend Architecture:** Built with React 18, TypeScript, Tailwind CSS, and TanStack Query (React Query) for optimistic updates and caching.

---

## Tech Stack & Technical Skills

| Layer | Technologies & Tools |
| :--- | :--- |
| **Backend Core** | Java 17, Spring Boot 3, Spring Web, Lombok |
| **Persistence & Database** | Spring Data JPA, Hibernate, PostgreSQL, Liquibase / Flyway |
| **Security & Auth** | Spring Security, OAuth2 Resource Server, Keycloak, JWT |
| **Payment Integration** | Chargily Pay V2 API, Webhooks |
| **Ticket Engine** | ZXing (Zebra Crossing) QR Code Generator |
| **Frontend Platform** | React 18, TypeScript, Vite, TanStack Query, Tailwind CSS |
| **Build & Testing** | Maven, JUnit 5, Mockito, Axios Interceptors |

---

## Platform Visual Showcase

### 1. Organiser Portal & Dynamic Event Builder
*Organizers configure event parameters, set scheduling windows, and define custom ticket tiers.*

![Create Event Interface](hirfa-frontend\public\demo.png)

### 2. Local Payment Processing (Chargily Pay Integration)
*Seamless checkout flow handling local payment methods (EDAHABIA / CIB) with webhook verification.*

![Chargily Payment Gateway](hirfa-frontend\public\chargily-payment.jpg)

---

## 🔌 API Endpoints Reference

| Method | Endpoint | Auth Level | Purpose |
| :--- | :--- | :--- | :--- |
| `GET` | `/api/v1/published-events` | Public | Fetch catalog listing for attendees |
| `POST` | `/api/v1/events` | `ORGANISER` | Create event with nested pass tiers |
| `GET` | `/api/v1/events` | `ORGANISER` | Fetch events managed by authenticated user |
| `PUT` | `/api/v1/events/{id}` | `ORGANISER` | Update event parameters and inventory |
| `POST` | `/api/v1/payments/checkout` | `ATTENDEE` | Initialize Chargily payment session |
| `POST` | `/api/v1/webhooks/chargily` | Public / Webhook | Process asynchronous payment notifications |
| `POST` | `/api/v1/tickets/scan` | `STAFF` | Validate ticket QR codes at event entry |

---

## Quick Start & Installation

### Backend Setup
```bash
# Clone the repository
git clone [https://github.com/your-username/hirfa-platform.git](https://github.com/your-username/hirfa-platform.git)
cd hirfa-platform/backend

# Configure your application.yml database & Keycloak credentials
mvn clean install
mvn spring-boot:run