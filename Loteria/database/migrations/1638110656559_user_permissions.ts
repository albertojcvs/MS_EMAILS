import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class UserPermissions extends BaseSchema {
  protected tableName = 'user_permissions'

  public async up () {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')

      table.integer('user_id')
      .notNullable()
      .unsigned()
      .references('users.id')
      .onDelete('CASCADE')

      table.integer('permission_id')
      .notNullable()
      .unsigned()
      .references('permissions.id')
      .onDelete('CASCADE')

      table.unique(['user_id', 'permission_id'])
      /**
       * Uses timestamptz for PostgreSQL and DATETIME2 for MSSQL
       */
      table.timestamp('created_at', { useTz: true })
    })
  }

  public async down () {
    this.schema.dropTable(this.tableName)
  }
}
