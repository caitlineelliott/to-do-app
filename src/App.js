import './App.css';

import { nanoid } from "nanoid";
import { useState } from "react";
import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';

// Creates ToDo items
function ToDo(props) {

  function handleCompleted() {
    props.toggleTaskCompleted(props.id)
  }

  function handleDeleted() {
    props.deleteTask(props.id)
  }
  const task = props.name;
  return (
    <li>
      <input className="check" id={props.id} type="checkbox" checked={props.completed} onChange={handleCompleted} />
      <label htmlFor={props.id}></label>
      <span htmlFor={props.id} id="task" >{task}</span>
      <span className="level-label" id={props.priority}>{props.priority}</span>
      <span id="edit"></span>
      <button id="delete" onClick={handleDeleted}>❌</button>
    </li>
  );
}

// Filter button values + functions
const filterMap = {
  All: () => true,
  Pending: task => !task.completed,
  Completed: task => task.completed
}

// Creates filter btns
function FilterButton(props) {
  const isActive = props.name === props.currentFilter;
  return (
    <button
      type="button"
      className="btn toggle-btn"
      aria-pressed={isActive}
      onClick={() =>
        props.onFilter(props.name)
      }
    >
      <span>{props.name}</span>
    </button >
  );
}

// Creates task list
//{ tasks, onDelete, onCompleted }
function TaskList(props) {
  return (
    <div id="task-list">
      {props.tasks.length > 0 ?
        <ul>
          {props.tasks.map(task => (
            <ToDo
              id={task.id}
              name={task.name}
              completed={task.completed}
              key={task.id}
              toggleTaskCompleted={props.onCompleted}
              deleteTask={props.onDelete}
              priority={task.priority}
            />
          ))}
        </ul> : <div id="no-tasks">No Tasks</div>}

    </div>
  )
}

// Creates form
function Form(props) {
  const [name, setName] = useState('');
  const [priority, setPriority] = useState('low');

  function handleChange(e) {
    setName(e.target.value);
  }

  function handleDropdown(e) {
    setPriority(e.target.value);
  }

  function handleSubmit(e) {
    e.preventDefault();
    if (name !== '') {
      props.addTask(name, priority);
      setName('');
      setPriority('low');
    }
  }

  return (
    <div id="form-container">
      <form onSubmit={handleSubmit}>
        <label>To Do Item:
          <input type="text" value={name} onChange={handleChange} />
        </label>
        <label>Priority:
          <select id="priority" value={priority} onChange={handleDropdown}>
            <option className='low' value='low'>Low</option>
            <option className='medium' value='medium'>Medium</option>
            <option className='high' value='high'>High</option>
          </select>
        </label>
        <button type="submit">Add Task</button>
      </form >
    </div>
  )
};

// Creates whole app
function App(props) {
  const ListArr = [
    { id: 'todo-01', name: 'call mom', completed: false, priority: 'high' },
    { id: 'todo-02', name: 'finish studying', completed: false, priority: 'medium' },
    { id: 'todo-03', name: 'yoga', completed: false, priority: 'low' }
  ]

  const [tasks, setTasks] = useState(ListArr);
  const [filter, setFilter] = useState('All');

  function handleTaskFilter(id) {
    const updatedTasks = tasks.map(task => {
      if (id === task.id) {
        return { ...task, completed: !task.completed }
      }
      return task;
    })
    setTasks(updatedTasks);
  }

  function handleTaskAdd(name, priority) {
    const newTask = { id: "todo-" + nanoid(), name: name, completed: false, priority: priority };
    setTasks(prevTasks => [...prevTasks, newTask]);
  }

  function handleTaskDelete(id) {
    setTasks(prevTasks => prevTasks.filter(task => id !== task.id))
  }

  return (
    <div id="container">
      <h1>Ascend</h1>
      <div id="btnContainer">
        <FilterButton
          name='All'
          currentFilter={filter}
          onFilter={setFilter}
        />
        <FilterButton
          name='Pending'
          currentFilter={filter}
          onFilter={setFilter}
        />
        <FilterButton
          name='Completed'
          currentFilter={filter}
          onFilter={setFilter}
        />
      </div>
      <TaskList tasks={tasks.filter(filterMap[([filter])])} onDelete={handleTaskDelete} onCompleted={handleTaskFilter} />
      <Form addTask={handleTaskAdd} />
    </div>
  )
};

ReactDOM.render(
  <App />,
  document.getElementById('root')
);

export default App;
