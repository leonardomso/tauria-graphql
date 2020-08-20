import {
  GraphQLObjectType,
  GraphQLString,
  GraphQLNonNull,
  GraphQLList,
} from "graphql";
import { fromGlobalId, connectionArgs } from "graphql-relay";

import UserType from "../modules/User/UserType";
import UserConnection from "../modules/User/UserConnection";
import * as UserLoader from "../modules/User/UserLoader";

import RoomType from "../modules/Room/RoomType";
import RoomModel from "../modules/Room/RoomModel";
import RoomConnection from "../modules/Room/RoomConnection";
import * as RoomLoader from "../modules/Room/RoomLoader";

import { NodeField } from "../interface/NodeInterface";
import UserModel from "../modules/User/UserModel";

const QueryType = new GraphQLObjectType({
  name: "Query",
  description: "The root of all... queries",
  fields: () => ({
    node: NodeField,
    currentUser: {
      type: UserType,
      resolve: (_, args, context) => context.user,
    },
    getUser: {
      type: UserType,
      args: {
        id: {
          type: GraphQLNonNull(GraphQLString),
        },
      },
      resolve: async (_, { id: globalId }, context) => {
        const { id, type } = fromGlobalId(globalId);
        if (type === "User") return await UserLoader.load(context, id);
        return null;
      },
    },
    getUsers: {
      type: UserConnection.connectionType,
      args: {
        ...connectionArgs,
        search: {
          type: GraphQLString,
        },
      },
      resolve: async (_, args, context) =>
        await UserLoader.loadUsers(context, args),
    },
    getRoom: {
      type: RoomType,
      args: {
        guid: {
          type: GraphQLNonNull(GraphQLString),
        },
      },
      resolve: async (_, { guid }, context) => {
        const room = RoomModel.findOne({ guid });
        return room;
      },
    },
    getRooms: {
      type: RoomConnection.connectionType,
      args: {
        ...connectionArgs,
        search: {
          type: GraphQLString,
        },
      },
      resolve: async (_, args, context) =>
        await RoomLoader.loadRooms(context, args),
    },
    getUserRooms: {
      type: GraphQLList(RoomType),
      args: {
        username: {
          type: GraphQLNonNull(GraphQLString),
        },
      },
      resolve: async (_, { username }, context) => {
        const rooms = await RoomModel.find();
        const user = await UserModel.findOne({ username });

        if (!user) {
          return "Username does not exist";
        } else {
          const userId = String(user._id);

          let results = [];

          const userHostRooms = await rooms.filter(
            ({ host_user }) => String(host_user) === userId,
          );

          await rooms.map((room) => {
            room.participants.map((participant) => {
              if (String(participant) === userId) {
                results.push(room);
              }
            });
          });

          results = [...results, ...userHostRooms];
          const newResults = [...new Set(results)];

          return newResults;
        }
      },
    },
  }),
});

export default QueryType;
