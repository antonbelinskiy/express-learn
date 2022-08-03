function registrationMiddleWare(req, res, next) {
    const name = req.body.name;
    const login = req.body.login;
    const password = req.body.password;

    if (!password) {
        return res.send('Password is not provided');
    }
    if (!name) {
        return res.send('Name is not provided');
    }
    if (!login) {
        return res.send('Login is not provided');
    }

    next();
}

function loginMiddleWare(req, res, next) {
    const login = req.body.login,
        password = req.body.password;

    if (!password && !login) {
        return res.send('Password and login are required.');
    }
    if (!login) {
        return res.send('Login is required.');
    }
    if (!password) {
        return res.send('Password is required.');
    }


    next();
}

module.exports = registrationMiddleWare;
module.exports = loginMiddleWare;