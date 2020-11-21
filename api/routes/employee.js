const express = require('express');
const router= express.Router();
const employeeController=require('../controllers/employeeController');

router.post('/',employeeController.create);
router.get('/pagination/:page',employeeController.getEmployees);
router.get('/:id',employeeController.getEmployeeById);
router.patch('/:id',employeeController.update);
router.delete('/:id',employeeController.remove);
module.exports = router;