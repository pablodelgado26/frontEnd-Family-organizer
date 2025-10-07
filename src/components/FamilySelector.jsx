'use client';

import { useState } from 'react';
import styles from './FamilySelector.module.css';

export function FamilySelector({ families, selectedFamily, onSelectFamily, onCreateFamily }) {
  const [showDropdown, setShowDropdown] = useState(false);

  return (
    <div className={styles.familySelector}>
      <div className={styles.selectedFamily} onClick={() => setShowDropdown(!showDropdown)}>
        <div className={styles.familyInfo}>
          <span className={styles.familyName}>
            {selectedFamily?.role === 'admin' && '👑 '}
            {selectedFamily?.name || 'Selecione uma família'}
          </span>
          <span className={styles.membersCount}>
            {selectedFamily?.members?.length || 0} membros
          </span>
        </div>
        <span className={styles.dropdownArrow}>▼</span>
      </div>

      {showDropdown && (
        <>
          <div 
            className={styles.overlay} 
            onClick={() => setShowDropdown(false)}
          />
          <div className={styles.dropdownMenu}>
            {families.map(family => (
              <div
                key={family.id}
                className={`${styles.dropdownItem} ${family.id === selectedFamily?.id ? styles.active : ''}`}
                onClick={() => {
                  onSelectFamily(family);
                  setShowDropdown(false);
                }}
              >
                <span>
                  {family.role === 'admin' && '👑 '}
                  {family.name}
                </span>
                <span className={styles.membersCount}>
                  {family.members?.length || 0} membros
                </span>
              </div>
            ))}
            
            <div className={styles.dropdownDivider} />
            
            <button
              className={`${styles.dropdownItem} ${styles.createFamily}`}
              onClick={() => {
                onCreateFamily();
                setShowDropdown(false);
              }}
            >
              ➕ Criar Nova Família
            </button>
          </div>
        </>
      )}
    </div>
  );
}
