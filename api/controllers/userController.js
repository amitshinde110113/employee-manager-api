const mongoose = require('mongoose');
const User = require('../models/user');
const bcrypt = require('bcrypt');
const saltRounds = 10;
const KEY = 'DemoKey'
const jwt = require('jsonwebtoken');

exports.signUp = (req, res, next) => {
    User.find({ email: req.body.email }).exec().then(async (result) => {
        if (result.length >= 1) {
            res.status(403).json({ message: 'Already exist.' })
        } else {
            const hash = await bcrypt.hash(req.body.password, saltRounds)
            const user = new User({
                _id: new mongoose.Types.ObjectId(),
                email: req.body.email,
                password: hash,
                firstName: req.body.firstName,
                lastName: req.body.lastName,
                address: req.body.address,
                dob: req.body.dob,
                company: req.body.company
            });
            user.save().then(async (result) => {
                res.status(201).json({
                    message: 'Registered successfully.',
                    user: result,
                });
            }).catch(err => {
                res.status(400).json(err);
            });
        }
    });
}

exports.login = (req, res, next) => {
    User.findOne({ email: req.body.email }).exec()
        .then(async (result) => {
            const match = await bcrypt.compare(req.body.password, result.password);
            if (match) {
                const token = jwt.sign({ email: result.email, userID: result._id, type: result.type }, KEY,
                    {
                        expiresIn: "1d"
                    });
                result['loginStatus'] = 'Success';
                res.status(200).json({ user: result, token: token, loginStatus: 'Success' });
            } else {
                res.status(401).json({ message: 'Please enter valid credentials.' })
            }
        })
        .catch(err => {
            res.status(404).json(err);
        });
}






