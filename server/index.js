const express = require("express");
const mysql = require("mysql");
const bodyParser = require("body-parser")
const app = express();
const cors = require("cors");

// setting up the body parser so that our api receives params
app.use(cors());
app.use(bodyParser.urlencoded({extended : true}))
app.use(bodyParser.json())

const port = process.env.PORT || 5000;

const pool = mysql.createPool({
    connectionLimit: 10,
    host: 'localhost',
    user:'root',
    password:'',
    database:'goldstone'

});

// Get a certain staff given a id 
app.get("/staff/:id",(req,res)=>{

    pool.getConnection((err,connection) =>{
        if(err) throw err
        console.log(`Connected as id  ${connection.threadId}`)

        connection.query('SELECT * from staff WHERE staff_id = ?',[req.params.id],(err,result)=>{
            connection.release()
            if(!err){
                res.send(result)
            }else{
                console.log(err)
            }
        })


    })
    
});

// Get all the staff members
app.get("/staff",(req,res)=>{

    pool.getConnection((err,connection) =>{
        if(err) throw err
        console.log(`Connected as id  ${connection.threadId}`)

        connection.query('SELECT * from staff',(err,result)=>{
            connection.release()
            if(!err){
                res.send(result)
            }else{
                console.log(err)
            }
        })


    })
    
});

// Get all the staff members
app.get("/name",(req,res)=>{

    res.send("Erick");

    // pool.getConnection((err,connection) =>{
    //     if(err) throw err
    //     console.log(`Connected as id  ${connection.threadId}`)

    //     connection.query('SELECT * from staff',(err,result)=>{
    //         connection.release()
    //         if(!err){
    //             res.send(result)
    //         }else{
    //             console.log(err)
    //         }
    //     })


    // })
    
});

// get the single staff by id
app.get("staff/:id",(req,res)=>{

    console.log(`BACKEND -- In the staff method, i got the id ${req.params.id}`)

    pool.getConnection((err,connection) =>{
        if(err) throw err
        console.log(`Connected as id  ${connection.threadId}`)

        connection.query('SELECT * from staff WHERE staff_id = ?',[req.params.id],(err,result)=>{
            connection.release() 

            if(!err){
                res.send(result)
            }else{
                console.log(err)
            }
        })
    })
    
});

// creating new registration
app.get("/new",(req,res)=>{

    const newDate = new Date(); 

    console.log(newDate);

    const current_time = `${newDate.getFullYear()} - ${newDate.getMonth()} - ${newDate.getDate()}`;
    console.log(`The current time is: ${current_time}`);

    pool.getConnection((err,connection) => {
        if(err) throw err
        console.log(`The Connected id is  ${connection.threadId}`)

        const body = req.body;

        console.log(current_time)

        // connection.query('INSERT INTO staff SET ?',body,(err,result)=>{
        //     connection.release() 

        //     if(!err){
        //         res.send(`The record has been added successfully ${body.staff_id}`)
        //     }else{
        //         console.log(err)
        //     }
        // })

        res.send(current_time)

        // console.log(`The body is ${body.name}`);
    })
    
});

// sending login data
// creating new registration
app.post("/login",(req,res)=>{

    console.log(`Received data: ${req.body}`);

    pool.getConnection((err,connection) =>{
        if(err) throw err
        console.log(`Connected as id  ${connection.threadId}`)

        // const body = req.body;
        const {email,password} = req.body;
        console.log("Printing the received data");
        console.log(password);
        console.log(email);

        connection.query('SELECT * FROM staff WHERE email = ? AND password = ?',[email,password],(err,result)=>{
            connection.release() 

            if(!err){
                if(result === undefined || result.length == 0){
                    console.log("The password or email is wrong");
                    res.send("Please provide the right Password and email address")
                }else{
                    res.send(result)
                }

                
            }else{
                console.log(`Wrong password! ${result}`)
            }
        })

        // console.log(`The body is ${body.name}`);
    })
    
});

