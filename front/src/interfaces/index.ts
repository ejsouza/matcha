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
  is_connected: number;
  created_at: Date;
  updated_at: Date;
}

export interface ApiResponse {
  user: UserInterface;
  token: string;
}
