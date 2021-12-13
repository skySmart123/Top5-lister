const jwt = require("jsonwebtoken")

class AuthManager {
    static Verify (req, res, next) {
        try {
            const token = req.cookies.token;
            if (!token) {
                // return res.unauthorized({})
                // throw new Error("Unauthorized")
                const e = new Error("Unauthorized")
                e.statusCode = 401
                return next(e)
            }

            const verified = jwt.verify(token, process.env.JWT_SECRET)
            req.userId = verified.userId;

            next();
        } catch (err) {
            console.error(err);

            // return res.unauthorized({})
            // throw new Error("Unauthorized")
            next(err)
        }
    }

    static SignToken (user) {
        return jwt.sign({
            userId: user._id
        }, process.env.JWT_SECRET);
    }

}

module.exports = AuthManager;