import Game from 'App/Models/Game'
import test from 'japa'
import supertest from 'supertest'
const BASE_URL = `http://${process.env.HOST}:${process.env.PORT}`

test.group('List games', () => {
  test('It should get all games', async (assert) => {
    const { text, statusCode } = await supertest(BASE_URL).get('/games')

    const games = JSON.parse(text)

    assert.equal(statusCode, 200)
    assert.hasAnyKeys(games, ['min-cart-value', 'types'])
  })

  test('It should get a game', async (assert) => {
    const { id, type } = await Game.firstOrFail()
    const { text, statusCode } = await supertest(BASE_URL).get(`/games/${id}`)

    const game = JSON.parse(text)

    assert.equal(statusCode, 200)
    assert.hasAllKeys(game, [
      'id',
      'type',
      'description',
      'range',
      'price',
      'color',
      'max_number',
      'created_at',
      'updated_at',
    ])
    assert.equal(game.type, type)
  })

  test('It should not be able to get a game that does not exist', async (assert) => {
    const id = 4
    const { text, statusCode } = await supertest(BASE_URL).get(`/games/${id}`)
    assert.equal(statusCode, 404)
    assert.hasAnyKeys(JSON.parse(text), ['error'])
  })
})
