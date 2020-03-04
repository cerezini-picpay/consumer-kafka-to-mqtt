const { Kafka } = require('kafkajs')
const MQTT = require('mqtt')

// const host = 'localhost'
// const host = process.env.HOST_IP || ip.address()

const kafka = new Kafka({
  // logLevel: logLevel.INFO,
  clientId: 'kafka-consumer',
  brokers: ['localhost:29092'],
})

const topic = 'features'
const consumer = kafka.consumer({ groupId: 'flags' })

const publisher = MQTT.connect('tcp://localhost:1883')

const run = async () => {    
    await consumer.connect()
    await consumer.subscribe({ topic, fromBeginning: true })
    await consumer.run({
    // eachBatch: async ({ batch }) => {
    //   console.log(batch)
    // },
    eachMessage: async ({ topic, partition, message }) => {
      const prefix = `${topic}[${partition} | ${message.offset}] / ${message.timestamp}`
      console.log(`- ${prefix} ${message.key}#${message.value}`)

      publisher.publish('features/1234', message.value)
      console.log('Mensagem enviada para mqtt')
    },
  })
}

publisher.on('connect', run)
//run().catch(e => console.error(`[example/consumer] ${e.message}`, e))

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