export interface IUserCreate {
  name: string;
  password: string;
  email: string;
}

export interface IUser {
  _id: string;
  name: string;
  email: string;
}