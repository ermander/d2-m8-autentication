const express = require("express")
const { basic, adminOnly } = require("../auth")
const UserSchema = require("./schema")
const { findOneAndDelete } = require("./schema")
const UserModel = require("./schema")

const usersRouter = express.Router()

usersRouter.get("/me/all-users", basic, adminOnly, async (req, res, next) => {
    try {
      const users = await UserSchema.find(req.query)
      res.send(users)
    } catch (error) {
      next(error)
    }
})

usersRouter.get("/me", basic, adminOnly, async (req, res, next) => {
    try {
      res.send(req.user)
    } catch (error) {
      next("While reading users list a problem occurred!")
    }
  })

// Register a new valid user
usersRouter.post("/", async (req, res, next) => {
    try {
        const newUser = new UserSchema(req.body)
        const userExists = await UserModel.find({ username: newUser.username})
        if(userExists){
            res.status(401).send("Exists already an user with this username, try an other one!")
        }else{
            const { _id } = await newUser.save()  
            res.status(201).send(_id)
        }        
    } catch (error) {
      next(error)
    }
})

usersRouter.put("/me", basic, adminOnly, async (req, res, next) => {
    try {
      const updates = Object.keys(req.body)
  
      try {
        updates.forEach((update) => (req.user[update] = req.body[update]))
        await req.user.save()
        res.send(req.user)
      } catch (e) {
        res.status(400).send(e)
      }
    } catch (error) {
      next(error)
    }
})

usersRouter.delete("/me/:username", basic, adminOnly, async (req, res, next) => {
    try {
        const username = req.body.username
        const user = await UserSchema.findOneAndDelete(username)
        if(user){
            res.send("Deleted")
        }  
    } catch (error) {
      next(error)
    }
})

module.exports = usersRouter