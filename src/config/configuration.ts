export default () => ({
  database: {
    scheme: process.env.DATABASE_SCHEME,
    url: process.env.DATABASE_URL,
    username: process.env.DATABASE_USERNAME,
    password: process.env.DATABASE_PASSWORD,
    port: parseInt(process.env.DATABASE_PORT, 10),
  },
});
