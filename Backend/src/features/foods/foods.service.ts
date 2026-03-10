import Food from "./foods.model";

export const createFood = (data: any) => {
    return  Food.create(data);
};

export const getAllFoods = () => {
    return Food.find({ deletedAt: null });
};

export const getFoodById = (id: string) => {
    return Food.findOne({
        _id: id,
        deletedAt: null,
    });
};

export const updateFoodById = (id: string, data: any) => {
    return Food.findByIdAndUpdate(id, data, {
        new: true,
        runValidators: true,
    });
};

export const softDeleteFoodById = (id: string) => {
    return Food.findByIdAndUpdate(
        id,
        { deletedAt: new Date() },
        { new: true }
    );
};
