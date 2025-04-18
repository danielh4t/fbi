import { createClient } from 'redis'

// Singleton Redis client
declare global {
  // eslint-disable-next-line no-var
  var _redisClient: ReturnType<typeof createClient> | undefined
}

const redisUrl = process.env.REDIS_URL || 'redis://localhost:6379'
const client = global._redisClient ?? createClient({ url: redisUrl })
if (!global._redisClient) {
  global._redisClient = client
  client.connect().catch((err) => {
    console.error('Redis connection error:', err)
  })
}
export default client