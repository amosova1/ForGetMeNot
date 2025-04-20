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
  console.log('abbbbb', username, password)
  try {
    const account = await Account.findOne({ where: { username } });

    if (!account) {
      return res.status(401).send('Invalid username or password');
    }
    console.log('sdfsdf')
    const match = await compare(password, account.password);

    if (!match) {
      return res.status(401).send('Invalid username or password');
    }

    console.log('here')
    req.session.user = {
      username: username,
      isAdmin: account.is_admin,
    };

    console.log('here2')
    res.status(200).json({
      message: 'Login successful',
      accountId: account.id,
      name: username,
      admin: account.is_admin,
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
  if (req.session && req.session.userId) {
    req.session.destroy((err) => {
      if (err) {
        console.log(err);
        return res.status(500).end();  // internal server error
      } else {
        // clear the cookie in the browser
        res.clearCookie(config.session.cookieName);
        return res.status(200).end();  // successful logout
      }
    });
  } else {
    return res.status(400).end();  // bad request - session doesn't exist
  }
});

module.exports = loginRouter;
