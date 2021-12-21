import User from 'App/Models/User'
import test from 'japa'
import supertest from 'supertest'
const BASE_URL = `http://${process.env.HOST}:${process.env.PORT}`

test.group('Create a User', () => {
  test('It should be able to create a user by HTTP request', async (assert) => {
    const data = {
      username: 'albertojcvs',
      email: 'albertojcvs@gmail.com',
      password: '123',
      password_confirmation: '123',
    }
    const { text, statusCode } = await supertest(BASE_URL).post('/users').send(data)

    const { id } = JSON.parse(text)[0]

    const user = await User.findOrFail(id)

    assert.equal(statusCode, 200)

    assert.equal(user.username, data.username)
    assert.equal(user.email, data.email)
    assert.notEqual(user.password, data.password)

    await user.delete()
  })

  test('It should not be able to create two users with same email', async (assert) => {
    const data1 = {
      username: 'albertojcvs',
      email: 'albertojcvs@gmail.com',
      password: '123',
      password_confirmation: '123',
    }
    const data2 = {
      username: 'albertojcs01',
      email: 'albertojcvs@gmail.com',
      password: '123',
      password_confirmation: '123',
    }
    const { text } = await supertest(BASE_URL).post('/users').send(data1)

    const { id } = JSON.parse(text)[0]

    const user1 = await User.findOrFail(id)

    const { statusCode } = await supertest(BASE_URL).post('/users').send(data2)

    assert.equal(statusCode, 422)
    await user1.delete()
  })

  test('It should not be able to create two users with same username', async (assert) => {
    const data1 = {
      username: 'albertojcvs',
      email: 'albertojcvs@gmail.com',
      password: '123',
      password_confirmation: '123',
    }
    const data2 = {
      username: 'albertojcvs',
      email: 'albertojcvs01@gmail.com',
      password: '123',
      password_confirmation: '123',
    }
    const { text } = await supertest(BASE_URL).post('/users').send(data1)

    const { id } = JSON.parse(text)[0]

    const user1 = await User.findOrFail(id)

    const { statusCode } = await supertest(BASE_URL).post('/users').send(data2)

    assert.equal(statusCode, 422)
    await user1.delete()
  })

  test('it should not be able to create a user without a username', async (assert) => {
    const email = 'albertojcvs@gmail.com'
    const { statusCode } = await supertest(BASE_URL).post('/users').send({
      email,
      password: '123',
      password_confiamtion: '123',
    })

    assert.equal(statusCode, 422)

    const user = await User.findBy('email', email)

    assert.notExists(user)
  })

  test('It should not be able to create a user without a email', async (assert) => {
    const username =  'albertojcvs'
    const { statusCode } = await supertest(BASE_URL).post('/users').send({
      username,
      password: '123',
      password_confiamtion: '123',
    })

    assert.equal(statusCode, 422)

    const user = await User.findBy('username', username)

    assert.notExists(user)
  })

  test('It should not be able to create a user without a password', async (assert) => {
    const email = 'albertojcvs@gmail.com'
    const { statusCode } = await supertest(BASE_URL).post('/users').send({
      username: 'albertojcvs',
      email: email,
    })
    assert.equal(statusCode, 422)

    const user = await User.findBy('email', email)

    assert.notExists(user)
  })


  test('It should not be able to create a user without a password confirmation', async (assert) => {
    const email = 'albertojcvs@gmail.com'
    const { statusCode } = await supertest(BASE_URL).post('/users').send({
      username: 'albertojcvs',
      email: email,
      password:'123'
    })
    assert.equal(statusCode, 422)

    const user = await User.findBy('email', email)

    assert.notExists(user)
  })

  test('It should hash the password after create a user', async (assert) => {
    const data = {
      username: 'albertojcvs',
      email: 'albertojcvs@gmail.com',
      password: '123',
      password_confirmation: '123',
    }
    const { text, statusCode } = await supertest(BASE_URL).post('/users').send(data)

    const { id } = JSON.parse(text)[0]

    const user = await User.findOrFail(id)

    assert.equal(statusCode, 200)
    assert.notEqual(user.password, data.password)

    await user.delete()
  })
})
