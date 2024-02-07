const express = require('express')
const app = express()
const port = 3000
const fs = require('fs');
const path = require('path');



app.use(express.json())


// ciclo per scrivere dinamicamente i controller
fs.readdirSync('./controllers')
.forEach(file => {
    console.log('Controller: ', file)

    const controllerName =  path.parse(file).name

    console.log('endpoint: ', `/${controllerName}`)
    
    app.use(`/${controllerName}`, require(`./controllers/${file}`))

})

app.listen(port, () => {
    console.log(`MY_API listening on port ${port}`)
})


