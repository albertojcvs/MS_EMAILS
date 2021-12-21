import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Cart from 'App/Models/Cart'

export default class CartsController {

  public async store({request}:HttpContextContract){
    const minValue = request.input('min-value')


   const cart = await Cart.create({minValue})

   return cart;
  }
}
