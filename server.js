import express from 'express'
import path from 'path'
// Create an instance of Express app
const app = express()


// Handle router for root dir


// Set static directory for js/css/html
app.use("/client", express.static("./client/"))

// Specify the port to which the app is accessible
const PORT = process.env.PORT || 5000
// Listen on PORT 
app.listen(PORT, () => {
    console.log('Server started on port: ' + PORT); 
})



