import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import User from 'App/Models/User'
import LoginValidator from 'App/Validators/LoginValidator'

export default class LoginCotroller {
  async login({ request, auth }: HttpContextContract) {
    const { email, password } = await request.validate(LoginValidator)

    const token = await auth.use('api').attempt(email, password)

    const user = await User.query()
      .select('id', 'username', 'email', 'created_at', 'updated_at')
      .where('email', email)
      .preload('permissions', (permissionsQuery) => {
        permissionsQuery.select('id','name')
      }).firstOrFail()

    return {
      token,
      userData: user,
    }
  }
  async logout({ auth }: HttpContextContract) {
    await auth.use('api').revoke()
    return { success: { message: 'User logout' } }
  }
}
