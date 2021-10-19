export interface CreateUserDto {
  id: number;
  username: string;
  firstname: string;
  lastname: string;
  email: string;
  password: string;
  gender?: string;
  sexual_orientation?: string;
  biography?: string;
  localisation?: {
    x: number;
    y: number;
  };
  activated?: boolean;
  created_at?: Date;
  updated_at?: Date;
}

export const MapUserDto = (user: CreateUserDto) => {};