import { schema, rules } from '@ioc:Adonis/Core/Validator'
import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

export default class UpdateUserValidator {
  constructor(protected ctx: HttpContextContract) {}

  public schema = schema.create({
    username: schema.string({ trim: true }, [
      rules.unique({ table: 'users', column: 'username' }),
      rules.required(),
    ]),
  })

  public messages = {
    'username.required':'The username is required to update an user!'
  }
}
