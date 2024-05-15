import React, { useState, useEffect } from "react";
import TaskForm from "./components/TaskForm";
import TaskList from "./components/TaskList";
import TaskFilter from "./components/TaskFilter";
import {
  Box,
  Button,
  Modal,
  Backdrop,
  Fade,
  Snackbar,
  IconButton,
  Grid,
} from "@mui/material"; // Import Snackbar and IconButton
import CloseIcon from "@mui/icons-material/Close"; // Import CloseIcon
import { fetchTasks, createTask, deleteTask, updateTask } from "./utils/api"; // Import API functions
import Loader from "./components/Loader"; // Import Loader component

const App = () => {
  const [tasks, setTasks] = useState([]);
  const [editingTask, setEditingTask] = useState(null);
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false); // State variable for loader
  const [snackbarOpen, setSnackbarOpen] = useState(false); // State variable for snackbar
  const [snackbarMessage, setSnackbarMessage] = useState(""); // State variable for snackbar message
  const [selectedFilters, setSelectedFilters] = useState(['To Do', 'In Progress', 'Done']); // State variable for selected filters

  useEffect(() => {
    const fetchTasksFromAPI = async () => {
      try {
        setLoading(true); // Set loading to true when making API request
        const tasksFromAPI = await fetchTasks();
        setTasks(tasksFromAPI);
      } catch (error) {
        console.error("Error fetching tasks:", error);
      } finally {
        setLoading(false); // Set loading to false after API request is completed
      }
    };
    fetchTasksFromAPI();
  }, []);

  const handleOpen = () => setOpen(true);
  const handleClose = () => {
    setOpen(false);
    setEditingTask(null); // Reset editingTask state when modal is closed
  };

  const handleEdit = (task) => {
    setOpen(true);
    setEditingTask(task);
  };

  const handleAddTask = async (taskData) => {
    try {
      setLoading(true); // Set loading to true when making API request
      const newTask = await createTask(taskData);
      setTasks([newTask, ...tasks]);
      handleClose(); // Close modal after adding task
      setSnackbarMessage("Task Added"); // Set snackbar message
      setSnackbarOpen(true); // Open snackbar after adding task
    } catch (error) {
      console.error("Error creating task:", error);
    } finally {
      setLoading(false); // Set loading to false after API request is completed
    }
  };

  const handleEditTask = async (editedTask) => {
    try {
      setLoading(true); // Set loading to true when making API request
      const updatedTask = await updateTask(editedTask.id, editedTask);
      setTasks(
        tasks.map((task) => (task.id === updatedTask.id ? updatedTask : task))
      );
      handleClose(); // Close modal after editing task
      setSnackbarMessage("Task Edited"); // Set snackbar message
      setSnackbarOpen(true); // Open snackbar after editing task
    } catch (error) {
      console.error("Error editing task:", error);
    } finally {
      setLoading(false); // Set loading to false after API request is completed
    }
  };

  const handleDeleteTask = async (taskId) => {
    try {
      setLoading(true); // Set loading to true when making API request
      await deleteTask(taskId);
      setTasks(tasks.filter((task) => task.id !== taskId));
      setSnackbarMessage("Task Deleted"); // Set snackbar message
      setSnackbarOpen(true); // Open snackbar after deleting task
    } catch (error) {
      console.error("Error deleting task:", error);
    } finally {
      setLoading(false); // Set loading to false after API request is completed
    }
  };

  const handleFilterTasks = async (event) => {
    const selectedValues = event.target.value;
    setSelectedFilters(selectedValues);
    try {
      setLoading(true); // Set loading to true when making API request
      let filteredTasks = [];
      if (selectedValues.length > 0) {
        filteredTasks = await fetchTasks();
        filteredTasks = filteredTasks.filter(task => selectedValues.includes(task.status));
      }
      setTasks(filteredTasks);
    } catch (error) {
      console.error('Error filtering tasks:', error);
    } finally {
      setLoading(false); // Set loading to false after API request is completed
    }
  };

  return (
    <Box p={4}>
      <h1>Task Management Application</h1>
      <Grid container display={"flex"} alignItems="center" spacing={2}> {/* Use Grid container for layout */}
          <Grid item xs={12} md={2}>
            <Button sx={{height: "3.4rem"}} variant="contained" color="primary" onClick={handleOpen} fullWidth>
              Add Task
            </Button>
          </Grid>
          <Grid item xs={12} md={2}>
          <TaskFilter value={selectedFilters} onChange={handleFilterTasks} />
          </Grid>
        </Grid>

      {loading ? (
        <Loader />
      ) : (
        <>
          <TaskList
            tasks={tasks}
            onDelete={handleDeleteTask}
            onEdit={handleEdit}
          />
        </>
      )}
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-title"
        aria-describedby="modal-description"
        closeAfterTransition
        slots={Backdrop}
        BackdropComponent={Backdrop}
        BackdropProps={{
          timeout: 500,
        }}
      >
        <Fade in={open}>
          <Box
            sx={{
              position: "absolute",
              top: "50%",
              left: "50%",
              transform: "translate(-50%, -50%)",
              width: "75vw", // Adjusted width for mobile responsiveness
              maxWidth: 400, // Max width for larger screens
              bgcolor: "background.paper",
              border: "2px solid #000",
              boxShadow: 24,
              p: 4,
            }}
          >
            <h2 fullWidth id="modal-title">{editingTask ? "Edit Task" : "Add Task"}</h2>
            <TaskForm
              onSubmit={editingTask ? handleEditTask : handleAddTask}
              editingTask={editingTask}
              onEdit={handleEdit}
            />
          </Box>
        </Fade>
      </Modal>
      {/* Snackbar */}
      <Snackbar
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "left",
        }}
        open={snackbarOpen}
        autoHideDuration={6000}
        onClose={() => setSnackbarOpen(false)}
        message={snackbarMessage}
        action={
          <IconButton
            size="small"
            aria-label="close"
            color="inherit"
            onClick={() => setSnackbarOpen(false)}
          >
            <CloseIcon fontSize="small" />
          </IconButton>
        }
      />
    </Box>
  );
};

export default App;
