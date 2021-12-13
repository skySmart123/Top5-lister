const AuthManager = require('../auth')
const User = require('../models/user-model')
const bcrypt = require('bcryptjs')

const getLoggedIn = async (req, res, next) => {
    const loggedInUser = await User.findOne({ _id: req.userId });
    if (loggedInUser) {
        return res.success({
            data: {
                loggedIn: true,
                user: {
                    firstName: loggedInUser.firstName,
                    lastName: loggedInUser.lastName,
                    email: loggedInUser.email,
                    // _id: loggedInUser._id,
                    _id: req.userId,
                }
            }
        });
    }

    next(new Error('No User Found'))
}

const registerUser = async (req, res, next) => {
    try {
        const { username, firstName, lastName, email, password, passwordVerify } = req.body;
        if (!username || !firstName || !lastName || !email || !password || !passwordVerify) {
            return res
                // .status(400)
                // .json({ errorMessage: "Please enter all required fields." });
                .error({
                    message: 'Please enter all required fields.',
                })
        }

        if (!(/^.+\@.+\..+$/.test(email))) {
            return res
                // .status(400)
                // .json({ errorMessage: "Please enter a valid email." });
                .error({
                    message: "Please enter a valid email.",
                })
        }
        if (password.length < 8) {
            return res
                // .status(400)
                // .json({
                //     errorMessage: "Please enter a password of at least 8 characters."
                // });
                .error({
                    message: "Please enter a password of at least 8 characters."
                })
        }
        if (password !== passwordVerify) {
            return res
                // .status(400)
                // .json({
                //     errorMessage: "Please enter the same password twice."
                // })
                .error({
                    message: "Please enter the same password twice.",
                })
        }
        const existingUsername = await User.findOne({ username });
        if (existingUsername) {
            return res
                // .status(400)
                // .json({
                //     success: false,
                //     errorMessage: "An account with this email address already exists."
                // })
                .error({
                    message: "An account with this username already exists.",
                })
        }
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res
                // .status(400)
                // .json({
                //     success: false,
                //     errorMessage: "An account with this email address already exists."
                // })
                .error({
                    message: "An account with this email address already exists.",
                })
        }

        const saltRounds = 10;
        const salt = await bcrypt.genSalt(saltRounds);
        const passwordHash = await bcrypt.hash(password, salt);

        const newUser = new User({
            username,
            firstName, lastName, email, passwordHash
        });
        const savedUser = await newUser.save();

        // NO NEED TO LOGIN THE USER
        return res.success({
            message: 'Account created successfully',
            data: {
                id: savedUser._id,
            }
        });

        // LOGIN THE USER
        // const token = AuthManager.SignToken(savedUser);
        //
        // await res.cookie("token", token, {
        //     httpOnly: true,
        //     secure: true,
        //     sameSite: "none"
        // }).status(200).json({
        //     success: true,
        //     user: {
        //         firstName: savedUser.firstName,
        //         lastName: savedUser.lastName,
        //         email: savedUser.email
        //     }
        // });
    } catch (err) {
        console.error(err);

        res.error({
            message: err.message
        })
    }
}

const loginUser = async (req, res, next) => {
    try {
        const { email, password } = req.body;
        if (!email || !password) {
            return res
                .badRequest({ message: "Please enter all required fields." });
        }
        // const existingUser = await User.findOne({ email });
        const existingUser = await User.findOne({
            $or: [
                {
                    email: email,
                },
                {
                    username: email,
                }
            ]
        });
        if (!existingUser) {
            return res
                .badRequest({
                    message: "Email or Username not exist."
                })
        }

        const passwordMatch = await bcrypt
            .compare(password, existingUser.passwordHash)

        if (passwordMatch) {
            // LOGIN THE USER
            const token = AuthManager.SignToken(existingUser);

            return res.cookie("token", token, {
                httpOnly: true,
                secure: true,
                sameSite: "none"
            }).success({
                message: 'Login success',

                data: {
                    user: {
                        firstName: existingUser.firstName,
                        lastName: existingUser.lastName,
                        email: existingUser.email
                    }
                }
            });
        } else {
            return res
                .badRequest({
                    message: "Password error."
                })
        }
    } catch (err) {
        console.error(err);

        // next(err)
        return res.error({
            message: err.message,
        })
    }
}
const logoutUser = async (req, res) => {
    await res.clearCookie('token').status(200).json({
        success: true,
    });
}

module.exports = {
    getLoggedIn,
    registerUser,
    loginUser,
    logoutUser,
}