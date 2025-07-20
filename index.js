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
      [name,email,password_hash]
    );
    res.json(newUser.rows[0]);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ error: "Server Error" });
  }
});
//get all users
app.get("/users", async(req,res)=>{
  try{
    const allUsers=await pool.query("SELECT * FROM users")
    res.json(allUsers.rows);

  }catch(err){
    console.error(err.message);
    res.status(500).json({ error: "Server Error" });

  }

})
//get a user
app.get("/users/:id",async(req,res)=>{
  try{
   const {id}=req.params;
   const user=await pool.query("SELECT * FROM users WHERE id= $1",[id])
   res.json(user.rows[0]);

  }catch(err){
    console.error(err.message)
  }
})
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
app.delete("/users/:id",async(req,res)=>{
  try{

    const{id}=req.params;
    const deleteUser=await pool.query("DELETE from users WHERE id=$1",[id])

    res.json("user deleted successfully!!")

  }catch(err){
    console.error(err.message);
  }
})

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
// Get jobs for a specific category
app.get("/categories/:id/jobs", async (req, res) => {
  const { id } = req.params;
  try {
    const result = await pool.query(`
      SELECT j.id, j.title, j.description, j.company, j.location,j.salary_range
      FROM jobs j
      WHERE j.category_id = $1
    `, [id]);

    res.json(result.rows);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
});

app.listen(5000, () => {
  console.log("Server has started  at the port 5000");
});
