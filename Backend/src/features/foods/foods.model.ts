import {foodType} from "../../@types/food.type";
import mongoose from "mongoose";

const foodModel = new mongoose.Schema<foodType>(
    {
        name: { type: String },
        description: { type: String },
        price: { type: Number },
        rating: { type: Number, default: 0 },
        category: { type: String },
        image: { type: String },
        deletedAt: {type: Date,default: null}
    },
    {
        timestamps: true
    }
)

export default mongoose.model<foodType>("foods", foodModel);