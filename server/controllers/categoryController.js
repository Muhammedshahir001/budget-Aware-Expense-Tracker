import Category from "../models/Category.js";

const categoryController = {

  getAll: async (req, res) => {
    try {
      const list = await Category.find({ userId: req.user.id });
      res.json(list);
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  },

  create: async (req, res) => {
    try {
      const { name, color } = req.body;
      if (!name) return res.status(400).json({ message: "Name required" });

      const item = await Category.create({
        name,
        color,
        userId: req.user.id,   
      });

      res.json({ message: "Category created", item });

    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  },

  remove: async (req, res) => {
    try {
      await Category.deleteOne({ _id: req.params.id, userId: req.user.id });
      res.json({ message: "Category deleted" });

    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  }

};

export default categoryController;
