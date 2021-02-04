const express = require('express')

const private_app = express()
// put the public endpoints (post location data) on their own port
// so we can easily separate the traffic
const public_app = express() 

public_app.use(express.json())
public_app.use(express.urlencoded({ extended: true }))

var Datastore = require('nedb')
  , db = new Datastore({ filename: __dirname + '/db/db', autoload: true, timestampData: true })

db.ensureIndex({ fieldName: 'createdAt', expireAfterSeconds: 60*60*24*31 }) // one month
db.ensureIndex({ fieldName: 'label' })

public_app.post('/', function (req, res) {
  if (!req.query.asset) throw new Error('Missing fields')
  let asset = req.body
  asset.label = req.query.asset
  db.insert(asset, (err, newDoc) => {
    if (err) throw err;
    res.send('OK')
  })
})

private_app.use('/', express.static( __dirname + "/public"))

private_app.get('/asset/:asset', function (req, res) {
  db.find({label: req.params.asset},(err, assets) => {
    res.send(assets)
  })
})

private_app.listen(3001)
public_app.listen(3000)
