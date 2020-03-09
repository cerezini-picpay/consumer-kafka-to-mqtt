const mqtt = require('mqtt')
const client  = mqtt.connect(
    'tcp://localhost:1883', 
    {
        clientId: 'mqtt-consumer', 
        clean: false
    }
)

let qty = 1

client.on('connect', () => {
    client.subscribe('features/1234', { qos: 1 }, (err) => {
        if (!err) {
            console.log('Conectado')
        }
    })
})

client.on('message', function (topic, message) {
  // message is Buffer
  console.log(`${qty} : `, message.toString())
  qty++
})