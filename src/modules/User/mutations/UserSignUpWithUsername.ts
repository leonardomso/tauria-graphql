import { GraphQLString, GraphQLNonNull } from "graphql";
import { mutationWithClientMutationId } from "graphql-relay";

import UserModel from "../UserModel";

import { generateToken } from "../../../utils/auth";

export default mutationWithClientMutationId({
  name: "UserSignUpWithUsername",
  inputFields: {
    username: {
      type: new GraphQLNonNull(GraphQLString),
    },
    password: {
      type: new GraphQLNonNull(GraphQLString),
    },
    mobile_token: {
      type: GraphQLString,
    },
  },
  mutateAndGetPayload: async ({ username, password, mobile_token }) => {
    let user = await UserModel.findOne({ username });

    if (user) {
      return {
        token: null,
        error: "Email is already in use",
      };
    }

    user = new UserModel({
      username,
      password,
      mobile_token,
    });

    await user.save();

    return {
      token: generateToken(user),
    };
  },
  outputFields: {
    token: {
      type: GraphQLString,
      resolve: ({ token }) => token,
    },
    error: {
      type: GraphQLString,
      resolve: ({ error }) => error,
    },
  },
});
