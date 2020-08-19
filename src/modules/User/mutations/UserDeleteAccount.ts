import { GraphQLString, GraphQLNonNull, GraphQLID } from "graphql";
import { fromGlobalId, mutationWithClientMutationId } from "graphql-relay";

import UserModel from "../UserModel";

import { GraphQLContext } from "../../../types";

export default mutationWithClientMutationId({
  name: "UserDeleteAccount",
  inputFields: {
    id: {
      type: GraphQLNonNull(GraphQLID),
    },
    password: {
      type: new GraphQLNonNull(GraphQLString),
    },
  },
  mutateAndGetPayload: async (
    { password, id: globalId },
    { user }: GraphQLContext,
  ) => {
    const { id } = fromGlobalId(globalId);

    if (!user) {
      return {
        error: "User not authenticated",
      };
    }

    const userAuthenticated = user.authenticate(password);

    if (!userAuthenticated) {
      return {
        error: "Invalid password",
      };
    }

    await UserModel.find({ _id: id }).remove().exec();

    return {
      id,
      message: "Account deleted successfully!",
      error: null,
    };
  },
  outputFields: {
    id: {
      type: GraphQLString,
      resolve: ({ id }) => id,
    },
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
