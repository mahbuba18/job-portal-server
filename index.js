const express = require("express");
const app = express();
const cors = require("cors");
const pool = require("./db.js");

//middleware
app.use(cors());
app.use(express.json()); //req.body

//ROUTES//

// create a user
app.post("/users", async (req, res) => {
  try {
    // console.log(req.body);
    const { name, email, password_hash } = req.body;
    const newUser = await pool.query(
      "INSERT INTO users(name,email,password_hash) VALUES($1,$2,$3) RETURNING *",
      [name, email, password_hash]
    );
    res.json(newUser.rows[0]);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ error: "Server Error" });
  }
});
//get all users
app.get("/users", async (req, res) => {
  try {
    const allUsers = await pool.query("SELECT * FROM users");
    res.json(allUsers.rows);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ error: "Server Error" });
  }
});
//get a user
app.get("/users/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const user = await pool.query("SELECT * FROM users WHERE id= $1", [id]);
    res.json(user.rows[0]);
  } catch (err) {
    console.error(err.message);
  }
});
//update a user

app.put("/users/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { name, email, password_hash } = req.body;

    const updateUser = await pool.query(
      "UPDATE users SET name = $1, email = $2, password_hash = $3 WHERE id = $4 RETURNING *",
      [name, email, password_hash, id]
    );

    res.json(updateUser.rows[0]);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});

//delete a user
app.delete("/users/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const deleteUser = await pool.query("DELETE from users WHERE id=$1", [id]);

    res.json("user deleted successfully!!");
  } catch (err) {
    console.error(err.message);
  }
});

//for job category
app.get("/categories", async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT c.id, c.name, c.icon, c.image_url, COUNT(j.id) AS job_count
      FROM job_categories c
      LEFT JOIN jobs j ON c.id = j.category_id
      GROUP BY c.id
      ORDER BY job_count DESC
    `);
    res.json(result.rows);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});

// Add a new job
app.post("/jobs", async (req, res) => {
  try {
    const {
      title,
      company,
      image_url,
      description,
      category_id,
      location,
      salary_range,
    } = req.body;

    const newJob = await pool.query(
      `INSERT INTO jobs
      (title, company, image_url, description, category_id, location, salary_range, created_at)
      VALUES($1,$2,$3,$4,$5,$6,$7,NOW()) RETURNING *`,
      [
        title,
        company,
        image_url,
        description,
        category_id,
        location,
        salary_range,
      ]
    );

    res.json(newJob.rows[0]);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ error: "Server Error" });
  }
});
// Get all jobs (optionally with search + category)
app.get("/jobs", async (req, res) => {
  try {
    const { search, category } = req.query;
    // console.log(category,search);

    let query = `
      SELECT j.id, j.title, j.description, j.company, j.location, j.salary_range, c.name AS category
      FROM jobs j
      LEFT JOIN job_categories c ON j.category_id = c.id
    `;
    let values = [];
    let conditions = [];

    // Search filter
    if (search) {
      conditions.push(`(j.title ILIKE $${values.length + 1} 
                       OR j.company ILIKE $${values.length + 1} 
                       OR j.location ILIKE $${values.length + 1})`);
      values.push(`%${search}%`);
    }

    // // Category filter
    // if (category) {
    //   conditions.push(`j.category_id = $${values.length + 1}`);
    //   values.push(category);
    // }

    // Add WHERE clause if we have conditions
    if (conditions.length > 0) {
      query += " WHERE " + conditions.join(" AND ");
    }

    query += " ORDER BY j.id DESC";

    const result = await pool.query(query, values);
    res.json(result.rows);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});

// Get single job by ID
app.get("/jobs/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const job = await pool.query(
      `SELECT j.*, c.name AS category
       FROM jobs j
       LEFT JOIN job_categories c ON j.category_id = c.id
       WHERE j.id = $1`,
      [id]
    );

    if (job.rows.length === 0) {
      return res.status(404).json({ error: "Job not found" });
    }

    res.json(job.rows[0]);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ error: "Server error" });
  }
});

// Update a job
app.put("/jobs/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const {
      title,
      company,
      image_url,
      description,
      category_id,
      location,
      salary_range,
    } = req.body;

    const updatedJob = await pool.query(
      `UPDATE jobs
       SET title=$1, company=$2, image_url=$3, description=$4, category_id=$5, location=$6, salary_range=$7
       WHERE id=$8
       RETURNING *`,
      [
        title,
        company,
        image_url,
        description,
        category_id,
        location,
        salary_range,
        id,
      ]
    );

    res.json(updatedJob.rows[0]);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ error: "Server Error" });
  }
});

// Delete a job
app.delete("/jobs/:id", async (req, res) => {
  try {
    const { id } = req.params;
    await pool.query("DELETE FROM jobs WHERE id=$1", [id]);
    res.json({ message: "Job deleted successfully!" });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ error: "Server Error" });
  }
});
app.listen(5000, () => {
  console.log("Server has started  at the port 5000");
});
