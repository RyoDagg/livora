import { Listing } from './Listing';

export type User = {
  id: string;
  email: string;
  name: string;
  phone: string;
  createdAt: string;
  Listings: Listing[];
};
