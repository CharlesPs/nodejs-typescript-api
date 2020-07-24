
import { Schema, model } from 'mongoose'

const schema = new Schema({
    name: { type: String, required: true },
    paternalSurname: String,
    maternalSurname: String,
    email: { type: String, required: true, unique: true},
    username: { type: String, required: true, lowercase: true},
    password: { type: String, required: true},
    createdAt: { type: Date, default: Date.now()}
})

export default model('User', schema)
