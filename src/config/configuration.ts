export default () => ({
  JWT_SECRET: process.env.JWT_TOKEN_KEY,
  AES_ENCRYPTION_KEY: process.env.AES_ENCRYPTION_KEY,
  database: {
    scheme: process.env.DATABASE_SCHEME,
    url: process.env.DATABASE_URL,
    db: process.env.DATABASE_NAME,
    username: process.env.DATABASE_USERNAME,
    password: process.env.DATABASE_PASSWORD,
    port: parseInt(process.env.DATABASE_PORT, 10),
  },
});
