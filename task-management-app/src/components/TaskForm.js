// TaskForm.js
import React, { useState, useEffect } from 'react';
import { TextField, Button, FormControl, Select, MenuItem, InputLabel } from '@mui/material';

const TaskForm = ({ onSubmit, editingTask, onEdit }) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [status, setStatus] = useState('');

  useEffect(() => {
    if (editingTask) {
      setTitle(editingTask.title);
      setDescription(editingTask.description);
      setStatus(editingTask.status);
    }
  }, [editingTask]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!title) return;

    if (editingTask) {
      onSubmit({ ...editingTask, title, description, status }); // Pass edited task data to the onEdit function
      setTitle('');
      setDescription('');
      setStatus(''); 
    } else {
      onSubmit({ title, description, status });
      setTitle('');
      setDescription('');
      setStatus('');
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <TextField
        label="Title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        fullWidth
        required
        margin="normal"
      />
      <TextField
        label="Description"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        fullWidth
        multiline
        rows={4}
        margin="normal"
      />
      <FormControl fullWidth margin="normal" sx={{marginBottom:2}}>
        <InputLabel>Status</InputLabel>
        <Select
          value={status}
          onChange={(e) => setStatus(e.target.value)}
          required
        >
          <MenuItem value="To Do">To Do</MenuItem>
          <MenuItem value="In Progress">In Progress</MenuItem>
          <MenuItem value="Done">Done</MenuItem>
        </Select>
      </FormControl>
      <Button fullWidth type="submit" sx={{marginTop:1}} variant="contained" color="primary">
        {editingTask ? 'Save' : 'Add Task'}
      </Button>
    </form>
  );
};

export default TaskForm;
