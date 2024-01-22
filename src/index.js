const express = require('express');
const handlebars = require('express-handlebars');
const path = require('path');
const mongoose = require('mongoose');
const cookieParser = require('cookie-parser');
const { auth } = require('./middlewares/authMiddleware');

const router = require('./router');

const { PORT, DB_URL } = require('./constants');

const app = express();

//Express Configs
//path resolve
app.use(express.static(path.resolve(__dirname, './public')));
//body parser
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(auth);

//Handlebars Configs
app.engine('hbs', handlebars.engine({ extname: 'hbs' }));
app.set('view engine', 'hbs');
app.set('views', 'src/views');

//DB Connection
async function dbConnect() {
    await mongoose.connect(DB_URL);
}

dbConnect()
    .then(() => { console.log('Connected to DB'); })
    .catch(err => { console.log(err); });


app.use(router);




app.listen(PORT, () => { console.log(`Server is listening on port: ${PORT}`); });