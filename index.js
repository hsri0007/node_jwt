const express = require("express");
const jwt = require("jsonwebtoken");
const CookieParser = require("cookie-parser");
const app = express();

app.use(CookieParser());
const user = {
  name: "hari",
  email: "hsri007@gmailc.com",
  password: "123456",
};

const middleware = (req, res, next) => {
  const authHeader = req.headers["authorization"];

  if (!authHeader) return res.sendStatus(401);

  const token = authHeader.split(" ")[1];

  jwt.verify(token, "srihari", (err, decoded) => {
    if (err) return res.sendStatus(403);
    req.user = decoded.user;
    next();
  });
};

app.get("/refresh", (req, res) => {
  const cookie = req.cookies;
  if (!cookie?.jwt) return res.status(401);
  console.log(cookie.jwt);
  const refreshtoken = cookie.jwt;
  jwt.verify(cookie.jwt, "sriharirefresh", (err, decoded) => {
    const accestoken = jwt.sign(
      {
        name: user.name,
      },
      "srihari",
      { expiresIn: "30s" }
    );
    res.json({ accestoken });
  });
});

app.get("/login", (req, res) => {
  const accestoken = jwt.sign(
    {
      name: user.name,
    },
    "srihari",
    { expiresIn: "30s" }
  );
  const refreshtoken = jwt.sign(
    {
      name: user.name,
    },
    "sriharirefresh",
    { expiresIn: "1d" }
  );
  res.cookie("jwt", refreshtoken, {
    httpOnly: true,
    maxAge: 24 * 60 * 60 * 1000,
  });

  res.json({ accestoken });
});

app.listen(8000);
