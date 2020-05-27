const express = require('express');
require('./db/mongoose');
const userRouter = require('./routers/user');
const taskRouter = require('./routers/task');

const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());
app.use(userRouter);
app.use(taskRouter);

app.listen(port, () => {
    console.log('Server is on port ' + port);
});

//HTTP ENDPOINTS exist in Routers
//GET - To Read
//POST - To Create
//PATCH - To Update
//DELETE - To Delete

//MODELS SCHEMAs for Users and Tasks exist in Models
//SCHEMAs
//Middleware - Authentication Tokens exist in User for manipulation

//AUTHENTICATION middleware for user authentication

//DB CONNECTION exists in DB

//File Loading exists in...
//CMD: npm run dev - runs the dev center for testing multer and sharp