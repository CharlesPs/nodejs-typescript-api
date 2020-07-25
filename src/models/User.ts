
import { Schema, model, Document } from 'mongoose'
import bcrypt from 'bcryptjs'

const schema = new Schema({
    name: { type: String, required: true },
    paternalSurname: String,
    maternalSurname: String,
    email: { type: String, required: true, unique: true},
    username: { type: String, required: true, lowercase: true},
    password: { type: String, required: true},
    createdAt: { type: Date, default: Date.now()},
    updatedAt: Date
})

schema.methods.comparePassword = async function(password: any): Promise<Boolean> {

    return await bcrypt.compare(password, this.password)
}

schema.methods.getNewPassword = () => {

    let text: String = ''

    const possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'

    for (let i = 0; i < 6; i += 1) {

        text += possible.charAt(Math.floor(Math.random() * possible.length))
    }

    return text
}

schema.pre<any>('save', async function (next) {

    this.updatedAt = Date.now()

    if (!this.isModified('password') && !this.isNew) {

        return next()
    }

    const salt = await bcrypt.genSalt(10)
    const hash = await bcrypt.hash(this.password, salt)

    this.password = hash

    next()

    next()
})

export default model('User', schema)
