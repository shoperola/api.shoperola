import mongoose from "mongoose";
const { Schema, SchemaTypes, model } = mongoose;

const PaymentsSchema = new Schema(
  {
    userID: {
      type: SchemaTypes.ObjectId,
      ref: "users",
      required: true,
    },
    paypal: {
      ENABLED: {
        type: Boolean,
        default: true,
      },
      merchantId: String,
      merchantIdInPayPal: String,
      permissionsGranted: Boolean,
      consentStatus: Boolean,
      productIntentId: String,
      productIntentID: String,
      isEmailConfirmed: Boolean,
      accountStatus: String,
      default: {},
    },
    stripe: {
      id: String,
      details_submitted: Boolean,
      charges_enabled: Boolean,
      ENABLED: {
        type: Boolean,
        default: true,
      },
      default: {},
    },
  },
  {
    minimize: false,
  }
);

PaymentsSchema.index({ userID: 1 });

export const Payment = model("payments", PaymentsSchema);
