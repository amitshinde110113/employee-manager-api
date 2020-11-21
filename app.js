const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const morgan = require('morgan');
const app = express();
const http = require('http');
const port = process.env.PORT || 4000;
const server = http.createServer(app);
const userRoute = require('./api/routes/users');
const employeeRoutes = require('./api/routes/employee');
const checkAuth = require('./api/middleware/check-auth');

// db connection
mongoose.connect('mongodb+srv://amit_shinde:amit_shinde@cluster0-bzohy.mongodb.net/test?retryWrites=true&w=majority',
  {
    useNewUrlParser: true,
  });

// Specifying port
server.listen(port, function () {
  console.log(`listening on ${port}`);
});

//Morgan for logs
app.use(morgan('dev'));

// to pasre JSON body
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

//Handling CORS
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept, Authorization"
  );
  if (req.method === "OPTIONS") {
    res.header("Access-Control-Allow-Methods", "PUT, POST, PATCH, DELETE, GET");
    return res.status(200).json({});
  }
  next();
});

// Manager routes
app.use('/api/users', userRoute);

// Employee CRUD routes
app.use('/api/employees', checkAuth, employeeRoutes);

// If no route matches
app.use((req, res, next) => {
  const error = new Error('Not Found');
  error['status'] = 404;
  next(error);
});

// throwing server error
app.use((error, req, res, next) => {
  res.status(error.status || 500);
  res.json({ error: { message: error.message } });
});
module.exports = app