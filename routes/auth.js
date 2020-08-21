const router = require('express').Router();
const User = require('../model/User');
const { registerValidation, loginValidation } = require('../validation');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

router.post('/register', async (req, res) => {
  const { error } = registerValidation(req.body);

  if (error) return res.status(400).send(error.details[0].message);

  // Check if user exists
  const nameExists = await User.findOne({ name: req.body.name });
  if (nameExists)
    return res.status(400).json({
      error: 'Username already exist',
    });

  // Hash password
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(req.body.password, salt);
  console.log(salt);
  // New user
  const user = new User({
    name: req.body.name,
    password: hashedPassword,
  });

  try {
    const savedUser = await user.save();
    res.send({ user: user._id });
  } catch (err) {
    res.status(400).send(err);
  }
});

router.post('/login', async (req, res) => {
  const { error } = loginValidation(req.body);

  if (error) return res.status(400).send(null);

  // Check if user does not exists
  const user = await User.findOne({ name: req.body.name });
  if (!user)
    return res.status(400).json({
      error: 'User or password does not exist',
    });
  // Check if password is correct
  const validPass = await bcrypt.compare(req.body.password, user.password);

  if (!validPass) return res.status(400).send('Invalid user or password');
  // Create tokken
  const token = jwt.sign({ _id: user._id }, process.env.TOKEN_SECRET);
  res.header('auth-token', token).send(token);

  res.send('Logged in!');
});

module.exports = router;
