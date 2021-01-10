import express from "express"
import Milk from "../../../models/Milk.js"

const milksRouter = new express.Router()

milksRouter.get('/', (req, res) => {
  res.set({ 'Content-Type': 'application/json' }).status(200).json(Milk.findAll())
})

export default milksRouter