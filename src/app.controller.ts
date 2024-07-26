import { Controller, Get, HttpException, HttpStatus } from '@nestjs/common';
import { AppService } from './app.service';

@Controller('/app')
export class AppController {
  constructor(private readonly appService: AppService) { }

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  @Get('/http_exception')
  testHttpException(): void {
    throw new HttpException('This is forbidden', HttpStatus.FORBIDDEN)
  }

  @Get('/custom_exception')
  testException(): void {
    throw new Error('Custom Exception')
  }
}
