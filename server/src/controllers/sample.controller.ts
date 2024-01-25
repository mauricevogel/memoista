import { Get, JsonController } from 'routing-controllers'

@JsonController('')
export class SampleController {
  @Get()
  async helloWorld() {
    return 'Hello World!'
  }
}
