import User from 'App/Models/User'
import test from 'japa'
import supertest from 'supertest'
const BASE_URL = `http://${process.env.HOST}:${process.env.PORT}`

test.group('Authenticate user', () => {
  test('It should be able to authenticate a user', async (assert) => {
    const email = 'albertojcvs@gmail.com'
    const password = '123'
    await supertest(BASE_URL).post('/users').send({
      username: 'albertojcvs',
      email,
      password,
      password_confirmation: password,
    })

    const user = await User.findByOrFail('email', email)

    const { text, statusCode } = await supertest(BASE_URL).post('/login').send({ email, password })

    const { token, userData } = JSON.parse(text)

    assert.equal(statusCode, 200)
    assert.exists(token, userData)
    assert.equal(userData.email, email)
    await user.delete()
  })

  test('It should not be able to authenticate a user without email', async (assert) => {
    const email = 'albertojcvs@gmail.com'
    const password = '123'
    await supertest(BASE_URL).post('/users').send({
      username: 'albertojcvs',
      email,
      password,
      password_confirmation: password,
    })

    const user = await User.findByOrFail('email', email)

    const { text, statusCode } = await supertest(BASE_URL).post('/login').send({ password })

    const response = JSON.parse(text)
    assert.equal(statusCode, 422)

    assert.hasAnyKeys(response, ['errors'])

    await user.delete()
  })

  test('It should not be able to authenticate a user without password', async (assert) => {
    const email = 'albertojcvs@gmail.com'
    const password = '123'
    await supertest(BASE_URL).post('/users').send({
      username: 'albertojcvs',
      email,
      password,
      password_confirmation: password,
    })

    const user = await User.findByOrFail('email', email)

    const { text, statusCode } = await supertest(BASE_URL).post('/login').send({ email })

    const response = JSON.parse(text)
    assert.equal(statusCode, 422)

    assert.hasAnyKeys(response, ['errors'])

    await user.delete()
  })

  test("It should not be able to authenticate a user who doesn't exist", async (assert) => {
    const { text, statusCode } = await supertest(BASE_URL)
      .post('/login')
      .send({ email: 'albertojcvs@gmail.com', password: '123' })
    const response = JSON.parse(text)
    assert.equal(statusCode, 401)

    assert.hasAnyKeys(response, ['error'])
  })
})
