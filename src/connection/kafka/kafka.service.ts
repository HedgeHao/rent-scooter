import { Injectable } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { Consumer, EachMessagePayload, Kafka, Producer } from 'kafkajs'

@Injectable()
export class KafkaService {
  private kafka: Kafka
  private producer: Producer
  private consumer: Consumer

  constructor(private readonly configService: ConfigService) {
    this.kafka = new Kafka({
      clientId: 'rent-scooter-kafka',
      brokers: configService.get<string>('KAFKA_BROKERS').split(',')
    })
    this.producer = this.kafka.producer()
    this.consumer = this.kafka.consumer({ groupId: 'order-checker-group' })
    ;(async () => {
      await this.producer.connect()
      await this.consumer.connect()
      await this.consumer.subscribe({ topic: 'order-expiration', fromBeginning: true })
      await this.consumer.run({
        eachMessage: this.orderExpirationHandler
      })
    })()
  }

  async produce(topic: string, message: any) {
    await this.producer.send({ topic, messages: [{ value: JSON.stringify(message) }] })
  }

  async orderExpirationHandler(payload: EachMessagePayload): Promise<void> {
    console.log(payload.message.value.toString())
  }
}
