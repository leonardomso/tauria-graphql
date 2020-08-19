import * as DataLoader from "dataloader";
import { Types } from "mongoose";

import * as UserLoader from "../modules/User/UserLoader";
import { IUser } from "../modules/User/UserModel";

import * as RoomLoader from "../modules/Room/RoomLoader";
import { IRoom } from "../modules/Room/RoomModel";

export type DataLoaderKey = string | object | Types.ObjectId;

export interface GraphQLDataloaders {
  UserLoader: DataLoader<DataLoaderKey, IUser>;
  RoomLoader: DataLoader<DataLoaderKey, IRoom>;
}

export { UserLoader, RoomLoader };
