import {
  GraphQLObjectType,
  GraphQLString,
  GraphQLNonNull,
  GraphQLInt,
  GraphQLList,
} from "graphql";
import { globalIdField } from "graphql-relay";

import UserType from "../User/UserType";
import UserModel from "../User/UserModel";

const RoomType: GraphQLObjectType = new GraphQLObjectType({
  name: "Room",
  description: "Room data",
  fields: () => ({
    id: globalIdField("Room"),
    _id: {
      type: GraphQLNonNull(GraphQLString),
      resolve: ({ _id }) => _id,
    },
    name: {
      type: GraphQLNonNull(GraphQLString),
      resolve: ({ name }) => name,
    },
    guid: {
      type: GraphQLNonNull(GraphQLString),
      resolve: ({ guid }) => guid,
    },
    host_user: {
      type: GraphQLNonNull(UserType),
      resolve: async (room, args, context) => {
        const user = await UserModel.findOne({ _id: room.host_user });
        return user;
      },
    },
    participants: {
      type: GraphQLList(UserType),
      resolve: async (room, args, context) => {
        return await room.participants.map((_id) => UserModel.findOne({ _id }));
      },
    },
    capacity: {
      type: GraphQLNonNull(GraphQLInt),
      resolve: ({ capacity }) => capacity,
    },
  }),
});

export default RoomType;
