export type Listing = {
  id: string;
  title: string;
  description: string;
  price: number;
  state: string;
  type: 'rent' | 'sale';
  availableAt: string;
  contact: string;
  owner: { id: string; name?: string; email: string };
  imageURL: string;
};

export type ListingInput = {
  title: string;
  description: string;
  price: number;
  state: string;
  type: 'rent' | 'sale';
  availableAt: string;
  contact: string;
  imageURL?: string;
};
