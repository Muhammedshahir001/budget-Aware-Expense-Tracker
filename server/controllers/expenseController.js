import Expense from "../models/Expense.js";
import Budget from "../models/Budget.js";

export const addExpense = async (req, res) => {
  try {
    const { categoryId, amount, date } = req.body;
    if (!categoryId || !amount || !date)
      return res.status(400).json({ message: "Missing fields" });

    const expense = await Expense.create({
      userId: req.user.id,
      categoryId,
      amount,
      date: new Date(date)
    });

    
    const month = new Date(date).toISOString().slice(0, 7);
    const start = new Date(month + "-01");
    const end = new Date(start);
    end.setMonth(end.getMonth() + 1);

    const agg = await Expense.aggregate([
      { $match: { userId: req.user.id, categoryId, date: { $gte: start, $lt: end } } },
      { $group: { _id: null, total: { $sum: "$amount" } } }
    ]);

    const spent = agg[0]?.total || 0;
    const budget = await Budget.findOne({ userId: req.user.id, categoryId, month });
    const status = budget && spent > budget.amount ? "over" : "within";

    res.json({ message: "Saved", status, expense });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const listExpenses = async (req, res) => {
  try {
    const { month } = req.query;
    const q = { userId: req.user.id };

    if (month) {
      const start = new Date(month + "-01");
      const end = new Date(start);
      end.setMonth(end.getMonth() + 1);
      q.date = { $gte: start, $lt: end };
    }

    const expenses = await Expense.find(q).sort({ date: -1 }).populate("categoryId");
    res.json(expenses);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const removeExpense = async (req, res) => {
  try {
    await Expense.deleteOne({ _id: req.params.id, userId: req.user.id });
    res.json({ message: "Expense deleted" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
