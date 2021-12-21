import { schema, rules } from '@ioc:Adonis/Core/Validator'
import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

export default class CreateGameValidator {
  constructor(protected ctx: HttpContextContract) {}

  public schema = schema.create({
    type: schema.string({ trim: true }, [
      rules.required(),
      rules.unique({ table: 'games', column: 'type' }),
    ]),
    description: schema.string({ trim: true }, [rules.required()]),
    range: schema.number([rules.range(1, Number.MAX_SAFE_INTEGER), rules.required()]),
    price: schema.number([rules.required()]),
    color: schema.string({ trim: true }, [rules.required()]),
    max_number: schema.number([rules.required(), rules.range(1, Number.MAX_SAFE_INTEGER)]),
  })

  public messages = {}
}
