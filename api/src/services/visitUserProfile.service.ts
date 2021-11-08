import {
  CreateVisitUserProfileDto,
  VisitUserProfileDto,
} from '../dto/visits/createvisitUserProfile.dto';
import visitUserProfileRepository from '../repositories/visitUserProfile.repository';
class VisitUserProfileService {
  /**
   * @description get all visits for a user
   * @param  			userId
   * @return 			visitors []
   *
   */
  async list(userId: number) {
    const res = await visitUserProfileRepository.list(userId);
    const visits: VisitUserProfileDto[] = res.rows;
    return visits;
  }

  /**
   * @description create visit
   * @param 			visitorId
   * @param 			visiteeId
   */
  async create(visitorId: number, visiteeId: number) {
    const visit: CreateVisitUserProfileDto = {
      visitee_id: visiteeId,
      visitor_id: visitorId,
      seen: false,
      visited_at: new Date(),
    };

    const res = await visitUserProfileRepository.create(visit);
    return res.rowCount;
  }

  /**
   * @description get unique visit based on visitor and visitee id
   * @param 			visitorId
   * @param 			visiteeId
   */
  async getVisitByVisitId(visitorId: number, visiteeId: number) {
    const res = await visitUserProfileRepository.getVisitByVisitId(
      visitorId,
      visiteeId
    );
    const visit: VisitUserProfileDto = res.rows[0];

    return visit;
  }

  /**
   * @description update visit from unseen to seen
   * @param 			visiteeId
   */
  async update(visitorId: number, visiteeId: number) {
    const visit = await this.getVisitByVisitId(visitorId, visiteeId);
    // handle if not visit found
    if (!visit) {
      return 0;
    }
    const res = await visitUserProfileRepository.update(visit.id);
    return res.rowCount;
  }

  /**
   * @description create or upate visit
   * @param 			visitorId
   * @param 			visiteeId
   */
  async put(visitorId: number, visiteeId: number) {
    const visitToUpdate = await this.getVisitByVisitId(visitorId, visiteeId);
    /**
     * Update current visit if exist, create visit otherwise
     */
    if (visitToUpdate) {
      const visit: CreateVisitUserProfileDto = { ...visitToUpdate };
      visit.seen = false;
      visit.visited_at = new Date();

      const res = await visitUserProfileRepository.put(visitToUpdate.id, visit);
      return res.rowCount;
    } else {
      return await this.create(visitorId, visiteeId);
    }
  }
}

export default new VisitUserProfileService();
