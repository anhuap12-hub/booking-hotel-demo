import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const userSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
      trim: true,
    },

    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
      index: true,
    },

    emailVerified: {
      type: Boolean,
      default: false,
    },

    phone: {
      type: String,
      trim: true,
      sparse: true,
      index: true,
    },

    phoneVerified: {
      type: Boolean,
      default: false,
    },

    password: {
      type: String,
      required: true,
      minlength: 6,
    },

    role: {
      type: String,
      enum: ["user", "admin"],
      default: "user",
    },

    isActive: {
      type: Boolean,
      default: true,
    },

    refreshToken: {
      type: String,
      default: null,
    },
  },
  { timestamps: true }
);

// ================= PASSWORD HASH =================
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return;
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);

});

// ================= PASSWORD COMPARE =================
userSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

// ================= INDEXES =================
userSchema.index({ username: 1 });

// ================= HIDE SENSITIVE =================
userSchema.set("toJSON", {
  transform: (doc, ret) => {
    delete ret.password;
    delete ret.refreshToken;
    delete ret.emailVerifyToken;
    delete ret.emailVerifyExpires;
    return ret;
  },
});

export default mongoose.model("User", userSchema);
