import Category from "../models/Category.js";
import Budget from "../models/Budget.js";
import Expense from "../models/Expense.js";

const reportController = {

  getMonthly: async (req, res) => {
    try {
      const { month } = req.query;
      if (!month) return res.status(400).json({ message: "Month is required" });

      const userId = req.user.id;
      const start = new Date(month + "-01");
      const end = new Date(start);
      end.setMonth(end.getMonth() + 1);

     
      const categories = await Category.find({ userId });

      
      const budgets = await Budget.find({ userId, month });

     
      const expenses = await Expense.find({
        userId,
        date: { $gte: start, $lt: end }
      });

      const output = categories.map(cat => {
        const budgetObj = budgets.find(b => b.categoryId.toString() === cat._id.toString());
        const spent = expenses
          .filter(e => e.categoryId.toString() === cat._id.toString())
          .reduce((sum, e) => sum + e.amount, 0);

        return {
          categoryId: cat._id,
          category: cat.name,
          color: cat.color || "#888",
          budget: budgetObj?.amount || 0,
          spent,
          remaining: (budgetObj?.amount || 0) - spent,
          status: (budgetObj?.amount || 0) - spent < 0 ? "over" : "within"
        };
      });

      res.json(output);

    } catch (err) {
      console.error(err);
      res.status(500).json({ message: "Failed to generate report" });
    }
  }

};

export default reportController;
