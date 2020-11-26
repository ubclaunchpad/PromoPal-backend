import { MigrationInterface, QueryRunner } from 'typeorm';

/**
 * This migration is to support full text search. (Note: you do not need to do anything special, by setting 'migrationsRun: true'
 * in our connection options, these migrations will be ran automatically).
 * * We first create a gin index on promotion.tsvector
 * * We then create a trigger to update promotion.tsvector on update/insert
 * */
export class FullTextSearch1605475222018 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      'create index tsvector_idx on promotion using gin (tsvector)'
    );
    await queryRunner.query(
      'create trigger tsvectorupdate before insert or update on promotion for each row execute procedure tsvector_update_trigger(tsvector, \'pg_catalog.english\', name, description)'
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query('drop index tsvector_idx');
    await queryRunner.query('drop trigger tsvectorupdate on promotion');
  }
}
