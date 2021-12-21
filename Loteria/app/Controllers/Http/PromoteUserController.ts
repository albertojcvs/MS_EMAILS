import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Permission from 'App/Models/Permission'
import User from 'App/Models/User'
import PromoteUserValidator from 'App/Validators/PromoteUserValidator'

export default class PromoteUserController {
  public async promote({ request }: HttpContextContract) {
    const { permission_name, user_id } = await request.validate(PromoteUserValidator)

    const permission = await Permission.findByOrFail('name', permission_name)
    const user = await User.findOrFail(user_id)

    await user.related('permissions').attach([permission.id])
    return { success: { message: 'User was promoted to ' + permission.name } }
  }

  public async removePromotion({ request ,response}: HttpContextContract) {
    const { user_id, permission_name } = await request.validate(PromoteUserValidator)

    if (permission_name === 'player') {
      return response.status(409).send( { error: { message: 'It is not possible remove player permission.' } })
    }

    const permission = await Permission.findByOrFail('name', permission_name)
    const user = await User.findOrFail(user_id)

    await user.load('permissions')

    const userHasThePermission = user.permissions.some(
      (permision) => permision.name === permission_name
    )
    if (userHasThePermission) {
      await user.related('permissions').detach([permission.id])
      return { success: { message: 'The permisision was removed!' } }
    } else {
      return response.status(404).send({
        error: {
          message: 'Can not remove this permission because user does not have it!',
        },
      })
    }
  }
}
