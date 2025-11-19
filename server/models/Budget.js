import mongoose from "mongoose";

const budgetSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  categoryId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Category",
    required: true,
  },
  amount: {
     type: Number,
     required: true 
    },
  month: {
     type: String,
      required: true
     },
});

export default mongoose.model("Budget", budgetSchema);
