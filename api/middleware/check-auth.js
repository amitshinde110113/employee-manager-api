const jwt = require('jsonwebtoken');
const User = require('../models/user');
const KEY='DemoKey'


module.exports = async (req, res, next) => {
    try {
        const token = req.headers.authorization.split(" ")[1];
        const decodes = jwt.verify(token, KEY);
        let currentUser = await User.findById(decodes.userID)
        req.userData = decodes;
        req.currentUser = currentUser
        next();
    } catch (error) {
        error['message']='Token verification failed';
        res.status(498).json(error);
    }
};