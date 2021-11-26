export type UserCol = {
  id?: number;
  name: string;
  preferredName?: string;
};

export type ProjectCol = {
  id?: number;
  ownerId?: number;
  name: string;
};

export type AddressCol = {
  userId?: number;
  address: string;
};
