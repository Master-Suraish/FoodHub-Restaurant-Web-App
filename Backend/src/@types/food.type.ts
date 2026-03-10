import {Document} from "mongoose";

export interface foodType extends Document{
    name: string,
    description: string,
    price: number,
    category: string,
    rating: number,
    image: string,
    deletedAt: Date | null
}