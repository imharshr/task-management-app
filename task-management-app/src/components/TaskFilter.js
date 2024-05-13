// TaskFilter.js
import React from 'react';
import { FormControl, Select, MenuItem, InputLabel, Checkbox } from '@mui/material';

const TaskFilter = ({ value, onChange }) => {
  const handleChange = (event) => {
    onChange(event.target.name, event.target.checked);
  };

  return (
    <FormControl fullWidth margin="normal">
      <InputLabel>Filter</InputLabel>
      <Select
        value={value}
        onChange={onChange}
        multiple
        renderValue={(selected) => selected.join(', ')}
        MenuProps={{ PaperProps: { style: { maxHeight: 224 } } }} // Set max height for the dropdown
      >
        <MenuItem value="To Do">
          <Checkbox checked={value.includes('To Do')} onChange={handleChange} name="To Do" />
          To Do
        </MenuItem>
        <MenuItem value="In Progress">
          <Checkbox checked={value.includes('In Progress')} onChange={handleChange} name="In Progress" />
          In Progress
        </MenuItem>
        <MenuItem value="Done">
          <Checkbox checked={value.includes('Done')} onChange={handleChange} name="Done" />
          Done
        </MenuItem>
      </Select>
    </FormControl>
  );
};

export default TaskFilter;
