// Importing React and hooks
import React, { useState, useRef, useEffect, useCallback} from "react";

// Importing external libraries
import { v4 as uuidv4 } from "uuid";
import Select from "react-select";

// Importing local components and utilities
import ToDoList from "./ToDoList";
import NavBar from "../NavBar/NavBar";
import softwareOptions from "./softwareOptions";
import tagOptions from "./tagOptions";
import moment from "moment";

// import weely page
// Importing styles
import "./NewTask.css";

function NewTask({todos, setTodos, completionOfTasksStats, setCompletionOfTasksStats}) {
  const [editingTodo, setEditingTodo] = useState(null);
  // use refs for todos
  const todoNameRef = useRef();
  const todoDescriptionRef = useRef();
  //use state
  const [goalType, setGoalType] = useState(null);
  const [selectedSoftware, setSelectedSoftware] = useState([]);
  const [dueDate, setDueDate] = useState("");
  const [filterMode, setFilterMode] = useState("active");
  const [selectedDays, setSelectedDays] = useState([]);
  const [selectedTags, setSelectedTags] = useState([]);



  // 1. Update your state to include an array of day objects:
  const [days, setDays] = useState([
    { name: "Sunday", checked: false },
    { name: "Monday", checked: false },
    { name: "Tuesday", checked: false },
    { name: "Wednesday", checked: false },
    { name: "Thursday", checked: false },
    { name: "Friday", checked: false },
    { name: "Saturday", checked: false },
  ]);
  const initialDaysState = [
    { name: "Sunday", checked: false },
    { name: "Monday", checked: false },
    { name: "Tuesday", checked: false },
    { name: "Wednesday", checked: false },
    { name: "Thursday", checked: false },
    { name: "Friday", checked: false },
    { name: "Saturday", checked: false },
  ];

  
 
  
  // This is a function that handles the addition of a new todo item.
  function handleAddTodo() { 

     // Add console logs here
 

    const name = todoNameRef.current.value;
    const description = todoDescriptionRef.current.value;
    const software = selectedSoftware.map((option) => option.value);
    const tags = selectedTags.map((option) => option.value);
    if (
      name === "" ||
      description === "" ||
      selectedDays.length === 0 ||
      goalType === null ||
      !dueDate||
      software.length === 0||
      tags.length === 0
    ) {
      return;
    }
  
    if (editingTodo) {
      setTodos((prevTodos) =>
        prevTodos.map((todo) => {
          if (todo.id === editingTodo.id) {
            return { 
              ...todo, 
              name: name, 
              description: description, 
              software: software,
              days:selectedDays,
              goalType: goalType,
              dueDate: dueDate,
             tags:tags
             
    
            };
          } else {
            return todo;
          }
        })
      );
      setEditingTodo(null);
    } else {
      setTodos((prevTodos) => [
        ...prevTodos,
        { 
          id: uuidv4(),
          name: name, 
          description: description, 
          software: software,
          days:selectedDays,
          goalType: goalType,
          dueDate: dueDate,
          tags: tags,
          isActive: true,
          checked: false,
          finished:false,
          completionDate: null // initially null completion date till finished
        },
      ]);
    }
  
    todoNameRef.current.value = null;
    todoDescriptionRef.current.value = null;
    setDays(initialDaysState);
    setGoalType(null);
    setSelectedSoftware([]);
    setDueDate("");
    setSelectedDays([]);
    setSelectedTags([]);
  }
  


  
// changes/edits to dos
  function handleEditTodoClick(todo) {
    setEditingTodo(todo);
    todoNameRef.current.value = todo.name;
    todoDescriptionRef.current.value = todo.description;

    setSelectedDays(todo.days);
    setGoalType(todo.goalType);

      // Update the 'days' state based on the editingTodo.days array
      setDays((prevDays) => {
      return prevDays.map((day) => {
      return {
      ...day,
      checked: todo.days.includes(day.name),
      };
      });
      });
    // ...
  const selectedSoftwareOptions = todo.software.map((software) =>
  softwareOptions.find((option) => option.value === software));
setSelectedSoftware(selectedSoftwareOptions);
setDueDate(todo.dueDate);

const selectedTagOptions = todo.tags.map((tag) =>
  tagOptions.find((option) => option.value === tag)
);
setSelectedTags(selectedTagOptions);
// Add console log here
  }

    //functions setters for the todos

function handleSelectedSoftwareChange(selectedOptions) {
  setSelectedSoftware(selectedOptions);
}


// handle the change of the goal type.
  function handleGoalTypeChange(e) {
    setGoalType(e.target.value);
  }
    


  function handleDaysChange(selectedOptions) {
    const selectedDayNames = selectedOptions.map(option => option.value);
    setSelectedDays(selectedDayNames);
  }
// sets tasks as complete or incomplete, maybe I have to change
  function handleToggleChecked(id) {
    setTodos((prevTodos) => {
      const updatedTodos = prevTodos.map((todo) => {
        if (todo.id === id) {
          return { ...todo, checked: !todo.checked };
        }
        return todo;
      });
      return updatedTodos;
    });
  }

  // New function for handling 'finished' state
  function handleToggleFinished(id) {
    setTodos((prevTodos) => {
      const updatedTodos = prevTodos.map((todo) => {
        if (todo.id === id) {
          return { ...todo, finished: !todo.finished };
        }
        return todo;
      });
      return updatedTodos;
    });
  }


//filtering and setting todos
  
function filteredTodos() {
  return todos.filter((todo) => {
    if (filterMode === "active") {
      return todo.isActive && !todo.finished;
    } else if (filterMode === "archived") {
      return !todo.isActive && !todo.finished;
    } else if (filterMode === "completed") {
      return !todo.isActive  &&  todo.finished; // Add this condition
    } else {
      return true;
    }
  });
}


function handleDeleteSelectedTasks() {
  setTodos((prevTodos) => prevTodos.filter((todo) => !todo.checked));
}


function handleSetToArchive() {
  setTodos((prevTodos) =>
    prevTodos.map((todo) => {
      if (todo.checked) {
        return { ...todo, isActive: false, checked: false, finished:false}; // Set checked to false when archiving
      } else {
        return todo;
      }
    })
  );
}

function handleSetToActive() {
  setTodos((prevTodos) =>
    prevTodos.map((todo) => {
      if (todo.checked) {
        return { ...todo, isActive: true, checked: false, finished:false }; // Set checked to false when setting to active
      } else {
        return todo;
      }
    })
  );
}

//marks as complete and gets the date for this
function handleMarkAsCompleted() {
  const currentDate = moment().format('YYYY-MM-DD'); // Get the current date in YYYY-MM-DD format
  
  setTodos((prevTodos) => {
    const updatedTodos = prevTodos.map((todo) => {
      if (todo.checked) {
        return { ...todo, isActive: false, checked: false, finished: true, completionDate: currentDate };
      }
      return todo;
    });
    return updatedTodos;
  });
}

// A counter for the short and long term tasks completed together with their dates
const setTaskCompletionStatistics = useCallback(() => {
  setCompletionOfTasksStats(prevStats => {
    const stats = {
      shortTerm: {...prevStats.shortTerm},
      longTerm: {...prevStats.longTerm},
    };

    for (let todo of todos) {
      if (todo.finished && todo.completionDate) {
        const targetStats = todo.goalType === "short-term" ? stats.shortTerm : stats.longTerm;

        if (targetStats[todo.completionDate]) {
          targetStats[todo.completionDate]++;
        } else {
          targetStats[todo.completionDate] = 1;
        }
      }
    }
    return stats;
  });
}, [todos, setCompletionOfTasksStats]);

// This effect runs every time `todos` is updated
useEffect(() => {
  setTaskCompletionStatistics();
}, [setTaskCompletionStatistics]);



return (
<div>
<div>
{/* navBar div */}
<NavBar />
</div>

<div className="container-fluid">
<div className="row mt-3">
{/* Form column */}
<div className="col-xl-4 col-lg-6 col-md-6 col-sm-12">
<div className="form-container">
{/* Form content */}
{/*  Name reference */}
<label htmlFor="todoName">Name of the Goal</label>
<input
type="text"
className="form-control"
placeholder="Name of the Goal"
ref={todoNameRef}
/>
<label htmlFor="todoDescription">Add a description for the todo</label>
<input
type="text"
className="form-control"
placeholder="Add a description for the todo"
ref={todoDescriptionRef}
/>

{/* days reference */}
{/* Add a new input for each day in your form, using the name property from each day object as the label and the checked property as the value: */}

<div className="form-group">
<label htmlFor="days">Days to work on goal</label>
<Select
isMulti
className="basic-multi-select"
classNamePrefix="select"
id="days"
options={days.map(day => ({ value: day.name, label: day.name }))}
value={selectedDays.map(day => ({ value: day, label: day }))}

onChange={handleDaysChange}
/>
</div>

{/* radio buttons for short-term and long-term goals inside the form. */}
<label htmlFor="shortOrLongTermDescription">Select the type of Goal:</label>
<div className="form-group">
<div className="form-check">
<input
className="form-check-input"
type="radio"
name="goalType"
id="short-term"
value="short-term"
checked={goalType === "short-term"}
onChange={handleGoalTypeChange}
/>
<label className="form-check-label" htmlFor="short-term">
Short-term Goal
</label>
</div>
<div className="form-check">
<input
className="form-check-input"
type="radio"
name="goalType"
id="long-term"
value="long-term"
checked={goalType === "long-term"}
onChange={handleGoalTypeChange}
/>
<label className="form-check-label" htmlFor="long-term">
Long-term Goal
</label>
</div>
</div>

{/* software */}
<div className="form-group">
  <label htmlFor="software">Applications required for the goal(optional)</label>
  <Select
    isMulti
    className="basic-multi-select"
    classNamePrefix="select"
    id="software"
    options={softwareOptions}
    value={selectedSoftware}
    onChange={handleSelectedSoftwareChange}
  />

{/* due date */}
<div className="form-group">
  <label htmlFor="dueDate">Due date:</label>
  <input type="date" className="form-control" id="dueDate" value={dueDate} onChange={(e) => setDueDate(e.target.value)} />
</div>

{/* tags */}
<div className="form-group">
  <label htmlFor="tags">Tags:</label>
  <Select
    isMulti
    className="basic-multi-select"
    classNamePrefix="select"
    id="tags"
    options={tagOptions}
    value={selectedTags}
    onChange={(selectedOptions) => setSelectedTags(selectedOptions)}
  />
</div>


{/* handle add to do button */}
</div>
<button
  type="button"
  className="btn btn-primary mt-2" // Added margin-top for better spacing
  onClick={handleAddTodo}
>
  Add to do
</button>
</div>
</div>
{/* ToDoList column */}
<div className="col-xl-4 col-lg-6 col-md-6 col-sm-12">
  {/* Clear tasks that are completed */}

  <div className="row">
  <div className="col-sm-12 col-md-6 col-lg-6">

    {/* button to set selected task to archived */}
    <button
      type="button"
      className="btn btn-primary btn-block"
      onClick={handleSetToArchive}
    >
      Archive selected tasks
    </button>
    
    
{/* button to set selected task to active*/}
<button
      type="button"
      className="btn btn-secondary btn-block"
      onClick={handleSetToActive}
    >
      Activate selected tasks
    </button>

{/* delete tasks selected */}
  <button
  type="button"
  className="btn btn-danger btn-block"
  onClick={handleDeleteSelectedTasks}
>
  Delete selected tasks
</button>

{/* button to mark as completed */}
<button
  type="button"
  className="btn btn-success btn-block"
  onClick={handleMarkAsCompleted}
>
  Mark selection  complete
</button>

</div>

  <div className="col-sm-12 col-md-6 col-lg-6">
    <label htmlFor="filterMode"> Press here to select tasks:</label>
    <select
  className="form-control"
  id="filterMode"
  value={filterMode}
  onChange={(e) => setFilterMode(e.target.value)}
>
  <option value="active">Show Active Tasks</option>
  <option value="archived">Show Archived Tasks</option>
  <option value="completed">Show Completed Tasks</option> {/* Add this line */}
</select>

  </div>
</div>


<ToDoList
        todos={filteredTodos()}
        toggleTodo={handleToggleChecked} // Changed from handleToggleComplete to handleToggleChecked
        editTodo={handleEditTodoClick}
        toggleFinished={handleToggleFinished} // New prop to handle 'finished' state
      />
</div>
</div>
        </div>
      </div>
);
}

export default NewTask;
