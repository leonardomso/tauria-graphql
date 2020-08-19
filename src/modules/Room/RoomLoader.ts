import {
  connectionFromMongoCursor,
  mongooseLoader,
} from "@entria/graphql-mongoose-loader";
import DataLoader from "dataloader";
import { ConnectionArguments } from "graphql-relay";
import { Schema } from "mongoose";

import RoomModel, { IRoom } from "../Room/RoomModel";
import { GraphQLContext } from "../../types";
import { DataLoaderKey } from "../../loaders";

import { escapeRegex } from "../../utils/escapeRegex";

import User from "../User/UserLoader";

export default class Room {
  id: string;
  _id: string;
  name: string;
  guid: string;
  host_user: User;
  participants: Array<string>;
  capacity: number;

  constructor(data: IRoom) {
    this.id = data._id;
    this._id = data._id;
    this.name = data.name;
    this.guid = data.guid;
    this.host_user = data.host_user;
    this.participants = data.participants;
    this.capacity = data.capacity;
  }
}

export const getLoader = () =>
  new DataLoader<DataLoaderKey, IRoom>((ids) =>
    mongooseLoader(RoomModel, ids as string[]),
  );

const viewerCanSee = () => true;

export const load = async (
  context: GraphQLContext,
  id: DataLoaderKey,
): Promise<Room | null> => {
  if (!id && typeof id !== "string") {
    return null;
  }
  let data;
  try {
    data = await context.dataloaders.RoomLoader.load(id as string);
  } catch (err) {
    return null;
  }
  return viewerCanSee() ? new Room(data) : null;
};

export const clearCache = (
  { dataloaders }: GraphQLContext,
  id: Schema.Types.ObjectId,
) => dataloaders.RoomLoader.clear(id.toString());

interface LoadRoomsArgs extends ConnectionArguments {
  search?: string;
}

export const loadRooms = async (context: any, args: LoadRoomsArgs) => {
  const defaultWhere = {
    removedAt: null,
  };

  const where = args.search
    ? {
        ...defaultWhere,
        name: { $regex: new RegExp(`^${escapeRegex(args.search)}`, "ig") },
      }
    : defaultWhere;

  const users = RoomModel.find(where, { _id: 1 })
    .sort({ createdAt: -1 })
    .lean();

  return connectionFromMongoCursor({
    cursor: users,
    context,
    args,
    loader: load,
  });
};
