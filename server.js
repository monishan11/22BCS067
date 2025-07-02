const express = require('express')
const app=express()
const bodyParser=require('body-parser')
const { timeStamp } = require('console')
app.use(bodyParser.json())
let journal_entries=[]
app.post('/journal',(req,res)=>{
    const entry={
        title: req.body.title,
        content: req.body.content,
        timestamp: new Date().toISOString(),
        mood: req.body.mood,
        tags: req.body.tags
    }    
    journal_entries.push(entry)
    res.status(201).json(entry)
})

app.get('/journel',(req,res)=>{
    res.json(journal_entries)
})

app.get('/journel/:title',(req,res)=>{
    const entry=journey_entries.find(e=>e.id==req.params.id)
    if(entry){
        res.json(entry);
    }
    else{
        res.status(404).json({error:'Entry is not found'})
    }
})

app.put('/journal/:title',(req,res)=>{
    const entry = journal_entries.find(e.id==req.params.id)
    if(entry){
        entry.title=req.body.title || entry.title
        entry.content=req.body.content || entry.content
        entry.mood=req.body.mood || entry.mood
        entry.tags=req.body.tags || entry.tags
        res.json(entry)
    }
    else{
        res.status(404).json({error:'Entry is not found'})
    }
})

app.delete('/journal/:title',(req,res)=> {
    const index=journal_entries.findIndex(e=> e.title == req.params.title)
    if(index!=-1){
        const deleted = journal_entries.slice(index,1)
        res.json(deleted[0])
    }
    else{
        res.status(404).json({error:"Entry is not found"})
    }
})

app.listen(3000,()=>{
    console.log('Server is running in port 3000')
})

