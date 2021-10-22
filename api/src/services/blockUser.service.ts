import { CreateBlockDto } from '../dto/block/create.block.dto';
import blockUserRepository from '../repositories/blockUser.repository';

class BlockUserService {
  async listBlockedByUser(userId: number) {
    const res = await blockUserRepository.listBlockedByUser(userId);
    const users: CreateBlockDto[] = res.rows;
    return users;
  }

  async create(resource: CreateBlockDto) {
    const res = await blockUserRepository.create(resource);
    return res.rowCount;
  }
}

export default new BlockUserService();
