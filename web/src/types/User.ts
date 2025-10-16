import { Listing } from './Listing';

export type User = {
  id: string;
  email: string;
  lastLogin?: Date;

  name?: string;
  avatarUrl?: string;
  bio?: string;
  gender?: string;
  isCompany: boolean;

  phone?: string;
  address?: string;
  state?: string;

  createdAt: Date;
  updatedAt: Date;

  Listings: Listing[];
};
