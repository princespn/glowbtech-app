import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      trim: true,
      maxlength: [50, "Name cannot exceed 50 characters"],
      default: null
    },

    mobile: {
      type: String,
      trim: true,
      default: null
    },

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
      select: false, // 🔒 Kept secure, query par automatically hide rahega
      maxlength: [100, "Password cannot exceed 100 characters"],
    },

    provider: {
      type: String,
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

// Compound index for high performance OAuth query pipelines
userSchema.index({ socialId: 1, provider: 1 });

// ⚡ FIX: Refactored to Modern Async/Await Pre-Save Lifecycle Hook
// Removed 'next' callback signature parameters to prevent the system breakdown runtime crash.
userSchema.pre("save", async function () {
  // If password structure isn't updated or blank (OAuth nodes handling), escape transaction
  if (!this.isModified("password") || !this.password) {
    return;
  }

  try {
    const salt = await bcrypt.genSalt(12);
    this.password = await bcrypt.hash(this.password, salt);
  } catch (error) {
    throw new Error(`Password encryption phase failed: ${error.message}`);
  }
});

// Compare password configuration method
userSchema.methods.comparePassword = async function (candidatePassword) {
  // Key fix: If password field is unselected, we handle comparison safely
  if (!this.password) return false;
  return await bcrypt.compare(candidatePassword, this.password);
};

// Generate JWT Engine mapping model fields dynamically
userSchema.methods.generateJWT = function () {
  return jwt.sign(
    {
      id: this._id,
      email: this.email,
      role: this.role,
      tokenVersion: this.tokenVersion,
    },
    process.env.JWT_SECRET || "fallback_glowb_secret_key",
    {
      expiresIn: process.env.JWT_EXPIRES_IN || "7d",
    }
  );
};

// Public profile formatter
userSchema.methods.getPublicProfile = function () {
  return {
    id: this._id,
    name: this.name, // Added string variable
    email: this.email,
    mobile: this.mobile, // Added string variable
    avatar: this.avatar,
    provider: this.provider,
    role: this.role,
    createdAt: this.createdAt,
  };
};

// Statics Helper Methods
userSchema.statics.findByEmail = function (email) {
  return this.findOne({ email: email.toLowerCase() });
};

userSchema.statics.findBySocialId = function (provider, socialId) {
  return this.findOne({ provider, socialId });
};

userSchema.set("toJSON", {
  transform: function (doc, ret) {
    delete ret.password;
    delete ret.__v;
    return ret;
  },
});

const User = mongoose.model("User", userSchema);
export default User;