import { createStorage } from 'unstorage'
import fsLiteDriver from 'unstorage/drivers/fs-lite'

export default createStorage({
    driver: fsLiteDriver({ base: './storage' }),
})

export { type Storage, prefixStorage } from 'unstorage'
