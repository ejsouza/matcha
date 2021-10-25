import { CreateReportDto } from '../dto/report/create.report.dto';
import reportUserRepository from '../repositories/reportUser.repository';

class ReportUserService {
  async listReportedByUser(userId: number) {
    const res = await reportUserRepository.listReportedByUser(userId);
    const users: CreateReportDto[] = res.rows;
    return users;
  }

  async create(resource: CreateReportDto) {
    const res = await reportUserRepository.create(resource);
    return res.rowCount;
  }
}

export default new ReportUserService();
