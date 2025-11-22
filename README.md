# Agricultural IoT Dashboard & Automation

An intelligent agricultural IoT platform that monitors environmental conditions, automates irrigation systems, predicts crop health issues, and optimizes resource usage.

## Features

- **Real-Time Sensor Monitoring**: Support for 20+ sensor types (soil moisture, temperature, humidity, pH, etc.)
- **Automated Irrigation Control**: Zone-based irrigation with smart scheduling
- **Environmental Dashboard**: Comprehensive visualization of all environmental data
- **Intelligent Alert System**: Threshold-based alerts with multi-channel notifications
- **Weather Integration**: Local weather data and 10-day forecasting
- **Crop Health Monitoring**: Disease risk prediction and growth tracking
- **Resource Analytics**: Water consumption tracking and cost analysis
- **Automation Rule Engine**: Visual rule builder with if-then-else logic

## Tech Stack

### Frontend
- Next.js 14 (App Router)
- TypeScript
- Tailwind CSS
- Zustand (State Management)
- Socket.IO Client (Real-time)
- Recharts (Charts)
- Leaflet (Maps)

### Backend
- Node.js 20 LTS
- NestJS 10
- TypeScript
- PostgreSQL 15+ with PostGIS
- InfluxDB 2.0 (Time-series)
- Redis 7+
- MQTT (Mosquitto)

## Project Structure

```
agricultural-iot-dashboard/
├── apps/
│   ├── api/                 # NestJS Backend API
│   │   ├── src/
│   │   │   ├── config/      # Configuration
│   │   │   ├── database/    # Entities and migrations
│   │   │   ├── modules/     # Feature modules
│   │   │   │   ├── auth/
│   │   │   │   ├── farms/
│   │   │   │   ├── zones/
│   │   │   │   ├── devices/
│   │   │   │   ├── sensors/
│   │   │   │   ├── irrigation/
│   │   │   │   ├── alerts/
│   │   │   │   ├── automation/
│   │   │   │   ├── weather/
│   │   │   │   ├── analytics/
│   │   │   │   ├── mqtt/
│   │   │   │   └── websocket/
│   │   │   └── simulator/   # IoT device simulator
│   │   └── package.json
│   │
│   └── web/                 # Next.js Frontend
│       ├── src/
│       │   ├── app/         # App router pages
│       │   ├── components/  # React components
│       │   ├── stores/      # Zustand stores
│       │   └── lib/         # Utilities
│       └── package.json
│
├── packages/
│   └── shared/              # Shared types and utilities
│       └── src/
│           ├── types/
│           ├── constants/
│           └── utils/
│
└── package.json             # Root workspace config
```

## Getting Started

### Prerequisites

- Node.js 20+
- PostgreSQL 15+
- Redis 7+
- MQTT Broker (Mosquitto)
- InfluxDB 2.0 (optional, for production)

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd agricultural-iot-dashboard
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
```bash
# Backend
cp apps/api/.env.example apps/api/.env
# Edit apps/api/.env with your configuration

# Frontend
cp apps/web/.env.example apps/web/.env
# Edit apps/web/.env with your configuration
```

4. Set up the database:
```bash
# Create PostgreSQL database
createdb agri_iot

# Run migrations (auto-sync in development)
npm run dev:api
```

5. Start the development servers:
```bash
# Start both API and Web
npm run dev

# Or start individually
npm run dev:api   # Backend on port 4000
npm run dev:web   # Frontend on port 3000
```

6. Run the IoT device simulator (optional):
```bash
npm run simulator
```

### API Documentation

Once the API is running, visit:
- Swagger UI: http://localhost:4000/api/docs

## Environment Variables

### Backend (.env)

| Variable | Description | Default |
|----------|-------------|---------|
| PORT | API server port | 4000 |
| DB_HOST | PostgreSQL host | localhost |
| DB_PORT | PostgreSQL port | 5432 |
| DB_NAME | Database name | agri_iot |
| MQTT_HOST | MQTT broker host | localhost |
| MQTT_PORT | MQTT broker port | 1883 |
| JWT_SECRET | JWT signing secret | - |
| OPENWEATHER_API_KEY | OpenWeather API key | - |

### Frontend (.env)

| Variable | Description | Default |
|----------|-------------|---------|
| NEXT_PUBLIC_API_URL | Backend API URL | http://localhost:4000/api/v1 |
| NEXT_PUBLIC_WS_URL | WebSocket URL | http://localhost:4000 |

## API Endpoints

### Authentication
- `POST /api/v1/auth/register` - Register new user
- `POST /api/v1/auth/login` - User login
- `POST /api/v1/auth/refresh` - Refresh token
- `GET /api/v1/auth/me` - Get current user

### Farms
- `GET /api/v1/farms` - List user's farms
- `POST /api/v1/farms` - Create farm
- `GET /api/v1/farms/:id` - Get farm details
- `GET /api/v1/farms/:id/stats` - Get farm statistics

### Sensors
- `GET /api/v1/sensors/latest` - Get latest readings
- `GET /api/v1/sensors/history` - Get historical data
- `GET /api/v1/sensors/aggregated` - Get aggregated stats

### Irrigation
- `GET /api/v1/irrigation/systems` - List irrigation systems
- `POST /api/v1/irrigation/systems/:id/start` - Start irrigation
- `POST /api/v1/irrigation/systems/:id/stop` - Stop irrigation
- `GET /api/v1/irrigation/water-usage` - Get water usage stats

### Alerts
- `GET /api/v1/alerts` - List alerts
- `PATCH /api/v1/alerts/:id/acknowledge` - Acknowledge alert
- `PATCH /api/v1/alerts/:id/resolve` - Resolve alert

### Automation
- `GET /api/v1/automation/rules` - List automation rules
- `POST /api/v1/automation/rules` - Create rule
- `PATCH /api/v1/automation/rules/:id/toggle` - Toggle rule

## MQTT Topics

| Topic | Purpose |
|-------|---------|
| `agri-iot/{farmId}/sensors/{deviceId}/data` | Sensor readings |
| `agri-iot/{farmId}/devices/{deviceId}/telemetry` | Device telemetry |
| `agri-iot/{farmId}/devices/{deviceId}/status` | Device status |
| `agri-iot/{farmId}/irrigation/{systemId}/command` | Irrigation commands |

## License

MIT License
