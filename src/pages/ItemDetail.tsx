import React, { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import type { RootState, AppDispatch } from '../store/store';
import { fetchItems, removeItem } from '../store/itemsSlice';
import backImg from '../assets/back.png';
import Modal from '../components/Modal';

const ItemDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const dispatch = useDispatch<AppDispatch>();
  const { items, isLoading } = useSelector((state: RootState) => state.items);
  const navigate = useNavigate();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [password, setPassword] = useState('');
  const [status, setStatus] = useState<'idle' | 'success' | 'error'>('idle');

  const item = items.find((i) => i.id === Number(id));

  const handleConfirm = async () => {
    const normalizedPassword = password.toLowerCase().trim();
    if (
      normalizedPassword === 'na słowie harcerza polegaj jak na zawiszy' ||
      normalizedPassword === 'na słowie harcerki polegaj jak na zawiszy'
    ) {
      // Correct password
      try {
        // Placeholder for webhook
        console.log('TODO: Webhook call');
        await new Promise((resolve) => setTimeout(resolve, 500)); // Simulate delay
        setStatus('success');
      } catch (e) {
        console.error(e);
        setStatus('error');
      }
    } else {
      // Incorrect password
      setStatus('error');
    }
  };

  const handleClose = () => {
    if (status === 'success') {
      if (item) {
        dispatch(removeItem(item.id));
      }
      navigate('/');
    } else {
      setIsModalOpen(false);
      setPassword('');
      setStatus('idle');
    }
  };

  useEffect(() => {
    if (items.length === 0) {
      dispatch(fetchItems());
    }
  }, [dispatch, items.length]);

  if (isLoading) return <div>Ładowanie...</div>;
  if (!item) return <div>Nie znaleziono przedmiotu.</div>;

  return (
    <div className="item-detail">
      <Link to="/" className="item-view-back-link">
        <img src={backImg} alt="Wróć" width="20" height="20" />
        <span>Wróć</span>
      </Link>

      <h1>{item.name}</h1>
      <img className="item-detail-img" src={item.photo} alt={item.name} />
      <p>{item.description}</p>
      <h2>Dane kontaktowe:</h2>
      <p>{item.contact}</p>

      <div
        className="add-item-button"
        role="button"
        tabIndex={0}
        onClick={() => setIsModalOpen(true)}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            setIsModalOpen(true);
          }
        }}
        style={{
          display: 'inline-block',
          cursor: 'pointer',
          borderWidth: '2px',
          marginTop: '2em',
          marginBottom: '2em',
        }}
      >
        Odbieram
      </div>

      <Modal isOpen={isModalOpen} onClose={handleClose}>
        {status === 'success' ? (
          <div style={{ textAlign: 'center' }}>
            <h2>Sukces!</h2>
            <p>Przedmiot został oznaczony jako odebrany.</p>
            <button className="modal-btn modal-btn-secondary" onClick={handleClose}>
              Zamknij
            </button>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1em' }}>
            <h3>Aby oznaczyć przedmiot jako odebrany podaj 2. prawo harcerskie:</h3>
            <input
              type="text"
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
                if (status === 'error') setStatus('idle');
              }}
              placeholder="Hasło"
              style={{ padding: '0.5em', fontSize: '1em' }}
            />
            {status === 'error' && (
              <p style={{ color: 'red', margin: 0 }}>Niepoprawne hasło</p>
            )}
            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '1em' }}>
              <button className="modal-btn modal-btn-secondary" onClick={handleClose}>
                Anuluj
              </button>
              <button className="modal-btn modal-btn-primary" onClick={handleConfirm}>
                Zatwierdź
              </button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default ItemDetail;
