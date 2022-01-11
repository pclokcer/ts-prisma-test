import dotenv from 'dotenv'
dotenv.config()

import express from 'express'
import cors from 'cors'
import morgan from 'morgan'

import { nanoid } from 'nanoid'
import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()

const main = async () => {

  try {

    const app = express()

    app.use(cors())
    app.use(express.urlencoded({ extended: true }))
    app.use(express.json())
    app.use(morgan('dev'))

    app.get('/', async (req, res, next) => {
      try {

        await prisma.devices.create({
          data: {
            id: nanoid(10),
            name: 'Alice',
            created_at: new Date()
          },
        })

        const users = await prisma.devices.findMany()

        return res.status(200).json(users)
      } catch (error) {
        return next(error)
      }
    })

    /**
     * Not Found
     */
    app.use((err, req, res, next) => {

      if (err) {
        return res.status(400).json({ success: false, message: err.message })
      }

      return res.status(404).json({ success: false, message: 'not found' })

    })

    const port = process.env.PORT
    app.listen(port, () => console.log("backend app listening on port " + port))
  } catch (error) {
    console.log(error)
  }

}

main()