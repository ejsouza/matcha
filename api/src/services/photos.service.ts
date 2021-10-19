import { CRUD } from '../common/interfaces/crud.interface';
import photoRepository from '../repositories/photo.repository';

interface Resource {
  userId: number;
  path: string;
}

class PhotoService implements CRUD {
  async create(ressource: Resource) {
    const res = await photoRepository.upload(ressource.userId, ressource.path);
    return res;
  }

  async list(userId: number) {
    const pictures = await photoRepository.list(userId);
    return pictures.rows;
  }

  async getById(id: string) {
    const res = await photoRepository.getById(Number(id));
    return res.rows[0];
  }

  async patchById() {}

  async delete(id: string) {
    const res = await photoRepository.delete(Number(id));
    return res.command;
  }
}

export default new PhotoService();
