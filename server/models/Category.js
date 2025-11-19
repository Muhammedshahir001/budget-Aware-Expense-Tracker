import mongoose from "mongoose";
const CategorySchema = new mongoose.Schema(
  {
    userId: { 
      type: String,
       required: true
       },
    name: {
       type: String,
        required: true
       },
    color: {
       type: String,
       default: "#3b82f6"
       },
  },
  { timestamps:
     true 
    }
);
export default mongoose.model("Category", CategorySchema);
