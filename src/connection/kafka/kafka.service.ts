import { Injectable } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { plainToInstance } from 'class-transformer'
import { Consumer, EachMessagePayload, Kafka, Producer } from 'kafkajs'
import { Define } from 'src/define'

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
      await this.consumer.subscribe({ topic: Define.Kafka.Topic.orderComplete, fromBeginning: true })
      await this.consumer.run({
        eachMessage: this.orderCompleteHandler
      })
    })()
  }

  async produce(topic: string, message: Define.Kafka.Message.Type) {
    await this.producer.send({ topic, messages: [{ value: JSON.stringify(message) }] })
  }

  async orderCompleteHandler(payload: EachMessagePayload): Promise<void> {
    const orderComplete = plainToInstance(Define.Kafka.Message.OrderCompleteMessage, payload.message.value.toString())
    console.log('Order Complete')
    console.log(orderComplete)
  }
}
