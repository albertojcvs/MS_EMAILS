import { schema, rules } from '@ioc:Adonis/Core/Validator'
import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

export default class CreatePermissionValidator {
  constructor(protected ctx: HttpContextContract) {}

  public schema = schema.create({
    name: schema.string({ trim: true }, [
      rules.required(),
      rules.unique({ table: 'permissions', column: 'name' }),
    ]),
  })

  public messages = {
    'required': 'The {{ field }} is necessary to create a new permission!',
    'unique':'The {{ field }} is not available!'
  }
}
