import express from "express"
import Cereal from "../../../models/Cereal.js"

const cerealsRouter = new express.Router()

cerealsRouter.get('/', (req, res) => {
  res.set({ 'Content-Type': 'application/json' }).status(200).json(Cereal.findAll())
})

cerealsRouter.get("/:id", (req, res) => {
  const cereal = Cereal.findById(req.params.id)
  if(cereal) {
    res.set({ 'Content-Type': 'application/json' }).status(200).json(cereal)
  } else {
    res.status(404).send("Not Found")
  }
})

export default cerealsRouter