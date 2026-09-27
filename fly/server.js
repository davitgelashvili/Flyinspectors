// cPanel / Phusion Passenger-ის startup file.
// Passenger `next start`-ს ვერ უშვებს, ამიტომ Next-ს პროგრამულად ვუშვებთ.
const http = require('http')
const next = require('next')

const port = process.env.PORT || 3000
const app = next({ dev: false })
const handle = app.getRequestHandler()

app.prepare().then(() => {
  http.createServer((req, res) => handle(req, res)).listen(port, () => {
    console.log(`Next.js ready on port ${port}`)
  })
})
