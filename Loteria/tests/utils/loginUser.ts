
import supertest from 'supertest'
const BASE_URL = `http://${process.env.HOST}:${process.env.PORT}`

export async function loginUser(email: string, password: string) {
  const loginResponse = await supertest(BASE_URL).post('/login').send({
    email,
    password,
  })

  const { token } = JSON.parse(loginResponse.text).token
  return token
}
