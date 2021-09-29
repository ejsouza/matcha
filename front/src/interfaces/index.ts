export interface UserInterface {
  activated: number | null;
  birthdate: Date | null;
  created: number | null;
  description: string;
  email: string;
  firstname: string;
  gender: string | null;
  id: number;
  lastname: string;
  localisation: {
    longitude: number;
    latitude: number;
  };
  modified: number | null;
  sexual_orientation: string;
  token: string;
  username: string;
  tags: string[];
}
