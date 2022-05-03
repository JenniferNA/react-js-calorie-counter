import React, { useState,useEffect } from 'react';
import {Paper, Button, IconButton, AppBar, Grid, Stack, Toolbar, TextField, Typography, Divider} from '@mui/material/';
import EditIcon from '@mui/icons-material/Edit';
import AddIcon from '@mui/icons-material/Add';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import LibraryAddCheckIcon from '@mui/icons-material/LibraryAddCheck';
import KeyboardArrowLeftIcon from '@mui/icons-material/KeyboardArrowLeft';
import Box from '@mui/system/Box';
import './App.css';

function App() {

  //data controller
  const DataCtrl = (function () {
    return {
      //saves meals to local storage
      storeMeals: function() {
        localStorage.setItem("meals", JSON.stringify(meals));
      },

      //adds item to meals
      storeItem: function () {
        setMeals([...meals,{id:id,name:name,calories:calories}]);
      },
  
      //gets meals from local storage
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
  
  const [meals, setMeals] = useState(() => { return DataCtrl.getItemsFromStorage(); });
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

  //handles UI changes when a meal is selected to be edited
  function editMeal(id){
    //get the 
    const meal = DataCtrl.getItemById(id);
    //makes edit buttons visible
    toggleButtonPanel();
    
    setId(id);
    setName(meal.name);
    setCalories(parseInt(meal.calories));
  }

  //toggles whether the edit buttons are visible
  function toggleButtonPanel() {
    setEditMode(prevState => !prevState);
  }


  const handleSubmit = (e) => {
    //dont refresh page
    e.preventDefault();

    if(e.target.id == "clr-btn"){
      //delete all
      console.log("Clear Items");
      DataCtrl.clearItems();
    }

    if(name && calories && calories !== NaN){
      if(e.target.id == "add-btn"){
        //add item
        DataCtrl.storeItem(); 
      }
      else if(e.target.id == "edit-btn"){
        //update item
        DataCtrl.updateItem(); 
        toggleButtonPanel();
      }
      else if(e.target.id == "delete-btn"){
        //delete item
        DataCtrl.deleteItem();
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

  //generates a list that will update when meals is altered
  class GenerateList extends React.Component {
    constructor(props) {
      super(props);
    }
    render(){
      return(
        meals.map((meal) => (
          <div>
            <Stack direction="row" >
              <li key={meal.id}><strong>{meal.name}:</strong> <em>{meal.calories} calories</em></li>
                {!editMode &&<IconButton id="edit-icon" onClick={() => editMeal(meal.id)}>
                  <EditIcon/>
                </IconButton>}
            </Stack>
            <Divider light />
          </div>
        ))
      )
    }
  }

  
  //any time meals is altered
  useEffect(() => {
    //save meals to storage
    DataCtrl.storeMeals();
    //update calories
    let updateCalories = (c) => setTotalCalories(countTotalCalories());
    updateCalories();
    //set current id
    setId(meals.length);
  }, [meals]);

  return (
    <div className="App">
      <AppBar position="static">
        <Box sx={{ flexGrow: 1 }}>
          <Toolbar>
            <Typography variant="h4" component="div" sx={{ flexGrow: 1 }}>
              Calorie Counter
            </Typography>
            <Button id="clr-btn" variant="contained" color="primary" component="div" onClick={handleSubmit}>Clear All</Button>
          </Toolbar>
        </Box>
      </AppBar>
      <br/>
      <Box className='main'>
      <Paper className='item-form' elevation={2}>
        <Stack spacing={2}>
          <Typography variant="h5">
            Add Meal / Food Item
          </Typography>
          <Grid container justifyContent="space-evenly"> 
            <Grid item md={6} xs={6}
            sx={{ pr:".5em" }}>
              <TextField
                required fullWidth
                label="Meal"
                placeholder="Add Item" 
                value={name} onChange={(e) => setName(e.target.value)}
              />
            </Grid>
            <Grid item md={6} xs={6}
            sx={{ pl:".5em" }}>
              <TextField
                required fullWidth 
                label="Calories"
                type="number"
                placeholder="Add Calories"
                value={calories} onChange={(e) => setCalories(parseInt(e.target.value))}
              />
            </Grid>
          </Grid>
          <Box>
            <div>
              {!editMode && <Button id="add-btn" variant="contained" startIcon={<AddIcon />} onClick={handleSubmit}>Add Meal</Button>}
            </div>
            <div>
            <Stack direction="row"
            sx={{
              fontSize: {
                lg: "1em",
                md: "1em",
                sm: ".80em",
                xs: ".80em"
              }
            }}>
              <Stack direction="row" spacing={1} className='edit-buttons-left'>
                {editMode && <Button id="edit-btn" variant="contained" color="warning" startIcon={<LibraryAddCheckIcon />} onClick={handleSubmit}>Update Meal</Button>}
                {editMode && <Button id="delete-btn" variant="contained" color="error" startIcon={<DeleteOutlineIcon />} onClick={handleSubmit}>Delete Meal</Button>}
              </Stack>
                {editMode && <Button id="back-btn" variant="contained" color="primary" startIcon={<KeyboardArrowLeftIcon/>} onClick={handleSubmit}>Back</Button>}
            </Stack>
            </div>
          </Box>
         
        </Stack>
      </Paper>

      <h3 class="total-cal">
        Total Calories: {totalCalories}
      </h3>

      <ul id="item-list">
        <GenerateList list={meals}></GenerateList>
      </ul>
      </Box>
    </div>
  );
}

export default App;
