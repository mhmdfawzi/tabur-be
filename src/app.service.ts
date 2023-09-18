import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  getHello(): string {
    return 'Hello, I am Tabur backend service, designed to provide information for the frontend. Greetings!';
  }
}
