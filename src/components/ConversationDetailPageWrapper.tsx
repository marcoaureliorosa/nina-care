import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import ConversationDetail from './conversations/ConversationDetail';

const ConversationDetailPageWrapper = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const handleClose = () => {
    navigate('/conversas');
  };

  if (!id) {
    return <div>Conversa não encontrada.</div>;
  }

  return <ConversationDetail id={id} onClose={handleClose} />;
};

export default ConversationDetailPageWrapper; 