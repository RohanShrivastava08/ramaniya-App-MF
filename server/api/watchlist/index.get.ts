import { useSession } from 'h3'

export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig()
  const session = await useSession(event, {
    password: config.session.password,
    name: 'ramaniya-session'
  })
  
  if (!session.data.userId) {
    throw createError({ statusCode: 401, statusMessage: 'Unauthorized' })
  }

  const userId = session.data.userId as string

  const watchlist = await prisma.watchlist.findMany({
    where: { userId },
    select: { fundId: true }
  })

  // Return just the fund IDs for easy lookup on the frontend
  return watchlist.map(item => item.fundId)
})
