const express = require('express');
require('./db/mongoose');
const userRouter = require('./routers/user');
const taskRouter = require('./routers/task');

const app = express();
const port = process.env.PORT || 3000;

//app.use((req, res, next) => {
//    if (req.method === 'GET'){
//        res.send('GET requests are disabled.')
//    } else {
//        next();
//    }
//});

/* Middleware that runs for every single route handler. 
app.use((req, res, next) => {
    res.status(503).send('Site is down. Come back soon!')
})
*/

app.use(express.json());
app.use(userRouter);
app.use(taskRouter);

app.listen(port, () => {
    console.log('Server is on port ' + port);
});

//HTTP Endpoints exist in Routers
//GET - To Read
//POST - To Create
//PATCH - To Update
//DELETE - To Delete