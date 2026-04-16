const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { z } = require("zod");
const User = require("../models/User");

const schema = z.object({
  name: z.string().min(2).optional(),
  email: z.string().email(),
  password: z.string().min(6),
});

const signToken = (id) => jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: "7d" });

const signUp = async (req, res) => {
  const payload = schema.extend({ name: z.string().min(2) }).parse(req.body);
  const exists = await User.findOne({ email: payload.email });
  if (exists) return res.status(409).json({ message: "Email already exists" });

  const hashed = await bcrypt.hash(payload.password, 10);
  const user = await User.create({ ...payload, password: hashed });
  return res.status(201).json({
    token: signToken(user._id),
    user: { id: user._id, name: user.name, email: user.email },
  });
};

const signIn = async (req, res) => {
  const payload = schema.pick({ email: true, password: true }).parse(req.body);
  const user = await User.findOne({ email: payload.email });
  if (!user) return res.status(401).json({ message: "Invalid credentials" });

  const ok = await bcrypt.compare(payload.password, user.password);
  if (!ok) return res.status(401).json({ message: "Invalid credentials" });

  return res.json({
    token: signToken(user._id),
    user: { id: user._id, name: user.name, email: user.email },
  });
};

module.exports = { signUp, signIn };
