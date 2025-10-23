import { User } from './User';

export type Listing = {
  id: string;

  title: string;
  description: string;
  price: number;
  type: 'rent' | 'sale';
  state: string;

  imagesURL: string[];
  contact: string;

  availableAt: string;

  owner: User;
};

export type ListingInput = {
  title: string;
  description: string;
  price: number;
  type: 'rent' | 'sale';
  state: string;

  imagesURL: string[];
  contact: string;

  availableAt: string;
};
