const { Kafka } = require('kafkajs')
const MQTT = require('mqtt')
const dotenv = require('dotenv')

dotenv.config()

const kafka = new Kafka({
  clientId: 'kafka-consumer',
  brokers: [process.env.PICPAY_FLAGS_KAFKA_URI]
})

const consumer = kafka.consumer({ groupId: process.env.PICPAY_FLAGS_KAFKA_GROUP_ID })

const publisher = MQTT.connect(process.env.PICPAY_FLAGS_MQTT_URI)

let qty = 1

const run = async () => {
  await consumer.connect()

  await consumer.subscribe({
    topic: process.env.PICPAY_FLAGS_KAFKA_QUEUE_FEATURE_UPDATE,
    fromBeginning: true
  })

  await consumer.run({
    eachMessage: async ({ topic, partition, message }) => {
      const { body, properties } = JSON.parse(message.value)
      publisher.publish(properties.topic, body, { qos: 1, retain: true })
      console.log(`${qty} : `, new Date())
      qty++
    }
  })
}

publisher.on('connect', run)

const errorTypes = ['unhandledRejection', 'uncaughtException']
const signalTraps = ['SIGTERM', 'SIGINT', 'SIGUSR2']

errorTypes.map(type => {
  process.on(type, async e => {
    try {
      console.log(`process.on ${type}`)
      console.error(e)
      await consumer.disconnect()
      process.exit(0)
    } catch (_) {
      process.exit(1)
    }
  })
})

signalTraps.map(type => {
  process.once(type, async () => {
    try {
      await consumer.disconnect()
    } finally {
      process.kill(process.pid, type)
    }
  })
})
