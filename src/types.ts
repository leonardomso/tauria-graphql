import { Request, Response } from "koa";
import Dataloader from "dataloader";

import { IUser } from "./modules/User/UserModel";
import { IRoom } from "./modules/Room/RoomModel";

export type Dataloaders = {
  UserLoader: Dataloader<string, IUser>;
  RoomLoader: Dataloader<string, IRoom>;
};

export type GraphQLContext = {
  req: Request;
  res: Response;
  user?: IUser;
  dataloaders: Dataloaders;
};
