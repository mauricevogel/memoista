/* eslint-disable @typescript-eslint/no-explicit-any */
import { ClassConstructor, plainToInstance } from 'class-transformer'
import { Action, UseInterceptor } from 'routing-controllers'

export function Serialize(dto: ClassConstructor<any>) {
  return UseInterceptor(function (action: Action, content: any) {
    return plainToInstance(dto, content, {
      excludeExtraneousValues: true
    })
  })
}
