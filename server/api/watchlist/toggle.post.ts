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
  const body = await readBody(event)
  
  if (!body.fundId) {
    throw createError({ statusCode: 400, statusMessage: 'Fund ID required' })
  }

  const fundId = body.fundId

  // Check if already in watchlist
  const existing = await prisma.watchlist.findUnique({
    where: {
      userId_fundId: {
        userId,
        fundId
      }
    }
  })

  if (existing) {
    // Remove if exists
    await prisma.watchlist.delete({
      where: {
        id: existing.id
      }
    })
    return { success: true, action: 'removed' }
  } else {
    // Add if not exists
    await prisma.watchlist.create({
      data: {
        userId,
        fundId
      }
    })
    return { success: true, action: 'added' }
  }
})
