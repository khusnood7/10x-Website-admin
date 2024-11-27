// src/hooks/useContacts.js

import { useContext } from 'react';
import ContactContext from '../contexts/ContactContext';

const useContacts = () => {
  return useContext(ContactContext);
};

export default useContacts;
