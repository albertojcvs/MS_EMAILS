import { schema, rules } from '@ioc:Adonis/Core/Validator'
import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

export default class CreateBetValidator {
  constructor(protected ctx: HttpContextContract) {}

  public schema = schema.create({
    bets: schema.array([rules.required()]).members(
      schema.object().members({
        user_id: schema.number([rules.required(), rules.exists({ table: 'users', column: 'id' })]),
        game_id: schema.number([rules.required(), rules.exists({ table: 'games', column: 'id' })]),
        numbers: schema.array([rules.required()]).members(schema.number([rules.unsigned()])),
      })
    ),
  })


  public messages = {
    'required': 'The {{ field }} is necessary to create bets!',
    'game_id.exists': 'The game must exist to create a bet! ',
    'user.exists': 'The user must exist to create a bet! ',
    'unsigned': "The numbers can't be negative!",
    'exists': 'The {{ field }} must exist',
    'cartPrice.range':'The bets total must be greater than R$30,00'
  }
}
