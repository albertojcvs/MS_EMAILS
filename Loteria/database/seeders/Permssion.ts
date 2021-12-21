import BaseSeeder from '@ioc:Adonis/Lucid/Seeder'
import Permission from 'App/Models/Permission'

export default class PermssionSeeder extends BaseSeeder {
  public async run () {
   await Permission.createMany([
     {name:'player'},
     {name:'admin'}
   ])
  }
}
