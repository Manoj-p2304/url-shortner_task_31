# URL Shortener API

![License](https://img.shields.io/badge/License-MIT-blue.svg)  
![Version](https://img.shields.io/badge/Version-1.0.0-green.svg)  

A scalable URL Shortener API with **Google OAuth authentication**, **custom aliases**, and **comprehensive analytics**.

---

## Table of Contents
1. [Overview](#overview)
2. [Features](#features)
3. [Getting Started](#getting-started)
4. [API Endpoints](#api-endpoints)
5. [Authentication](#authentication)
6. [Schemas](#schemas)
7. [Contributing](#contributing)
8. [License](#license)

---

## Overview
The URL Shortener API allows users to shorten URLs, create custom aliases, and track analytics on their links. Authentication is handled using Google OAuth, ensuring secure access for users. 

---

## Features
- **Google OAuth Authentication**
- Shorten URLs with optional custom aliases
- Track analytics, including:
  - Total and unique clicks
  - Clicks by date
  - Device and OS breakdowns
- Filter analytics by topics
- Comprehensive API documentation with Swagger/OpenAPI

---

## Getting Started

### Prerequisites
- Node.js (v14+)
- MongoDB

### Installation
1. Clone the repository:
   ```bash
   git clone https://github.com/your-repo/url-shortener-api.git
   cd url-shortener-api
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Set up environment variables in a `.env` file:
   ```env
   GOOGLE_CLIENT_ID=<your-google-client-id>
   GOOGLE_CLIENT_SECRET=<your-google-client-secret>
   MONGO_URI=<your-mongodb-uri>
   SESSION_SECRET=<your-session-secret>
   ```
4. Start the development server:
   ```bash
   npm run dev
   ```

### Running Tests
Run the test suite using:
```bash
npm test
```

---

## API Endpoints

### Authentication
#### `GET /auth/google`
- **Description:** Initiates Google OAuth2 authentication
- **Response:** Redirects to the Google consent screen

#### `GET /auth/google/callback`
- **Description:** Handles the response from Google after user authorization
- **Response:** Redirects to the dashboard on success

#### `GET /auth/logout`
- **Description:** Logs out the user
- **Response:** `{ "message": "Successfully logged out!" }`

---

### URL Management
#### `POST /api/shorten`
- **Description:** Create a shortened URL
- **Request Body:**
  ```json
  {
    "longUrl": "https://www.example.com/very/long/url",
    "customAlias": "my-custom-link",
    "topic": "technology"
  }
  ```
- **Response:**
  ```json
  {
    "shortUrl": "abc123",
    "createdAt": "2025-01-28T10:00:00Z"
  }
  ```

#### `GET /api/shorten/{alias}`
- **Description:** Redirects to the original URL
- **Parameters:**
  - `alias`: Shortened alias (e.g., `abc123`)

---

### Analytics
#### `GET /api/analytics/overall`
- **Description:** Get analytics for all user's URLs
- **Response:**
  ```json
  {
    "totalUrls": 10,
    "totalClicks": 150,
    "uniqueUsers": 75
  }
  ```

#### `GET /api/analytics/{alias}`
- **Description:** Get analytics for a specific shortened URL
- **Parameters:**
  - `alias`: Shortened alias
- **Response:**
  ```json
  {
    "totalClicks": 50,
    "uniqueUsers": 30,
    "clicksByDate": [
      { "date": "2025-01-27", "clickCount": 25 }
    ],
    "osType": [
      { "osName": "Windows", "uniqueClicks": 15 }
    ]
  }
  ```

#### `GET /api/analytics/topic/{topic}`
- **Description:** Get analytics for all URLs in a specific topic
- **Parameters:**
  - `topic`: Topic name (e.g., `technology`)

---

## Schemas

### ShortUrl
```yaml
longUrl: string
shortUrl: string
customAlias: string
topic: string
userId: string
createdAt: date-time
```

### User
```yaml
email: string
name: string
googleId: string
```

### Analytics
```yaml
totalClicks: integer
uniqueUsers: integer
clicksByDate:
  - date: string
    clickCount: integer
osType:
  - osName: string
    uniqueClicks: integer
deviceType:
  - deviceName: string
    uniqueClicks: integer
```

---

## Contributing
1. Fork the repository.
2. Create a new branch:
   ```bash
   git checkout -b feature-name
   ```
3. Commit your changes:
   ```bash
   git commit -m "Added new feature"
   ```
4. Push to the branch:
   ```bash
   git push origin feature-name
   ```
5. Create a Pull Request.

---

## License
This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.