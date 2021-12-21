import { schema, rules } from '@ioc:Adonis/Core/Validator'
import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

export default class ResetPasswordValidator {
  constructor(protected ctx: HttpContextContract) {}

  public schema = schema.create({
    token: schema.string({ trim: true }, [
      rules.required(),
      rules.exists({ table: 'users', column: 'token' }),
    ]),
    password: schema.string({ trim: true }, [rules.required(), rules.confirmed()]),
  })

  public messages = {
    'required':'The {{ field }} is required to reset password!',
    'token.exists': "The token does not exist!",
    'password.confirmed': 'The passwords have to be equal!'
  }
}
