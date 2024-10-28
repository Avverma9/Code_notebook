import mongoose from 'mongoose'

const javascriptSchema = new mongoose.Schema({
    title:String,
    content:String,
    output:String
})

const Javascript = mongoose.model("Javascript",javascriptSchema)
export default Javascript