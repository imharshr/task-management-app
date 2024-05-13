import React from 'react';
import { List, ListItem, ListItemText, ListItemSecondaryAction, IconButton, Tooltip, Typography } from '@mui/material'; // Import Typography
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit'; // Import the edit icon

const TaskList = ({ tasks, onDelete, onEdit }) => {
  const getStatusColor = (status) => {
    switch (status) {
      case 'To Do':
        return '#FF5722'; // Orange color for 'To Do' status
      case 'In Progress':
        return '#2196F3'; // Blue color for 'In Progress' status
      case 'Done':
        return '#4CAF50'; // Green color for 'Done' status
      default:
        return '#000'; // Default color
    }
  };

  return (
    <>
      {tasks.length === 0 ? (
        <Typography variant="body1" color="textSecondary">No tasks to show</Typography>
      ) : (
        <List>
          {tasks.map((task) => (
            <ListItem key={task.id} sx={{px:0}}>
              {/* Tooltip for status */}
              <Tooltip title={task.status}>
                {/* Colored status bar */}
                <div style={{
                  width: 8,
                  height: "2.2rem",
                  backgroundColor: getStatusColor(task.status),
                  marginRight: 8,
                  borderRadius: 4 // Rounded corners
                }} />
              </Tooltip>
              <ListItemText primary={task.title} secondary={task.description} />
              <ListItemSecondaryAction>
                {/* Edit button */}
                <Tooltip title="Edit">
                  <IconButton edge="end" onClick={() => onEdit(task)}>
                    <EditIcon />
                  </IconButton>
                </Tooltip>
                {/* Delete button */}
                <Tooltip title="Delete">
                  <IconButton edge="end" onClick={() => onDelete(task.id)}>
                    <DeleteIcon />
                  </IconButton>
                </Tooltip>
              </ListItemSecondaryAction>
            </ListItem>
          ))}
        </List>
      )}
    </>
  );
};

export default TaskList;
