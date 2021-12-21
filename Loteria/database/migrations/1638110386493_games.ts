import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class Games extends BaseSchema {
  protected tableName = 'games'

  public async up () {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')

      table.string('type').notNullable().unique()
      table.string('description').notNullable()
      table.integer('range').notNullable()
      table.float('price').notNullable()
      table.string('color').notNullable()
      table.integer('max_number').notNullable()


      /**
       * Uses timestamptz for PostgreSQL and DATETIME2 for MSSQL
       */
      table.datetime('created_at', { useTz: true })
      table.datetime('updated_at', { useTz: true })
    })
  }

  public async down () {
    this.schema.dropTable(this.tableName)
  }
}
