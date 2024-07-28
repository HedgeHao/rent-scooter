import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { ScooterEntity } from '../connection/postgres/entity/scooter.entity'
import { ScooterDto } from './scooter.dto'

@Injectable()
export class ScooterService {
  constructor(
    @InjectRepository(ScooterEntity)
    private readonly scooterRepository: Repository<ScooterEntity>
  ) {}

  async getAllScooters(): Promise<ScooterDto[]> {
    const scooters = await this.scooterRepository.find()
    return scooters
  }
}
