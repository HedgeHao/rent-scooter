import { Injectable } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { plainToInstance } from 'class-transformer'
import { Consumer, EachMessagePayload, Kafka, Producer, logLevel } from 'kafkajs'
import { Define } from '../../define'

@Injectable()
export class KafkaService {
  private kafka: Kafka
  private producer: Producer
  private consumer: Consumer

  constructor(private readonly configService: ConfigService) {
    this.kafka = new Kafka({
      clientId: 'rent-scooter-kafka',
      brokers: configService.get<string>('KAFKA_BROKERS').split(','),
      logLevel: logLevel.ERROR
    })
    this.producer = this.kafka.producer()
    this.consumer = this.kafka.consumer({ groupId: 'rent-checker-group' })
    ;(async () => {
      await this.producer.connect()
      await this.consumer.connect()
      await this.consumer.subscribe({ topic: Define.Kafka.Topic.rentComplete, fromBeginning: false })
      await this.consumer.run({
        eachMessage: this.rentCompleteHandler
      })
    })()
  }

  async produce(topic: string, message: Define.Kafka.Message.Type) {
    await this.producer.send({ topic, messages: [{ value: JSON.stringify(message) }] })
  }

  async rentCompleteHandler(payload: EachMessagePayload): Promise<void> {
    const rentComplete = plainToInstance(Define.Kafka.Message.rentCompleteMessage, payload.message.value.toString())
    console.log('=======Kafka Consumer========')
    console.log('Rent Complete')
    console.log(rentComplete)
    console.log('=======Kafka Consumer========')
  }
}
