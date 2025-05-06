var express = require('express');
const Account = require("../models/account");
const {compare} = require("bcrypt");
var loginRouter = express.Router();

/* POST login */
loginRouter.post('/', async function (req, res) {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).send('Username and password are required');
  }
  try {
    const account = await Account.findOne({ where: { username } });

    if (!account) {
      return res.status(401).send('Invalid username or password');
    }
    const match = await compare(password, account.password);

    if (!match) {
      return res.status(401).send('Invalid username or password');
    }

    req.session.user = {
      username: username,
      accountId: account.account_id,
      isAdmin: account.is_admin,
    };

    res.status(200).json({
      message: 'Login successful',
      accountId: account.account_id,
      name: username,
      isAdmin: account.is_admin,
    });

  } catch (error) {
    console.error('Error during login:', error);
    res.status(500).send('Internal Server Error');
  }
});

loginRouter.get('/',  (req, res) => {
  if (req.session.user) {
    res.json({ loggedIn: true, ...req.session.user });
  } else {
    res.json({ loggedIn: false });
  }
});

loginRouter.delete('/logout', (req, res) => {
  if (req.session && req.session.user && req.session.user.accountId) {
    req.session.destroy((err) => {
      if (err) {
        console.error('Error destroying session:', err);
        return res.status(500).end();
      }

      res.clearCookie('connect.sid');
      return res.status(200).end();
    });
  } else {
    return res.status(400).json({ error: 'Not logged in' });
  }
});

module.exports = loginRouter;
