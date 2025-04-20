var express = require('express');
const User = require("../models/user");
const Account = require("../models/account");
var registerRouter = express.Router();
const bcrypt = require('bcrypt');

/* POST register */
registerRouter.post('/', async function (req, res) {
  const { firstname, lastname, username, password } = req.body;

  console.log(firstname, lastname);

  if (!firstname || !lastname || !username || !password) {
    return res.status(400).send('All fields are required');
  }

  try {
    const existingAccount = await Account.findOne({ where: { username } });
    if (existingAccount) {
      return res.status(409).json({ message: 'Username already taken' });
    }

    let user = await User.findOne({ where: { first_name: firstname, last_name: lastname } });
    console.log(user);

    if (!user) {
      user = await User.create({ first_name: firstname, last_name: lastname });
      console.log('created user ', user);
    }

    if (typeof password !== 'string') {
      return res.status(400).json({ message: 'Password must be a string' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const account = await Account.create({
      username,
      user_id: user.user_id,
      password: hashedPassword,
    });

    req.session.user = {
      username: username,
      isAdmin: account.is_admin,
    };

    res.status(201).json({
      message: 'Registration successful',
      userId: user.user_id,
      name: username,
      admin: account.is_admin,
    });

  } catch (error) {
    console.error('Error during registration:', error);
    res.status(500).send('Internal Server Error');
  }
});

module.exports = registerRouter;
