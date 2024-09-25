import React, { useState, useEffect } from 'react';

const FinanceApp = () => {
  const [income, setIncome] = useState(0);
  const [expenses, setExpenses] = useState([]);
  const [fixedExpenses, setFixedExpenses] = useState([]);
  const [newExpense, setNewExpense] = useState({ name: '', amount: '', date: new Date().toISOString().split('T')[0] });
  const [newFixedExpense, setNewFixedExpense] = useState({ name: '', amount: '' });
  const [savingsGoal, setSavingsGoal] = useState(0);
  const [months, setMonths] = useState(12);
  const [editingExpense, setEditingExpense] = useState(null);

  const addExpense = () => {
    if (newExpense.name && newExpense.amount) {
      setExpenses([...expenses, { ...newExpense, amount: parseFloat(newExpense.amount), id: Date.now() }]);
      setNewExpense({ name: '', amount: '', date: new Date().toISOString().split('T')[0] });
    }
  };

  const removeExpense = (id) => {
    setExpenses(expenses.filter(expense => expense.id !== id));
  };

  const editExpense = (expense) => {
    setEditingExpense(expense);
  };

  const saveEditedExpense = () => {
    if (editingExpense) {
      setExpenses(expenses.map(exp => exp.id === editingExpense.id ? editingExpense : exp));
      setEditingExpense(null);
    }
  };

  const addFixedExpense = () => {
    if (newFixedExpense.name && newFixedExpense.amount) {
      setFixedExpenses([...fixedExpenses, { ...newFixedExpense, amount: parseFloat(newFixedExpense.amount), spent: 0, id: Date.now() }]);
      setNewFixedExpense({ name: '', amount: '' });
    }
  };

  useEffect(() => {
    const updatedFixedExpenses = fixedExpenses.map(fixedExp => {
      const relatedExpenses = expenses.filter(exp => exp.name.toLowerCase() === fixedExp.name.toLowerCase());
      const totalSpent = relatedExpenses.reduce((sum, exp) => sum + exp.amount, 0);
      return { ...fixedExp, spent: totalSpent };
    });
    setFixedExpenses(updatedFixedExpenses);
  }, [expenses, fixedExpenses]);

  const calculateBalance = () => {
    const totalExpenses = expenses.reduce((sum, expense) => sum + expense.amount, 0);
    return income - totalExpenses;
  };

  const calculateSavings = () => {
    const monthlyBalance = calculateBalance();
    return monthlyBalance * months;
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <h1 className="text-3xl md:text-4xl font-light mb-8 text-center text-gray-800">Finanzas Personales</h1>
      
      <div className="bg-white shadow rounded-lg p-4 md:p-6 mb-8">
        <h2 className="text-xl md:text-2xl font-medium mb-4 text-gray-700">Ingresos</h2>
        <input
          type="number"
          value={income}
          onChange={(e) => setIncome(parseFloat(e.target.value) || 0)}
          placeholder="Ingreso mensual"
          className="w-full p-2 mb-4 border rounded"
        />
      </div>

      <div className="bg-white shadow rounded-lg p-4 md:p-6 mb-8">
        <h2 className="text-xl md:text-2xl font-medium mb-4 text-gray-700">Gastos</h2>
        <div className="flex flex-col md:flex-row gap-2 md:gap-4 mb-4">
          <input
            placeholder="Concepto"
            value={newExpense.name}
            onChange={(e) => setNewExpense({ ...newExpense, name: e.target.value })}
            className="flex-grow p-2 border rounded"
          />
          <input
            type="number"
            placeholder="Monto"
            value={newExpense.amount}
            onChange={(e) => setNewExpense({ ...newExpense, amount: e.target.value })}
            className="w-full md:w-32 p-2 border rounded"
          />
          <input
            type="date"
            value={newExpense.date}
            onChange={(e) => setNewExpense({ ...newExpense, date: e.target.value })}
            className="w-full md:w-40 p-2 border rounded"
          />
          <button onClick={addExpense} className="w-full md:w-auto bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition duration-300">Agregar</button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full min-w-full">
            <thead>
              <tr className="border-b-2 border-blue-500">
                <th className="text-left p-2">Concepto</th>
                <th className="text-left p-2">Monto</th>
                <th className="text-left p-2">Fecha</th>
                <th className="text-left p-2">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {expenses.map((expense) => (
                <tr key={expense.id} className="border-b">
                  <td className="p-2">
                    {editingExpense && editingExpense.id === expense.id ? (
                      <input
                        value={editingExpense.name}
                        onChange={(e) => setEditingExpense({ ...editingExpense, name: e.target.value })}
                        className="w-full p-1 border rounded"
                      />
                    ) : expense.name}
                  </td>
                  <td className="p-2">
                    {editingExpense && editingExpense.id === expense.id ? (
                      <input
                        type="number"
                        value={editingExpense.amount}
                        onChange={(e) => setEditingExpense({ ...editingExpense, amount: parseFloat(e.target.value) || 0 })}
                        className="w-full p-1 border rounded"
                      />
                    ) : `$${expense.amount.toFixed(2)}`}
                  </td>
                  <td className="p-2">
                    {editingExpense && editingExpense.id === expense.id ? (
                      <input
                        type="date"
                        value={editingExpense.date}
                        onChange={(e) => setEditingExpense({ ...editingExpense, date: e.target.value })}
                        className="w-full p-1 border rounded"
                      />
                    ) : expense.date}
                  </td>
                  <td className="p-2">
                    {editingExpense && editingExpense.id === expense.id ? (
                      <button onClick={saveEditedExpense} className="bg-green-500 text-white px-2 py-1 rounded text-sm hover:bg-green-600 transition duration-300">Guardar</button>
                    ) : (
                      <div className="flex flex-col sm:flex-row gap-2">
                        <button onClick={() => editExpense(expense)} className="bg-yellow-500 text-white px-2 py-1 rounded text-sm hover:bg-yellow-600 transition duration-300">
                          Editar
                        </button>
                        <button onClick={() => removeExpense(expense.id)} className="bg-red-500 text-white px-2 py-1 rounded text-sm hover:bg-red-600 transition duration-300">
                          Eliminar
                        </button>
                      </div>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="bg-white shadow rounded-lg p-4 md:p-6 mb-8">
        <h2 className="text-xl md:text-2xl font-medium mb-4 text-gray-700">Gastos Fijos</h2>
        <div className="flex flex-col md:flex-row gap-2 md:gap-4 mb-4">
          <input
            placeholder="Concepto"
            value={newFixedExpense.name}
            onChange={(e) => setNewFixedExpense({ ...newFixedExpense, name: e.target.value })}
            className="flex-grow p-2 border rounded"
          />
          <input
            type="number"
            placeholder="Monto estimado"
            value={newFixedExpense.amount}
            onChange={(e) => setNewFixedExpense({ ...newFixedExpense, amount: e.target.value })}
            className="w-full md:w-40 p-2 border rounded"
          />
          <button onClick={addFixedExpense} className="w-full md:w-auto bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition duration-300">Agregar</button>
        </div>
        {fixedExpenses.map((expense) => (
          <div key={expense.id} className="mb-4">
            <h3 className="text-lg font-medium mb-2">{expense.name}</h3>
            <p className="text-sm mb-2">
              Estimado: ${expense.amount.toFixed(2)} | Gastado: ${expense.spent.toFixed(2)}
            </p>
            <div className="w-full bg-gray-200 rounded-full h-2.5">
              <div 
                className="bg-blue-600 h-2.5 rounded-full transition-all duration-500" 
                style={{width: `${Math.min((expense.spent / expense.amount) * 100, 100)}%`}}
              ></div>
            </div>
            <p className="text-sm text-gray-600 mt-1">
              {expense.spent < expense.amount 
                ? `Ahorrado: $${(expense.amount - expense.spent).toFixed(2)}` 
                : `Excedido: $${(expense.spent - expense.amount).toFixed(2)}`}
            </p>
          </div>
        ))}
      </div>

      <div className="bg-white shadow rounded-lg p-4 md:p-6 mb-8">
        <h2 className="text-xl md:text-2xl font-medium mb-4 text-gray-700">Meta de Ahorro</h2>
        <div className="flex flex-col md:flex-row gap-2 md:gap-4 mb-4">
          <input
            type="number"
            placeholder="Meta de ahorro"
            value={savingsGoal}
            onChange={(e) => setSavingsGoal(parseFloat(e.target.value) || 0)}
            className="flex-grow p-2 border rounded"
          />
          <input
            type="number"
            placeholder="Número de meses"
            value={months}
            onChange={(e) => setMonths(parseInt(e.target.value) || 0)}
            className="w-full md:w-40 p-2 border rounded"
          />
        </div>
        <p className="text-lg mb-2">Ahorro proyectado en {months} meses: ${calculateSavings().toFixed(2)}</p>
        {savingsGoal > 0 && (
          <p className={`font-bold ${calculateSavings() >= savingsGoal ? 'text-green-600' : 'text-red-600'}`}>
            {calculateSavings() >= savingsGoal
              ? `¡Alcanzarás tu meta de ahorro en ${Math.ceil(savingsGoal / (calculateBalance() || 1))} meses!`
              : `No alcanzarás tu meta de ahorro en el tiempo especificado. Necesitas ahorrar $${((savingsGoal - calculateSavings()) / months).toFixed(2)} más por mes.`}
          </p>
        )}
      </div>

      <div className="bg-white shadow rounded-lg p-4 md:p-6">
        <h2 className="text-xl md:text-2xl font-medium mb-4 text-gray-700">Resumen Financiero</h2>
        <div className="bg-gray-100 p-4 rounded">
          <p className="mb-2">Ingresos: ${income.toFixed(2)}</p>
          <p className="mb-2">Gastos Totales: ${expenses.reduce((sum, expense) => sum + expense.amount, 0).toFixed(2)}</p>
          <p className="font-bold">Balance: ${calculateBalance().toFixed(2)}</p>
        </div>
      </div>
    </div>
  );
};

export default FinanceApp;
