import { User } from '../user.entity';

export class UserProfileDto {
  id: string;
  email: string;
  name: string | null;
  createdAt: Date;

  static from(user: User): UserProfileDto {
    return {
      id: user.id,
      email: user.email,
      name: user.name,
      createdAt: user.createdAt,
    };
  }
}
