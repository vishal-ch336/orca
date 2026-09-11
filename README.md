# Orca - AP Fisherfolk Advisory System

Orca is an AI-powered advisory system designed for marine safety and Potential Fishing Zone (PFZ) intelligence along the Andhra Pradesh coast.

## Repository Layout

```
orca/
├── backend/                # FastAPI + LangGraph Service
│   ├── app/                # Application code (agents, API routes, DB models)
│   ├── alembic/            # Database migration scripts
│   ├── alembic.ini         # Alembic configuration
│   ├── docker-compose.yml  # Docker compose configuration (API, PostGIS, Redis)
│   ├── Dockerfile          # Backend container image definition
│   ├── requirements.txt    # Python dependencies
│   ├── .env                # Environment variables (configured API keys & DB URLs)
│   └── .env.example        # Environment variable template
├── .gitignore              # Global git ignore configuration
└── README.md               # Project documentation
```

## Getting Started

### Running the Backend

1. Navigate to the `backend/` directory:
   ```bash
   cd backend
   ```

2. Start the services using Docker Compose:
   ```bash
   docker compose up -d --build
   ```

3. Verify service health:
   ```bash
   curl http://localhost:8000/health
   ```

4. Run database migrations / seed data (if needed):
   ```bash
   docker compose exec api alembic upgrade head
   docker compose exec api python -m app.db.seed
   ```

### Verification Endpoints

- **Health Check**: `GET http://localhost:8000/health`
- **Weather Debug**: `GET http://localhost:8000/debug/weather?lat=16.5&lon=80.6`
- **PFZ Debug**: `GET http://localhost:8000/debug/pfz-full?lat=16.5&lon=80.6`
- **Multi-agent Query**: `POST http://localhost:8000/api/query`
