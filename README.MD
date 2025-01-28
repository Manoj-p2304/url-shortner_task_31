# URL Shortener API

![License](https://img.shields.io/badge/License-MIT-blue.svg)  
![Version](https://img.shields.io/badge/Version-1.0.0-green.svg) 

A robust URL shortening service with Google OAuth authentication and comprehensive analytics tracking. This API allows users to create shortened URLs, track their usage, and analyze engagement patterns across different devices and operating systems.

## 📚 API Documentation

Interactive API documentation is available through Swagger UI:
```http
GET /api-docs
```
Visit this endpoint in your browser to:
- Explore all available endpoints
- Test API calls directly from the browser
- View request/response schemas
- Understand authentication requirements
- Download OpenAPI specification

## 🚀 Features

- **URL Shortening**: Create shortened URLs with optional custom aliases
- **Google OAuth Authentication**: Secure user authentication and management
- **Topic Organization**: Categorize URLs by topics for better organization
- **Comprehensive Analytics**: Track clicks, unique users, and usage patterns
- **Device & OS Tracking**: Monitor access across different platforms
- **Custom Alias Support**: Create memorable, custom short URLs
- **Dashboard**: User-specific dashboard for managing shortened URLs
- **Interactive API Docs**: Swagger UI for testing and exploration

## 📋 Technical Stack

- **API Version**: 1.0.0
- **Authentication**: Google OAuth 2.0
- **Session Management**: Cookie-based (`connect.sid`)
- **Response Format**: JSON
- **Documentation**: OpenAPI 3.0.0 / Swagger UI

## 🔐 Authentication

The API uses Google OAuth 2.0 for authentication. Users must authenticate through Google before accessing protected endpoints.

### Authentication Endpoints

| Endpoint | Method | Description |
|----------|---------|-------------|
| `/auth/google` | GET | Initiates Google OAuth flow |
| `/auth/google/callback` | GET | Handles OAuth callback |
| `/auth/logout` | GET | Logs out current user |

## 🛠 API Endpoints

### URL Management

#### Create Shortened URL
```http
POST /api/shorten
```
**Request Body**:
```json
{
  "longUrl": "https://www.example.com/very/long/url",
  "customAlias": "my-custom-link",  // optional
  "topic": "technology"             
}
```
**Response** (201 Created):
```json
{
  "shortUrl": "abc123",
  "createdAt": "2025-01-28T12:00:00Z"
}
```

#### Access Shortened URL
```http
GET /api/shorten/{alias}
```
- Redirects to original URL (302)
- Tracks analytics automatically

### Analytics

#### Overall Analytics
```http
GET /api/analytics/overall
```
Returns comprehensive statistics including:
- Total URLs and clicks
- Unique visitors
- Daily click distribution
- Device and OS breakdown

#### URL-Specific Analytics
```http
GET /api/analytics/{alias}
```
Provides detailed analytics for a specific shortened URL:
- Total clicks
- Unique visitors
- Temporal distribution
- Platform statistics

#### Topic-Based Analytics
```http
GET /api/analytics/topic/{topic}
```
Aggregates statistics for all URLs within a specific topic:
- Combined clicks and visitors
- URL-specific breakdowns
- Temporal trends

### Dashboard
```http
GET /api/dashboard
```
Provides user-specific dashboard data and authentication status.

## 📊 Analytics Data Structure

The analytics system tracks the following metrics:

```json
{
  "totalClicks": 150,
  "uniqueUsers": 75,
  "clicksByDate": [
    {
      "date": "2025-01-27",
      "clickCount": 25
    }
  ],
  "osType": [
    {
      "osName": "Windows",
      "uniqueClicks": 45,
      "uniqueUsers": 30
    }
  ],
  "deviceType": [
    {
      "deviceName": "Desktop",
      "uniqueClicks": 80,
      "uniqueUsers": 50
    }
  ]
}
```

## ⚠️ Error Handling

The API uses standard HTTP status codes:
- `201`: Resource created successfully
- `302`: Redirect to original URL
- `401`: Authentication required
- `404`: Resource not found
- `500`: Server error

Each error response includes a descriptive message:
```json
{
  "error": "Error description"
}
```

## 🔒 Security

- All API endpoints (except authentication) require valid session
- Session management via secure cookies
- OAuth state parameter validation
- User-specific data isolation

[Previous sections remain the same...]

## 💻 Development

To run the server locally:

1. Clone the repository:
   ```bash
   git clone https://github.com/Manoj-p2304/url-shortner_task_31.git
   ```

2. Navigate to the project directory:
   ```bash
   cd url-shortner_task_31
   ```

3. Install dependencies:
   ```bash
   npm install
   ```

4. Configure environment variables:
   ```bash
   # Create a .env file in the root directory
   RENDER_EXTERNAL_URL=http://localhost:3000
   GOOGLE_CLIENT_ID=your_google_client_id
   GOOGLE_CLIENT_SECRET=your_google_client_secret
   MONGODB_URI=your_mongodb_connection_string
   SESSION_SECRET=your_session_secret
   ```

5. Start the development server:
   ```bash
   npm run dev
   ```

6. Access the API at `http://localhost:3000`

7. Visit `/api/api-docs` to explore the interactive API documentation


## 📝 Models

### User
```json
{
  "email": "user@example.com",
  "name": "John Doe",
  "googleId": "118234567892214561234"
}
```

### Short URL
```json
{
  "longUrl": "https://www.example.com/very/long/url",
  "shortUrl": "abc123",
  "customAlias": "my-custom-link",
  "topic": "technology",
  "userId": "118234567892214561234",
  "createdAt": "2025-01-28T12:00:00Z"
}
```

### Analytics
```json
{
  "totalClicks": 150,
  "uniqueUsers": 75,
  "clicksByDate": [
    {
      "date": "2025-01-27",
      "clickCount": 25
    }
  ],
  "osType": [
    {
      "osName": "Windows",
      "uniqueClicks": 45,
      "uniqueUsers": 30
    }
  ],
  "deviceType": [
    {
      "deviceName": "Desktop",
      "uniqueClicks": 80,
      "uniqueUsers": 50
    }
  ]
}
```

---
For additional support or feature requests, please open an issue in the repository.

## License
This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.
