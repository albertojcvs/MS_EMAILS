import { schema, rules } from '@ioc:Adonis/Core/Validator'
import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

export default class CreateResetPasswordValidator {
  constructor(protected ctx: HttpContextContract) {}

  public schema = schema.create({
    email: schema.string({ trim: true }, [
      rules.required(),
      rules.email(),
      rules.exists({ table: 'users', column: 'email' }),
    ]),
    url:schema.string({trim:true}, [rules.url(),rules.required()])
  })

  public messages = {
    'required':'The {{ field }} is required to reset password!',
    'email': 'The email format is not correct!',
    'exists': "It's not possible reset a password of a nonexistant user!",
    'url': 'The url format is not correct!'
  }
}
