import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  Grid,
  Card,
  CardContent,
  Snackbar,
  IconButton,
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import axios from "axios";
import CloseIcon from "@mui/icons-material/Close";
import AddTask from "./addTask";
import { format } from "date-fns";

const Dashboard = () => {
  const [tasks, setTasks] = useState([]);
  const [error, setError] = useState("");
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [addTaskOpen, setAddTaskOpen] = useState(false);
  const [currentTask, setCurrentTask] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await axios.get(
          `${process.env.REACT_APP_API_URL}/api/tasks`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        setTasks(response.data);
      } catch (err) {
        setError("Failed to fetch tasks");
        setSnackbarOpen(true);
      }
    };

    fetchTasks();
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/");
  };

  const handleSnackbarClose = () => {
    setSnackbarOpen(false);
  };

  const handleAddTaskOpen = () => {
    setCurrentTask(null);
    setAddTaskOpen(true);
  };

  const handleEditTaskOpen = (task) => {
    setCurrentTask(task);
    setAddTaskOpen(true);
  };

  const handleAddTaskClose = () => {
    setAddTaskOpen(false);
  };

  const handleTaskAdded = () => {
    const fetchTasks = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await axios.get(
          `${process.env.REACT_APP_API_URL}/api/tasks`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        setTasks(response.data);
      } catch (err) {
        setError("Failed to fetch tasks");
        setSnackbarOpen(true);
      }
    };

    fetchTasks();
  };

  const handleDeleteTask = async (taskId) => {
    try {
      const token = localStorage.getItem("token");
      await axios.delete(
        `${process.env.REACT_APP_API_URL}/api/tasks/${taskId}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      handleTaskAdded();
    } catch (err) {
      setError("Failed to delete task");
      setSnackbarOpen(true);
    }
  };

  return (
    <div>
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h6" style={{ flexGrow: 1 }}>
            Task Manager
          </Typography>
          <Button color="inherit" onClick={handleLogout}>
            Logout
          </Button>
        </Toolbar>
      </AppBar>
      <div style={{ padding: 20 }}>
        <Button
          variant="contained"
          color="primary"
          style={{ marginBottom: 20 }}
          onClick={handleAddTaskOpen}
        >
          Add New Task
        </Button>
        <Grid container spacing={3}>
          {tasks.map((task) => (
            <Grid item xs={12} sm={6} md={4} key={task.id}>
              <Card style={{ position: "relative" }}>
                <IconButton
                  aria-label="edit"
                  onClick={() => handleEditTaskOpen(task)}
                  style={{
                    position: "absolute",
                    top: 0,
                    right: 40,
                    color: "blue",
                  }}
                >
                  <EditIcon />
                </IconButton>
                <IconButton
                  aria-label="delete"
                  onClick={() => handleDeleteTask(task.id)}
                  style={{
                    position: "absolute",
                    top: 0,
                    right: 0,
                    color: "red",
                  }}
                >
                  <DeleteIcon />
                </IconButton>
                <CardContent>
                  <Typography variant="h5" component="h2">
                    {task.title}
                  </Typography>
                  <Typography color="textSecondary">
                    {task.description}
                  </Typography>
                  <Typography color="textSecondary">
                    Due Date: {format(new Date(task.due_date), "MM/dd/yyyy")}
                  </Typography>
                  <Typography color="textSecondary">
                    Status:{" "}
                    {task.status === "completed" ? "Completed" : "Uncompleted"}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </div>
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={6000}
        onClose={handleSnackbarClose}
        message={error}
        action={
          <IconButton
            size="small"
            color="inherit"
            onClick={handleSnackbarClose}
          >
            <CloseIcon fontSize="small" />
          </IconButton>
        }
      />
      <AddTask
        open={addTaskOpen}
        onClose={handleAddTaskClose}
        onTaskAdded={handleTaskAdded}
        task={currentTask}
      />
    </div>
  );
};

export default Dashboard;
