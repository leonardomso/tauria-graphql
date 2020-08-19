import { GraphQLObjectType } from "graphql";

import UserMutation from "../modules/User/mutations";
import RoomMutation from "../modules/Room/mutations";

const MutationType = new GraphQLObjectType({
  name: "Mutation",
  fields: () => ({
    ...UserMutation,
    ...RoomMutation,
  }),
});

export default MutationType;
