const express = require("express")
const cors = require("cors")
const listEndPoints = require("express-list-endpoints")
const mongoose = require("mongoose")

const usersRouter = require("./users")

const server = express()

server.use(cors())

const port = process.env.PORT 

server.use(express.json())

server.use("/users", usersRouter)

console.log(listEndPoints(server))

mongoose.connect("mongodb://localhost:27017/users-auth", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
  })
  .then(
    server.listen(port, () => {
      console.log("Running on port", port)
    })
  )
  .catch((err) => console.log(err))