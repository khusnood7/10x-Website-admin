// src/pages/ContactDetailsPage.jsx

import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import ContactDetails from '../components/Contacts/ContactDetails';
import useContacts from '../hooks/useContacts';
import toast from 'react-hot-toast';
import Modal from '../components/Common/Modal';

const ContactDetailsPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { getContactMessageById, updateMessageStatus } = useContacts();
  const [message, setMessage] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(true); // Open modal by default

  useEffect(() => {
    const fetchMessage = async () => {
      try {
        const data = await getContactMessageById(id);
        setMessage(data);
      } catch (err) {
        setError(err);
        toast.error(`Error fetching message details: ${err}`);
      } finally {
        setLoading(false);
      }
    };

    fetchMessage();
  }, [id, getContactMessageById]);

  const handleUpdateStatus = async (id, newStatus) => {
    try {
      await updateMessageStatus(id, newStatus);
      setMessage((prev) => ({ ...prev, status: newStatus }));
      toast.success('Message status updated successfully.');
    } catch (err) {
      toast.error(`Failed to update message status: ${err}`);
    }
  };

  if (loading) return <p>Loading message details...</p>;
  if (error) return <p className="text-red-500">{error}</p>;
  if (!message) return <p>Message not found.</p>;

  return (
    <>
      <Modal isOpen={isModalOpen} onClose={() => navigate(-1)} title="Contact Message Details">
        <ContactDetails
          message={message}
          onClose={() => navigate(-1)}
          onUpdateStatus={handleUpdateStatus}
        />
      </Modal>
    </>
  );
};

export default ContactDetailsPage;
