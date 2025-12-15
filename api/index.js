const express = require("express");
const cors = require("cors");
const passport = require("passport");
const cookieParser = require("cookie-parser");
require("dotenv").config();

const authRoutes = require("./src/routes/auth.routes");
const workspaceRoutes = require("./src/routes/workspace.routes");
const projectsRoutes = require("./src/routes/projects.routes");

const app = express();

// Express middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(cookieParser());

// Cors middleware
app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

// Passport middleware
app.use(passport.initialize());

require("./src/utils/passport")(passport);

app.get(
  "/users",
  //   passport.authenticate("jwt", { session: false }),
  async (req, res) => {
    const users = await db("users").select("*");
    res.json(users);
  }
);

app.use("/api/auth", authRoutes);
app.use("/api/workspace", workspaceRoutes);
app.use("/api/projects", projectsRoutes);

app.listen(3000, () => console.log("Server running on 3000"));
