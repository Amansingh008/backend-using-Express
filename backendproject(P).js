import express from 'express'
const app = express()
import fs from 'fs';

app.use(express.json())

// const path = require('path')
const FILE_PATH="(P)students.json";

function readStudents(){
    const data=fs.readFileSync(FILE_PATH, "utf-8");
    return JSON.parse(data);
}

function writeStudents(data){
    fs.writeFileSync(FILE_PATH, JSON.stringify(data, null, 2));
}

app.post("/students", (req, res)=>{
    const student = readStudents();
    const newStudent={
        id:req.body.id,
        name:req.body.name,
        email:req.body.email,
        course:req.body.course
    };
    student.push(newStudent);
    writeStudents(student);

    res.status(200).json(newStudent);
})

app.get("/students",(req,res)=>{
    const student = readStudents();
    res.status(200).json(student);
})

app.get("/students/:id",(req,res)=>{
    const student = readStudents();
    const s = student.find(i=>i.id == req.params.id);

    if(!s){
        return res.status(404).json({
            message:"failure! Student not found"
        })
    }
    res.status(200).json({
        success:true,
        body:s
    })
})

app.put("/students/:id", (req, res) => {
    const students = readStudents();
    const index = students.findIndex(i => i.id == req.params.id);

    if (index === -1) {
        return res.status(404).json({
            message: "Student not found"
        });
    }

    students[index] = {
        id: students[index].id,
        name: req.body.name,
        email: req.body.email,
        course: req.body.course
    };

    writeStudents(students);

    res.status(200).json({
        success: true,
        updatedStudent: students[index]
    });
});

app.delete("/students/:id", (req, res) => {
    const students = readStudents();
    const filteredStudents = students.filter(i => i.id != req.params.id);

    if (students.length === filteredStudents.length) {
        return res.status(404).json({
            message: "Student not found"
        });
    }

    writeStudents(filteredStudents);

    res.status(200).json({
        success: true,
        message: "Student deleted successfully"
    });
});

app.listen(4000,()=>{
    console.log("Server running at port no 4000");
})
