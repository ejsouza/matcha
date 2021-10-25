export interface CreateVisitUserProfileDto {
  visitee_id: number;
  visitor_id: number;
  seen_visit: boolean;
  visited_at: Date;
}

export interface VisitUserProfileDto {
  id: number;
  visitee_id: number;
  visitor_id: number;
  seen_visit: boolean;
  visited_at: Date;
}
