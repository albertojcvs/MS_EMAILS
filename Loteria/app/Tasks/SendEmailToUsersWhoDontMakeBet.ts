import { BaseTask } from 'adonis5-scheduler/build'
import { Producer } from 'App/Kafka/Producer'
import User from 'App/Models/User'
import { DateTime } from 'luxon'

export default class SendEmailToUsersWhoDontMakeBet extends BaseTask {
  public static get schedule() {
    return '1,10,20,30,40,50 * * * * *'
  }
  public static get useLock() {
    return false
  }

  public async handle() {
    const usersAndLastBet = await User.query().preload('bets', (betsQuery) => {
      betsQuery.orderBy('created_at', 'desc').limit(1)
    })

    for (const user of usersAndLastBet) {
      const lastBet = user.bets[0]
      const prazoEmSegundos = 7 * 24 * 60 * 60 // 1 semana: 7 dias * 24 horas * 60 minutos * 60 segundos
      if (lastBet) {
        if (
          DateTime.now().startOf('day').toSeconds() -
            lastBet.createdAt.startOf('day').toSeconds() >=
          prazoEmSegundos
        ) {
        }
      } else {
      }
    }
  }
}
