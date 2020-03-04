const mqtt = require('mqtt')
const client  = mqtt.connect('tcp://localhost:1883')

client.on('connect', () => {
    client.subscribe('features/1234', (err) => {
        if (!err) {
            console.log('Conectado')
        }
    })
})

client.on('message', function (topic, message) {
  // message is Buffer
  console.log(message.toString())
  client.end()
})