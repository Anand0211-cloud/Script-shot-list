import React, { useState, useEffect } from 'react';
import Exercise from './components/Exercise';
import { CHECKLISTS } from './data/checklistsData';

function App() {
  const [activeId, setActiveId] = useState(() => {
    return localStorage.getItem('active_checklist_id') || 'slam-ball';
  });

  const activeChecklist = CHECKLISTS.find(c => c.id === activeId);

  // Unified state for all checklists to prevent overwrite bugs
  const [allCheckedStates, setAllCheckedStates] = useState(() => {
    const saved = localStorage.getItem('all_shot_checklists_v3');
    return saved ? JSON.parse(saved) : {};
  });

  const [openAccordions, setOpenAccordions] = useState({});
  const [lightbox, setLightbox] = useState({ isOpen: false, img: '', caption: '' });

  // Current checklist's shots
  const checkedShots = allCheckedStates[activeId] || {};

  // Persist everything whenever it changes
  useEffect(() => {
    localStorage.setItem('all_shot_checklists_v3', JSON.stringify(allCheckedStates));
  }, [allCheckedStates]);

  useEffect(() => {
    localStorage.setItem('active_checklist_id', activeId);
    
    // Auto-expand first accordion on tab switch if not already open
    if (activeChecklist.data.length > 0) {
      setOpenAccordions(prev => ({
        ...prev,
        [activeChecklist.data[0].id]: true
      }));
    }
  }, [activeId, activeChecklist]);

  const toggleShot = (shotId) => {
    setAllCheckedStates(prev => {
      const currentListState = { ...(prev[activeId] || {}) };
      if (currentListState[shotId]) {
        delete currentListState[shotId];
      } else {
        currentListState[shotId] = true;
      }
      return {
        ...prev,
        [activeId]: currentListState
      };
    });
  };

  const toggleAccordion = (id) => {
    setOpenAccordions(prev => ({
      ...prev,
      [id]: !prev[id]
    }));
  };

  const openLightbox = (img, caption) => {
    if (!img) return;
    setLightbox({ isOpen: true, img, caption });
  };

  const closeLightbox = () => {
    setLightbox({ ...lightbox, isOpen: false });
  };

  const totalShots = activeChecklist.data.reduce((acc, ex) => acc + ex.shots.length, 0);
  const doneShots = Object.keys(checkedShots).length;
  const progressPercent = totalShots ? (doneShots / totalShots) * 100 : 0;
  const isFinished = doneShots === totalShots && totalShots > 0;

  return (
    <div className="App">
      <header>
        <div className="label">{activeChecklist.emojiLabel}</div>
        <h1>
          {activeChecklist.title.split(' ')[0]} 
          <span>{activeChecklist.title.split(' ').slice(1).join(' ')}</span>
        </h1>
        <div className="subtitle">{activeChecklist.subtitle}</div>
      </header>

      <div className="tab-nav">
        {CHECKLISTS.map(c => (
          <button 
            key={c.id} 
            className={`tab-btn ${activeId === c.id ? 'active' : ''}`}
            onClick={() => setActiveId(c.id)}
          >
            {c.title}
          </button>
        ))}
      </div>

      <div className="progress-wrap">
        <div className="progress-meta">
          <span className="done-count">{doneShots}</span>
          <span className="total-label">/ {totalShots} SHOTS COMPLETED</span>
        </div>
        <div className="progress-bar">
          <div className="progress-fill" style={{ width: `${progressPercent}%` }}></div>
        </div>
      </div>

      <main>
        <div className={`completion-banner ${isFinished ? 'show' : ''}`}>
          <h2>🎬 THAT'S A WRAP</h2>
          <p>All shots checked. You nailed it.</p>
        </div>

        {activeChecklist.data.map(ex => (
          <Exercise 
            key={ex.id}
            data={ex}
            checkedShots={checkedShots}
            onToggleShot={toggleShot}
            isOpen={!!openAccordions[ex.id]}
            onToggleAccordion={() => toggleAccordion(ex.id)}
            openLightbox={openLightbox}
          />
        ))}
      </main>

      <div 
        className={`lightbox ${lightbox.isOpen ? 'open' : ''}`} 
        onClick={closeLightbox}
      >
        <div className="lightbox-inner" onClick={e => e.stopPropagation()}>
          <div className="lightbox-close" onClick={closeLightbox}>×</div>
          <img src={lightbox.img} alt="" />
          <div className="lightbox-cap">{lightbox.caption}</div>
        </div>
      </div>
    </div>
  );
}

export default App;
