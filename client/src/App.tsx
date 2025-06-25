import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import { 
  Container, 
  AppBar, 
  Toolbar, 
  Typography, 
  Button, 
  Box, 
  CircularProgress, 
  Snackbar, 
  Alert,
  CssBaseline
} from '@mui/material';
import { ExpenseForm } from './components/ExpenseForm';
import { ExpenseList } from './components/ExpenseList';
import { ExpenseCharts } from './components/ExpenseCharts';
import Login from './components/Login';
import Register from './components/Register';
import { AuthProvider, useAuth } from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext';
import ThemeToggle from './components/ThemeToggle';
import { apiService } from './services/api';
import { Expense, ExpenseFormData } from './types/expense';

const PrivateRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user } = useAuth();
  return user ? <>{children}</> : <Navigate to="/login" />;
};

const Navigation: React.FC = () => {
  const { user, logout } = useAuth();

  return (
    <AppBar position="static">
      <Container>
        <Toolbar sx={{ position: 'relative' }}>
          <Typography 
            variant="h5" 
            sx={{ 
              position: 'absolute',
              left: '50%',
              transform: 'translateX(-50%)',
              fontWeight: 'bold'
            }}
          >
            Expense Tracker
          </Typography>

          {user && (
            <Box sx={{ 
              display: 'flex', 
              alignItems: 'center',
              gap: 2,
              ml: 'auto'
            }}>
              <ThemeToggle />
              <Typography sx={{ whiteSpace: 'nowrap' }}>
                Welcome, {user.name}
              </Typography>
              <Button 
                color="inherit" 
                onClick={logout}
                variant="outlined"
                sx={{ 
                  borderColor: 'white',
                  minWidth: 'auto',
                  whiteSpace: 'nowrap',
                  '&:hover': {
                    borderColor: 'white',
                    backgroundColor: 'rgba(255, 255, 255, 0.1)'
                  }
                }}
              >
                Logout
              </Button>
            </Box>
          )}
        </Toolbar>
      </Container>
    </AppBar>
  );
};

const Dashboard: React.FC = () => {
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [error, setError] = useState<string>('');
  const [success, setSuccess] = useState<string>('');

  const fetchExpenses = async () => {
    try {
      const response = await apiService.getAllExpenses();
      setExpenses(response.data);
    } catch (err) {
      setError('Failed to fetch expenses');
    }
  };

  useEffect(() => {
    fetchExpenses();
  }, []);

  const handleAddExpense = async (formData: ExpenseFormData) => {
    try {
      await apiService.addExpense(formData);
      await fetchExpenses();
      setSuccess('Expense added successfully');
    } catch (err) {
      setError('Failed to add expense');
    }
  };

  const handleUpdateExpense = async (id: string, formData: ExpenseFormData) => {
    try {
      await apiService.updateExpense(id, formData);
      await fetchExpenses();
      setSuccess('Expense updated successfully');
    } catch (err) {
      setError('Failed to update expense');
    }
  };

  const handleDeleteExpense = async (id: string) => {
    try {
      await apiService.deleteExpense(id);
      await fetchExpenses();
      setSuccess('Expense deleted successfully');
    } catch (err) {
      setError('Failed to delete expense');
    }
  };

  return (
    <Box sx={{ mt: 4 }}>
      <ExpenseForm onSubmit={handleAddExpense} />
      
      <Box sx={{ mt: 8 }}>
        <ExpenseList
          expenses={expenses}
          onUpdate={handleUpdateExpense}
          onDelete={handleDeleteExpense}
        />
      </Box>

      <Box sx={{ mt: 4 }}>
        <ExpenseCharts expenses={expenses} />
      </Box>

      <Snackbar
        open={!!error}
        autoHideDuration={6000}
        onClose={() => setError('')}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      >
        <Alert onClose={() => setError('')} severity="error">
          {error}
        </Alert>
      </Snackbar>

      <Snackbar
        open={!!success}
        autoHideDuration={6000}
        onClose={() => setSuccess('')}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      >
        <Alert onClose={() => setSuccess('')} severity="success">
          {success}
        </Alert>
      </Snackbar>
    </Box>
  );
};

const App: React.FC = () => {
  return (
    <ThemeProvider>
      <CssBaseline />
      <AuthProvider>
        <Router>
          <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
            <Navigation />
            <Container component="main" sx={{ mt: 4, mb: 4, flex: 1 }}>
              <Routes>
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route
                  path="/"
                  element={
                    <PrivateRoute>
                      <Dashboard />
                    </PrivateRoute>
                  }
                />
              </Routes>
            </Container>
          </Box>
        </Router>
      </AuthProvider>
    </ThemeProvider>
  );
};

export default App;
