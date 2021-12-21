import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class Bets extends BaseSchema {
  protected tableName = 'bets'

  public async up () {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')

      table
      .integer('user_id')
      .notNullable()
      .unsigned()
      .references('users.id')
      .onDelete('CASCADE')

      table
      .integer('game_id')
      .notNullable()
      .unsigned()
      .references('games.id')
      .onDelete('CASCADE')

      table
      .string('numbers')
      .notNullable()



      /**
       * Uses timestamptz for PostgreSQL and DATETIME2 for MSSQL
       */
      table.dateTime('created_at', { useTz: true })
      table.dateTime('updated_at', { useTz: true })
    })
  }

  public async down () {
    this.schema.dropTable(this.tableName)
  }
}
