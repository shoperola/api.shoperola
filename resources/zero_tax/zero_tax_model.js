import mongoose from "mongoose";
const { Schema, model } = mongoose;

const ZeroTaxSchema = Schema({
    tax_name: {type: 'string', default:'zero_tax'},
    tax_percentage: {type: 'number', default: 0}

});

export const ZeroTax = model("ZeroTax", ZeroTaxSchema);
