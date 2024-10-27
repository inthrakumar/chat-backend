export default () => ({
  JWT_SECRET: process.env.JWT_TOKEN_KEY,
  REFRESH_JWT_SECRET: process.env.JWT_REFRESH_TOKEN_KEY,
  AES_ENCRYPTION_KEY: process.env.AES_ENCRYPTION_KEY,
  CASSANDRA_CONTACT_POINTS: process.env.CASSANDRA_CONTACT_POINTS,
  CASSANDRA_KEYSPACE: process.env.CASSANDRA_KEYSPACE,
  CASSANDRA_LOCAL_DATACENTER: process.env.CASSANDRA_LOCAL_DATACENTER,
  database: {
    scheme: process.env.DATABASE_SCHEME,
    url: process.env.DATABASE_URL,
    db: process.env.DATABASE_NAME,
    username: process.env.DATABASE_USERNAME,
    password: process.env.DATABASE_PASSWORD,
    port: parseInt(process.env.DATABASE_PORT, 10),
  },
});
