const express = require("express");
const router = require("./router");
const mongoose = require("mongoose");
const fs = require("fs");
const path = require("path");
const cors = require("cors");
const cookieParser = require("cookie-parser");
// აბსოლუტური გზა: cPanel/Passenger პროცესს repo-ს root-იდან უშვებს და cwd-ზე მიბმული .env ვერ იპოვება
require("dotenv").config({ path: path.join(__dirname, ".env") });

const app = express();
const PORT = process.env.PORT || 8000;

// ✅ Next.js ფრონტენდი (../flyinspectors) — საჭიროა production build: cd flyinspectors && npm run build
// ლოკალურად (next dev 3000-ზე) build არ არის, ამიტომ ბექი მხოლოდ API-ს ემსახურება.
const FRONT_DIR = path.join(__dirname, "../flyinspectors");
let handleFront = null;

async function prepareFront() {
  if (!fs.existsSync(path.join(FRONT_DIR, ".next", "BUILD_ID"))) {
    console.log("ℹ️ flyinspectors-ის production build არ არის — მხოლოდ API");
    return;
  }
  try {
    // next fly-ის node_modules-დან, რომ ვერსია build-ს ემთხვეოდეს
    const createNextApp = require(require.resolve("next", { paths: [FRONT_DIR] }));
    const nextApp = createNextApp({ dev: false, dir: FRONT_DIR });
    await nextApp.prepare();
    handleFront = nextApp.getRequestHandler();
    console.log("✅ Next.js frontend ready");
  } catch (err) {
    // ფრონტის შეცდომამ API არ უნდა გათიშოს
    console.error("❌ Next.js start error — მხოლოდ API:", err);
  }
}

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

app.use(cookieParser());

// ✅ API როუტერები. body parser-ები მხოლოდ /api-ზეა: გლობალურად რომ იყოს, POST-ის body-ს
// Next-ზე ადრე წაიკითხავდა და Next-ის route-ები (მაგ. /adminpanel/revalidate) ცარიელ body-ს მიიღებდა.
app.use(
  "/api",
  express.json({ limit: "100mb" }),
  express.urlencoded({ limit: "100mb", extended: true }),
  router
);

// ✅ დანარჩენ ყველაფერს (გვერდები, _next სტატიკა, middleware, route-ები) Next ამუშავებს
app.all("*", (req, res) => (handleFront ? handleFront(req, res) : res.status(404).send("Not found")));

// ბადე უკანასკნელ შემთხვევისთვის: დაუჭერელი rejection Node 15+-ში პროცესს კლავს,
// ანუ ერთი ცუდი მოთხოვნა მთელ API-ს ათიშებს. ვლოგავთ და ვრჩებით ფეხზე.
process.on("unhandledRejection", (reason) => {
  console.error("❌ Unhandled rejection:", reason);
});

// Express-ის შეცდომების handler — მოთხოვნა 500-ით სრულდება და არა პროცესის დაცემით
app.use((err, req, res, next) => {
  console.error("❌ Request error:", err);
  if (res.headersSent) return next(err);
  return res.status(500).send("Internal server error");
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

// ✅ სერვერის გაშვება (Next-ის მომზადების შემდეგ)
prepareFront().then(() => {
  app.listen(PORT, () => {
    console.log(`🚀 Server is running on port ${PORT}`);
  });
});
