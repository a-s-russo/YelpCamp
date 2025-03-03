import * as users from "../controllers/users.js";
import express from "express";
import passport from "passport";
import { catchAsync } from "../utils/catchAsync.js";
import { storeReturnTo } from "../middleware.js";

const router = express.Router();

router
  .route("/register")
  .get(users.renderRegisterForm)
  .post(catchAsync(users.register));

router
  .route("/login")
  .get(users.renderLoginForm)
  .post(
    storeReturnTo,
    passport.authenticate("local", {
      failureFlash: true,
      failureRedirect: "/login",
    }),
    users.login
  );

router.get("/logout", users.logout);

export default router;
