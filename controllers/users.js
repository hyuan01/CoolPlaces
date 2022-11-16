const User = require('../models/user');

// register page
module.exports.registerPage = (req, res) => {
    res.render('users/register');
};

// register a new user
module.exports.registerUser = async (req, res, next) => {
    try {
        const {email, username, password} = req.body;
        const user = new User({ email, username });
        const registeredUser = await User.register(user, password);
        console.log(registeredUser);
        req.login(registeredUser, err => {
            if(err) return next(err);
            req.flash('success', 'Welcome to CoolPlaces!');
            res.redirect('/coolplaces');
        });
    } catch(e) {
        req.flash('error', e.message);
        res.redirect('register');
    }
};

// login page
module.exports.loginPage = (req, res) => {
    res.render('users/login');
};

// login a user
module.exports.loginUser = (req, res) => {
    req.flash('success', 'Welcome Back!');
    const redirectUrl = req.session.returnTo || '/coolplaces';
    delete req.session.returnTo;
    res.redirect(redirectUrl);
}

// logout a user
module.exports.logoutUser = (req, res) => {
    req.logout(function(err) {
        if (err) { return next(err); }    
        req.flash('success', "Successfully logged out!");
        res.redirect('/');
    });
};