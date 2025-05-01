//allowedOrigins for CORS will be for who is allowed to access your api
//You can access your api with your own website
//You can access api if you golive in VS maybe your are building with react
//Or if you are using custom server and want to access with localhost

const allowedOrigins = [
  "https://www.yoursite.com",
  "http://127.0.0.1:5500",
  "http://localhost:3500",
];

module.exports = allowedOrigins;
