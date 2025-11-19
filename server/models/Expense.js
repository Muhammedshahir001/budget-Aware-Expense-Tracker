import mongoose from "mongoose";
const ExpenseSchema = new mongoose.Schema(
  {
    userId: {
       type: String,
        required: true 
      },
    categoryId: {
       type: String,
        required: true
       },
    amount: {
       type: Number,
        required: true
       },
    date: {
       type: Date,
        required: true
       },
  },
  { 
    timestamps: true 

  }
);
export default mongoose.model("Expense", ExpenseSchema);
