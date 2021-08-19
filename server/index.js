import React from 'react'
import express, { query } from 'express';
import { readFileSync } from 'fs'
import { renderToString } from 'react-dom/server'

// all npm i imports at the top and a space between built in imports 
// like this
import { App } from '../client/App'
import { handleModifyAnswerVotes } from '../shared/utility'


const data = {
    questions:[{
        questionId:"Q1",
        content:"Should we use Jquery or Fetch for Ajax?"
    },{
        questionId:"Q2",
        content:"Should we use Jquery or Fetch for Ajax?"
    }],
    answers:[{
        answerId: "A1",
        questionId: "Q1",
        upvotes: 2,
        content: "JQuery"
    },{    
    answerId: "A2",
    questionId: "Q2",
    upvotes: 1,
    content: "Fetch"
}],
}

const app = new express();

app.use(express.static("dist"));

app.get("/vote/:answerId", (req,res)=>{
    const { query, params } = req;
    data.answers = handleModifyAnswerVotes(data.answers, params.answerId, +query.increment)
    res.send("OK")
})

app.get("/data", async(_req, res) =>{
    res.json(data)
})

app.get('/', async (_req,res) =>{
    
    const index = readFileSync(`public/index.html`, `utf8`);
    const rendered = renderToString(< App {... data}/>) //same as questions={data.questions} answers={data.answers}
    res.send(index.replace("{{rendered}}", rendered));
    
    // res.send(
    //     `<h1>REACT IS EXECELLENT</h1>`
    // )
})

app.listen(7778);
console.log("Server is listening.")