const express = () => {
  const express = require("express");
  const cors = require("cors");
  const cookieParser = require('cookie-parser');

  const app = express();

  app.use(cors({ origin: true }));
  app.use(cookieParser());
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));

  return app;
};

module.exports = express;