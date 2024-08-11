const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
dotenv.config();

const app = express();
//create an instance of express
app.use(express.json())
app.use(cors())

// connecting mongoDB
mongoose.connect(process.env.MONGODB_URL)
.then( () => {
    console.log('DB connected!!!')
})
.catch((err) => {
    console.log(err)
})

// creating schema
const todoSchema = new mongoose.Schema({
    title: {
        required: true,
        type: String
    },
    description: String
})

//creating model
const todoModel = mongoose.model('Todo',todoSchema);

//Create a to-do item
app.post('/todos',async(req,res)=> {
        const { title , description} = req.body;
      /*  const newTodo = {
            id: todos.length +1,
            title ,
            description
        };
        todos.push(newTodo);
        console.log(todos); */
        try {
        const newTodo = new todoModel({title,description});
        await newTodo.save();
        res.status(201).json(newTodo);

        }
        catch(error){
             console.log(error)
             res.status(500).json({message: error.message});
        }
})

//Get all items
app.get('/todos',async (req,res) => {
    try{
     const todos = await todoModel.find();
     res.json(todos);
    }
    catch(error){
             console.log(error)
             res.status(500).json({message: error.message});
    }
})

// update an todo item
app.put('/todos/:id', async(req, res) => {
    try{
        const { title , description} = req.body;
        const id = req.params.id;
        const updatedTodo = await todoModel.findByIdAndUpdate(
            id,
            {title,description},
        // to show the updated value on  the output    
            {new: true}
        )
        if(!updatedTodo){
            return res.status(404).json({ message: "Todo not found"})
        }
         res.json(updatedTodo)
    }
    catch(error){
        console.log(error)
        res.status(500).json({message: error.message});
    }
})

//Delete an item on list
app.delete('/todos/:id', async(req,res) => {
    try{
         const id = req.params.id;
         await todoModel.findByIdAndDelete(id);
         res.status(204).end();
    }   
    catch(error){
         console.log(error)
         res.status(500).json({message: error.message});
    }         
})

//Start the server
const port = 8000;
app.listen(port, () =>{
    console.log("server is listening on port "+port);
})
