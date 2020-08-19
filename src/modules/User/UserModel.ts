import mongoose, { Schema, Document, Model } from "mongoose";
import bcrypt from "bcrypt";

const UserSchema = new Schema(
  {
    username: {
      type: String,
      trim: true,
      index: true,
      required: true,
      lowercase: true,
    },
    password: {
      type: String,
      hidden: true,
      required: true,
      minlength: 6,
    },
    mobile_token: {
      type: String,
    },
  },
  {
    timestamps: true,
    collection: "User",
  },
);

export interface IUser extends Document {
  username: string;
  password: string;
  mobile_token: string;
  authenticate: (plainTextPassword: string) => boolean;
  encryptPassword: (password: string | undefined) => Promise<string>;
}

UserSchema.methods = {
  authenticate: function (this: IUser, plainTextPassword: string) {
    return bcrypt.compare(plainTextPassword, this.password);
  },
};

UserSchema.pre<IUser>("save", function (next) {
  if (!this.isModified("password")) return next();
  if (!this.password) return next();
  return bcrypt.hash(this.password, 8).then((hash: string) => {
    this.password = hash;
    next();
  });
});

// This line is only to fix "Cannot overwrite `User` model once compiled." error.
// https://stackoverflow.com/questions/19051041/cannot-overwrite-model-once-compiled-mongoose
mongoose.models = {};

const UserModel: Model<IUser> = mongoose.model("User", UserSchema);

export default UserModel;
