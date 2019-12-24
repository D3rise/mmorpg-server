const config = require("../config/database");
const User = require("../models/User");
const jwtAuth = require("socketio-jwt-auth")

module.exports = jwtAuth.authenticate({
    secret: config.secret
}, async (payload, done) => {
    try {
        const user = User.findById(payload.id)
        if(!user) return done(null, false, "Token invalid")
        if(payload.verify !== user.tokenVerify) return done(null, false, "Token invalid")

        return done(null, user)
    } catch(err) {
        return done(err)
    }
})