import React, { useState } from 'react';
import {
  TextField,
  Button,
  Checkbox,
  FormControlLabel,
  IconButton,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  FormControl,
  InputLabel,
  Select,
  MenuItem
} from '@material-ui/core';
import DeleteIcon from '@material-ui/icons/Delete';
import EditIcon from '@material-ui/icons/Edit';
import SaveIcon from '@material-ui/icons/Save';
import DragIndicatorIcon from '@material-ui/icons/DragIndicator';
import ListItemIcon from '@mui/material/ListItemIcon';

import Paper from '@mui/material/Paper';
import InputBase from '@mui/material/InputBase';
import SearchIcon from '@material-ui/icons/Search';

import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';

const TodoApp = () => {
  const [tasks, setTasks] = useState([]);
  const [newTask, setNewTask] = useState('');
  const [editableIndex, setEditableIndex] = useState(-1);
  const [editableText, setEditableText] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [filterOption, setFilterOption] = useState('all');

  const handleAddTask = () => {
    if (newTask.trim() !== '') {
      setTasks([...tasks, { text: newTask, completed: false }]);
      setNewTask('');
      setFilterOption('all');
    }
  };

  const handleCheckboxChange = (index) => {
    const updatedTasks = [...tasks];
    updatedTasks[index].completed = !updatedTasks[index].completed;
    setTasks(updatedTasks);
  };

  const handleEditTask = (index, text) => {
    setEditableIndex(index);
    setEditableText(text);
  };

  const handleSaveTask = (index, newText) => {
    if (newText.trim() !== '') {
      const updatedTasks = [...tasks];
      updatedTasks[index].text = newText;
      setTasks(updatedTasks);
    }
    setEditableIndex(-1);
    setEditableText('');
  };

  const handleDeleteTask = (index) => {
    const updatedTasks = [...tasks];
    updatedTasks.splice(index, 1);
    setTasks(updatedTasks);
  };

  const handleDragEnd = (result) => {
    if (!result.destination) return;

    const updatedTasks = [...tasks];
    const [removed] = updatedTasks.splice(result.source.index, 1);
    updatedTasks.splice(result.destination.index, 0, removed);

    setTasks(updatedTasks);
  };

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleFilterChange = (e) => {
    setFilterOption(e.target.value);
  };

  const handleClearCompletedTasks = () => {
    const updatedTasks = tasks.filter((task) => !task.completed);
    setTasks(updatedTasks);
  };

  const filteredTasks = tasks.filter((task) =>
    task.text.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredTasksByFilterOption = filteredTasks.filter((task) => {
    if (filterOption === 'all') return true;
    if (filterOption === 'completed') return task.completed;
    if (filterOption === 'not_completed') return !task.completed;
    return false;
  });

  return (
    <div className='TodoMain'>
        <div className='TodoTop'>
            <div className='NewTask'>
                <TextField
                    label="New Task"
                    className='inputField' 
                    variant='outlined'
                    value={newTask}
                    onChange={(e) => setNewTask(e.target.value)}
                />
                <Button variant="contained" color="primary" className='addButton' onClick={handleAddTask}>
                    Add
                </Button>
            </div>
       <Paper
            component="form" className='paper'
            sx={{ p: '2px 4px', display: 'flex', alignItems: 'center', width: 400 }}
            >
            <IconButton sx={{ p: '10px' }} aria-label="menu">
            <SearchIcon />
            </IconButton>
            <InputBase
                sx={{ ml: 3, flex: 1 }}
                placeholder="Type to Search Tasks"
                value={searchTerm} 
                onChange={handleSearch}
            />
        </Paper>


      <FormControl className='filterClass' style={{width: '150px', border:'1px solid rgba(0, 0, 255, 0.3)', borderRadius:'10px', padding:'0 auto'}}>
        <InputLabel > &nbsp;Filter Tasks</InputLabel>
        <Select value={filterOption} onChange={handleFilterChange}>
          <MenuItem value="all">All</MenuItem>
          <MenuItem value="completed">Completed</MenuItem>
          <MenuItem value="not_completed">Not Completed</MenuItem>
        </Select>
      </FormControl>

      <Button variant="contained" color="secondary" onClick={handleClearCompletedTasks}>
        Clear Completed Tasks
      </Button>
    </div>
      <DragDropContext onDragEnd={handleDragEnd}>
        <Droppable droppableId="taskList">
          {(provided) => (
            <List {...provided.droppableProps} ref={provided.innerRef}>
              {filteredTasksByFilterOption.map((task, index) => (
                <Draggable key={index} draggableId={index.toString()} index={index}>
                  {(provided) => (
                    <div ref={provided.innerRef} {...provided.draggableProps}>
                      <ListItem className={task.completed ? 'completed list-item' : 'list-item'}>
                        <ListItemIcon {...provided.dragHandleProps}>
                          <IconButton>
                            <DragIndicatorIcon />
                          </IconButton>
                        </ListItemIcon>
                        <FormControlLabel
                          control={
                            <Checkbox
                              checked={task.completed}
                              onChange={() => handleCheckboxChange(index)}
                            />
                          }
                          label={
                            index === editableIndex ? (
                              <TextField
                                label="Edit Task"
                                value={editableText}
                               className='editableInput'
                                onChange={(e) => setEditableText(e.target.value)}
                              />
                            ) : (
                              task.text
                            )
                          }
                        />
                        <ListItemSecondaryAction>
                          {index === editableIndex ? (
                            <IconButton onClick={() => handleSaveTask(index, editableText)}>
                              <SaveIcon />
                            </IconButton>
                          ) : (
                            <IconButton onClick={() => handleEditTask(index, task.text)}>
                              <EditIcon />
                            </IconButton>
                          )}
                          <IconButton onClick={() => handleDeleteTask(index)}>
                            <DeleteIcon />
                          </IconButton>
                        </ListItemSecondaryAction>
                      </ListItem>
                    </div>
                  )}
                </Draggable>
              ))}
              {provided.placeholder}
            </List>
          )}
        </Droppable>
      </DragDropContext>
    </div>
  );
};

export default TodoApp;
