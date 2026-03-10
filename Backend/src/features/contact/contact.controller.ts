import { Request, Response } from "express";
import {
  createContactMessage,
  getAllContactMessages,
  deleteContactMessages,
} from "./contact.service";
import { contactSchema } from "./contact.validation";

export const submitContact = async (req: Request, res: Response) => {
  try {
    const { success, data, error } = contactSchema.safeParse(req.body);

    if (!success) {
      return res.status(400).json({
        success: false,
        errors: error.issues,
      });
    }
    const message = await createContactMessage(req.body);

    res.status(201).json({
      success: true,
      message: "Contact form saved successfully!",
      data: message,
    });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};
export const getAllContacts = async (req: Request, res: Response) => {
  try {
    const allMessages = await getAllContactMessages();

    res.status(201).json({
      success: true,
      message: "All contacts messages data fetched successfully!",
      data: allMessages,
    });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

export async function HardDeleteMessage(
  req: Request<{ userId: string }>,
  res: Response,
) {
  try {
    const { userId } = req.params;

    const deletedMessage = await deleteContactMessages(userId);

    if (!deletedMessage) {
      res.status(404).json({
        success: false,
        message: "Sorry, This ID name user message not found in database.",
      });
    }
    res.status(200).json({
      message: "User message hard deleted successfully by admin",
      data: deletedMessage,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Internal server error" + error,
    });
  }
}
