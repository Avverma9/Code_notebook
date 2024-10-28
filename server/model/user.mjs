import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
    name: String,
    mobile: String,
    password: String
});

// Export the model using modern syntax
export default mongoose.model('User', userSchema);
