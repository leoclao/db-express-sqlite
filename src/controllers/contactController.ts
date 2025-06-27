import { Request, Response } from 'express';
import { createContact } from '../models/contactModel';
import { Contact } from '../types';

export const createContact = async (req: Request, res: Response) => {
  const contact: Contact = req.body;
  try {
    if (!contact.name || !contact.email || !contact.message || !contact.createdAt) {
      return res.status(400).json({ error: 'name, email, message, and createdAt are required' });
    }
    const contactId = await createContact(contact);
    res.status(201).json({ message: 'Contact created', contactId });
  } catch (error) {
    res.status(500).json({ error: 'Internal server error', details: (error as Error).message });
  }
};