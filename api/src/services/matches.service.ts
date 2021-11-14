import matchRepository from '../repositories/match.repository';
import { CreateMatchDto } from '../dto/matches/create.match.dto';

class MatchService {
  async get(userId: number) {
    const res = await matchRepository.get(userId);
    const matches: CreateMatchDto[] = res.rows;

    return matches;
  }

  async create(userId: number) {
    const resource: CreateMatchDto = {
      user_id: userId,
      seen: false,
    };
    const res = await matchRepository.create(resource);

    return res.rowCount;
  }

  async update(id: number) {
    const res = await matchRepository.update(id);

    return res.rowCount;
  }

  async deleteAllMatches(userId: number) {
    const matches = await this.get(userId);
    let count = 0;
    for await (let match of matches) {
      if (match.id) {
        const res = await matchRepository.delete(match.id);
        count += res.rowCount;
      }
    }
    // const res = await matchRepository.delete(id);

    // return res.rowCount;
    return count;
  }
}

export default new MatchService();
