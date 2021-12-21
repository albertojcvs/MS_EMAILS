import BaseSeeder from '@ioc:Adonis/Lucid/Seeder'
import Permission from 'App/Models/Permission'
import User from 'App/Models/User'

export default class UserSeeder extends BaseSeeder {
  public async run () {
    const userPlayer = await User.create({
      username:'albertojcvsPlayer',
      email: 'albertojcvsplayer@gmail.com',
      password:'12345',

    })
    const adminPermission = await Permission.findByOrFail('name','admin')
    const playerPermission = await Permission.findByOrFail('name','player')


  await  userPlayer.related('permissions').attach([playerPermission.id])


    const userAdmin = await User.create({
      username:'albertojcvsAdmin',
      email: 'albertojcvsadmin@gmail.com',
      password:'12345',
    })

  await  userAdmin.related('permissions').attach([adminPermission.id,playerPermission.id])
  }
}
