import EmbeddedPostgres from 'embedded-postgres'
import path from 'path'
import { fileURLToPath } from 'url'
import { existsSync } from 'fs'

const dirname = path.dirname(fileURLToPath(import.meta.url))
const databaseDir = path.resolve(dirname, '../.local-pg-data')

const pg = new EmbeddedPostgres({
  databaseDir,
  user: 'postgres',
  password: 'postgres',
  port: 5432,
  persistent: true,
})

async function main() {
  if (!existsSync(path.join(databaseDir, 'PG_VERSION'))) {
    console.log('Initialising cluster...')
    await pg.initialise()
  }
  console.log('Starting postgres...')
  await pg.start()
  try {
    await pg.createDatabase('parissa')
    console.log('Created database parissa')
  } catch {
    console.log('Database parissa likely already exists')
  }
  console.log('Postgres is running on port 5432. Press Ctrl+C to stop.')
}

main()
