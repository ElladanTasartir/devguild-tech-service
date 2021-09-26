import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddIndexToName1632683452564 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      'CREATE INDEX idx_technologies_name ON technologies(name)',
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query('DROP INDEX idx_technologies_name');
  }
}
