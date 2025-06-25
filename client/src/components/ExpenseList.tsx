import React, { useState } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
  Dialog,
  Box,
  Typography,
} from '@mui/material';
import { Edit as EditIcon, Delete as DeleteIcon } from '@mui/icons-material';
import { Expense, ExpenseFormData } from '../types/expense';
import { ExpenseForm } from './ExpenseForm';

interface ExpenseListProps {
  expenses: Expense[];
  onDelete: (id: string) => void;
  onUpdate: (id: string, expense: ExpenseFormData) => void;
}

export const ExpenseList: React.FC<ExpenseListProps> = ({
  expenses,
  onDelete,
  onUpdate,
}) => {
  const [editingExpense, setEditingExpense] = useState<Expense | null>(null);

  const handleCloseDialog = () => {
    setEditingExpense(null);
  };

  const handleUpdate = (formData: ExpenseFormData) => {
    if (editingExpense) {
      onUpdate(editingExpense._id, formData);
      handleCloseDialog();
    }
  };

  return (
    <Box>
      <Typography variant="h6" gutterBottom>
        Expense List
      </Typography>
      
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Date</TableCell>
              <TableCell>Category</TableCell>
              <TableCell>Description</TableCell>
              <TableCell align="right">Amount</TableCell>
              <TableCell align="center">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {expenses.map((expense) => (
              <TableRow key={expense._id}>
                <TableCell>{new Date(expense.date).toLocaleDateString()}</TableCell>
                <TableCell>{expense.category}</TableCell>
                <TableCell>{expense.description}</TableCell>
                <TableCell align="right">${expense.amount.toFixed(2)}</TableCell>
                <TableCell align="center">
                  <IconButton
                    color="primary"
                    onClick={() => setEditingExpense(expense)}
                  >
                    <EditIcon />
                  </IconButton>
                  <IconButton
                    color="error"
                    onClick={() => onDelete(expense._id)}
                  >
                    <DeleteIcon />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <Dialog open={!!editingExpense} onClose={handleCloseDialog} maxWidth="sm" fullWidth>
        {editingExpense && (
          <Box sx={{ p: 2 }}>
            <ExpenseForm
              onSubmit={handleUpdate}
              initialData={editingExpense}
              isEditing
            />
          </Box>
        )}
      </Dialog>
    </Box>
  );
}; 