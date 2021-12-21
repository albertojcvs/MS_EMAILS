import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Permission from 'App/Models/Permission'
import SavePermissionValidator from 'App/Validators/SavePermissionValidator'

export default class PermissionsController {
  public async index({}: HttpContextContract) {
    return await Permission.all()
  }

  public async store({ request }: HttpContextContract) {

      const data = await request.validate(SavePermissionValidator)

     const permission =  await Permission.create(data)

      return permission

  }

  public async show({ params }: HttpContextContract) {
    const { id } = params
    const permission = await Permission.findOrFail(id)

    return permission
  }

  public async update({ params, request }: HttpContextContract) {
    const { id } = params
    const data = await request.validate(SavePermissionValidator)

    const permission = await Permission.findOrFail(id)
    Object.assign(permission, data)

    await permission.save()
    return permission
  }

  public async destroy({ params }: HttpContextContract) {
    const { id } = params
    const permission = await Permission.findOrFail(id)

    await permission.delete()
    return {success:{message:'Permission has been deleted'}}
  }
}
