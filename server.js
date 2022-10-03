const express = require('express')
const mysql = require('mysql')


const app = express();
app.use(express.json());

//msql Connection
const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'msql_nidejs',
    port: '3306'
}) 

connection.connect((err) => {
    if (err) {
        console.log('Error connecting to mysql database')
        return;
    }
    console.log('mysql successfully connected');
})


//create routes
app.post("/create", async (req, res) => {
    const { email, name, password } = req.body;

    try {
        connection.query (
            "insert into user(email, fullname, password) values(?, ?, ?)",
            [email, name, password],
            (err, results, fields) => {
                if (err) {
                    console.log("error insert user", err);
                    return res.status(400).send();
                }
                return res.status(201).json({ message: "new user created!"})
            }
        )
    }catch(err) {
        console.log(err);
        return res.status(500).send(); 
    }
})


//read
app.get("/read", async (req, res) => {
    try {
        connection.query("select * from user", (err, results, fields) => {
            if (err) {
                console.log(err);
                return res.status(400).send();
            }
            res.status(200).json(results)
        })
    } catch(err) {
        console.log(err);
        return res.status(500).send();
    }
})


// read single user from DB
app.get("/read/single/:email", async (req, res) => {
    const email = req.params.email;
    
    try {
        connection.query("select * from user where email = ?", [email],  (err, results, fields) => {
            if (err) {
                console.log(err);
                return res.status(400).send();
            }
            res.status(200).json(results)
        })
    } catch(err) {
        console.log(err);
        return res.status(500).send();
    }
})


//update data
app.patch("/update/:email", async (req, res) => {
    const email = req.params.email;
    const newPassword = req.body.newPassword;

    try {
        connection.query("update user set password = ? where email = ?", [newPassword, email],  (err, results, fields) => {
            if (err) {
                console.log(err);
                return res.status(400).send();
            }
            res.status(200).json({ message: "user password updated!"})
        })
    } catch(err) {
        console.log(err);
        return res.status(500).send();
    }
})


//delete data
app.delete("/delete/:email", async (req, res) => {
    const email = req.params.email;

    try {
        connection.query("delete from user where email = ?", [email],  (err, results, fields) => {
            if (err) {
                console.log(err);
                return res.status(400).send();
            }
            if (results.affectedRows == 0) {
                return res.status(404).json({ message: "No user with that email!"});  
            }
            return res.status(404).json({ message: "User deleted!!"});
        })
    } catch(err) {
        console.log(err);
        return res.status(500).send();
    }
})

app.listen(3000, () => console.log('Server is running on port 3000'));

