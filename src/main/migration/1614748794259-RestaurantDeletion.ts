import { MigrationInterface, QueryRunner } from 'typeorm';

/**
 * This migration is to support restaurant cleanup when a promotion is deleted.
 * * We only want to delete a promotions restaurant if the restaurant is referencing only one more promotion
 * * Thus create a trigger to execute on for each promotion (row) that is deleted in the promotion table. We can reference
 * the deleted promotion through `old`. Then create a function to delete the restaurant based on the deleted promotion `old` only if
 * the restaurant is referencing zero promotions.
 * * Intro to triggers: https://www.postgresqltutorial.com/creating-first-trigger-postgresql/
 * */
export class RestaurantDeletion1614748794259 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `
            CREATE OR REPLACE FUNCTION cleanupRestaurant()
                RETURNS TRIGGER
                LANGUAGE PLPGSQL
            AS $$
            BEGIN
                delete from restaurant
                where id = old."restaurantId" and
                    not exists(select * from promotion P where P."restaurantId" = old."restaurantId" and P.id != old.id for update);
                return old;
            END
            $$;
            `
    );

    await queryRunner.query(
      `
            create trigger cleanupRestaurant
            after delete on promotion
            for each row
            execute procedure cleanupRestaurant();
            `
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query('drop trigger cleanupRestaurant on promotion;');
    await queryRunner.query('drop function cleanupRestaurant();');
  }
}
