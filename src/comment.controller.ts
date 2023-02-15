import { Controller, Get } from '@nestjs/common';

@Controller()
export class CommentController {
  constructor() {}

  @Get()
  getHello() {
  }
}
