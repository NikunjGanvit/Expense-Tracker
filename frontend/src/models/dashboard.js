import React, { useEffect, useState } from 'react';
import { Button } from 'react-bootstrap';
import axios from 'axios';
import IncomeBox from './IncomeBox';
import ExpenseBox from './ExpenseBox';
import FilterForm from './FilterForm';
import AddIncomeForm from './AddIncomeForm';
import AddExpenseForm from './AddExpenseForm';
import jsPDF from 'jspdf';
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';
import useAuthnticate from './auth/authentication';
const Dashboard = () => {
  const [showFilterForm, setShowFilterForm] = useState(false);
  const [showAddIncomeForm, setShowAddIncomeForm] = useState(false);
  const [showAddExpenseForm, setShowAddExpenseForm] = useState(false);
  const [showCategoryInput, setShowCategoryInput] = useState(false);
  const [newCategory, setNewCategory] = useState('');
  const [error, setError] = useState('');
  const [refreshIncomes, setRefreshIncomes] = useState(false);
  const [refreshExpenses, setRefreshExpenses] = useState(false);
  // const [, setIncomeData] = useState([]);
  // const [, setExpenseData] = useState([]);
  const [documentType, setDocumentType] = useState('');

  const isAuthnticate = useAuthnticate();
  useEffect(() => {
    isAuthnticate(); // Check authentication when the component mounts
  }, [isAuthnticate]);

  const toggleFilterForm = () => setShowFilterForm(!showFilterForm);
  const toggleAddIncomeForm = () => setShowAddIncomeForm(!showAddIncomeForm);
  const toggleAddExpenseForm = () => setShowAddExpenseForm(!showAddExpenseForm);
  const toggleCategoryInput = () => setShowCategoryInput(!showCategoryInput);

  const handleCategoryInputChange = (e) => setNewCategory(e.target.value);

  const handleCategorySubmit = async () => {
    try {
      if (!newCategory.trim()) {
        setError('Category name cannot be empty');
        return;
      }

      const token = localStorage.getItem('jwtToken');
      if (!token) {
        setError('User is not logged in');
        return;
      }

      const decodedToken = JSON.parse(atob(token.split('.')[1]));
      const userId = decodedToken.userId;

      await axios.post(
        'http://localhost:8000/category',
        { name: newCategory, user_id: userId },
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );
      handleExpenseRefresh();
      handleIncomeRefresh();
      window.alert(`Category added successfully!\nUser ID: ${userId}\nCategory Name: ${newCategory}`);
      setShowCategoryInput(false);
      setNewCategory('');
      setError('');
    } catch (error) {
      console.error('Error adding category:', error);
      setError('Failed to add category');
    }
  };

  const handleCategoryCancel = () => {
    setShowCategoryInput(false);
    setNewCategory('');
    setError('');
  };

  const handleDownloadData = async () => {
    const token = localStorage.getItem('jwtToken');
    if (!token) {
      setError('User is not logged in');
      return;
    }

    try {
      const responseIncomes = await axios.get('http://localhost:8000/income', {
        headers: { Authorization: `Bearer ${token}` }
      });

      const responseExpenses = await axios.get('http://localhost:8000/expense', {
        headers: { Authorization: `Bearer ${token}` }
      });

      const allIncomeData = responseIncomes.data;
      const allExpenseData = responseExpenses.data;

      const decodedToken = JSON.parse(atob(token.split('.')[1]));
      const userId = decodedToken.userId;

      const userIncomeData = allIncomeData.filter((item) => item.user_id._id === userId);
      const userExpenseData = allExpenseData.filter((item) => item.user_id._id === userId);

      const dataToExport = {
        Income: userIncomeData.map((item) => ({
          Category: item.category.name,
          Amount: item.amount,
          Date: item.date,
          Note: item.note,
          Recurring: item.recurring ? 'Yes' : 'No'
        })),
        Expense: userExpenseData.map((item) => ({
          Category: item.category.name,
          Amount: item.amount,
          Date: item.date,
          Note: item.note,
          Recurring: item.recurring ? 'Yes' : 'No'
        }))
      };

      if (documentType === 'pdf') {
        const doc = new jsPDF();
        doc.text('Income and Expense Data', 10, 10);

        let yOffset = 20;
        doc.text('Income Data:', 10, yOffset);
        yOffset += 10;

        dataToExport.Income.forEach((item) => {
          doc.text(`Category: ${item.Category}, Amount: ${item.Amount}, Date: ${item.Date}, Note: ${item.Note}, Recurring: ${item.Recurring}`, 10, yOffset);
          yOffset += 10;
        });

        yOffset += 10;
        doc.text('Expense Data:', 10, yOffset);
        yOffset += 10;

        dataToExport.Expense.forEach((item) => {
          doc.text(`Category: ${item.Category}, Amount: ${item.Amount}, Date: ${item.Date}, Note: ${item.Note}, Recurring: ${item.Recurring}`, 10, yOffset);
          yOffset += 10;
        });

        doc.save('data.pdf');
      } else if (documentType === 'excel') {
        // Create a new workbook
        const workbook = XLSX.utils.book_new();

        // Create worksheets
        const incomeWorksheet = XLSX.utils.json_to_sheet(dataToExport.Income);
        const expenseWorksheet = XLSX.utils.json_to_sheet(dataToExport.Expense);

        // Add worksheets to the workbook
        workbook.SheetNames.push('Income Data');
        workbook.Sheets['Income Data'] = incomeWorksheet;

        workbook.SheetNames.push('Expense Data');
        workbook.Sheets['Expense Data'] = expenseWorksheet;

        // Write the workbook to a buffer and save
        const excelBuffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
        saveAs(new Blob([excelBuffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' }), 'data.xlsx');
      } else if (documentType === 'csv') {
        const csvRows = [];
        csvRows.push(['Type', 'Category', 'Amount', 'Date', 'Note', 'Recurring']);

        dataToExport.Income.forEach((item) => {
          csvRows.push(['Income', item.Category, item.Amount, item.Date, item.Note, item.Recurring]);
        });

        dataToExport.Expense.forEach((item) => {
          csvRows.push(['Expense', item.Category, item.Amount, item.Date, item.Note, item.Recurring]);
        });

        const csvContent = csvRows.map(row => row.join(',')).join('\n');
        const blob = new Blob([csvContent], { type: 'text/csv' });
        saveAs(blob, 'data.csv');
      } else {
        alert('Unsupported format');
      }
    } catch (error) {
      console.error('Error downloading data:', error);
      setError('Failed to download data');
    }
  };

  const handleExpenseRefresh = () => setRefreshExpenses(prev => !prev);
  const handleIncomeRefresh = () => setRefreshIncomes(prev => !prev);

  return (
    <div style={{ backgroundColor: '#add8e6', minHeight: '100vh', padding: '20px' }}>
      <h1 className="text-center mt-4 mb-4">Expense Tracker Dashboard</h1>

      <div className="text-center mb-4">
        <Button onClick={toggleFilterForm} variant="primary" className="me-2">
          Filter
        </Button>
        <Button onClick={toggleAddIncomeForm} variant="success" className="me-2">
          Add Income
        </Button>
        <Button onClick={toggleAddExpenseForm} variant="danger" className="me-2">
          Add Expense
        </Button>
        <Button onClick={toggleCategoryInput} variant="info" className="me-2">
          Add Category
        </Button>
        
        {/* Dropdown for document type selection */}
        <select
          value={documentType}
          onChange={(e) => setDocumentType(e.target.value)}
          className="me-2"
        >
          <option value="">Select Document Type</option>
          <option value="pdf">PDF</option>
          <option value="excel">Excel</option>
          <option value="csv">CSV</option>
        </select>

        <Button onClick={handleDownloadData} variant="dark">
          Download Data
        </Button>

        {showFilterForm && (
          <div className="overlay">
            <FilterForm onClose={toggleFilterForm} />
          </div>
        )}

        {showAddIncomeForm && (
          <div className="overlay">
            <AddIncomeForm 
              onClose={toggleAddIncomeForm}
              onSuccess={handleIncomeRefresh}
            />
          </div>
        )}

        {showAddExpenseForm && (
          <div className="overlay">
            <AddExpenseForm 
              onClose={toggleAddExpenseForm}
              onSuccess={handleExpenseRefresh}
            />
          </div>
        )}

        {showCategoryInput && (
          <div className="overlay">
            <div className="category-input-container">
              <input
                type="text"
                placeholder="Enter new category"
                value={newCategory}
                onChange={handleCategoryInputChange}
              />
              <Button onClick={handleCategorySubmit} variant="primary">
                Submit
              </Button>
              <Button onClick={handleCategoryCancel} variant="secondary">
                Cancel
              </Button>
              {error && <p className="text-danger">{error}</p>}
            </div>
          </div>
        )}
      </div>

      <div className="d-flex justify-content-around">
        <div className="box-container">
          <IncomeBox refresh={refreshIncomes} />
        </div>
        <div className="box-container">
          <ExpenseBox refresh={refreshExpenses} />
        </div>
      </div>

      <style jsx>{`
        .overlay {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background-color: rgba(0, 0, 255, 0.5);
          display: flex;
          justify-content: center;
          align-items: center;
          z-index: 999;
        }

        .category-input-container {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 10px;
          background-color: #fff;
          padding: 20px;
          border-radius: 8px;
          box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
        }
      `}</style>
    </div>
  );
};

export default Dashboard;
