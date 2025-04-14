import 'dotenv/config'

import http from '@/api/http'
import ws from '@/api/ws'

ws(http())
