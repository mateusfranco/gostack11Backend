import {
  MigrationInterface,
  QueryRunner,
  TableColumn,
  TableForeignKey,
} from "typeorm";

export default class AlterProviderFieldToProviderID1603420358149
  implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropColumn("appointments", "provider");
    await queryRunner.addColumn(
      "appointments",
      new TableColumn({
        name: "providerId",
        type: "uuid",
        isNullable: true,
      })
    );
    await queryRunner.createForeignKey(
      "appointments",
      new TableForeignKey({
        name: "provider_user",
        columnNames: ["providerId"],
        referencedColumnNames: ["id"],
        referencedTableName: "users",
        onDelete: "SET NULL",
        onUpdate: "CASCADE",
      })
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropForeignKey("appointments", "provider_user");
    await queryRunner.dropColumn("appointments", "providerId");
    await queryRunner.addColumn(
      "appointments",
      new TableColumn({
        name: "provider",
        type: "varchar",
      })
    );
  }
}
