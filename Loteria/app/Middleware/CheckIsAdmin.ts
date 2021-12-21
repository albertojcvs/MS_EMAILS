import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import User from 'App/Models/User'

export default class CheckIsAdmin {
  public async handle({ auth, response }: HttpContextContract, next: () => Promise<void>) {
    if (!auth.user) {
      return ''
    } else {
      const user = await User.findOrFail(auth.user.id)
      await user.load('permissions')

      const isAdmin = user.permissions.some((permission) => permission.name === 'admin')

      if (isAdmin) await next()
      else response.status(403).send({error:{message:'Only admins can use this route!'}})
    }
  }
}
