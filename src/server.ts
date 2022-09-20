import express from 'express'
import cors from 'cors'
import { PrismaClient } from '@prisma/client'
import convertHour from './utils/convert-hour'
import convertMinutes from './utils/convert-minutes'

const app = express()
app.use(express.json())
app.use(cors(
  // {
  // // Origin -> Endereço que pode acessar a aplicação
  // // origin: 'http://localhost:3000'
  // }
))

const prisma = new PrismaClient({
  log: ['query'],
})

// List Games
app.get('/games', async (req, res) => {
  const games = await prisma.game.findMany({
    include: {
      _count: {
        select: {
          ads: true,
        },
      },
    }
  })
  return res.status(200).json(games)
})

// List Ads By Game
app.get('/games/:id/ads', async (req, res) => {
  const { id } = req.params
  const ads = await prisma.ad.findMany({
    select: {
      id: true,
      name: true,
      weekDays: true,
      useVoiceChannel: true,
      yearsPlaying: true,
      hourStart: true,
      hourEnd: true
    },
    where: {
      gameId: id,
    },
    orderBy: {
      createdAt: 'desc'
    }
  })
  return res.status(200).json(ads.map(ad => ({
    ...ad,
    weekDays: ad.weekDays.split(','),
    hourStart: convertMinutes(ad.hourStart),
    hourEnd: convertMinutes(ad.hourEnd)
    })))
})

// Get Discord By Ad
app.get('/ads/:id/discord', async (req, res) => {
  const { id } = req.params
  const ad = await prisma.ad.findUniqueOrThrow({
    select: {
      discord: true,
    },
    where: { id },
  })
  return res.status(200).json({
    discord: ad.discord,
  })

})

// Create Ad
app.post('/ads', async (req, res) => {
  const { name, gameId, weekDays, useVoiceChannel, yearsPlaying, hourStart, hourEnd, discord } = req.body
  const ad = await prisma.ad.create({
    data: {
      name,
      gameId,
      weekDays: weekDays.join(','),
      useVoiceChannel,
      yearsPlaying,
      hourStart: convertHour(hourStart),
      hourEnd: convertHour(hourEnd),
      discord
    }
  })
  return res.status(201).json(ad)
})

app.listen(3000, () => {
  console.log(' app listening on port 3000!')
})