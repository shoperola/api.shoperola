import  mongoose from 'mongoose'

const alertSchema = new mongoose.Schema({
  userID: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'users', 
    required: true
  },
  productName: {
    type: String,
    required: true
  },
  displayName: {
    type: String,
    required: true
  }
});

const Alert = mongoose.model('Alert', alertSchema);

export default  Alert;
