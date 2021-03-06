const mqtt = require('mqtt')
const dotenv = require('dotenv')

dotenv.config()

const client  = mqtt.connect(
    process.env.PICPAY_FLAGS_MQTT_URI, 
    {
        clientId: 'mqtt-consumer', 
        clean: false
    }
)

let qty = 1

client.on('connect', () => {
    client.subscribe('features', { qos: 1 }, (err) => {
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