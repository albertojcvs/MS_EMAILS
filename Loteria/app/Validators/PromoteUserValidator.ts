import { schema, rules } from '@ioc:Adonis/Core/Validator'
import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

export default class PromoteUserValidator {
  constructor(protected ctx: HttpContextContract) {}

  public schema = schema.create({
    user_id: schema.number([rules.required(), rules.exists({ table: 'users', column: 'id' })]),
    permission_name: schema.string({ trim: true }, [
      rules.required(),
      rules.exists({ table: 'permissions', column: 'name' }),
    ]),
  })

  public messages = {
    'required': 'The {{ field }} is required to promote a user!',
    'permission_name.exists': 'There in no permission with this name!',
    'user_id.exists': 'There in no user with this id!',
  }
}
