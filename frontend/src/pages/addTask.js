import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  Switch,
  FormControlLabel,
  Alert,
} from "@mui/material";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import axios from "axios";

const AddTask = ({ open, onClose, onTaskAdded, task }) => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [dueDate, setDueDate] = useState(null);
  const [completed, setCompleted] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (task) {
      setTitle(task.title);
      setDescription(task.description);
      setDueDate(task.due_date);
      setCompleted(task.status === "completed");
    } else {
      setTitle("");
      setDescription("");
      setDueDate(null);
      setCompleted(false);
    }
  }, [task]);

  const handleSave = async () => {
    try {
      const token = localStorage.getItem("token");
      const payload = {
        title,
        description,
        due_date: dueDate,
        status: completed ? "completed" : "incomplete",
      };
      console.log("Request Payload:", payload);
      if (task) {
        await axios.put(
          `${process.env.REACT_APP_API_URL}/api/tasks/${task.id}`,
          payload,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
      } else {
        await axios.post(
          `${process.env.REACT_APP_API_URL}/api/tasks`,
          payload,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
      }
      onTaskAdded();
      onClose();
    } catch (err) {
      console.error("Error saving task:", err);
      setError("Failed to save task");
    }
  };

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>{task ? "Edit Task" : "Add New Task"}</DialogTitle>
      <DialogContent>
        {error && <Alert severity="error">{error}</Alert>}
        <TextField
          label="Title"
          variant="outlined"
          fullWidth
          margin="normal"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
        <TextField
          label="Description"
          variant="outlined"
          fullWidth
          margin="normal"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
        <DatePicker
          label="Due Date"
          value={dueDate}
          onChange={(newValue) => setDueDate(newValue)}
          renderInput={(params) => (
            <TextField {...params} fullWidth margin="normal" />
          )}
        />
        <FormControlLabel
          control={
            <Switch
              checked={completed}
              onChange={(e) => setCompleted(e.target.checked)}
            />
          }
          label="Completed"
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color="secondary">
          Cancel
        </Button>
        <Button onClick={handleSave} color="primary">
          Save
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default AddTask;
