import React, { useState } from 'react';
import { Box, Paper, Typography, ButtonGroup, Button } from '@mui/material';
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  BarElement,
  PointElement,
  LineElement,
} from 'chart.js';
import { Pie, Bar, Line } from 'react-chartjs-2';
import { Expense } from '../types/expense';

ChartJS.register(
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  BarElement,
  PointElement,
  LineElement
);

interface ExpenseChartsProps {
  expenses: Expense[];
}

interface DailyData {
  date: string;
  timestamp: number;
  total: number;
}

interface MonthlyData {
  month: string;
  monthIndex: number;
  total: number;
}

type TimePeriod = 'daily' | 'weekly' | 'monthly';

export const ExpenseCharts: React.FC<ExpenseChartsProps> = ({ expenses }) => {
  const [timePeriod, setTimePeriod] = useState<TimePeriod>('daily');

  const categoryTotals = expenses.reduce((acc, expense) => {
    acc[expense.category] = (acc[expense.category] || 0) + expense.amount;
    return acc;
  }, {} as Record<string, number>);

  const monthlyData = expenses.reduce((acc: MonthlyData[], expense) => {
    const date = new Date(expense.date);
    const month = date.toLocaleString('default', { month: 'short' });
    const monthIndex = date.getMonth();
    
    const existingMonth = acc.find(item => item.monthIndex === monthIndex);
    if (existingMonth) {
      existingMonth.total += expense.amount;
    } else {
      acc.push({ month, monthIndex, total: expense.amount });
    }
    return acc;
  }, []);

  monthlyData.sort((a, b) => a.monthIndex - b.monthIndex);

  const getTimeRangeData = () => {
    const now = new Date();
    let timeAgo = new Date();
    let format: Intl.DateTimeFormatOptions = { month: 'short', day: 'numeric' };
    
    switch (timePeriod) {
      case 'daily':
        timeAgo.setDate(now.getDate() - 30);
        break;
      case 'weekly':
        timeAgo.setDate(now.getDate() - 90);
        break;
      case 'monthly':
        timeAgo.setMonth(now.getMonth() - 12);
        format = { month: 'short', year: '2-digit' };
        break;
    }

    const filteredExpenses = expenses.filter(
      expense => new Date(expense.date) >= timeAgo
    );

    const groupedData = filteredExpenses.reduce((acc: DailyData[], expense) => {
      const date = new Date(expense.date);
      let groupKey: string;
      let timestamp: number;

      if (timePeriod === 'weekly') {
        const day = date.getDay();
        const diff = date.getDate() - day + (day === 0 ? -6 : 1);
        const monday = new Date(date.setDate(diff));
        groupKey = monday.toLocaleDateString('default', { month: 'short', day: 'numeric' });
        timestamp = monday.getTime();
      } else if (timePeriod === 'monthly') {
        groupKey = date.toLocaleDateString('default', { month: 'short', year: '2-digit' });
        timestamp = new Date(date.getFullYear(), date.getMonth(), 1).getTime();
      } else {
        groupKey = date.toLocaleDateString('default', format);
        timestamp = date.getTime();
      }

      const existingGroup = acc.find(item => item.date === groupKey);
      if (existingGroup) {
        existingGroup.total += expense.amount;
      } else {
        acc.push({ date: groupKey, timestamp, total: expense.amount });
      }
      return acc;
    }, []);

    return groupedData.sort((a, b) => a.timestamp - b.timestamp);
  };

  const timeRangeData = getTimeRangeData();

  const pieChartData = {
    labels: Object.keys(categoryTotals),
    datasets: [
      {
        data: Object.values(categoryTotals),
        backgroundColor: [
          '#FF6384',
          '#36A2EB',
          '#FFCE56',
          '#4BC0C0',
          '#9966FF',
          '#FF9F40',
          '#FF99CC',
          '#99FF99',
        ],
      },
    ],
  };

  const barChartData = {
    labels: monthlyData.map(item => item.month),
    datasets: [
      {
        label: 'Monthly Expenses',
        data: monthlyData.map(item => item.total),
        backgroundColor: '#36A2EB',
      },
    ],
  };

  const lineChartData = {
    labels: timeRangeData.map(item => item.date),
    datasets: [
      {
        label: `${timePeriod.charAt(0).toUpperCase() + timePeriod.slice(1)} Expenses`,
        data: timeRangeData.map(item => item.total),
        borderColor: '#4BC0C0',
        backgroundColor: 'rgba(75, 192, 192, 0.2)',
        tension: 0.3,
        fill: true,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      y: {
        beginAtZero: true,
        title: {
          display: true,
          text: 'Amount',
        },
      },
      x: {
        title: {
          display: true,
          text: 'Date',
        },
      },
    },
    plugins: {
      tooltip: {
        enabled: true,
        position: 'nearest' as const,
        intersect: false,
      },
    },
  };

  const getHeatmapData = () => {
    const data = Array(7).fill(0).map(() => Array(24).fill(0));

    expenses.forEach(expense => {
      const date = new Date(expense.date);
      const dayIndex = date.getDay();
      const hour = date.getHours();
      data[dayIndex][hour] += expense.amount;
    });

    return data;
  };

  const heatmapData = getHeatmapData();
  const maxAmount = Math.max(...heatmapData.flat());

  const heatmapChartData = {
    labels: ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
    datasets: Array(24).fill(0).map((_, hour) => ({
      label: `${hour}:00`,
      data: heatmapData.map(day => day[hour]),
      backgroundColor: heatmapData.map(day => {
        const value = day[hour];
        const intensity = value / maxAmount;
        return `rgba(75, 192, 192, ${intensity})`;
      }),
      barPercentage: 1,
      categoryPercentage: 1,
    })),
  };

  const heatmapOptions = {
    responsive: true,
    maintainAspectRatio: false,
    indexAxis: 'y' as const,
    scales: {
      x: {
        stacked: true,
        title: {
          display: true,
          text: 'Amount',
        },
      },
      y: {
        stacked: true,
        title: {
          display: true,
          text: 'Day of Week',
        },
      },
    },
    plugins: {
      tooltip: {
        callbacks: {
          title: (items: any[]) => {
            if (items.length > 0) {
              const dayIndex = items[0].dataIndex;
              return ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'][dayIndex];
            }
            return '';
          },
          label: (item: any) => {
            return `Amount: $${item.raw.toFixed(2)}`;
          },
        },
      },
      legend: {
        display: false,
      },
    },
  };

  return (
    <Box sx={{ mt: 4 }}>
      <Typography variant="h6" gutterBottom>
        Expense Analysis
      </Typography>
      
      <Box sx={{ display: 'flex', gap: 2, mb: 2 }}>
        <Paper sx={{ p: 2, flex: 1, minWidth: 300, maxWidth: '45%' }}>
          <Typography variant="subtitle1" gutterBottom>
            Expenses by Category
          </Typography>
          <Pie data={pieChartData} />
        </Paper>

        <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 2, minWidth: 300 }}>
          <Paper sx={{ p: 2, height: '48%' }}>
            <Typography variant="subtitle1" gutterBottom>
              Monthly Expenses
            </Typography>
            <Box sx={{ height: 'calc(100% - 32px)' }}>
              <Bar data={barChartData} options={chartOptions} />
            </Box>
          </Paper>

          <Paper sx={{ p: 2, height: '48%' }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
              <Typography variant="subtitle1">
                Expense Trends
              </Typography>
              <ButtonGroup size="small">
                <Button 
                  variant={timePeriod === 'daily' ? 'contained' : 'outlined'}
                  onClick={() => setTimePeriod('daily')}
                >
                  Daily
                </Button>
                <Button 
                  variant={timePeriod === 'weekly' ? 'contained' : 'outlined'}
                  onClick={() => setTimePeriod('weekly')}
                >
                  Weekly
                </Button>
                <Button 
                  variant={timePeriod === 'monthly' ? 'contained' : 'outlined'}
                  onClick={() => setTimePeriod('monthly')}
                >
                  Monthly
                </Button>
              </ButtonGroup>
            </Box>
            <Box sx={{ height: 'calc(100% - 50px)' }}>
              <Line data={lineChartData} options={chartOptions} />
            </Box>
          </Paper>
        </Box>
      </Box>

      <Paper sx={{ p: 2, mt: 2, height: '300px' }}>
        <Typography variant="subtitle1" gutterBottom>
          Spending Patterns (Day & Hour)
        </Typography>
        <Box sx={{ height: 'calc(100% - 32px)' }}>
          <Bar data={heatmapChartData} options={heatmapOptions} />
        </Box>
      </Paper>
    </Box>
  );
};