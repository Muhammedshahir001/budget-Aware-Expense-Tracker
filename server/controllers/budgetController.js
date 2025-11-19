import Budget from "../models/Budget.js";

const budgetController = {

  getAll: async (req, res) => {
  try {
    const { month } = req.query;
    const query = { userId: req.user.id };
    if (month) query.month = month;

    const list = await Budget.find(query).populate("categoryId", "name"); 
    res.json(list);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
},


  createOrUpdate: async (req, res) => {
    try {
      const { categoryId, amount, month } = req.body;

      if (!categoryId || !amount || !month) {
        return res.status(400).json({ message: "Missing fields" });
      }

      
      let budget = await Budget.findOne({
        userId: req.user.id,
        categoryId,
        month
      });

      if (budget) {
  
        budget.amount = amount;
        await budget.save();
        return res.json({ message: "Budget updated", item: budget });
      }

     
      budget = await Budget.create({
        categoryId,
        amount,
        month,
        userId: req.user.id
      });

      res.json({ message: "Budget created", item: budget });
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  },


  remove: async (req, res) => {
    try {
      await Budget.deleteOne({ _id: req.params.id, userId: req.user.id });
      res.json({ message: "Budget deleted" });
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  }
};

export default budgetController;
