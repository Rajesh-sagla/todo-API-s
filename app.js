const express = require('express')
const {open} = require('sqlite')
const app = express()
const sqlite3 = require('sqlite3')
const path = require('path')
const dbPath = path.join(__dirname, 'todoApplication.db')
app.use(express.json())
let db = null
let intializeDbAndServer = async () => {
  try {
    db = await open({
      filename: dbPath,
      driver: sqlite3.Database,
    })
    app.listen(3000, () => {
      console.log('Sever Started.....')
    })
  } catch (e) {
    console.log(`Error at : ${e.message}`)
  }
}
let checkRequestQueries = async (request, response, next) => {
  let {
    search_q = '',
    priority = '',
    status = '',
    category = '',
    dueDate = '',
  } = request.query
  let {todoId} = request.params
  if (status !== undefined) {
    const statusArray = ['TO DO', 'IN PROGRESS', 'DONE']
    let CheckInStatusArray = statusArray.includes(status)
    if (CheckInStatusArray) {
      request.status = status
    } else {
      response.status(400)
      response.send('Invalid Todo Status')
      return
    }
  }
  next()
}
app.get('/todos/', checkRequestQueries, async (request, response) => {
  let getData = null
  let getDataQuery = ''
  let {
    search_q = '',
    priority = '',
    status = '',
    category = '',
    dueDate = '',
  } = request.query
  getDataQuery = `SELECT id,todo,priority,status,category,dueDate from todo where todo=${search_q},priority=${priority},status=${status},category=${category},dueDate=${dueDate};`
  getData = await db.all(getDataQuery)
  response.send(getData)
})
