import { User } from "../models/user.js";

export const renderRegisterForm = (req, res) => {
  res.render("users/register");
};

export const register = async (req, res, next) => {
  try {
    const { email, username, password } = req.body;
    const user = new User({ email, username });
    const registeredUser = await User.register(user, password);
    req.login(registeredUser, (err) => {
      if (err) return next(err);
      req.flash("success", "Welcome to YelpCamp!");
      res.redirect("/campgrounds");
    });
  } catch (e) {
    req.flash("error", e.message);
    res.redirect("register");
  }
};

export const renderLoginForm = (req, res) => {
  res.render("users/login");
};

export const login = (req, res) => {
  req.flash("success", "Welcome back!");
  const redirectUrl = res.locals.returnTo || "/campgrounds";
  res.redirect(redirectUrl);
};

export const logout = (req, res, next) => {
  req.logout(function (err) {
    if (err) {
      next(err);
    } else {
      req.flash("success", "Goodbye!");
      res.redirect("/campgrounds");
    }
  });
};
