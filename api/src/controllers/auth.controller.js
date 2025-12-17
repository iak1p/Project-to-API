const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const db = require("../utils/db");

class AuthController {
  me = async (req, res) => {
    const user = req.user;

    return res.status(200).json({
      message: "Login successful",
      user: {
        username: user.username,
      },
    });
  };

  login = async (req, res) => {
    const { username, password } = req.body;

    try {
      const user = await db("users").where({ username });
      if (!user.length) {
        return res.status(400).json({ message: "User not found" });
      }

      const isMatch = await bcrypt.compare(password, user[0].password);

      if (!isMatch) {
        return res.status(400).json({ message: "Invalid credentials" });
      }

      const token = jwt.sign({ id: user[0].id }, "TEST", { expiresIn: "3d" });

      res.cookie("token", token, {
        httpOnly: true,
        sameSite: "lax",
        secure: false,
        maxAge: 7 * 24 * 60 * 60 * 1000,
      });

      return res.status(200).json({
        message: "Login successful",
        token: "Bearer " + token,
      });
    } catch (err) {
      console.error("Error happened on server:", err);

      return res.status(500).json({ message: err.message });
    }
  };

  register = async (req, res) => {
    const { username, password } = req.body;

    try {
      if (await db("users").where({ username }).first()) {
        return res.status(400).json({ message: "User already exists" });
      }
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(password, salt);

      const [newUser] = await db("users")
        .insert({
          username: username,
          password: hashedPassword,
        })
        .returning("*");

      return res.status(201).json({
        message: "User created successfully",
        user: {
          id: newUser.id,
          username: newUser.username,
        },
      });
    } catch (err) {
      console.error("Error happened on server:", err);

      return res.status(500).json({ message: err.message });
    }
  };

  logout = async () => {
    try {
      res.clearCookie("token", {
        httpOnly: true,
        sameSite: "lax",
        secure: false,
      });

      return res.status(200).json({ ok: true });
    } catch (err) {
      console.error("Error happened on server:", err);

      return res.status(500).json({ message: err.message });
    }
  };
}

module.exports = new AuthController();
