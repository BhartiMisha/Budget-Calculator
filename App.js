import React, { useState, useEffect } from 'react'
import './App.css';
import ExpenseList from './components/expenseList'
import ExpenseForm from './components/expenseForm'
import Alert from './components/alert'
import { isCompositeComponent } from 'react-dom/test-utils';
const { v4: uuidv4 } = require('uuid');

// import useState()
// function returns array with two values
// the actual value of the state
// function for updates/controls
// default value

/* const initialExpenses = [
  {
    id: uuidv4(),
    charge: "rent",
    amount: 16000,
  },
  {
    id: uuidv4(),
    charge: "car payment",
    amount: 400,
  },
  {
    id: uuidv4(),
    charge: "emi",
    amount: 2710,
  },
] */

const initialExpenses = localStorage.getItem('expenses') ? JSON.parse(localStorage.getItem("expenses")) : []

function App() {
  // **************** state values ********************
  // all expenses, add expense
  const [expenses, setExpenses] = useState(initialExpenses);
  //single expense
  const [charge, setCharge] = useState('');
  //single amount
  const [amount, setAmount] = useState('');
  // alert
  const [alert,setAlert]= useState({show:false});
  // edit 
  const [edit,setEdit]= useState(false);

  //edit item
  const [id,setId]=useState(0);
  //****************** functionality *******************
  useEffect(()=>{
    localStorage.setItem('expenses',JSON.stringify(expenses));
  },[expenses]);
  //****************** functionality *******************
//handle charge
  const handleCharge = e => {
    setCharge(e.target.value);

  }
// handle amount
  const handleAmount = e => {
    
    setAmount(e.target.value);
  }
// handle alert
  const handleAlert = ({type,text}) => {
    setAlert({show:true,type,text})
    setTimeout(()=>{
      setAlert({show:false})
  },3000)
  }
// handle submit
  const handleSubmit = e => {
    e.preventDefault();
    if(charge !='' && amount > 0)
    {

      if(edit)
      {
        let tempExpenses= expenses.map(item=>{  //iterates and check if the id matches then changes the charge and amount else returns the item as it is
          return item.id===id? {...item,charge: charge,amount: amount} : item;
        })
        setExpenses([...tempExpenses]);
        setEdit(false);
        handleAlert({type:'success',text: 'item updated'})
      }
      else{
        const singleExpense = {
          id: uuidv4(),
          charge, //since the name and the value name would be same so we use just the charge
          amount //same like charge name
        };
        setExpenses([...expenses,singleExpense]); //we need to use array here or else it will throw an error,
                                                  //if we dont use ..expenses then all the previous items will be deleted
        handleAlert({type:"success",text: "item added"});
      }
      
      setCharge("");
      setAmount("");
    }                                           

    else{
      //handle alert call
      handleAlert({type: "danger", text: `charge cannot be empty value and amount value has to be bigger than zero`})
    }
  };

  //clear all items
  const clearItems= () => {
    setExpenses([]); // pass empty array to clear all the items
    handleAlert({type:'danger', text: 'all items deleted'})
  }
  // handle delete
  const handleDelete= (id) =>
  { // filter is used to iterate and filter out, here if item.id is not equal to id then we will pass it to tempExpense
    let tempExpenses = expenses.filter(item => item.id !== id)
    setExpenses([...tempExpenses])
    handleAlert({type:'danger',text: `item deleted`})
    
  }
  //handle edit
  const handleEdit = (id) =>{
    let expense= expenses.find(item => item.id === id)
    let {charge,amount}=expense;
    setCharge(charge);
    setAmount(amount);
    setEdit(true);
    setId(id);
  }
  return (
    <>
      {alert.show && <Alert type={alert.type} text={alert.text} />}
      <Alert />
      <h1>budget calculator</h1>
      <main className="App">
        <ExpenseForm charge={charge} amount={amount} handleAmount={handleAmount} handleCharge={handleCharge} handleSubmit={handleSubmit} edit={edit}  />
        <ExpenseList expenses={expenses} handleDelete={handleDelete} handleEdit={handleEdit} clearItems={clearItems}  />
      </main>

      <h1>
        Total spending: <span className="total">
          ${expenses.reduce((acc, curr) => {
            return (acc += parseInt(curr.amount));
          }, 0)}
        </span>
      </h1>

    </>
  );
}

export default App;
