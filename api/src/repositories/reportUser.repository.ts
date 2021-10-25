import db from '../../db';
import { CreateReportDto } from '../dto/report/create.report.dto';

class ReportUserRepository {
  async listReportedByUser(userId: number) {
    const query = 'SELECT * FROM reported_users WHERE reporter_id = $1';
    return db.query(query, [userId]);
  }

  async create(resource: CreateReportDto) {
    const query = 'INSERT INTO reported_users VALUES ($1, $2)';
    return db.query(query, [resource.reporter_id, resource.reported_id]);
  }
}

export default new ReportUserRepository();
