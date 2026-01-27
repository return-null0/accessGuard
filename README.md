# AccessGuard: Enterprise RBAC & Media Dashboard

AccessGuard is a robust Role-Based Access Control (RBAC) administration dashboard built to demonstrate secure enterprise patterns. It features granular permission management, JWT authentication, and a high-performance media delivery system.

![Stack](https://img.shields.io/badge/stack-Angular%20%7C%20Spring%20Boot%20%7C%20PostgreSQL-green)


## Features

* **Granular RBAC:** Distinct roles (`Admin`, `Editor`, `Viewer`) with specific permission bits (e.g., `can_delete_users`, `can_view_private_media`).
* **Secure Media Management:** Upload, stream, and manage video assets with ownership tracking.
* **JWT Authentication:** Stateless security with HTTP Interceptors for automatic token handling.
* **Reactive UI:** Angular Signals and RxJS for real-time data handling.
* **Dockerized:** Full stack (Frontend, Backend, Database) spins up with a single command.

## Tech Stack

* **Frontend:** Angular 17+ (Signals, Standalone Components), TailwindCSS
* **Backend:** Spring Boot 3.2, Spring Security, Hibernate/JPA
* **Database:** PostgreSQL 15 (Containerized)
* **Infrastructure:** Docker Compose

## Quick Start

**Prerequisites:** Docker & Docker Compose.

1.  **Clone the repository**
    ```bash
    git clone [ ]( )
    cd accessguard
    ```

2.  **Start the application**
    ```bash
    docker-compose up --build
    ```

3.  **Access the Dashboard**
    * Frontend: `http://localhost:4200`


## Default Credentials

The database is pre-seeded with the following accounts to demonstrate RBAC capabilities:

| Role | Email | Password | Permissions |
| :--- | :--- | :--- | :--- |
| **Admin** | `admin@email.com` | `password` | Full System Access, User Management, Delete Any Media |
| **Editor** | `renaldo.dev@email.com` | `password` | Upload Media, View Public Assets, No Delete Rights |

## Demo Assets

The system is pre-configured with the following high-quality media assets to demonstrate streaming performance and metadata parsing. These are from Google's commondatastorage subdomain, specifically for developer testing. 

From `docker-compose.yml`
```
    volumes:
    - ./init-scripts:/docker-entrypoint-initdb.d
    - ~/Desktop/aguploads:/var/www/cdn
```

* [Tears of Steel (1080p)](https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/TearsOfSteel.mp4)

* [Big Buck Bunny (720p)](https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4)
