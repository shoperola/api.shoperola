import mongoose from "mongoose";
const { Schema, model, SchemaTypes } = mongoose;

const CouponSchema = Schema({
    coupon_name:{type:String, default: ""},
    coupon_code: {type: String, default: ""},
    promotion: {type: String, enum: ['percentage_off', 'amount_off', 'free_shipping'], default: 'free_shipping'},
    percentage_off: {type:Number,default: 0},
    amount_off:{type:Number, default: 0},
    applies_to: {type: String ,enum:['any_order','single_product','orders-over','product_by_category'], default: ""},
    price:{ type: Number, default: 0 },
    product_name:{type: SchemaTypes.ObjectId, ref: "Ecommerce"},
    product_category:{ type: SchemaTypes.ObjectId, ref: "Category"},
    limit: {type:String, enum: ['unlimited', 'limited'], default: 'unlimited'},
    start_date: {type: Date, default: ''},
    end_date: {type: Date, default: ''},
    limit_one_person: {type: Boolean, default: false},
    never_expire: {type: Boolean, default: false},
    status: {type: String, enum:['active','inactive'], default: 'active'},
    userID:{type: SchemaTypes.ObjectId, ref: "users"}
  },
{timestamps: true}
);

export const Coupon = model("Coupon", CouponSchema);
