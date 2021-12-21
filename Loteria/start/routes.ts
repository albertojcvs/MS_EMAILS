import Route from '@ioc:Adonis/Core/Route'
import { Producer } from 'App/Kafka/Producer'

Route.group(() => {
  Route.post('/', 'UsersController.store')

  Route.group(() => {
    Route.get('/', 'UsersController.index')
    Route.get('/:id', 'UsersController.show')
    Route.put('/:id', 'UsersController.update')
    Route.delete('/:id', 'UsersController.destroy')
  }).middleware('auth:api')
}).prefix('/users')

Route.group(() => {
  Route.get('/', 'GamesController.index')
  Route.get('/:id', 'GamesController.show')
  Route.group(() => {
    Route.post('/', 'GamesController.store')
    Route.put('/:id', 'GamesController.update')
    Route.delete('/:id', 'GamesController.destroy')
  }).middleware('auth:api').middleware('isAdmin')
})
  .prefix('/games')

Route.group(() => {
  Route.post('/teste', 'BetsController.storeWithoutPriceCheck')

  Route.post('/', 'BetsController.store')
  Route.get('/', 'BetsController.index')
  Route.get('/:id', 'BetsController.show')
  Route.delete('/:id', 'BetsController.destroy')
})
  .prefix('/bets')
  .middleware('auth:api')

Route.group(() => {
  Route.post('/', 'LoginController.login')
  Route.delete('/', 'LoginController.logout').middleware('auth:api')
}).prefix('/login')

Route.group(() => {
  Route.get('/', 'PermissionsController.index')
  Route.get('/:id', 'PermissionsController.show')
  Route.group(() => {
    Route.post('/', 'PermissionsController.store')
    Route.put('/:id', 'PermissionsController.update')
    Route.delete('/:id', 'PermissionsController.destroy')
  }).middleware('isAdmin')
})
  .prefix('/permissions')
  .middleware('auth:api')

Route.group(() => {
  Route.post('/', 'ResetPasswordController.store')
  Route.put('/', 'ResetPasswordController.resetPassword')
}).prefix('/resetPassword')

Route.group(() => {
  Route.post('/', 'PromoteUserController.promote')
  Route.delete('/', 'PromoteUserController.removePromotion')
})
  .prefix('/promote')
  .middleware('auth:api')
  .middleware('isAdmin')


  Route.group(() => {
    Route.post('/', 'CartsController.store')
  }).prefix('/carts')



  Route.get('/', async () =>{
    const produder = new Producer()

    await produder.produce({topic:'teste',messages:[{value:JSON.stringify({name:'alberto'})}]})
    return 'bbbbbbbbbbb'
  })
