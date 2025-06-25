import express from 'express';
import mongoose from 'mongoose';
import { auth } from '../middleware/auth.js';

const router = express.Router();

// Expense Schema
const expenseSchema = new mongoose.Schema({
  amount: { type: Number, required: true },
  category: { type: String, required: true },
  description: { type: String },
  date: { type: Date, required: true },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }
});

const Expense = mongoose.model('Expense', expenseSchema);

// Create expense
router.post('/', auth, async (req, res) => {
  try {
    const { amount, category, description, date } = req.body;
    const expense = new Expense({
      amount,
      category,
      description,
      date,
      userId: req.user._id
    });
    await expense.save();
    res.status(201).json(expense);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Get all expenses
router.get('/', auth, async (req, res) => {
  try {
    const expenses = await Expense.find({ userId: req.user._id }).sort({ date: -1 });
    res.json(expenses);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Update expense
router.put('/:id', auth, async (req, res) => {
  try {
    const { id } = req.params;
    const { amount, category, description, date } = req.body;
    
    const expense = await Expense.findOne({ _id: id, userId: req.user._id });
    if (!expense) return res.status(404).json({ error: 'Expense not found' });
    
    expense.amount = amount;
    expense.category = category;
    expense.description = description;
    expense.date = date;
    
    await expense.save();
    res.json(expense);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Delete expense
router.delete('/:id', auth, async (req, res) => {
  try {
    const { id } = req.params;
    const expense = await Expense.findOneAndDelete({ _id: id, userId: req.user._id });
    if (!expense) return res.status(404).json({ error: 'Expense not found' });
    res.json({ message: 'Expense deleted' });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

export default router; 