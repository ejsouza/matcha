export interface PutUserDto {
  id: number;
  username: string;
  firstname: string;
  lastname: string;
  email: string;
  password: string;
  gender: string;
  sexual_orientation: string;
  biography: string;
  tags: string;
  localisation: {
    x: number;
    y: number;
  };
  activated: boolean;
  created_at: Date;
  updated_at: Date;
}
