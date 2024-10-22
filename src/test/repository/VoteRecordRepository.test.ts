import { VoteRecordRepository } from '../../main/repository/VoteRecordRepository';
import { UserRepository } from '../../main/repository/UserRepository';
import { PromotionRepository } from '../../main/repository/PromotionRepository';
import connection from './BaseRepositoryTest';
import { getCustomRepository } from 'typeorm';
import { User } from '../../main/entity/User';
import { UserFactory } from '../factory/UserFactory';
import { PromotionFactory } from '../factory/PromotionFactory';
import { VoteState } from '../../main/entity/VoteRecord';

describe('Unit test for VoteRecord', function () {
  let voteRecordRepository: VoteRecordRepository;
  let userRepository: UserRepository;
  let promotionRepository: PromotionRepository;
  beforeAll(async () => {
    await connection.create();
  });

  afterAll(async () => {
    await connection.close();
  });

  beforeAll(async () => {
    await connection.clear();
    voteRecordRepository = getCustomRepository(VoteRecordRepository);
    userRepository = getCustomRepository(UserRepository);
    promotionRepository = getCustomRepository(PromotionRepository);
  });

  test('Should be able to create a new voteRecord', async () => {
    // make a promotion
    const user: User = new UserFactory().generate();
    const promotion = new PromotionFactory().generateWithRelatedEntities(user);
    await userRepository.save(user);
    await promotionRepository.save(promotion);

    const votingUser: User = new UserFactory().generate();
    await userRepository.save(votingUser);
    const voteRecord = voteRecordRepository.create({
      userId: votingUser.id,
      promotionId: promotion.id,
    });
    await voteRecordRepository.save(voteRecord);
    const record = await voteRecordRepository.findOne({
      user: votingUser,
      promotion: promotion,
    });
    expect(record).toBeDefined();
    expect(record!.userId).toEqual(votingUser.id);
    expect(record!.promotionId).toEqual(promotion.id);
    expect(record!.voteState).toEqual(VoteState.INIT);
  });

  test('Should not able to create two vote record for one user', async () => {
    // make a promotion
    const user: User = new UserFactory().generate();
    const promotion = new PromotionFactory().generateWithRelatedEntities(user);
    await userRepository.save(user);
    await promotionRepository.save(promotion);
    // save the promotion
    const votingUser: User = new UserFactory().generate();
    await userRepository.save(votingUser);
    await voteRecordRepository.addVoteRecord(votingUser, promotion);
    try {
      await voteRecordRepository.addVoteRecord(votingUser, promotion);
      fail('Should have failed');
    } catch (e) {
      expect(e.detail).toEqual(
        `Key ("userId", "promotionId")=(${votingUser.id}, ${promotion.id}) already exists.`
      );
    }
  });

  test('Should be able to edit the vote state', async () => {
    // make a promotion
    const user: User = new UserFactory().generate();
    const promotion = new PromotionFactory().generateWithRelatedEntities(user);
    await userRepository.save(user);
    await promotionRepository.save(promotion);

    const votingUser: User = new UserFactory().generate();
    await userRepository.save(votingUser);
    const voteRecord = voteRecordRepository.create({
      userId: votingUser.id,
      promotionId: promotion.id,
    });
    await voteRecordRepository.save(voteRecord);
    let record;
    try {
      record = await voteRecordRepository.findOneOrFail({
        user: votingUser,
        promotion: promotion,
      });
    } catch (e) {
      fail(e);
    }
    expect(record).toBeDefined();
    expect(record!.userId).toEqual(votingUser.id);
    expect(record!.promotionId).toEqual(promotion.id);
    expect(record!.voteState).toEqual(VoteState.INIT);
    record.voteState = VoteState.UP;
    await voteRecordRepository.save(record);
    try {
      record = await voteRecordRepository.findOneOrFail({
        userId: votingUser.id,
        promotionId: promotion.id,
      });
      expect(record).toBeDefined();
      expect(record!.userId).toEqual(votingUser.id);
      expect(record!.promotionId).toEqual(promotion.id);
      expect(record!.voteState).toEqual(VoteState.UP);
    } catch (e) {
      fail(e);
    }
    record.voteState = VoteState.DOWN;
    await voteRecordRepository.save(record);
    try {
      record = await voteRecordRepository.findOneOrFail({
        userId: votingUser.id,
        promotionId: promotion.id,
      });
      expect(record).toBeDefined();
      expect(record!.userId).toEqual(votingUser.id);
      expect(record!.promotionId).toEqual(promotion.id);
      expect(record!.voteState).toEqual(VoteState.DOWN);
    } catch (e) {
      fail(e);
    }
  });

  test('Vote record should be removed when respective promotion is deleted', async () => {
    const user: User = new UserFactory().generate();
    const promotion = new PromotionFactory().generateWithRelatedEntities(user);
    await userRepository.save(user);
    await promotionRepository.save(promotion);

    const votingUser: User = new UserFactory().generate();
    await userRepository.save(votingUser);
    const voteRecord = voteRecordRepository.create({
      userId: votingUser.id,
      promotionId: promotion.id,
    });
    await voteRecordRepository.save(voteRecord);
    // delete promotion
    await promotionRepository.delete(promotion.id);
    try {
      await voteRecordRepository.findOneOrFail({
        userId: votingUser.id,
        promotionId: promotion.id,
      });
      fail('Should have failed');
    } catch (e) {
      expect(e.message).toEqual(
        `Could not find any entity of type "VoteRecord" matching: {
    "userId": "${votingUser.id}",
    "promotionId": "${promotion.id}"\n}`
      );
    }
  });

  test('Vote record should be removed when respective user is deleted', async () => {
    const user: User = new UserFactory().generate();
    const promotion = new PromotionFactory().generateWithRelatedEntities(user);
    await userRepository.save(user);
    await promotionRepository.save(promotion);

    const votingUser: User = new UserFactory().generate();
    await userRepository.save(votingUser);
    const voteRecord = voteRecordRepository.create({
      userId: votingUser.id,
      promotionId: promotion.id,
    });
    await voteRecordRepository.save(voteRecord);
    // delete user
    await userRepository.delete(votingUser.id);
    try {
      await voteRecordRepository.findOneOrFail({
        userId: votingUser.id,
        promotionId: promotion.id,
      });
      fail('Should have failed');
    } catch (e) {
      expect(e.message).toEqual(
        `Could not find any entity of type "VoteRecord" matching: {
    "userId": "${votingUser.id}",
    "promotionId": "${promotion.id}"\n}`
      );
    }
  });
});
