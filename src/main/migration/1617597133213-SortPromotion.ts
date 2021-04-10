import { MigrationInterface, QueryRunner } from 'typeorm';

/**
 * Loads a new extension into the current database if it does not exist already. These extensions
 * are necessary to be able to sort promotions by lat/lon
 * Source: https://www.postgresql.org/docs/9.1/sql-createextension.html
 * */
export class SortPromotion1617597133213 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query('CREATE EXTENSION IF NOT EXISTS cube;');
    await queryRunner.query('CREATE EXTENSION IF NOT EXISTS earthdistance;');
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query('DROP EXTENSION IF EXISTS cube CASCADE;');
    await queryRunner.query('DROP EXTENSION IF EXISTS earthdistance CASCADE;');
  }
}
