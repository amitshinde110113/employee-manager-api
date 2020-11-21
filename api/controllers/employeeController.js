const mongoose = require('mongoose');
const EmployeeSchema = require('../models/employee');



exports.create = async (req, res, next) => {
    let count = await EmployeeSchema.find({ manager: req.currentUser._id }).count()
    count++;
    const empId = count < 10 ? `EMP0${count}` : `EMP${count}`
    const employee = new EmployeeSchema({
        _id: new mongoose.Types.ObjectId(),
        manager: req.currentUser._id,
        empId: empId,
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        address: req.body.address,
        dob: req.body.dob,
        city: req.body.city,
        phone: req.body.phone,

    });
    employee.save().then((result) => {
        res.status(201).json(result);
    }).catch(err => {
        res.status(401).json(err);
    })
}

exports.getEmployees = async (req, res, next) => {
    const page = req.params.page;
    const skip = page * 10;
    const totalCount = await EmployeeSchema.find({ manager: req.currentUser._id, status: 'ACTIVE' }).count()
    EmployeeSchema.find({ manager: req.currentUser._id, status: 'ACTIVE' }).populate('manager').sort({ 'firstName': 1, 'lastName': 1 }).skip(skip).limit(10).then(result => {
        res.status(201).json({ totalCount: totalCount, employees: result });
    }).catch(err => {
        res.status(401).json(err);
    })
}
exports.getEmployeeById = (req, res, next) => {
    const id = req.params.id;
    EmployeeSchema.findOne({ _id: id }).then(result => {
        res.status(201).json(result);
    }).catch(err => {
        res.status(404).json(err);
    })
}


exports.update = (req, res, next) => {
    var data = req.body;
    var id = req.params.id;
    EmployeeSchema.findByIdAndUpdate(id, { $set: data }, { new: true }).exec()
        .then((result) => {
            res.status(201).json(result);
        })
        .catch(err => {
            res.status(404).json({ error: err });
        });
}

exports.remove = (req, res, next) => {
    const id = req.params.id;
    EmployeeSchema.findByIdAndUpdate(id, { $set: { status: 'DELETED' } }, { new: true }).exec()
        .then((employee) => {
            res.status(201).json(employee);
        })
        .catch(err => {
            res.status(500).json({ error: err });
        });
}

