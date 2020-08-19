import { GraphQLObjectType, GraphQLString, GraphQLNonNull } from "graphql";
import { globalIdField } from "graphql-relay";

import { NodeInterface } from "../../interface/NodeInterface";

const UserType: GraphQLObjectType = new GraphQLObjectType({
  name: "User",
  description: "User data",
  fields: () => ({
    id: globalIdField("User"),
    _id: {
      type: GraphQLNonNull(GraphQLString),
      resolve: ({ _id }) => _id,
    },
    username: {
      type: GraphQLNonNull(GraphQLString),
      resolve: ({ username }) => username,
    },
    mobile_token: {
      type: GraphQLString,
      resolve: ({ mobile_token }) => mobile_token,
    },
  }),
  interfaces: () => [NodeInterface],
});

export default UserType;
