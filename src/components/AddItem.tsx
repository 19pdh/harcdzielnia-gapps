import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import type { AppDispatch } from '../store/store';
import { fetchItems, GAS_WEBAPP_URL } from '../store/itemsSlice';
import addImg from '../assets/add.png';
import Modal from './Modal';

const AddItem: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [code, setCode] = useState('');
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState('');

  const handleOpenModal = () => {
    setIsModalOpen(true);
    setCode('');
    setStatus('idle');
    setErrorMessage('');
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!code) return;

    setStatus('loading');
    setErrorMessage('');

    try {
      const response = await fetch(GAS_WEBAPP_URL, {
        method: 'POST',
        body: JSON.stringify({ code }),
        headers: {
          'Content-Type': 'text/plain;charset=utf-8',
        }
      });

      const data = await response.json();

      if (data.success) {
        setStatus('success');
        dispatch(fetchItems()); // Refetch to update the UI
        setTimeout(() => {
          handleCloseModal();
        }, 1500);
      } else {
        setStatus('error');
        setErrorMessage(data.error || 'Wystąpił błąd podczas weryfikacji kodu.');
      }
    } catch {
      setStatus('error');
      setErrorMessage('Wystąpił błąd połączenia z serwerem.');
    }
  };

  return (
    <div className="add-item">
      <div className="add-item-button">
        <a
          href="https://docs.google.com/forms/d/e/1FAIpQLSelaJDsMnUEU4GJ2W-RYuMRtKizXkiReLtFx1wb4A3XVwYUrg/viewform"
          target="_blank"
          rel="noopener noreferrer"
          className="add-item-link"
        >
          <img src={addImg} width="50" height="50" alt="Add" />
          <span>Oddaj mundur</span>
        </a>
      </div>

      <div className="pickup-item-button" role="button" tabIndex={0} onClick={handleOpenModal} onKeyDown={(e) => e.key === 'Enter' && handleOpenModal()}>
        <div className="pickup-item-link">
          <span>Odbierz mundur</span>
        </div>
      </div>

      <Modal isOpen={isModalOpen} onClose={handleCloseModal} title="Odbiór munduru">
        <form onSubmit={handleSubmit}>
          <p>Przepisz kod z munduru (np. z naklejki lub taśmy), aby potwierdzić jego odbiór.</p>
          <input
            type="text"
            value={code}
            onChange={(e) => setCode(e.target.value)}
            placeholder="Wpisz kod..."
            className="pickup-input"
            autoFocus
          />
          {status === 'error' && <p style={{ color: 'red', marginTop: '0' }}>{errorMessage}</p>}
          {status === 'success' && <p style={{ color: 'green', marginTop: '0', fontWeight: 'bold' }}>Mundur odebrany pomyślnie!</p>}

          <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '16px' }}>
            <button type="button" className="modal-btn modal-btn-secondary" onClick={handleCloseModal}>Anuluj</button>
            <button type="submit" className="modal-btn modal-btn-primary" disabled={status === 'loading' || !code}>
              {status === 'loading' ? 'Sprawdzanie...' : 'Oznacz jako odebrane'}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default AddItem;
