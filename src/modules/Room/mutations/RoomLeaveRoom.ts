import { GraphQLString, GraphQLNonNull } from "graphql";
import { mutationWithClientMutationId } from "graphql-relay";

import { GraphQLContext } from "../../../types";

import RoomModel from "../RoomModel";

export default mutationWithClientMutationId({
  name: "RoomLeaveRoom",
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

    const userIsHostOfTheRoom = String(room.host_user) === String(user._id);

    if (!room) {
      return {
        message: null,
        error: "Room does not exist",
      };
    } else if (!room.participants.length && userIsHostOfTheRoom) {
      await room.remove();

      return {
        message: "You leave the room successfully!",
        error: null,
      };
    } else if (room.participants.length && userIsHostOfTheRoom) {
      room.host_user = room.participants[0];
      room.participants.splice(0, 1);

      await room.save();

      return {
        message: "You leave the room successfully!",
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
