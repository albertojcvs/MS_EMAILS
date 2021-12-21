import Bet from 'App/Models/Bet'
import Game from 'App/Models/Game'
import test from 'japa'
import supertest from 'supertest'
import { createUser } from './utils/createUser'
import { loginUser } from './utils/loginUser'
const BASE_URL = `http://${process.env.HOST}:${process.env.PORT}`

function getRandomNumbers(lenght: number, range: number): number[] {
  const arrayWithAllAvailableNumbers: number[] = Array().fill(0, 0, range - 1)

  const choosedNumbers: number[] = []

  for (let i = 0; i < range; i++) {
    arrayWithAllAvailableNumbers[i] = i + 1
  }

  for (let i = 0; i < lenght; i++) {
    const index = Math.ceil(Math.random() * (arrayWithAllAvailableNumbers.length - 1))

    choosedNumbers.push(arrayWithAllAvailableNumbers[index])
    arrayWithAllAvailableNumbers.splice(index, 1)
  }

  choosedNumbers.sort()

  return choosedNumbers
}

test.group('Create a Mega-Sena bet', () => {
  test('It should be able to create a Mega-Sena bet', async (assert) => {
    const { user, password } = await createUser()
    const token = await loginUser(user.email, password)
    const MegaSenaGame = await Game.findByOrFail('type', 'Mega-Sena')

    const numbers = getRandomNumbers(MegaSenaGame?.max_number, MegaSenaGame?.range)

    const { text, statusCode } = await supertest(BASE_URL)
      .post('/bets/teste')
      .send({
        bets: [
          {
            user_id: user.id,
            game_id: MegaSenaGame.id,
            numbers,
          },
        ],
      })
      .set({ authorization: `Bearer ${token}`, accpet: 'application/json' })
    const { id } = JSON.parse(text)[0]

    const bet = await Bet.findOrFail(id)

    assert.equal(statusCode, 200)
    assert.exists(bet)
    assert.equal(bet.user_id, user.id)
    assert.equal(bet.game_id, MegaSenaGame.id)
    assert.equal(bet.numbers, numbers.join(', '))
    await bet.delete()
    await user.delete()
  })

  test('It should be able to create several Mega-Sena bet', async (assert) => {
    const { user, password } = await createUser()
    const token = await loginUser(user.email, password)
    const MegaSenaGame = await Game.findByOrFail('type', 'Mega-Sena')

    const numbers1 = [1, 2, 3, 4, 5, 6]
    const numbers2 = [1, 2, 3, 4, 5, 7]

    const { text, statusCode } = await supertest(BASE_URL)
      .post('/bets/teste')
      .send({
        bets: [
          {
            user_id: user.id,
            game_id: MegaSenaGame.id,
            numbers: numbers1,
          },
          {
            user_id: user.id,
            game_id: MegaSenaGame.id,
            numbers: numbers2,
          },
        ],
      })
      .set({ authorization: `Bearer ${token}`, accpet: 'application/json' })

    const data1 = JSON.parse(text)[0]
    const data2 = JSON.parse(text)[1]

    const bet1 = await Bet.findOrFail(data1.id)
    const bet2 = await Bet.findOrFail(data2.id)

    assert.equal(statusCode, 200)
    assert.exists(bet1)
    assert.equal(bet1.user_id, user.id)
    assert.equal(bet1.game_id, MegaSenaGame.id)
    assert.equal(bet1.numbers, numbers1.join(', '))

    assert.exists(bet2)
    assert.equal(bet2.user_id, user.id)
    assert.equal(bet2.game_id, MegaSenaGame.id)
    assert.equal(bet2.numbers, numbers2.join(', '))

    await bet1.delete()
    await bet2.delete()
    await user.delete()
  })

  test('It should not be possible to create a Mega-Sena bet  without authentication', async (assert) => {
    const { user } = await createUser()
    const MegaSenaGame = await Game.findByOrFail('type', 'Mega-Sena')

    const numbers = getRandomNumbers(MegaSenaGame?.max_number, MegaSenaGame?.range)

    const { statusCode } = await supertest(BASE_URL)
      .post('/bets/teste')
      .send({
        bets: [
          {
            user_id: user.id,
            game_id: MegaSenaGame.id,
            numbers,
          },
        ],
      })
    const bet = await Bet.query()
      .select('*')
      .where('user_id', user.id)
      .andWhere('game_id', MegaSenaGame.id)
      .andWhere('numbers', numbers.join(', '))
      .first()
    assert.equal(statusCode, 401)
    assert.notExists(bet)

    await user.delete()
  })

  test('It should not be able to create a Mega-Sena bet that has a number greater than the Mega-Sena range', async (assert) => {
    const { user, password } = await createUser()
    const token = await loginUser(user.email, password)
    const MegaSenaGame = await Game.findByOrFail('type', 'Mega-Sena')

    const numbers = getRandomNumbers(MegaSenaGame?.max_number, MegaSenaGame?.range)
    numbers[MegaSenaGame.max_number - 1] = MegaSenaGame.range + 1

    const { statusCode } = await supertest(BASE_URL)
      .post('/bets/teste')
      .send({
        bets: [
          {
            user_id: user.id,
            game_id: MegaSenaGame.id,
            numbers,
          },
        ],
      })
      .set({ authorization: `Bearer ${token}`, accpet: 'application/json' })

    const bet = await Bet.query()
      .select('*')
      .where('user_id', user.id)
      .andWhere('game_id', MegaSenaGame.id)
      .andWhere('numbers', numbers.join(', '))
      .first()

    assert.equal(statusCode, 409)
    assert.notExists(bet)
    await user.delete()
  })

  test('It should not be able to create a Mega-Sena Bet that have less numbers than the Mega-Sena minimum', async (assert) => {
    const { user, password } = await createUser()
    const token = await loginUser(user.email, password)
    const MegaSenaGame = await Game.findByOrFail('type', 'Mega-Sena')

    const numbers = getRandomNumbers(MegaSenaGame.max_number, MegaSenaGame.range)
    numbers.pop()

    const { statusCode } = await supertest(BASE_URL)
      .post('/bets/teste')
      .send({
        bets: [
          {
            user_id: user.id,
            game_id: MegaSenaGame.id,
            numbers,
          },
        ],
      })
      .set({ authorization: `Bearer ${token}`, accpet: 'application/json' })

    const bet = await Bet.query()
      .select('*')
      .where('user_id', user.id)
      .andWhere('game_id', MegaSenaGame.id)
      .andWhere('numbers', numbers.join(', '))
      .first()

    assert.equal(statusCode, 409)
    assert.notExists(bet)
    await user.delete()
  })

  test('It should not be able to create a Mega-Sena Bet that has already been created', async (assert) => {
    const { user, password } = await createUser()
    const token = await loginUser(user.email, password)
    const MegaSenaGame = await Game.findByOrFail('type', 'Mega-Sena')

    const numbers = getRandomNumbers(MegaSenaGame.max_number, MegaSenaGame.range)

    await supertest(BASE_URL)
      .post('/bets/teste')
      .send({
        bets: [
          {
            user_id: user.id,
            game_id: MegaSenaGame.id,
            numbers,
          },
        ],
      })
      .set({ authorization: `Bearer ${token}`, accpet: 'application/json' })

    const { statusCode } = await supertest(BASE_URL)
      .post('/bets/teste')
      .send({
        bets: [
          {
            user_id: user.id,
            game_id: MegaSenaGame.id,
            numbers,
          },
        ],
      })
      .set({ authorization: `Bearer ${token}`, accpet: 'application/json' })

    const bet = await Bet.query()
      .select('*')
      .where('user_id', user.id)
      .andWhere('game_id', MegaSenaGame.id)
      .andWhere('numbers', numbers.join(', '))

    assert.equal(statusCode, 409)
    assert.equal(bet.length, 1)

    await bet[0].delete()
    await user.delete()
  })

  test('It should be able to create a Mega-Sena bet with cart price check', async (assert) => {
    const { user, password } = await createUser()
    const token = await loginUser(user.email, password)
    const MegaSenaGame = await Game.findByOrFail('type', 'Mega-Sena')

    const { text, statusCode } = await supertest(BASE_URL)
      .post('/bets')
      .send({
        bets: [
          {
            user_id: user.id,
            game_id: MegaSenaGame.id,
            numbers: [1, 2, 3, 4, 5, 6],
          },
          {
            user_id: user.id,
            game_id: MegaSenaGame.id,
            numbers: [1, 2, 3, 4, 5, 7],
          },
          {
            user_id: user.id,
            game_id: MegaSenaGame.id,
            numbers: [1, 2, 3, 4, 5, 8],
          },
          {
            user_id: user.id,
            game_id: MegaSenaGame.id,
            numbers: [1, 2, 3, 4, 5, 9],
          },
          {
            user_id: user.id,
            game_id: MegaSenaGame.id,
            numbers: [1, 2, 3, 4, 5, 10],
          },
          {
            user_id: user.id,
            game_id: MegaSenaGame.id,
            numbers: [1, 2, 3, 4, 5, 11],
          },
          {
            user_id: user.id,
            game_id: MegaSenaGame.id,
            numbers: [1, 2, 3, 4, 5, 12],
          },
          {
            user_id: user.id,
            game_id: MegaSenaGame.id,
            numbers: [1, 2, 3, 4, 5, 13],
          },
          {
            user_id: user.id,
            game_id: MegaSenaGame.id,
            numbers: [1, 2, 3, 4, 5, 14],
          },
        ],
      })
      .set({ authorization: `Bearer ${token}`, accpet: 'application/json' })
    const bets = JSON.parse(text)

    assert.equal(statusCode, 200)
    assert.exists(bets)
    assert.isArray(bets)
    assert.equal(bets.length, 9)

    await Bet.truncate()
    await user.delete()
  })
})
