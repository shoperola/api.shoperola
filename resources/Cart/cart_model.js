import mongoose from "mongoose";
const { Schema, SchemaTypes, model } = mongoose;

const products = new Schema({
  pid:{
    type: SchemaTypes.ObjectId, ref: "Ecommerce"
  },
  quantity: { type: Number, default: 0}
})

const CartSchema = new Schema(
  {
    products: [products],
    total_price: { type: Number, default: 0 }
  },
  { timestamps: true }
);

CartSchema.post("findOneAndUpdate", async function(next) {
try{
  const docToUpdate = await this.model.findOne(this.getQuery()).populate({path:"products",populate: {
    path:'pid'}});
    let total_price = 0;
   docToUpdate.products.map(x => {total_price += x.pid.sale_price* x.quantity});
   await docToUpdate.updateOne({$set:{total_price:total_price}})
   next();
}catch(e){
  console.log(e);
  //res.send(e);
}
})
export const Cart = model("Cart", CartSchema);
