import { MigrationInterface, QueryRunner } from 'typeorm';

export class InitDb1632622291251 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      'CREATE TABLE technologies (id int PRIMARY KEY NOT NULL, name varchar NOT NULL)',
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query('DROP TABLE technologies');
  }
}
