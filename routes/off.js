const express = require('express');
const router = express.Router();
const knex = require("../db/knex");
const bcrypt = require("bcrypt");

router.get('/', function (req, res, next) {
  const userId = req.session.userid;
  const isAuth = Boolean(userId);
  res.render('off', {
    title: 'off',
    isAuth: isAuth,
    name: req.user.name,
  });
});
router.post('/', function (req, res, next) {
  const userId = req.session.userid;
  const isAuth = Boolean(userId);
  const username = req.body.username;
  const password = req.body.password;
  const repassword = req.body.repassword;

  knex("users")
    .where({name: username})
    .select("*")
    .then(async function (result) {
      if (result.length !== 0) {
        res.render("off", {
          title: "off",
          errorMessage: ["9時間労働ね"],
          isAuth: isAuth,
        })
      } else if (password === repassword) {
        const hashedPassword = await bcrypt.hash(password, 10);
        console.log(hashedPassword);
        knex("users")
          .insert({name: username, password: hashedPassword})
          .then(function () {
            res.redirect("/");
          })
          .catch(function (err) {
            console.error(err);
            res.render("off", {
              title: "off",
              errorMessage: [err.sqlMessage],
              isAuth: isAuth,
            });
          });
      } else {
        res.render("off", {
          title: "off",
          errorMessage: ["何をしている！"],
          isAuth: isAuth,
        });
      }
    })
    .catch(function (err) {
      console.error(err);
      res.render("signup", {
        title: "Sign up",
        errorMessage: [err.sqlMessage],
        isAuth: isAuth,
       
      });
    });
});

module.exports = router;