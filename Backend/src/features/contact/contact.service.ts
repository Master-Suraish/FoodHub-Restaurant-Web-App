import Contact from "./contact.model";
import { ContactInput } from "./contact.validation";

export const createContactMessage = async (data: ContactInput) => {
  return await Contact.create(data);
};
export const getAllContactMessages = async () => {
  return await Contact.find();
};
export const deleteContactMessages = async (userId: any) => {
  return await Contact.findOneAndDelete({ _id: userId });
};
