const models = require('../models');

const { Account } = models;

const loggedIn = async (req, res) => {
  if (req.session.account) {
    const acc = await Account.findOne({ _id: req.session.account._id });
    return res.json({ loggedIn: true, accountID: req.session.account._id, premium: acc.premium });
  }
  return res.json({ loggedIn: false });
};

const loginPage = (req, res) => res.render('login');

const logout = (req, res) => {
  req.session.destroy();
  res.redirect('/');
};

const login = (req, res) => {
  const username = `${req.body.username}`;
  const pass = `${req.body.pass}`;

  if (!username || !pass) {
    return res.status(400).json({ error: 'All fields are required!' });
  }

  return Account.authenticate(username, pass, (err, account) => {
    if (err || !account) {
      return res.status(401).json({ error: 'Wrong username or password!' });
    }

    req.session.account = Account.toAPI(account);

    return res.json({ redirect: '/uploader' });
  });
};

const signup = async (req, res) => {
  const username = `${req.body.username}`;
  const pass = `${req.body.pass}`;
  const pass2 = `${req.body.pass2}`;

  if (!username || !pass || !pass2) {
    return res.status(400).json({ error: 'All fields are required!' });
  }

  if (pass !== pass2) {
    return res.status(400).json({ error: 'Passwords do not match!' });
  }

  try {
    const hash = await Account.generateHash(pass);
    const newAccount = new Account({ username, password: hash, premium: false });
    await newAccount.save();
    req.session.account = Account.toAPI(newAccount);
    return res.json({ redirect: '/uploader' });
  } catch (err) {
    console.log(err);
    if (err.code === 11000) {
      return res.status(400).json({ error: 'Username already in use!' });
    }
    return res.status(500).json({ error: 'An error occured!' });
  }
};

const getAccount = async (req, res) => {
  if (!req.headers.id) {
    return res.status(404).json({ error: 'Account not found ' });
  }

  try {
    const user = await Account.findOne({ _id: req.headers.id });
    return res.json({ user });
  } catch (err) {
    console.log(err);
    return res.status(500).json({ error: 'An error occured!' });
  }
};

const getAccountPage = (req, res) => res.render('account');

const togglePremium = async (req, res) => {
  try {
    const acc = await Account.findOne({ _id: req.session.account._id });
    req.session.account.premium = !acc.premium;
    await Account.updateOne({ _id: req.session.account._id }, { $set: { premium: !acc.premium } });
    return res.status(204);
  } catch (err) {
    return res.status(500).json({ error: 'An error occured!' });
  }
};

module.exports = {
  loggedIn,
  loginPage,
  login,
  logout,
  signup,
  getAccount,
  getAccountPage,
  togglePremium,
};
