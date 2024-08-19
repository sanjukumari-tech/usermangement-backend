const express = require("express");
const connectDB = require("./config/db");
const cors = require('cors');
const userRoutes = require("./routes/userRoutes");
const memberRoutes = require("./routes/memberRoutes");
const auth = require("./middleware/auth");
require("dotenv").config();

const app = express();
app.use(express.json());
app.use(cors());


app.get("/",(req,res)=>{
    res.send("this is home page");
});

app.use("/userMangement",auth,memberRoutes)
app.use("/user",userRoutes);

const port = process.env.PORT;
app.listen(port, async()=>{
    try{
        await connectDB();
        console.log( `server is running at port no : http://localhost:${port}`);

    }catch(err){
        console.log(err);
        res.status(500).json({message:"error has occured..."});
    }
})



// // const express = require('express');
// // const multer = require('multer');
// // const morgan = require('morgan');
// // const path = require('path');
// // const fs = require('fs');
// // const bodyParser = require('body-parser');
// // require('dotenv').config();

// // const app = express();
// // const port = process.env.PORT || 3000;

// // // Create a logs directory if it doesn't exist
// // if (!fs.existsSync(path.join(__dirname, 'logs'))) {
// //   fs.mkdirSync(path.join(__dirname, 'logs'));
// // }

// // // Morgan setup
// // const accessLogStream = fs.createWriteStream(path.join(__dirname, 'logs', 'access.log'), { flags: 'a' });
// // app.use(morgan('combined', { stream: accessLogStream }));

// // // Body parser setup
// // app.use(bodyParser.urlencoded({ extended: false }));
// // app.use(bodyParser.json());

// // // Multer setup
// // const storage = multer.diskStorage({
// //   destination: function (req, file, cb) {
// //     cb(null, 'uploads/profile-pics/');
// //   },
// //   filename: function (req, file, cb) {
// //     cb(null, Date.now() + path.extname(file.originalname)); // Append the file extension
// //   }
// // });

// // const fileFilter = (req, file, cb) => {
// //   if (file.mimetype === 'image/jpeg' || file.mimetype === 'image/png') {
// //     cb(null, true);
// //   } else {
// //     cb(new Error('File format should be JPG or PNG'), false);
// //   }
// // };

// // const upload = multer({ storage: storage, fileFilter: fileFilter });

// // // Serve static files
// // app.use(express.static(path.join(__dirname, 'public')));
// // app.set('view engine', 'ejs');
// // app.set('views', path.join(__dirname, 'views'));

// // // Routes
// // const memberRoutes = require('./routes/memberRoutes')(upload);
// // app.use('/members', memberRoutes);

// // app.get('/', (req, res) => {
// //   res.sendFile(path.join(__dirname, 'public', 'index.html'));
// // });

// // app.listen(port, () => {
// //   console.log(`Server running at http://localhost:${port}/`);
// // });



// // server.js
// const express = require('express');
// const session = require('express-session');
// const MongoStore = require('connect-mongo');
// const path = require('path');
// const bodyParser = require('body-parser');
// const passport = require('./auth');
// const connectDB = require('./db');

// const app = express();
// const port = process.env.PORT || 3000;

// connectDB();

// app.use(express.static(path.join(__dirname, 'public')));
// app.use(bodyParser.urlencoded({ extended: false }));
// app.use(bodyParser.json());

// // Sessions
// app.use(session({
//   secret: process.env.SESSION_SECRET,
//   resave: false,
//   saveUninitialized: false,
//   store: MongoStore.create({ mongoUrl: process.env.MONGO_URI }),
// }));

// app.use(passport.initialize());
// app.use(passport.session());

// app.set('view engine', 'ejs');
// app.set('views', path.join(__dirname, 'views'));

// // Routes
// app.use('/users', require('./routes/userRoutes'));
// app.use('/events', require('./routes/eventRoutes'));

// app.get('/', (req, res) => {
//   res.render('index');
// });

// app.listen(port, () => {
//   console.log(`Server running at http://localhost:${port}/`);
// });
