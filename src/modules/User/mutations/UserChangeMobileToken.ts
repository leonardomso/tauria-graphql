import { GraphQLString, GraphQLNonNull } from "graphql";
import { mutationWithClientMutationId } from "graphql-relay";

import { GraphQLContext } from "../../../types";

export default mutationWithClientMutationId({
  name: "UserChangeMobileToken",
  inputFields: {
    password: {
      type: new GraphQLNonNull(GraphQLString),
    },
    newMobileToken: {
      type: new GraphQLNonNull(GraphQLString),
    },
  },
  mutateAndGetPayload: async (
    { password, newMobileToken },
    { user }: GraphQLContext,
  ) => {
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

    user.mobile_token = newMobileToken;
    await user.save();

    return {
      message: "Mobile token updated successfully",
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
