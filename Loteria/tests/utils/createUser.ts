import Permission from "App/Models/Permission"
import User from "App/Models/User"

export async function createUser(isAdmin = false) {
  const email = 'user@user.com'
  const password = '12345'
  const user = await User.create({
    username: 'user',
    email,
    password,
  })
  if (isAdmin) {
    const adminPermission = await Permission.findByOrFail('name', 'admin')

    user.related('permissions').attach([adminPermission.id])
  }
  return {user,password}
}
