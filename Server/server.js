import express from "express";
import bodyParser from "body-parser"; // Correct package name
import cors from "cors";
import mysql from 'mysql'
const app = express();
const PORT = 8081;
const db=mysql.createConnection({
    host:'localhost',
    password:'',
    user:'root',
    database:'crud'
})
app.use(cors());
app.use(bodyParser.json());
app.get('/',(req,res)=>{
    const sql="SELECT * FROM student"
    db.query(sql,(err,result)=>{

        if(err){
            return res.json({Message:'Error in server'})
        }
        return res.json(result)
    })
})

app.post('/create', (req, res) => {
    const { name, email } = req.body;

    if (!name || !email) {
        return res.status(400).json({ Message: 'Name and Email are required' });
    }

    const sql = "INSERT INTO `student` (`name`, `email`) VALUES (?, ?)";
    db.query(sql, [name, email], (err, result) => {
        if (err) {
            return res.status(500).json({ Message: 'Error inserting student data' });
        }
        return res.status(201).json({
            id: result.insertId, // ID of the inserted student
            name,
            email
        });
    });
});
app.put('/edit/:id', (req, res) => {
    const { id } = req.params; // Get the student ID from URL parameters
    const { name, email } = req.body;
    if (!name || !email) {
        return res.status(400).json({ Message: 'Name and Email are required' });
    }

    // SQL query to update student information
    const sql = "UPDATE `student` SET `name` = ?, `email` = ? WHERE `id` = ?";
    
    db.query(sql, [name, email, id], (err, result) => {
        if (err) {
            return res.status(500).json({ Message: 'Error updating student data' });
        }

        if (result.affectedRows === 0) {
            return res.status(404).json({ Message: 'Student not found' });
        }

        return res.status(200).json({
            id,
            name,
            email
        });
    });
});

app.delete('/delete/:id', (req, res) => {
    const { id } = req.params;

    const sql = "DELETE FROM `student` WHERE `id` = ?";
    db.query(sql, [id], (err, result) => {
      if (err) {
        return res.status(500).json({ Message: 'Error deleting student' });
      }
      if (result.affectedRows === 0) {
        return res.status(404).json({ Message: 'Student not found' });
      }
      return res.status(200).json({ Message: 'Student deleted successfully' });
    });
  });
  
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
