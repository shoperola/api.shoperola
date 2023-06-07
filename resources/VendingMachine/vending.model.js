// Import Mongoose and define the schema
import mongoose from 'mongoose';

const stockMachineSchema = new mongoose.Schema({
    userID: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'users',
  },
  product: [
    {
        productId:{
            type: mongoose.Schema.Types.ObjectId,
            required: true,
        },
        title: {
            type: String,
            required: true,
        },
        description: {
            type: String,
            required: true,
        },
        price: {
            type: String,
            required: true,
        },
        qty: {
            type: Number,
            required: true,
        },
        image: {
            type: String,
            required: false,
        },
    }
  ],
 
},
{
    timestamps:true
}
);







const vendingMachineModel = mongoose.model('vendingMachineModel', stockMachineSchema);

export default vendingMachineModel;
