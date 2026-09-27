const express = require("express");
const router = require("./router");
const mongoose = require("mongoose");
const path = require("path");
const bodyParser = require("body-parser");
const cors = require("cors");
require("dotenv").config();

const app = express();
const PORT = process.env.PORT || 8000;

// ✅ CORS whitelist (ფრონტენდ ჰოსტები — პროტოკოლისა და www-ს გარეშე)
const allowedHosts = [
  "localhost:3000",
  "localhost:3001",
  "127.0.0.1:3000",
  "127.0.0.1:3001",
  "flyinspectors.ge",
  "flyinspectors.com",
  "flyinspectors.co.uk",
  "test.flyinspectors.com",
  "tourclaim.com",
  "tourclaims.com",
  "tour.claims",
];

// ✅ CORS კონფიგურაცია
const corsOptions = {
  origin: function (origin, callback) {
    if (!origin) return callback(null, true); // Server-to-server calls

    let host;
    try {
      host = new URL(origin).host.replace(/^www\./, "");
    } catch {
      console.error("❌ Blocked by CORS (invalid origin):", origin);
      return callback(new Error("Not allowed by CORS"));
    }

    if (allowedHosts.includes(host)) {
      return callback(null, true);
    }

    console.error("❌ Blocked by CORS:", origin);
    return callback(new Error("Not allowed by CORS"));
  },
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
};

// ✅ Middleware-ები
app.use(cors(corsOptions));
app.options("*", cors(corsOptions)); // Preflight OPTIONS

app.use(express.json({ limit: "100mb" }));
app.use(express.urlencoded({ limit: "100mb", extended: true }));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

// ✅ API როუტერები
app.use("/api", router);

// ✅ React build ფაილების სერვინგი (თუ Frontend ერთადაა ჰოსტზე)
app.use(express.static(path.join(__dirname, "./../flyinspectors/build")));

app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "./../flyinspectors/build", "index.html"));
});

// ✅ MongoDB კავშირი
mongoose
  .connect(process.env.MONGODB_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("✅ Connected to MongoDB");
  })
  .catch((err) => {
    console.error("❌ MongoDB connection error:", err);
  });

// ✅ სერვერის გაშვება
app.listen(PORT, () => {
  console.log(`🚀 Server is running on port ${PORT}`);
});
