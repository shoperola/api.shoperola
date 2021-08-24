import mongoose from "mongoose";
const { Schema, SchemaTypes, model } = mongoose;

const products = new Schema({
  pid:{
    type: SchemaTypes.ObjectId, ref: "Ecommerce"
  },
  quantity: { type: Number, default: 0},
  userID:{
    type: SchemaTypes.ObjectId
  }
})

const CartSchema = new Schema(
  {
    products: [products],
    cart_total_price: { type: Number, default: 0 },
    userID: { type: SchemaTypes.ObjectId, ref: "users" }
  },
  { timestamps: true }
);

CartSchema.post("findOneAndUpdate", async function(params,next) {
try{
  const docToUpdate = await this.model.findOne(this.getQuery()).populate({path:"products",populate: {
    path:'pid'}});
    let total_price = 0;
    console.log( docToUpdate,params);
   docToUpdate.products.map(x => {total_price += x.pid.total_price* x.quantity});
   await docToUpdate.updateOne({$set:{cart_total_price:total_price}});
   next();
}catch(e){
  console.log(e);
  //res.send(e);
}
});


// CartSchema.post("find", async function(next) {
//   try{
//     const docToUpdate = await this.model.findOne(this.getQuery()).populate({path:"products",populate: {
//       path:'pid'}});
//       let total_price = 0;
//      docToUpdate.products.map(x => {total_price -= x.pid.sale_price* x.quantity});
//      await docToUpdate.updateOne({$set:{total_price:total_price}})
//      next();
//   }catch(e){
//     console.log(e);
//     //res.send(e);
//   }
//   });


export const Cart = model("Cart", CartSchema);
