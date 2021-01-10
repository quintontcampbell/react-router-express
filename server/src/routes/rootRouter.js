import express from "express"
import clientRouter from "./clientRouter.js"
import cerealsRouter from "./api/v1/cerealsRouter.js"
import milksRouter from "./api/v1/milksRouter.js"

const rootRouter = new express.Router()

rootRouter.use("/api/v1/cereals", cerealsRouter)
rootRouter.use("/api/v1/milks", milksRouter)

rootRouter.use("/", clientRouter)

export default rootRouter
