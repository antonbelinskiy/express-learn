const performQuery = require('../utils/utils');
const registrationMiddleWare = require('../middlewares/middlewares');
const loginMiddleWare = require('../middlewares/middlewares');

const express = require('express');
const router = express.Router();



const { Pool } = require('pg')
const pool = new Pool({
  user: 'admin',
  host: 'localhost',
  database: 'postgres',
  password: 'admin',
  port: 5432,
});


/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

router.get('/users/:name', async function (req, res) {
    const {name} = req.params;
    const user = await new Promise(function (resolve, reject) {
        pool.query(`SELECT * FROM users WHERE name = '${name}'`, function (err, res) {
            if (err) reject(err);
            else resolve(res.rows);
        });
    })
    console.log('Serega:', user);
    res.json(user);
});


router.get('/users', async function (req,res) {
    const users = await new Promise(function (resolve, reject) {
        pool.query('SELECT * FROM users', function (err, res) {
            if (err) reject(err);
            else resolve(res.rows);
        });
    });
    res.json(users);
});

router.put('/users', async function (req, res) {
    const user = await new Promise(function (resolve, reject) {
        pool.query(`UPDATE users SET name = 'Anton' WHERE name = 'Serega'`, function (err, res) {
            if (err) reject(err);
            else resolve(res.rows);
        });
    })
    console.log('Changed name:', user);
    res.json(user);
});


router.delete('/users', async function (req, res) {
    const {userId} = req.body;
    const userExists = await performQuery(`SELECT * FROM users WHERE id = '${userId}'`, pool);

    if (userExists.length === 0) {
        return res.send(`User width id ${userId} is not exists`);
    }

    await performQuery(`DELETE FROM users WHERE id = '${userId}'`, pool)

    return res.send(`User with id ${userId} has been deleted`);
})

//registration

router.post('/registration', registrationMiddleWare, async function (req, res) {
    const {name, login, password} = req.body;

    const userExists = await performQuery(`SELECT * FROM users WHERE login = '${login}'`, pool);

    if (userExists.length > 0) {
        return res.send(`User with login ${login} is already exists`);
    }

    await performQuery(`INSERT INTO users (name, login, password) VALUES ('${name}', '${login}', '${password}')`, pool)

    return res.json('User has been successfully added !');
});

//login

router.post('/login', loginMiddleWare, async function (req, res) {

    const {login, password} = req.body;
    const successLogin = await performQuery(`SELECT * FROM users WHERE login = '${login}' AND password = '${password}'`, pool);

    if (successLogin.length === 0) {
        return res.send('Incorrect email or password.');
    }

    return res.json('Successfully logged!');
});


// Functions

module.exports = router;
