import { defineConfig } from 'cypress'
import fs from 'fs'
import http, { Server } from 'http'
import { URL } from 'url'

export default defineConfig({
  e2e: {
    setupNodeEvents(on, config) {
      let server: Server

      on('task', {
        mockServer({ interceptUrl, fixture }: { interceptUrl: string; fixture?: string }) {
          if (server) server.close() // close any previous instance

          const url = new URL(interceptUrl)
          server = http.createServer((req, res) => {
            if (req.url === url.pathname) {
              const data = fixture ? fs.readFileSync(`./cypress/fixtures/${fixture}`) : {}
              res.end(data)
            } else {
              res.end()
            }
          })

          server.listen(url.port)
          console.log(`Mock server listening on port ${url.port}`)

          return null
        }
      })
    }
  }
})
