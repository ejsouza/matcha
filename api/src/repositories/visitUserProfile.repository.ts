import db from '../../db';
import { CreateVisitUserProfileDto } from '../dto/visits/createvisitUserProfile.dto';

class VisitUserProfileRepository {
  async create(resource: CreateVisitUserProfileDto) {
    const query =
      'INSERT INTO visits (visitee_id, visitor_id, seen, visited_at) VALUES($1, $2, $3, $4)';

    return db.query(query, [
      resource.visitee_id,
      resource.visitor_id,
      resource.seen,
      resource.visited_at,
    ]);
  }

  async list(userId: number) {
    const query = 'SELECT * FROM visits WHERE visitee_id = $1';
    return db.query(query, [userId]);
  }

  async getVisitByVisitId(visitorId: number, visiteeId: number) {
    const query =
      'SELECT * FROM visits WHERE visitor_id = $1 AND visitee_id = $2';

    return db.query(query, [visitorId, visiteeId]);
  }

  async update(visitId: number) {
    const query = 'UPDATE visits SET seen=$1 WHERE id=$2';

    return db.query(query, [true, visitId]);
  }

  async put(visitId: number, resource: CreateVisitUserProfileDto) {
    const query =
      'UPDATE visits SET visitee_id=$2, visitor_id=$3, seen=$4, visited_at=$5 WHERE id=$1';

    return db.query(query, [
      visitId,
      resource.visitee_id,
      resource.visitor_id,
      resource.seen,
      resource.visited_at,
    ]);
  }
}

export default new VisitUserProfileRepository();
