import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

import { DateTime } from 'luxon'
import crypto from 'crypto'

import User from 'App/Models/User'
import CreateResetPasswordValidator from 'App/Validators/CreateResetPasswordValidator'
import ResetPasswordValidator from 'App/Validators/ResetPasswordValidator'
import { Producer } from 'App/Kafka/Producer'

export default class ResetPasswordController {
  public async store({ request }: HttpContextContract) {
    const { email, url } = await request.validate(CreateResetPasswordValidator)

    const user = await User.findByOrFail('email', email)
    user.token = crypto.randomBytes(10).toString('hex')
    user.token_created_at = DateTime.now()

    await user.save()

    const producer = new Producer()
    await producer.produce({
      topic: 'send-email-reset-password',
      messages: [
        {
          value: JSON.stringify({
            to: user.email,
            from: 'loteria@loteria.com',
            subject: 'Reset Password',
            username: user.username,
            url,
          }),
        },
      ],
    })
  }
  public async resetPassword({ request, response }: HttpContextContract) {
    const { password, token } = await request.validate(ResetPasswordValidator)

    const user = await User.findByOrFail('token', token)

    const periodInSeconds = 1 * 60 * 60 // 1 hour:  1 hour *  60 minutes * 60 seconds

    if (user.token && user.token_created_at) {
      const isTokenExpired =
        DateTime.now().toSeconds() - user.token_created_at.toSeconds() > periodInSeconds

      if (isTokenExpired) {
        return response.status(401).send({ error: { message: 'This token has expired' } })
      }

      user.password = password
      user.token = null
      user.token_created_at = null
      await user.save()

      const producer = new Producer()
      await producer.produce({
        topic: 'send-email-password-reseted',
        messages: [
          {
            value: JSON.stringify({
              to: user.email,
              from: 'loteria@loteria.com',
              subject: 'Your password was reseted',
              username: user.username,
            }),
          },
        ],
      })
    } else {
      return response.status(409).send({ error: { message: 'The user does not have a token!' } })
    }
  }
}
