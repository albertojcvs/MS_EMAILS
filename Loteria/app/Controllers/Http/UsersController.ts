import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

import { DateTime } from 'luxon'

import User from 'App/Models/User'
import Permission from 'App/Models/Permission'

import CreateUserValidator from 'App/Validators/CreateUserValidator'
import UpdateUserValidator from 'App/Validators/UpdateUserValidator'
import { Producer } from 'App/Kafka/Producer'

export default class UsersController {
  async index() {
    return await User.query()
      .select('id', 'username', 'email', 'created_at', 'updated_at','token')
      .preload('bets', (betsQuery) => {
        betsQuery
          .where('created_at', '<=', DateTime.now().toSQL())
          .where('created_at', '>', DateTime.now().minus({ days: 30 }).startOf('day').toSQL())
      })
  }

  async show({ params }: HttpContextContract) {
    const { id } = params
    const user = await User.findOrFail(id)
    await user.load('bets', (betsQuery) => {
      betsQuery
        .where('created_at', '<=', DateTime.now().toSQL())
        .where('created_at', '>=', DateTime.now().minus({ days: 30 }).startOf('day').toSQL())
    })
    await user.load('permissions')
    return {
      id: user.id,
      username: user.username,
      email: user.email,
      created_at: user.createdAt,
      update_at: user.updatedAt,
      token:user.token
    }
  }

  async store({ request }: HttpContextContract) {
    const { username, email, password } = await request.validate(CreateUserValidator)

    const user = await User.create({
      username,
      email,
      password,
    })

    const permission = await Permission.findByOrFail('name', 'player')

    await user.related('permissions').attach([permission.id])

    const userCreated = await User.query()
      .select('id', 'username', 'email', 'created_at', 'updated_at')
      .where('id', user.id)

      const producer = new Producer()

    await producer.produce({
      topic: 'send-email-new-user',
      messages: [
        {
          value: JSON.stringify({
            to: user.email,
            from: 'loteria@loteria.com',
            subject: 'Welcome',
            username,
          }),
        },
      ],
    })
    return userCreated
  }

  async update({ params, request, bouncer }: HttpContextContract) {
    const { id } = params
    await bouncer.authorize('updateUser', id)
    const { username: newUsername } = await request.validate(UpdateUserValidator)
    const user = await User.findOrFail(id)

    user.username = newUsername

    await user.save()
    return {
      id: user.id,
      username: user.username,
      email: user.email,
      created_at: user.createdAt,
      update_at: user.updatedAt,
    }
  }

  async destroy({ params, bouncer }: HttpContextContract) {
    const { id } = params

    const user = await User.findOrFail(id)
    await bouncer.authorize('deleteUser', id)
    await user.delete()

    return { success: { message: 'User has been deleted!' } }
  }
}
