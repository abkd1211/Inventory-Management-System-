const mongoose = require("mongoose");

const inventorySchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "User", // Links this item to the User model
    },
    name: {
      type: String,
      required: [true, "Please add a product name"],
      trim: true,
    },
    sku: {
      type: String,
      required: true,
      unique: true, // Ensures no two products have the same SKU
      trim: true,
    },
    category: {
      type: String,
      required: [true, "Please add a category"],
      trim: true,
    },
    quantity: {
      type: Number,
      required: [true, "Please add a quantity"],
      default: 0,
    },
    price: {
      type: Number,
      required: [true, "Please add a price"],
      default: 0.0,
    },
    description: {
      type: String,
      required: false,
      trim: true,
      default: '', // Default to empty string if not provided
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Inventory", inventorySchema);