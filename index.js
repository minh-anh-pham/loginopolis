const express = require('express');
const sequelize = require('sequelize');
const app = express();
const { User } = require('./db');
const bcrypt = require('bcrypt');

app.use(express.json());
app.use(express.urlencoded({extended:true}));

app.get('/', async (req, res, next) => {
  try {
    res.send('<h1>Welcome to Loginopolis!</h1><p>Log in via POST /login or register via POST /register</p>');
  } catch (error) {
    console.error(error);
    next(error)
  }
});

// POST /register
// TODO - takes req.body of {username, password} and creates a new user with the hashed password
app.post('/register', async (req, res, next) => {
  // create table, drop it first if already exists
  //await sequelize.sync({force: true});
  try {
    const {username, password} = req.body;

    const hashedPw = await bcrypt.hash(password, 6);

    const newUser = await User.create({username, password: hashedPw});

    res.send('successfully created user bobbysmiles');

  } catch (error) {
    console.error(error);
    next(error);
  }
});

// POST /login
// TODO - takes req.body of {username, password}, finds user by username, and compares the password with the hashed version from the DB
app.post('/login', async (req, res, next) => {
  // create table, drop it first if already exists
  //await sequelize.sync({force: true});
  try {
    const {username, password} = req.body;

    const userFound = await User.findOne({where: {username}});

    if (userFound) {
      const isMatch = await bcrypt.compare(password, userFound.password);

      if (isMatch) {
        res.send('successfully logged in user bobbysmiles');
      } else {
        res.send('incorrect username or password');
      }
    } else {
      res.send('user with this username not found');
    }
  } catch (error) {
    console.error(error);
    next(error);
  }
});

// we export the app, not listening in here, so that we can run tests
module.exports = app;
