import { GraphQLString, GraphQLNonNull } from "graphql";
import { mutationWithClientMutationId } from "graphql-relay";

import { GraphQLContext } from "../../../types";

import RoomModel from "../RoomModel";

export default mutationWithClientMutationId({
  name: "RoomJoinRoom",
  inputFields: {
    guid: {
      type: GraphQLNonNull(GraphQLString),
    },
  },
  mutateAndGetPayload: async ({ guid }, { user }: GraphQLContext) => {
    if (!user) {
      return {
        error: "You must be logged in to join a room",
      };
    }

    const room = await RoomModel.findOne({ guid });

    if (!room) {
      return {
        message: null,
        error: "Room does not exist",
      };
    } else if (String(room.host_user) === String(user._id)) {
      return {
        message: null,
        error: "You cannot join a room when you are the current host",
      };
    } else {
      await room.participants.push(user._id);

      await room.save();

      return {
        message: "Joined room successfully!",
        error: null,
      };
    }
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
