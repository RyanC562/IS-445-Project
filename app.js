// load env
if (process.env.NODE_ENV !== "production") {
  require("dotenv").load();
}

const express = require("express")
const path = require("path")
const bodyParser = require('body-parser')
const apiRouter = require('./api')

const app = express()
const DEFAULT_PORT = 8088
const port = process.env.PORT || DEFAULT_PORT

app.set("view engine", "ejs")
app.set("views", path.resolve(__dirname, "views"))

const assetsPath = path.resolve(__dirname, 'views/assets')
app.use(express.static(assetsPath))

//Make sure to parse request JSON as req.body
app.use(bodyParser.json({ type: 'application/json' }))

app.get('/', (req, res) => {
    res.render('home')
})

app.use('/api', apiRouter)

app.listen(port, () =>{
    console.log(`App started on ${port}`)
})

const mongoose = require("mongoose");

const user = process.env.MDB_USER;
const passwd = process.env.MDB_PASSWORD;

mongoose
  .connect(`mongodb://${user}:${passwd}@ds014648.mlab.com:14648/is445`)
  .then(() => console.log("connection successful"))
  .catch(err => console.error(err));
module.exports = app;
