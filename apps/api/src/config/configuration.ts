export default () => ({
  port: parseInt(process.env.PORT || '4000', 10),

  database: {
    host: process.env.DB_HOST || 'localhost',
    port: parseInt(process.env.DB_PORT || '5432', 10),
    username: process.env.DB_USERNAME || 'postgres',
    password: process.env.DB_PASSWORD || 'postgres',
    name: process.env.DB_NAME || 'agri_iot',
    synchronize: process.env.NODE_ENV !== 'production',
    logging: process.env.DB_LOGGING === 'true',
  },

  redis: {
    host: process.env.REDIS_HOST || 'localhost',
    port: parseInt(process.env.REDIS_PORT || '6379', 10),
    password: process.env.REDIS_PASSWORD || undefined,
  },

  influxdb: {
    url: process.env.INFLUXDB_URL || 'http://localhost:8086',
    token: process.env.INFLUXDB_TOKEN || '',
    org: process.env.INFLUXDB_ORG || 'agri-iot',
    bucket: process.env.INFLUXDB_BUCKET || 'sensor_data',
  },

  mqtt: {
    host: process.env.MQTT_HOST || 'localhost',
    port: parseInt(process.env.MQTT_PORT || '1883', 10),
    username: process.env.MQTT_USERNAME || undefined,
    password: process.env.MQTT_PASSWORD || undefined,
    clientId: process.env.MQTT_CLIENT_ID || 'agri-iot-api',
  },

  jwt: {
    secret: process.env.JWT_SECRET || 'your-secret-key-change-in-production',
    expiresIn: process.env.JWT_EXPIRES_IN || '24h',
    refreshExpiresIn: process.env.JWT_REFRESH_EXPIRES_IN || '7d',
  },

  weather: {
    apiKey: process.env.OPENWEATHER_API_KEY || '',
    refreshInterval: parseInt(process.env.WEATHER_REFRESH_INTERVAL || '1800000', 10), // 30 minutes
  },

  notifications: {
    twilio: {
      accountSid: process.env.TWILIO_ACCOUNT_SID || '',
      authToken: process.env.TWILIO_AUTH_TOKEN || '',
      phoneNumber: process.env.TWILIO_PHONE_NUMBER || '',
    },
    sendgrid: {
      apiKey: process.env.SENDGRID_API_KEY || '',
      fromEmail: process.env.SENDGRID_FROM_EMAIL || 'noreply@agri-iot.com',
    },
  },

  cors: {
    origin: process.env.CORS_ORIGIN || 'http://localhost:3000',
  },
});
