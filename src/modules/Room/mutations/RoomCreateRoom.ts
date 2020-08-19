import {
  GraphQLString,
  GraphQLNonNull,
  GraphQLList,
  GraphQLInt,
  GraphQLID,
} from "graphql";
import { mutationWithClientMutationId } from "graphql-relay";

import { GraphQLContext } from "../../../types";

import RoomModel from "../RoomModel";

export default mutationWithClientMutationId({
  name: "RoomCreateRoom",
  inputFields: {
    name: {
      type: GraphQLNonNull(GraphQLString),
    },
    guid: {
      type: GraphQLNonNull(GraphQLString),
    },
    participants: {
      type: GraphQLList(GraphQLID),
    },
    capacity: {
      type: GraphQLInt,
    },
  },
  mutateAndGetPayload: async (
    { name, guid, participants, capacity = 5 },
    { user }: GraphQLContext,
  ) => {
    if (!user) {
      return {
        error: "You must be logged in to create a room",
      };
    }

    const room = new RoomModel({
      name,
      guid,
      participants,
      capacity,
      host_user: user.id,
    });

    await room.save();

    return {
      message: "Room created successfully!",
      error: null,
    };
  },
  outputFields: {
    message: {
      type: GraphQLString,
      resolve: ({ message }) => message,
    },
    error: {
      type: GraphQLString,
      resolve: ({ error }) => error,
    },
  },
});
