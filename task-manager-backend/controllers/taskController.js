const db = require("../models/db");

exports.getTasks = async (req, res) => {
  const { status, sort } = req.query;
  let query = `SELECT * FROM tasks WHERE user_id = ?`;
  const params = [req.user.id];

  if (status) {
    query += ` AND status = ?`;
    params.push(status);
  }

  if (sort) {
    query += ` ORDER BY due_date ${
      sort.toUpperCase() === "DESC" ? "DESC" : "ASC"
    }`;
  }

  try {
    const [rows] = await db.execute(query, params);
    res.json(rows);
  } catch (err) {
    console.error("Error fetching tasks:", err);
    res.status(500).json({ error: "Internal server error" });
  }
};

exports.createTask = async (req, res) => {
  const { title, description, due_date, status } = req.body;

  if (!title || !description || !due_date) {
    return res
      .status(400)
      .json({ error: "Title, description, and due date are required" });
  }

  try {
    const [result] = await db.execute(
      `INSERT INTO tasks (user_id, title, description, due_date, status) VALUES (?, ?, ?, ?, ?)`,
      [req.user.id, title, description, due_date, status || "incomplete"]
    );
    res.json({ message: "Task created successfully", taskId: result.insertId });
  } catch (err) {
    console.error("Error creating task:", err);
    res.status(500).json({ error: "Internal server error" });
  }
};

exports.updateTask = async (req, res) => {
  const { id } = req.params;
  const { title, description, due_date, status } = req.body;

  try {
    const [result] = await db.execute(
      `UPDATE tasks SET title = ?, description = ?, due_date = ?, status = ? WHERE id = ? AND user_id = ?`,
      [title, description, due_date, status, id, req.user.id]
    );

    if (result.affectedRows === 0) {
      return res
        .status(404)
        .json({ error: "Task not found or not authorized" });
    }

    res.json({ message: "Task updated successfully" });
  } catch (err) {
    console.error("Error updating task:", err);
    res.status(500).json({ error: "Internal server error" });
  }
};

exports.deleteTask = async (req, res) => {
  const { id } = req.params;

  try {
    const [result] = await db.execute(
      `DELETE FROM tasks WHERE id = ? AND user_id = ?`,
      [id, req.user.id]
    );

    if (result.affectedRows === 0) {
      return res
        .status(404)
        .json({ error: "Task not found or not authorized" });
    }

    res.json({ message: "Task deleted successfully" });
  } catch (err) {
    console.error("Error deleting task:", err);
    res.status(500).json({ error: "Internal server error" });
  }
};
