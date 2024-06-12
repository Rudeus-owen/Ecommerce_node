const jwt = require("jsonwebtoken");
const config = require("../config/auth.config");
const User = require('../models/user.model');

const verifyToken = (req, res, next) => {
    let token = req.headers["x-access-token"];
    if (!token) {
        return res.status(403).send({
            message: "No token provided!",
        });
    }

    jwt.verify(token, config.secret, (err, decoded) => {
        if (err) {
            return res.status(401).send({
                message: "Unauthorized user!",
            });
        }
        req.userId = decoded.id;
        next();
    });
};

const isAdmin = async (req, res, next) => {
    try {
        const user = await User.findById(req.userId);
        if (!user) {
            return res.status(404).send({ message: "User not found!" });
        }

        const userRole = user.role;

        if (userRole === 'admin' || userRole === '2') {
            req.userType = 'admin';
            next();
        } else {
            req.userType = 'user';
            return res.status(403).json({ message: "You do not have permission to perform this action" });
        }
    } catch (err) {
        console.error("Error in isAdmin middleware:", err);
        return res.status(500).send({ message: "Internal server error" });
    }
};

const isRootAdmin = async (req, res, next) => {
    try {
        const user = await User.findById(req.userId);
        if (!user) {
            return res.status(404).send({ message: "User not found!" });
        }

        const userRole = user.role;

        if (userRole === 'rootadmin' || userRole === '1') {
            req.userType = 'rootadmin';
            next();
        } else {
            req.userType = 'user';
            return res.status(403).json({ message: "You do not have permission to perform this action" });
        }
    } catch (err) {
        console.error("Error in isRootAdmin middleware:", err);
        return res.status(500).send({ message: "Internal server error" });
    }
};

const roleRedirect = async (req, res, next) => {
    try {
        const user = await User.findById(req.userId);
        if (!user) {
            return res.status(404).send({ message: "User not found!" });
        }

        const userRole = user.role;

        switch (userRole) {
            case 'admin':
            case '2':
                return res.redirect('/admin-dashboard');
            case 'rootadmin':
            case '1':
                return res.redirect('/root-admin-dashboard');
            case 'user':
            case '3':
                return res.redirect('/ecommerce-home');
            case 'guest':
            case '4':
            default:
                return res.redirect('/guest-home');
        }
    } catch (err) {
        console.error("Error in roleRedirect middleware:", err);
        return res.status(500).send({ message: "Internal server error" });
    }
};

const authJwt = {
    verifyToken,
    isAdmin,
    isRootAdmin,
    roleRedirect
};

module.exports = authJwt;
