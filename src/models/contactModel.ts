import { AppDataSource } from '../config/ormconfig';
import { ContactEntity } from '../entities/ContactEntity';
import { InterfaceContact } from '../types';

export const createContact = async (contact: InterfaceContact) => {
  const repo = AppDataSource.getRepository(ContactEntity);
  const newContact = repo.create(contact);
  const result = await repo.save(newContact);
  return result;
};