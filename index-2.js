/*
Tentarei me conectar a fila kafka e ouvir por mensagens na fila definida
    Se falhar a conexão, inicialmente ou posteriormente, espero alguns segundos e tento me conectar novamente
    Criou log da falha na conexão, assim como na conexão
Conectei com sucesso
    Log da conexão
Tento me conectar ao mqtt, se já não conectado
    Se falhar a conexão, inicialmente ou posteriormente, espero alguns segundos e tento me conectar novamente
    Se falhar não devo dar ack na fila do kafka, o processo deve ficar em standby
Envio a mensagem para o mqtt
    Atualizo o kafka
    Log sucesso

async function bakeMeSomeBurgers () {
  let canIHave = await canIHazACheezBurger();
  if (canIHave)
    console.log('Hehe, you can have...');
  else
    console.log('NOPE');

  // Here we create an await our promise:
  await new Promise((resolve, reject) => {
    // Here invoke our event emitter:
    let cook = new BurgerCooking('cheez');
    // a normal event callback:
    cook.on('update', percent => {
      console.log(`The burger is ${percent}% done`);
    });
    cook.on('end', resolve); // call resolve when its done
    cook.on('error', reject); // don't forget this
  });

  console.log('I\'ve finished the burger!');
  if (canIHave)
    console.log('Here, take it :)');
  else
    console.log('Too bad you can\'t have it >:)');
}

*/

const { Kafka } = require('kafkajs')
const dotenv = require('dotenv')

dotenv.config()

const kafka = new Kafka({
  clientId: 'kafka-consumer',
  brokers: [process.env.PICPAY_FLAGS_KAFKA_URI]
})

const topic = 'features'
const consumer = kafka.consumer({ groupId: 'flags' })

const run = async () => {
  await consumer.connect()
  await consumer.subscribe({ topic, fromBeginning: true })
  await consumer.run({

    eachMessage: async ({ topic, partition, message }) => {
      const { body, properties } = JSON.parse(message.value)
    }
  })
}

run()
