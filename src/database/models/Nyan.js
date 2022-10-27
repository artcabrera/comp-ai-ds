import mongoose from "mongoose";
import bcryptjs from "bcryptjs";

const NyanSchema = new mongoose.Schema({
  role: {
    type: String,
    required: true,
  },
  username: {
    type: String,
    required: true,
    lowercase: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  firstname: {
    type: String,
    required: true,
  },
  lastname: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    unique: true,
  },
});

NyanSchema.pre("save", async function (next) {
  this.password = await bcryptjs.hash(this.password, await bcryptjs.genSalt());
  next();
});

NyanSchema.statics.login = async function (username, password) {
  const user =
    (await this.findOne({ username })) ||
    (await this.findOne({ email: username }));
  if (user) {
    const auth = await bcryptjs.compare(password, user.password);
    if (auth) {
      return user;
    }
    throw Error("CredentialsSignin");
  }
  throw Error("CredentialsSignin");
};

NyanSchema.statics.findByEmail = async function (email) {
  const user = await this.findOne({ email });
  if (user) return user;
  else return null;
};

NyanSchema.statics.findByUsername = async function (username) {
  const user = await this.findOne({ username });
  if (user) return user;
  else return null;
};

export default mongoose.models.Nyan || mongoose.model("Nyan", NyanSchema);
