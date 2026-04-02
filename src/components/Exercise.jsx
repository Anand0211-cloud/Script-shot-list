import React from 'react';

const Exercise = ({ 
  data, 
  checkedShots, 
  onToggleShot, 
  isOpen, 
  onToggleAccordion,
  openLightbox 
}) => {
  const { id, number, name, script, shots, refs, isHero } = data;
  const exCheckedCount = shots.filter((_, idx) => checkedShots[`${id}_${idx}`]).length;
  const isAllDone = shots.length > 0 && exCheckedCount === shots.length;

  return (
    <div className={`exercise ${isHero ? 'hero' : ''} ${isAllDone ? 'all-done' : ''}`} data-id={id}>
      <div 
        className="exercise-header" 
        onClick={onToggleAccordion} 
        aria-expanded={isOpen}
      >
        <div className="ex-number">{number}</div>
        <div className="ex-info">
          <div className="ex-name">{name}</div>
          <div className="ex-progress">
            {exCheckedCount} / {shots.length} shots
          </div>
        </div>
        {isHero && <span className="hero-badge">HERO</span>}
        <svg className="chevron" viewBox="0 0 24 24">
          <polyline points="6 9 12 15 18 9"/>
        </svg>
      </div>
      
      <div className={`exercise-body ${isOpen ? 'open' : ''}`}>
        <div className="script-block">
          <div className="script-label">📝 Action Script</div>
          <ul className="script-steps">
            {script.map((step, idx) => (
              <li key={idx}>{step}</li>
            ))}
          </ul>
        </div>
        
        <div className="shots-label">🎥 Focus Shots</div>
        {shots.map((shot, idx) => {
          const shotId = `${id}_${idx}`;
          const isChecked = !!checkedShots[shotId];
          return (
            <div 
              key={idx} 
              className={`shot-item ${isChecked ? 'checked' : ''}`} 
              onClick={() => onToggleShot(shotId)}
            >
              <div className="check-box">
                <svg viewBox="0 0 12 10" fill="none" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="1,5 4,9 11,1"/>
                </svg>
              </div>
              <div className="shot-text">{shot}</div>
            </div>
          );
        })}

        {refs && refs.length > 0 && (
          <div className="ref-section">
            <div className="ref-label">📸 Reference Images</div>
            <div className="ref-images">
              {refs.map((ref, idx) => (
                <div 
                  key={idx} 
                  className="ref-img-card has-image" 
                  onClick={() => openLightbox(ref.img, ref.caption)}
                >
                  <img src={ref.img} alt={`Reference ${ref.num}`} />
                  <div className="ref-caption">{ref.caption}</div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Exercise;
