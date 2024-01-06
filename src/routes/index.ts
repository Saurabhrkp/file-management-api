import { Router } from 'express'
import { apiLogger } from 'middlewares/apiLogger'
import v1 from './v1'

const router = Router()

// Logging All requests
router.use(apiLogger)

router.use('/v1', v1)

export default router
