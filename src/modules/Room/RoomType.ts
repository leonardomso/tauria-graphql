import {
  GraphQLObjectType,
  GraphQLString,
  GraphQLNonNull,
  GraphQLInt,
  GraphQLList,
  GraphQLID,
} from "graphql";
import { globalIdField } from "graphql-relay";

import UserType from "../User/UserType";

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
      resolve: ({ host_user }) => host_user,
    },
    participants: {
      type: GraphQLList(GraphQLID),
      resolve: ({ participants }) => participants,
    },
    capacity: {
      type: GraphQLNonNull(GraphQLInt),
      resolve: ({ capacity }) => capacity,
    },
  }),
});

export default RoomType;
