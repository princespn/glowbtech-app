import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

const userSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
      trim: true,
      lowercase: true,
      maxlength: [100, "Email cannot exceed 100 characters"],
    },

    password: {
      type: String,
      select: false,
      maxlength: [100, "Password cannot exceed 100 characters"],
    },

    provider: {
      type: String,
      required: [true, "Provider is required"],
      enum: ["local", "google", "facebook", "twitter", "tiktok"],
      default: "local",
    },

    socialId: {
      type: String,
      sparse: true,
    },

    avatar: {
      type: String,
      default: null,
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

    tokenVersion: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);

// Compound index
userSchema.index({ socialId: 1, provider: 1 });

// Hash password before save
userSchema.pre("save", async function (next) {
  if (!this.isModified("password") || !this.password) {
    return next();
  }

  try {
    const salt = await bcrypt.genSalt(12);

    this.password = await bcrypt.hash(this.password, salt);

    next();
  } catch (error) {
    next(error);
  }
});

// Compare password
userSchema.methods.comparePassword = async function (
  candidatePassword
) {
  if (!this.password) {
    return false;
  }

  return await bcrypt.compare(
    candidatePassword,
    this.password
  );
};

// Generate JWT
userSchema.methods.generateJWT = function () {
  return jwt.sign(
    {
      id: this._id,
      email: this.email,
      role: this.role,
      tokenVersion: this.tokenVersion,
    },
    process.env.JWT_SECRET,
    {
      expiresIn:
        process.env.JWT_EXPIRES_IN || "7d",
    }
  );
};

// Public profile
userSchema.methods.getPublicProfile =
  function () {
    return {
      id: this._id,
      email: this.email,
      avatar: this.avatar,
      provider: this.provider,
      role: this.role,
      createdAt: this.createdAt,
    };
  };

// Find by email
userSchema.statics.findByEmail = function (
  email
) {
  return this.findOne({
    email: email.toLowerCase(),
  });
};

// Find social login
userSchema.statics.findBySocialId =
  function (provider, socialId) {
    return this.findOne({
      provider,
      socialId,
    });
  };

// Remove sensitive fields
userSchema.set("toJSON", {
  transform: function (doc, ret) {
    delete ret.password;
    delete ret.__v;

    return ret;
  },
});

const User = mongoose.model(
  "User",
  userSchema
);

export default User;