const app = require("./app")
const port = process.env.API_PORT;

(async () => {
  // run migrations in Render, before api starts
  if ('RENDER' in process.env && process.env.RENDER) {
    console.log('RUNNING MIGRATIONS...')
    const db_migrate = require('db-migrate').getInstance(true)
    await db_migrate.up()
    console.log('\n')
  }

  app.listen(port, () => {
    console.log(`api has started on port ${port}`)
  })
})()

module.exports = app