import React, { useState,useEffect } from 'react';
import EditIcon from '@mui/icons-material/Edit';
import Button from "@mui/material/Button";
import IconButton from "@mui/material/IconButton";
import './App.css';

function App() {

  //storage controller
  const StorageCtrl = (function () {
    return {
      storeMeals: function() {
        localStorage.setItem("meals", JSON.stringify(meals));
      },

      storeItem: function () {
        setMeals([...meals,{id:id,name:name,calories:calories}]);
      },
  
      getItemsFromStorage: function () {
        let items = localStorage.getItem('meals');
        return items ? JSON.parse(items) : [];
      },

      getItemById: function (id) {
        let items = JSON.parse(localStorage.getItem('meals'));
        let item = items.find(i => {return i.id === id})
        return item ? item : '';
      },

      updateItem: function () {
        let items = JSON.parse(localStorage.getItem("meals"));
        items.forEach(function (item) {
          if (item.id === id) {
            items.splice(item.id, 1, {id:id,name:name,calories:calories});
          }
        });
        setMeals(items);
      },
 
      deleteItem: function () {
        let items = JSON.parse(localStorage.getItem("meals"));
        items.splice(id, 1);
        let count = 0;

        items.forEach(function (item) {
          item.id = count++;
        });
        setMeals(items);
        console.log(items);
      },

      clearItems: function () {
        setMeals([]);
      },

    };
  })();
  
  const [meals, setMeals] = useState(() => { return StorageCtrl.getItemsFromStorage(); });
  const [id, setId] = useState(() => {return meals.length});
  const [name, setName] = useState('');
  const [calories, setCalories] = useState();
  const [totalCalories, setTotalCalories] = useState(() => { return countTotalCalories(); });
  const [editMode, setEditMode] = useState(false);
  

  function countTotalCalories(){
    let count = 0;
    for(let i = 0; i < meals.length; i++)
      count += meals[i].calories;
    return count;
  }

  const handleSubmit = (e) => {
    //dont refresh page
    e.preventDefault();

    if(e.target.id == "clr-btn"){
      //delete all
      console.log("Clear Items");
      StorageCtrl.clearItems();
    }

    if(name && calories && calories !== NaN){
      if(e.target.id == "add-btn"){
        //add item
        StorageCtrl.storeItem(); 
      }
      else if(e.target.id == "edit-btn"){
        //update item
        StorageCtrl.updateItem(); 
        toggleButtonPanel();
      }
      else if(e.target.id == "delete-btn"){
        //delete item
        StorageCtrl.deleteItem();
        toggleButtonPanel();
      }
      else if(e.target.id == "back-btn"){
        //delete item
        toggleButtonPanel();
        //set id since meals isn't being altered
        setId(meals.length);
      }

    //clear inputs
    setName('');
    setCalories('');
    }
    
  }

  function editMeal(id){
    const meal = StorageCtrl.getItemById(id);
    toggleButtonPanel();

    setId(id);
    setName(meal.name);
    setCalories(meal.calories);
  }

  //generates a list that will update when meals is altered
  class GenerateList extends React.Component {
    constructor(props) {
      super(props);
    }
    render(){
      return(
        meals.map((meal) => (
          <li key={meal.id}>{meal.name}: {meal.calories} calories
            <IconButton onClick={() => editMeal(meal.id)}>
              <EditIcon/>
            </IconButton>
          </li>
        ))
      )
    }
  }

  function toggleButtonPanel() {
    setEditMode(prevState => !prevState);
  }

  //any time meals is altered
  useEffect(() => {
    //save meals to storage
    StorageCtrl.storeMeals();
    //update calories
    let updateCalories = (c) => setTotalCalories(countTotalCalories());
    updateCalories();
    //set current id
    setId(meals.length);
  }, [meals]);

  return (
    <div className="App">
      <nav>
        <a>Calorie Counter</a>
        <Button id="clr-btn" variant="contained" onClick={handleSubmit}>Clear All</Button>
      </nav>

      <br/>

      <div>
        <div>
          <span>Add Meal / Food Item</span>
          <form>
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
              {!editMode && <Button id="add-btn" variant="contained" onClick={handleSubmit}>Add Meal</Button>}
              {editMode && <Button id="edit-btn" variant="contained" onClick={handleSubmit}>Update Meal</Button>}
              {editMode && <Button id="delete-btn" variant="contained" onClick={handleSubmit}>Delete Meal</Button>}
              {editMode && <Button id="back-btn" variant="contained" onClick={handleSubmit}>Back</Button>}
            </div>
          </form>
        </div>

        <h3 class="center-align">
          Total Calories: {totalCalories}
        </h3>

        <ul id="item-list">
          <GenerateList list={meals}></GenerateList>
        </ul>
            
      </div>

    </div>
  );
}

export default App;