// for updating the registration table approve field
app.put("/approve",(req,res)=>{

    pool.getConnection((err,connection) =>{
        if(err) throw err
        console.log(`Connected as id  ${connection.threadId}`)

        // const body = req.body;
        const {approved,staff_id} = req.body;
        console.log("Printing the received data in the approve method () ");
        console.log(approved)
        console.log(staff_id)
        // const id = req.body.staff_id

        // console.log(body)
        connection.query('UPDATE registration SET approved = ? WHERE staff_id =  ?',[approved,staff_id],(err,result)=>{
            connection.release() 

            if(!err){
                res.send( result)
            }else{
                console.log(err)
            }
        })

        // console.log(`The body is ${body.name}`);
    })
    
});

// for updating the registration table approve field
app.put("/disapprove",(req,res)=>{

    pool.getConnection((err,connection) =>{
        if(err) throw err
        console.log(`Connected as id  ${connection.threadId}`)

        // const body = req.body;
        const {approved,staff_id} = req.body;
        // const id = req.body.staff_id

        // console.log(body)
        connection.query('UPDATE registration SET approved = ? WHERE staff_id =  ?',[approved,staff_id],(err,result)=>{
            connection.release() 

            if(!err){
                res.send(`The record has been UPDATED successfully ${approved}`)
            }else{
                console.log(err)
            }
        })

        // console.log(`The body is ${body.name}`);
    })
    
});

// get all the registers for a given day
app.post("/registers",(req,res)=>{

    const {date,id} = req.body;
    console.log(`received date AND ID at the backend ${date} ${id}`)
    var qDate = new Date(date)

    var year = qDate.getFullYear()
    var month = qDate.getUTCMonth() + 1
    var day =   qDate.getDate()

    const fDate = `${qDate.getFullYear()}-${qDate.getMonth() +1}-${qDate.getDate()}`
    let test = ""+fDate+""

    console.log(fDate)

    console.log(year);
    console.log(month);
    console.log(day);



    console.log(qDate)

    pool.getConnection((err,connection) =>{
        if(err) throw err
        console.log(`Connected as id  ${connection.threadId}`)

        // WHERE datetime>='2009-10-20' AND datetime<'2009-10-21'


        connection.query('SELECT * from Registration WHERE staff_id = ? AND date = ?',[id,qDate],(err,result)=>{
            connection.release() 

            if(!err){

                res.send(result)
            }else{
                console.log(err)
            }
        })


    })
    
});

//
app.post("/register",(req,res)=>{

    const {date,approved,staff_id} = req.body;
    start_time = "";
    exit_time = "";

    pool.getConnection((err,connection) =>{ 
        if(err) throw err
        console.log(`Connected as id  ${connection.threadId}`)

        connection.query('INSERT INTO Registration Values(?,?,?,?,?)',date,(err,result)=>{
            connection.release() 

            if(!err){

                res.send(result)
            }else{
                console.log(err)
            }
        })


    })
    
});

//get the registers given a date
app.post("/dateregisters",(req,res)=>{

    const {date} = req.body;
    console.log(`received date the backend ${date}`)
    var qDate = new Date(date)

    console.log(`QUERY DATE ${qDate}`)

    pool.getConnection((err,connection) =>{ 
        if(err) throw err
        console.log(`Connected as id  ${connection.threadId}`)

        connection.query('SELECT * FROM Registration WHERE date = ?',qDate,(err,result)=>{
            connection.release() 

            if(!err){

                res.send(result)
            }else{
                console.log(err)
            }
        })


    })
    
});

// get all the registers from the database
app.get("/registers/all",(req,res)=>{

    // const {date} = req.body;
    pool.getConnection((err,connection) =>{
        if(err) throw err
        console.log(`Connected as id  ${connection.threadId}`)

        connection.query('SELECT * from Registration',(err,result)=>{
            connection.release() 

            if(!err){
                res.send(result)
            }else{
                console.log(err)
            }
        })


    })
    
});

// get all the registers from the database
app.put("/approve/all",(req,res)=>{

    // const {date} = req.body;

    pool.getConnection((err,connection) =>{
        if(err) throw err
        console.log(`Connected as id  ${connection.threadId}`)

        connection.query('SELECT * from Registration',(err,result)=>{
            connection.release() 

            if(!err){
                res.send(result)
            }else{
                console.log(err)
            }
        })


    })
    
});

app.listen(3000,function(){
    console.log("Server started on port 3000")
})