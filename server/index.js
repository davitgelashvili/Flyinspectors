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

// CloudLinux-ზე next/react აპის virtualenv-შია (server/node_modules). .next/server-ის chunk-ები მათ
// flyinspectors-იდან ეძებენ და ვერ პოულობენ, ამიტომ server/node_modules გლობალურ ძიებაში ემატება.
process.env.NODE_PATH = [process.env.NODE_PATH, path.join(__dirname, "node_modules")]
  .filter(Boolean)
  .join(path.delimiter);
require("module")._initPaths();

let handleFront = null;
let frontError = "not started yet";

// ჯერ flyinspectors-ის node_modules (ვერსია build-ს ემთხვევა). CloudLinux-ის nodevenv-ში npm
// პაკეტებს აპის (server) virtualenv-ში აყენებს, ამიტომ მეორე ცდა server-ის საკუთარი resolve-ია.
function resolveNext() {
  try {
    return require.resolve("next", { paths: [FRONT_DIR] });
  } catch {
    return require.resolve("next");
  }
}

function describeFrontModules() {
  const nm = path.join(FRONT_DIR, "node_modules");
  let kind;
  try {
    const st = fs.lstatSync(nm);
    kind = st.isSymbolicLink() ? `symlink -> ${fs.realpathSync(nm)}` : "dir";
  } catch {
    kind = "missing";
  }
  return `front node_modules: ${kind}, next/package.json: ${fs.existsSync(path.join(nm, "next", "package.json"))}`;
}

async function prepareFront() {
  if (!fs.existsSync(path.join(FRONT_DIR, ".next", "BUILD_ID"))) {
    frontError = `build not found: ${path.join(FRONT_DIR, ".next", "BUILD_ID")}`;
    console.log("ℹ️ flyinspectors-ის production build არ არის — მხოლოდ API");
    return;
  }
  try {
    const createNextApp = require(resolveNext());
    const nextApp = createNextApp({ dev: false, dir: FRONT_DIR });
    await nextApp.prepare();
    handleFront = nextApp.getRequestHandler();
    console.log("✅ Next.js frontend ready");
  } catch (err) {
    // ფრონტის შეცდომამ API არ უნდა გათიშოს
    frontError = `next start failed: ${err.message} | ${describeFrontModules()}`;
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
// ლოგებზე წვდომა არ გვაქვს, ამიტომ მიზეზს პასუხშივე ვწერთ
app.all("*", (req, res) =>
  handleFront
    ? handleFront(req, res)
    : res.status(503).send(`Frontend not loaded (node ${process.version}): ${frontError}`)
);

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
