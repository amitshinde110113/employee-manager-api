const mongoose = require('mongoose');
var timestamps = require('mongoose-timestamp');

const employeeTestSchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    manager:
    {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'TestUser'
    },
    empId: { type: String },
    firstName: { type: String },
    lastName: { type: String },
    address: { type: String },
    dob: { type: String },
    city: { type: String },
    phone: { type: String },
    status: { type: String, default: 'ACTIVE' },// DELETED

});
employeeTestSchema.plugin(timestamps);
module.exports = mongoose.model('EmployeeTest', employeeTestSchema);