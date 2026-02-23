
# Project Management


## 1. GitHub Repository

* Create a public or private GitHub repository
* Include all source code and configuration files
* Add a `.gitignore` file for dependencies and environment variables (`node_modules`, `.env`, `dist`, etc.)
* Maintain clear commit history with descriptive messages

---

## 2. README.md Contents

### Setup Instructions

```bash
# Prerequisites
- Node.js v18+
- npm
- MongoDB (local or MongoDB Atlas)

# Installation
1. Clone the repository
2. Install dependencies: npm install
3. Create a .env file in the root directory with the following variables:

   PORT=8000
   MONGO_URI=mongodb://localhost:27017
   DB_NAME=master

4. Start the server:
   Development: npm run dev
   Production: npm start
```

---

### API Documentation

#### Endpoints

| Method | Endpoint                   | Description           |
| ------ | -------------------------- | --------------------- |
| GET    | `/health`                  | Server health check   |
| GET    | `/api/projects`            | Fetch all projects    |
| GET    | `/api/projects/:id`        | Fetch project by ID   |
| POST   | `/api/projects`            | Create new project    |
| PATCH  | `/api/projects/:id/status` | Update project status |
| DELETE | `/api/projects/:id`        | Delete project        |

---


---

### Assumptions and Trade-offs

* **Assumption**: User authentication is handled externally
* **Trade-off**: Simplicity prioritized over advanced optimization and scaling
* **Limitation**: No rate limiting or advanced indexing implemented for high-volume datasets


