import React from 'react';
import addImg from '../assets/add.png';

const AddItem: React.FC = () => {
  return (
    <div className="add-item">
      <div className="add-item-button">
        <a
          href="https://docs.google.com/forms/d/e/1FAIpQLSelaJDsMnUEU4GJ2W-RYuMRtKizXkiReLtFx1wb4A3XVwYUrg/viewform"
          target="_blank"
          rel="noopener noreferrer"
        >
          <img src={addImg} width="50" height="50" alt="Add" />
          <span>Chcę oddać mundur!</span>
        </a>
      </div>
    </div>
  );
};

export default AddItem;
