/**
 * Created by Mistral on 5/19/2015.
 */

var passport = require('passport');

module.exports.express = {
    customMiddleware: function (app) {
        app.use(passport.initialize());
        app.use(passport.session());
    }
};