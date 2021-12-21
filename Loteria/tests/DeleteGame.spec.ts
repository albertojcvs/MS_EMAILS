import Game from 'App/Models/Game'
import test from 'japa'
import supertest from 'supertest'
import { createUser } from './utils/createUser'
import { loginUser } from './utils/loginUser'
const BASE_URL = `http://${process.env.HOST}:${process.env.PORT}`

test.group('Delete a game', () => {
  test('Should be able to delete a game', async (assert) => {
    const { id, range, type, description, max_number, color, price } = await Game.firstOrFail()

    const { user, password } = await createUser(true)

    const token = await loginUser(user.email, password)

    const { statusCode } = await supertest(BASE_URL)
      .del(`/games/${id}`)
      .set({ authorization: `Bearer ${token}`, accpet: 'application/json' })

    const gameDeleted = await Game.find(id)
    assert.equal(statusCode, 200)

    assert.notExists(gameDeleted)

    await Game.create({ range, type, description, max_number, color, price })
    await user.delete()
  })
  test('Should not be able to delete a game without admin permission', async (assert) => {
    let game = await Game.firstOrFail()

    const { user, password } = await createUser()

    const token = await loginUser(user.email, password)

    const { statusCode } = await supertest(BASE_URL)
      .del(`/games/${game.id}`)
      .set({ authorization: `Bearer ${token}`, accpet: 'application/json' })

    game = await Game.findOrFail(game.id)

    assert.equal(statusCode, 403)
    assert.exists(game)

    await user.delete()
  })

  test('Should not be able to delete a game without authentication', async (assert) => {
    let game = await Game.firstOrFail()

    const { user } = await createUser(true)

    const { statusCode } = await supertest(BASE_URL).del(`/games/${game.id}`)

    game = await Game.findOrFail(game.id)

    assert.equal(statusCode, 401)
    assert.exists(game)

    await user.delete()
  })

  test('Should not be able to delete a game  that does not exist', async (assert) => {
    let gamesLength = (await Game.all()).length

    const { user, password } = await createUser(true)

    const token = await loginUser(user.email, password)

    const { text, statusCode } = await supertest(BASE_URL)
      .del(`/games/${gamesLength + 1}`)
      .set({ authorization: `Bearer ${token}`, accpet: 'application/json' })

    assert.equal(statusCode, 404)
    assert.hasAnyKeys(JSON.parse(text), ['error'])
    await user.delete()
  })
})
