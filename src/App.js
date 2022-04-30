import React, { useState,useEffect } from 'react';
import './App.css';

function App() {
  const [meals, setMeals] = useState([]);
  const [name, setName] = useState('');
  const [calories, setCalories] = useState();
  const [totalCalories, setTotalCalories] = useState(0);

  //currently only adding items
  const handleSubmit = (e) => {

    e.preventDefault();

    setMeals([...meals,{id:meals.length+1,name:name,calories:calories}]);
    updateCalories(calories);
    
    //clear inputs
    setName('');
    setCalories('');


  }

  function updateCalories(c) {
    setTotalCalories(totalCalories + c);
  }

  //store meals to localstorage when meals is altered  
  useEffect(() => {
    localStorage.setItem("meals", JSON.stringify(meals));
  }, [meals]);



  return (
    <div className="App">
      <nav>
        <a>Calorie Counter</a>
        <ul>
          <li>
            <a>Clear All</a>
          </li>
        </ul>
      </nav>

      <br/>

      <div>
        <div>
          <span>Add Meal / Food Item</span>
          <form onSubmit={handleSubmit}>
            <div>
              <div>
                <input type="text" 
                placeholder="Add Item" 
                id="item-name" 
                value={name} onChange={(e) => setName(e.target.value)}/>
                <label for="item-name">Meal</label>
              </div>
              <div>
                <input type="number"  
                placeholder="Add Calories"  
                id="item-calories" 
                value={calories} onChange={(e) => setCalories(parseInt(e.target.value))}/>
                <label for="item-calories">Calories</label>
              </div>
              <input type="submit"></input>
            </div>
          </form>
        </div>

        <h3 class="center-align">
          Total Calories: {totalCalories}
        </h3>

        <ul id="item-list">
          {meals.map((meal) => (
            <li key={meal.id}>{meal.name} {meal.calories}</li>
          ))}
        </ul>
        
      </div>

    </div>
  );
}

export default App;
