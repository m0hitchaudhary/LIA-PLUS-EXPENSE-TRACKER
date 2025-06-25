import React, { useState, useEffect } from 'react';
import {
  Button,
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Box,
  Typography,
} from '@mui/material';
import { ExpenseFormData, ExpenseCategory, Expense } from '../types/expense';

interface ExpenseFormProps {
  onSubmit: (expense: ExpenseFormData) => void;
  initialData?: Expense;
  isEditing?: boolean;
}

const defaultFormData: ExpenseFormData = {
  amount: null,
  category: 'Other' as ExpenseCategory,
  description: '',
  date: new Date().toISOString().split('T')[0],
};

const categories: ExpenseCategory[] = [
  'Food',
  'Transportation',
  'Housing',
  'Utilities',
  'Entertainment',
  'Shopping',
  'Healthcare',
  'Other',
];

export const ExpenseForm: React.FC<ExpenseFormProps> = ({
  onSubmit,
  initialData,
  isEditing = false,
}) => {
  const [formData, setFormData] = useState<ExpenseFormData>(defaultFormData);

  useEffect(() => {
    if (initialData) {
      setFormData({
        amount: initialData.amount,
        category: initialData.category as ExpenseCategory,
        description: initialData.description,
        date: initialData.date.split('T')[0],
      });
    }
  }, [initialData]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.amount === null) return;
    onSubmit({
      ...formData,
      amount: formData.amount
    });
    if (!isEditing) {
      setFormData(defaultFormData);
    }
  };

  const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setFormData({
      ...formData,
      amount: value === '' ? null : Number(value)
    });
  };

  const handleCategoryChange = (e: { target: { value: string } }) => {
    setFormData({
      ...formData,
      category: e.target.value as ExpenseCategory
    });
  };

  return (
    <Box component="form" onSubmit={handleSubmit} sx={{ maxWidth: 400, margin: '0 auto' }}>
      <Typography variant="h6" gutterBottom sx={{ textAlign: 'center' }}>
        {isEditing ? 'Edit Expense' : 'Add New Expense'}
      </Typography>
      
      <TextField
        fullWidth
        label="Amount"
        type="number"
        value={formData.amount === null ? '' : formData.amount}
        onChange={handleAmountChange}
        margin="normal"
        required
        inputProps={{ min: 0, step: "0.01" }}
      />

      <FormControl fullWidth margin="normal" required>
        <InputLabel id="category-label">Category</InputLabel>
        <Select
          labelId="category-label"
          value={formData.category}
          onChange={handleCategoryChange}
          label="Category"
        >
          {categories.map((category) => (
            <MenuItem key={category} value={category}>
              {category}
            </MenuItem>
          ))}
        </Select>
      </FormControl>

      <TextField
        fullWidth
        label="Description"
        value={formData.description}
        onChange={(e) => setFormData({ ...formData, description: e.target.value })}
        margin="normal"
      />

      <TextField
        fullWidth
        label="Date"
        type="date"
        value={formData.date}
        onChange={(e) => setFormData({ ...formData, date: e.target.value })}
        margin="normal"
        required
        InputLabelProps={{ shrink: true }}
      />

      <Button
        type="submit"
        variant="contained"
        color="primary"
        fullWidth
        sx={{ mt: 2 }}
        disabled={formData.amount === null}
      >
        {isEditing ? 'Update Expense' : 'Add Expense'}
      </Button>
    </Box>
  );
}; 