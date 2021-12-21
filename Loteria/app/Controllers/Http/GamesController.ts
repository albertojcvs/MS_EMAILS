import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Cart from 'App/Models/Cart'
import Game from 'App/Models/Game'
import SaveGameValidator from 'App/Validators/SaveGameValidator'

export default class GamesController {
  public async index({}: HttpContextContract) {
    const games = await Game.all()

    const cart = await Cart.firstOrFail()

    return {
      'min-cart-value': cart.minValue,
      'types': games,
    }
  }

  public async store({ request }: HttpContextContract) {
    const data = await request.validate(SaveGameValidator)

    const game = await Game.create(data)

    return game
  }

  public async show({ params }: HttpContextContract) {
    const { id } = params
    const game = await Game.findOrFail(id)
    return game
  }

  public async update({ params, request }: HttpContextContract) {
    const { id } = params
    const game = await Game.findOrFail(id)

    const data = await request.validate(SaveGameValidator)

    Object.assign(game, data)

    await game.save()

    return game
  }

  public async destroy({ params }: HttpContextContract) {
    const { id } = params
    const game = await Game.findOrFail(id)
    await game.delete()

    return { sucess: { message: 'Game has been deleted!' } }
  }
}
