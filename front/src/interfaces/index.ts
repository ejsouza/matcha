export interface UserInterface {
  id: number;
  username: string;
  firstname: string;
  lastname: string;
  email: string;
  gender: string | null;
  activated: boolean | null;
  birthdate: Date | null;
  biography: string;
  localisation: {
    x: number;
    y: number;
  };
  modified: number | null;
  sexual_orientation: string;
  default_picture: string;
  popularity: number;
  is_connected: number;
  reported: boolean;
  distance_preference: number;
  age_preference_min: number;
  age_preference_max: number;
  created_at: Date;
  updated_at: Date;
}

export interface ApiResponse {
  user: UserInterface;
  token: string;
}
