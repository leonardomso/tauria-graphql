import mongoose, { Schema, Document, Model } from "mongoose";

import User from "../User/UserLoader";

const RoomSchema = new Schema(
  {
    name: {
      type: String,
      trim: true,
      index: true,
      required: true,
    },
    guid: {
      type: String,
      required: true,
      unique: true,
    },
    host_user: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
    participants: [
      {
        type: Schema.Types.ObjectId,
        ref: "User",
      },
    ],
    capacity: {
      type: Number,
      default: 5,
    },
  },
  {
    timestamps: true,
    collection: "Room",
  },
);

export interface IRoom extends Document {
  name: string;
  guid: string;
  host_user: User;
  participants: Array<User>;
  capacity: number;
}

// This line is only to fix "Cannot overwrite `Room` model once compiled." error.
// https://stackoverflow.com/questions/19051041/cannot-overwrite-model-once-compiled-mongoose
mongoose.models = {};

const RoomModel: Model<IRoom> = mongoose.model("Room", RoomSchema);

export default RoomModel;
