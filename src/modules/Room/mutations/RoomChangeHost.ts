import { GraphQLString, GraphQLNonNull, GraphQLID } from "graphql";
import { mutationWithClientMutationId } from "graphql-relay";

import { GraphQLContext } from "../../../types";

import RoomModel from "../RoomModel";

export default mutationWithClientMutationId({
  name: "RoomChangeHost",
  inputFields: {
    roomName: {
      type: GraphQLNonNull(GraphQLString),
    },
    new_host_user: {
      type: GraphQLNonNull(GraphQLID),
    },
  },
  mutateAndGetPayload: async (
    { roomName, new_host_user },
    { user }: GraphQLContext,
  ) => {
    if (!user) {
      return {
        error: "You must be logged in to change the host of a room",
      };
    }

    const room = await RoomModel.findOne({
      name: roomName,
      host_user: user.id,
    });

    if (!room) return "Something went wrong!";

    room.host_user = new_host_user;
    await room.save();

    return {
      message: "Room host updated successfully",
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
