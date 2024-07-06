const user = require("../model/user");

module.exports.renderSignupForm = (req, res) => {
    res.render("users/signup.ejs");
};

module.exports.signup = async (req, res, next) => {
    try {
        let { username, email, password } = req.body;
        const newUser = user({ email, username });
        let registeredUser = await user.register(newUser, password);
        req.login(registeredUser, ((err) => {
            if (err) {
                return next(err);
            }
            req.flash("success", "Welcome to WanderEase");
            res.redirect("/listings");
        }))

    } catch (err) {
        req.flash("error", err.message);
        res.redirect("/signup");
    }
};

module.exports.renderLoginForm = (req, res) => {
    res.render("users/login.ejs");
};

module.exports.login = async (req, res) => {
    req.flash("success", "welcome back to WanderEase")
    let redirectUrl = res.locals.redirectUrl || "/listings";
    res.redirect(redirectUrl);
};

module.exports.logout = (req, res, next) => {
    req.logout((err) => {
        if (err) {
            return next(err);
        }
        req.flash("success", "You have logged out");
        res.redirect("/listings");
    });
}