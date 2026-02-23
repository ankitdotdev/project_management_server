# Submission Requirements - Backend Assignment 4

## 1. GitHub Repository

- Create a public or private GitHub repository
- Include all source code and configuration files
- Add a `.gitignore` file for dependencies and environment variables
- Maintain clear commit history with descriptive messages

## 2. README.md Contents

### Setup Instructions

```bash
# Prerequisites
- Node.js v18+
- npm or yarn
- Database (specify type)

# Installation
1. Clone the repository
2. Install dependencies: npm install
3. Configure environment variables: cp .env.example .env
4. Start the server: npm start
```

### API Documentation

#### Endpoints

| Method | Endpoint            | Description          |
| ------ | ------------------- | -------------------- |
| GET    | `/api/resource`     | Fetch all resources  |
| POST   | `/api/resource`     | Create new resource  |
| GET    | `/api/resource/:id` | Fetch resource by ID |
| PUT    | `/api/resource/:id` | Update resource      |
| DELETE | `/api/resource/:id` | Delete resource      |

#### Example Requests

```json
POST /api/resource
{
    "name": "Example",
    "value": 123
}

Response: { "id": 1, "name": "Example", "value": 123 }
```

### Assumptions and Trade-offs

- **Assumption**: User authentication is handled externally
- **Trade-off**: Synchronous operations prioritized for simplicity over async optimization
- **Limitation**: Database queries not indexed for high-volume datasets

