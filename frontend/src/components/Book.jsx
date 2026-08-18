import { useState, useEffect, useRef } from 'react';
import PoemInteractions from './PoemInteractions';
import { exportPoemToPDF, exportPoemToJPEG } from '../utils/exporter';
import toast from 'react-hot-toast';
import './Book.css';

export default function Book({
  poems,
  currentSheet,
  setCurrentSheet,
  isMobile,
  reader,
  activeTool,
  highlightColor,
  annotations,
  onSaveAnnotations
}) {
  const totalPoems = poems.length;
  const totalPoemSheets = Math.ceil(totalPoems / 2);
  const totalSheets = 1 + totalPoemSheets + 1; // Cover/TOC + Poem sheets + Back Cover

  // Selection & annotation states
  const [selectedLineForNote, setSelectedLineForNote] = useState(null); // { poemId, lineIndex }
  const [noteText, setNoteText] = useState('');
  const [activeNoteBubble, setActiveNoteBubble] = useState(null); // { poemId, lineIndex }
  const [activeReviewPoem, setActiveReviewPoem] = useState(null); // Poem object for feedback modal
  const [activeDownloadDropdown, setActiveDownloadDropdown] = useState(null); // poemId

  // Touch swiping
  const touchStartX = useRef(null);

  const handleNext = () => {
    if (isMobile) {
      const maxPages = 1 + totalPoems + 1;
      if (currentSheet < maxPages - 1) {
        setCurrentSheet(currentSheet + 1);
      }
    } else {
      if (currentSheet < totalSheets - 1) {
        setCurrentSheet(currentSheet + 1);
      }
    }
    // Close editors/bubbles/menus on navigation
    setSelectedLineForNote(null);
    setActiveNoteBubble(null);
    setActiveDownloadDropdown(null);
  };

  const handlePrev = () => {
    if (currentSheet > 0) {
      setCurrentSheet(currentSheet - 1);
    }
    // Close editors/bubbles/menus on navigation
    setSelectedLineForNote(null);
    setActiveNoteBubble(null);
    setActiveDownloadDropdown(null);
  };

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'ArrowRight' || e.key === 'PageDown') {
        handleNext();
      } else if (e.key === 'ArrowLeft' || e.key === 'PageUp') {
        handlePrev();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [currentSheet, isMobile, totalSheets]);

  // Swipe navigation
  const handleTouchStart = (e) => {
    touchStartX.current = e.touches[0].clientX;
  };

  const handleTouchEnd = (e) => {
    if (touchStartX.current === null) return;
    const touchEndX = e.changedTouches[0].clientX;
    const diffX = touchStartX.current - touchEndX;

    if (diffX > 50) {
      handleNext();
    } else if (diffX < -50) {
      handlePrev();
    }
    touchStartX.current = null;
  };

  // Helper to find exact selection offsets inside a text element (ignoring existing tags)
  const getSelectionCharacterOffsetWithin = (element) => {
    let start = 0;
    let end = 0;
    const sel = window.getSelection();
    if (sel.rangeCount > 0) {
      const range = sel.getRangeAt(0);
      const preSelectionRange = range.cloneRange();
      preSelectionRange.selectNodeContents(element);
      preSelectionRange.setEnd(range.startContainer, range.startOffset);
      start = preSelectionRange.toString().length;
      end = start + range.toString().length;
    }
    return { start, end };
  };

  // 🖍️ Highlight selection handler
  const handleTextSelection = (poemId) => {
    if (activeTool !== 'highlight') return;

    const selection = window.getSelection();
    const selectedText = selection.toString().trim();

    if (selectedText.length > 0) {
      // Find the line wrapper parent element to get the line index
      let lineElement = selection.anchorNode.nodeType === 1 
        ? selection.anchorNode 
        : selection.anchorNode.parentElement;
        
      while (lineElement && !lineElement.classList.contains('line-wrapper')) {
        lineElement = lineElement.parentElement;
      }

      if (lineElement) {
        const lineIndex = parseInt(lineElement.getAttribute('data-line-index'));
        const poemLineElement = lineElement.querySelector('.poem-line');
        
        if (poemLineElement) {
          const { start, end } = getSelectionCharacterOffsetWithin(poemLineElement);
          
          if (start !== end) {
            const lineText = poemLineElement.textContent || '';
            let expandedStart = start;
            let expandedEnd = end;

            // Character checks for word boundaries (English & Hindi/Devanagari characters)
            const isWordChar = (char) => {
              if (!char) return false;
              // Matches non-whitespace and non-punctuation
              return !/[\s\.,!\?;"'\(\)\[\]\{\}:\-\–\—]/.test(char);
            };

            // Expand backward to the start of the word
            while (expandedStart > 0 && isWordChar(lineText[expandedStart - 1])) {
              expandedStart--;
            }
            // Expand forward to the end of the word
            while (expandedEnd < lineText.length && isWordChar(lineText[expandedEnd])) {
              expandedEnd++;
            }

            const poemAnnos = annotations[poemId] || { highlights: [], notes: {} };
            const highlights = poemAnnos.highlights || [];

            // Add the new precise character range highlight snapped to word boundaries
            const updatedHighlights = [
              ...highlights,
              {
                lineIndex,
                start: expandedStart,
                end: expandedEnd,
                text: lineText.substring(expandedStart, expandedEnd),
                color: highlightColor.value
              }
            ];
            
            const updatedAnnos = { ...poemAnnos, highlights: updatedHighlights };
            onSaveAnnotations(poemId, updatedAnnos);
          }
        }
      }
      
      selection.removeAllRanges();
    }
  };

  // 🧽 Erase Highlight
  const handleEraseHighlight = (poemId, targetHl) => {
    const poemAnnos = annotations[poemId] || { highlights: [], notes: {} };
    const highlights = poemAnnos.highlights || [];
    // Remove only the highlight matching the exact line index and character offset boundary
    const updatedHighlights = highlights.filter(
      (hl) => !(hl.lineIndex === targetHl.lineIndex && hl.start === targetHl.start && hl.end === targetHl.end)
    );
    const updatedAnnos = { ...poemAnnos, highlights: updatedHighlights };
    onSaveAnnotations(poemId, updatedAnnos);
  };

  // 📝 Save Note
  const handleSaveNote = (poemId, lineIndex) => {
    const poemAnnos = annotations[poemId] || { highlights: [], notes: {} };
    const notes = poemAnnos.notes || {};
    
    const updatedNotes = { ...notes };
    if (noteText.trim()) {
      updatedNotes[lineIndex] = noteText.trim();
    } else {
      delete updatedNotes[lineIndex];
    }

    const updatedAnnos = { ...poemAnnos, notes: updatedNotes };
    onSaveAnnotations(poemId, updatedAnnos);
    setSelectedLineForNote(null);
    setNoteText('');
  };

  // 🧽 Erase Note
  const handleEraseNote = (poemId, lineIndex) => {
    const poemAnnos = annotations[poemId] || { highlights: [], notes: {} };
    const notes = poemAnnos.notes || {};
    
    const updatedNotes = { ...notes };
    delete updatedNotes[lineIndex];

    const updatedAnnos = { ...poemAnnos, notes: updatedNotes };
    onSaveAnnotations(poemId, updatedAnnos);
    setActiveNoteBubble(null);
  };

  // Export Trigger
  const handleExport = async (poem, format) => {
    const el = document.getElementById(`poem-content-container-${poem._id}`);
    if (!el) {
      toast.error('Poem content not found for export.');
      return;
    }

    setActiveDownloadDropdown(null);
    const loadId = toast.loading(`Generating your poem ${format.toUpperCase()}...`);

    try {
      if (format === 'pdf') {
        await exportPoemToPDF(poem, el);
      } else {
        await exportPoemToJPEG(poem, el);
      }
      toast.success(`${format.toUpperCase()} downloaded successfully!`, { id: loadId });
    } catch (err) {
      toast.error(`Export failed. Please try again.`, { id: loadId });
    }
  };

  // Render a poem line with highlights applied precisely at character indices
  const renderLineContent = (poemId, lineText, lineIndex) => {
    const poemAnnos = annotations[poemId] || { highlights: [], notes: {} };
    const lineHighlights = (poemAnnos.highlights || []).filter(
      (hl) => hl.lineIndex === lineIndex
    );

    if (lineHighlights.length === 0) {
      return lineText;
    }

    // Sort highlights by start character offset
    const sortedHls = [...lineHighlights].sort((a, b) => a.start - b.start);
    const parts = [];
    let lastIndex = 0;

    sortedHls.forEach((hl, hlIdx) => {
      // Safeguard against overlapping ranges or out of bounds indices
      if (hl.start < lastIndex) return;

      // Add preceding plain text
      if (hl.start > lastIndex) {
        parts.push(lineText.substring(lastIndex, hl.start));
      }

      // Add precise highlighted text node
      parts.push(
        <mark
          key={`hl-${lineIndex}-${hlIdx}`}
          className={`theme-highlight ${activeTool === 'erase' ? 'eraser-hover' : ''}`}
          style={{ '--highlight-color': hl.color }}
          onClick={(e) => {
            if (activeTool === 'erase') {
              e.stopPropagation();
              handleEraseHighlight(poemId, hl);
            }
          }}
        >
          {lineText.substring(hl.start, hl.end)}
        </mark>
      );

      lastIndex = hl.end;
    });

    // Add remaining plain text
    if (lastIndex < lineText.length) {
      parts.push(lineText.substring(lastIndex));
    }

    return parts;
  };

  // Render a poem's complete block with lines
  const renderPoemBlock = (poem) => {
    const poemAnnos = annotations[poem._id] || { highlights: [], notes: {} };
    const notes = poemAnnos.notes || {};
    const lines = poem.content.split('\n');

    return (
      <div 
        className="poem-lines-container"
        onMouseUp={() => handleTextSelection(poem._id)}
        role="document"
        aria-label={`Poetry text of ${poem.title}`}
      >
        {lines.map((line, idx) => {
          const hasNote = notes[idx] !== undefined;
          const isEditingNote = selectedLineForNote?.poemId === poem._id && selectedLineForNote?.lineIndex === idx;
          const isBubbleOpen = activeNoteBubble?.poemId === poem._id && activeNoteBubble?.lineIndex === idx;

          return (
            <div
              key={idx}
              className={`line-wrapper ${activeTool === 'pen' ? 'can-add-note' : ''}`}
              data-line-index={idx}
              onClick={() => {
                if (activeTool === 'pen') {
                  setSelectedLineForNote({ poemId: poem._id, lineIndex: idx });
                  setNoteText(notes[idx] || '');
                }
              }}
            >
              {hasNote && (
                <span
                  className={`note-pin ${activeTool === 'erase' ? 'eraser-hover' : ''}`}
                  onClick={(e) => {
                    e.stopPropagation();
                    if (activeTool === 'erase') {
                      handleEraseNote(poem._id, idx);
                    } else {
                      setActiveNoteBubble(
                        isBubbleOpen ? null : { poemId: poem._id, lineIndex: idx }
                      );
                    }
                  }}
                  role="button"
                  tabIndex={0}
                  aria-label={activeTool === 'erase' ? 'Delete note' : 'Read margin note'}
                  title={activeTool === 'erase' ? 'Click to erase note' : 'Click to read note'}
                >
                  📝
                </span>
              )}

              {isBubbleOpen && (
                <div className="note-bubble" role="status" aria-live="polite">
                  <p>{notes[idx]}</p>
                </div>
              )}

              {isEditingNote && (
                <div className="note-editor-box" onClick={(e) => e.stopPropagation()}>
                  <input
                    type="text"
                    className="note-input"
                    placeholder="Type note..."
                    value={noteText}
                    onChange={(e) => setNoteText(e.target.value)}
                    maxLength={150}
                    autoFocus
                    aria-label="Enter margin note"
                  />
                  <div className="note-editor-actions">
                    <button
                      className="note-btn note-btn-cancel"
                      onClick={() => setSelectedLineForNote(null)}
                    >
                      Cancel
                    </button>
                    <button
                      className="note-btn note-btn-save"
                      onClick={() => handleSaveNote(poem._id, idx)}
                    >
                      Save
                    </button>
                  </div>
                </div>
              )}

              <p className="poem-line" data-line-index={idx}>{renderLineContent(poem._id, line, idx)}</p>
            </div>
          );
        })}
      </div>
    );
  };

  // Render Mobile Layout
  if (isMobile) {
    const mobilePages = [
      {
        type: 'cover',
        content: (
          <div className="mobile-page-content cover-page" role="document">
            <span className="cover-icon">📖</span>
            <h1 className="cover-title gradient-text">My Diary</h1>
            <p className="cover-subtitle">by NaKSh</p>
            <p className="cover-footer">Tap to open or swipe left to start</p>
          </div>
        ),
      },
      {
        type: 'toc',
        content: (
          <div className="mobile-page-content toc-page" role="navigation" aria-label="Table of contents">
            <h2 className="page-heading">Index</h2>
            <div className="toc-list">
              {poems.map((poem, index) => (
                <button
                  key={poem._id}
                  className="toc-item-btn"
                  onClick={() => setCurrentSheet(index + 2)}
                  aria-label={`Go to poem: ${poem.title}`}
                >
                  <span className="toc-num">{String(index + 1).padStart(2, '0')}.</span>
                  <span className="toc-title">{poem.title}</span>
                </button>
              ))}
            </div>
          </div>
        ),
      },
      ...poems.map((poem, index) => ({
        type: 'poem',
        content: (
          <div className="mobile-page-content poem-page">
            {/* Printable Area */}
            <div id={`poem-content-container-${poem._id}`} className="poem-printable-area">
              <div className="poem-meta">
                <span className="poem-date">
                  {new Date(poem.writtenDate).toLocaleDateString(undefined, {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                  })}
                </span>
                <span className="poem-num">Page {index + 1}</span>
              </div>
              <h2 className="poem-title font-headings">{poem.title}</h2>
              <div className="poem-content-text">{renderPoemBlock(poem)}</div>
              <div className="export-attribution">— Written by {poem.author} in My Diary</div>
            </div>

            {/* Non-printable actions footer */}
            <div className="poem-footer">
              <span className="poem-author">— {poem.author}</span>
              <div className="poem-footer-actions">
                <button
                  className="poem-review-badge glass"
                  onClick={() => setActiveReviewPoem(poem)}
                  aria-haspopup="dialog"
                  aria-label={`Open reviews for ${poem.title}`}
                >
                  ⭐ {poem.avgRating?.toFixed(1) || '0.0'} ({poem.totalRatings || 0})
                </button>

                {/* Download Dropdown */}
                <div className="download-dropdown-wrapper">
                  <button
                    className="poem-review-badge glass download-toggle-btn"
                    onClick={() => setActiveDownloadDropdown(activeDownloadDropdown === poem._id ? null : poem._id)}
                    aria-haspopup="menu"
                    aria-expanded={activeDownloadDropdown === poem._id}
                    aria-label="Download options"
                  >
                    📥 Download
                  </button>
                  {activeDownloadDropdown === poem._id && (
                    <div className="download-menu glass" role="menu">
                      <button className="download-menu-item" onClick={() => handleExport(poem, 'pdf')} role="menuitem">
                        📄 PDF Format
                      </button>
                      <button className="download-menu-item" onClick={() => handleExport(poem, 'jpeg')} role="menuitem">
                        🖼️ JPEG Image
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        ),
      })),
      {
        type: 'back-cover',
        content: (
          <div className="mobile-page-content back-cover-page" role="document">
            <h2>The End</h2>
            <p className="closing-note">Thank you for reading the diary of NaKSh.</p>
            <button className="btn btn-primary btn-back-home" onClick={() => window.location.href = '/'}>
              Return Home
            </button>
          </div>
        ),
      },
    ];

    const currentPageIndex = Math.min(currentSheet, mobilePages.length - 1);

    return (
      <div
        className="mobile-book-container"
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
      >
        <div className="mobile-book-card glass">
          {mobilePages[currentPageIndex].content}
        </div>
        <div className="book-controls" role="navigation" aria-label="Mobile reading controls">
          <button
            className="control-btn prev-btn"
            onClick={handlePrev}
            disabled={currentPageIndex === 0}
            aria-label="Go to previous page"
            tabIndex={0}
          >
            ← Prev
          </button>
          <span className="page-indicator" aria-live="polite">
            {currentPageIndex + 1} / {mobilePages.length}
          </span>
          <button
            className="control-btn next-btn"
            onClick={handleNext}
            disabled={currentPageIndex === mobilePages.length - 1}
            aria-label="Go to next page"
            tabIndex={0}
          >
            Next →
          </button>
        </div>

        {activeReviewPoem && (
          <PoemInteractions
            poem={activeReviewPoem}
            reader={reader}
            onClose={() => setActiveReviewPoem(null)}
          />
        )}
      </div>
    );
  }

  // Render Desktop Layout (3D double-page flip book)
  const sheets = [];

  // Sheet 0: Cover / Table of Contents
  sheets.push({
    id: 'sheet-cover',
    front: (
      <div className="page-inner cover-page" role="document">
        <div className="cover-design">
          <span className="cover-emboss">📖</span>
          <h1 className="cover-title gradient-text">My Diary</h1>
          <p className="cover-subtitle">by NaKSh</p>
          <div className="cover-border"></div>
        </div>
        <div className="page-number-left">I</div>
      </div>
    ),
    back: (
      <div className="page-inner toc-page" role="navigation" aria-label="Book table of contents">
        <h2 className="page-heading">Index</h2>
        <div className="toc-list">
          {poems.map((poem, index) => (
            <button
              key={poem._id}
              className="toc-item-btn"
              onClick={() => {
                const targetSheet = Math.floor(index / 2) + 1;
                setCurrentSheet(targetSheet);
              }}
              aria-label={`Go to poem page: ${poem.title}`}
            >
              <span className="toc-num">{String(index + 1).padStart(2, '0')}.</span>
              <span className="toc-title">{poem.title}</span>
            </button>
          ))}
        </div>
        <div className="page-number-right">II</div>
      </div>
    ),
  });

  // Poem sheets
  for (let i = 0; i < totalPoemSheets; i++) {
    const poem1Index = i * 2;
    const poem2Index = i * 2 + 1;

    const poem1 = poems[poem1Index];
    const poem2 = poems[poem2Index];

    sheets.push({
      id: `sheet-poem-${i}`,
      front: (
        <div className="page-inner poem-page">
          {/* Printable Area */}
          <div id={`poem-content-container-${poem1._id}`} className="poem-printable-area">
            <div className="poem-meta">
              <span className="poem-date">
                {new Date(poem1.writtenDate).toLocaleDateString(undefined, {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                })}
              </span>
              <span className="poem-num">Page {poem1Index + 1}</span>
            </div>
            <h2 className="poem-title font-headings">{poem1.title}</h2>
            <div className="poem-content-text">{renderPoemBlock(poem1)}</div>
            <div className="export-attribution">— Written by {poem1.author} in My Diary</div>
          </div>

          {/* Footer Controls */}
          <div className="poem-footer">
            <span className="poem-author">— {poem1.author}</span>
            <div className="poem-footer-actions">
              <button
                className="poem-review-badge glass"
                onClick={() => setActiveReviewPoem(poem1)}
                aria-haspopup="dialog"
                aria-label={`Open reviews for ${poem1.title}`}
              >
                ⭐ {poem1.avgRating?.toFixed(1) || '0.0'} ({poem1.totalRatings || 0})
              </button>
              
              {/* Download dropdown */}
              <div className="download-dropdown-wrapper">
                <button
                  className="poem-review-badge glass download-toggle-btn"
                  onClick={() => setActiveDownloadDropdown(activeDownloadDropdown === poem1._id ? null : poem1._id)}
                  aria-haspopup="menu"
                  aria-expanded={activeDownloadDropdown === poem1._id}
                  aria-label="Download formats options"
                >
                  📥 Download
                </button>
                {activeDownloadDropdown === poem1._id && (
                  <div className="download-menu glass" role="menu">
                    <button className="download-menu-item" onClick={() => handleExport(poem1, 'pdf')} role="menuitem">
                      📄 PDF Format
                    </button>
                    <button className="download-menu-item" onClick={() => handleExport(poem1, 'jpeg')} role="menuitem">
                      🖼️ JPEG Image
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      ),
      back: poem2 ? (
        <div className="page-inner poem-page">
          {/* Printable Area */}
          <div id={`poem-content-container-${poem2._id}`} className="poem-printable-area">
            <div className="poem-meta">
              <span className="poem-date">
                {new Date(poem2.writtenDate).toLocaleDateString(undefined, {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                })}
              </span>
              <span className="poem-num">Page {poem2Index + 1}</span>
            </div>
            <h2 className="poem-title font-headings">{poem2.title}</h2>
            <div className="poem-content-text">{renderPoemBlock(poem2)}</div>
            <div className="export-attribution">— Written by {poem2.author} in My Diary</div>
          </div>

          {/* Footer Controls */}
          <div className="poem-footer">
            <span className="poem-author">— {poem2.author}</span>
            <div className="poem-footer-actions">
              <button
                className="poem-review-badge glass"
                onClick={() => setActiveReviewPoem(poem2)}
                aria-haspopup="dialog"
                aria-label={`Open reviews for ${poem2.title}`}
              >
                ⭐ {poem2.avgRating?.toFixed(1) || '0.0'} ({poem2.totalRatings || 0})
              </button>
              
              {/* Download dropdown */}
              <div className="download-dropdown-wrapper">
                <button
                  className="poem-review-badge glass download-toggle-btn"
                  onClick={() => setActiveDownloadDropdown(activeDownloadDropdown === poem2._id ? null : poem2._id)}
                  aria-haspopup="menu"
                  aria-expanded={activeDownloadDropdown === poem2._id}
                  aria-label="Download formats options"
                >
                  📥 Download
                </button>
                {activeDownloadDropdown === poem2._id && (
                  <div className="download-menu glass" role="menu">
                    <button className="download-menu-item" onClick={() => handleExport(poem2, 'pdf')} role="menuitem">
                      📄 PDF Format
                    </button>
                    <button className="download-menu-item" onClick={() => handleExport(poem2, 'jpeg')} role="menuitem">
                      🖼️ JPEG Image
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="page-inner blank-page" role="document">
          <div className="blank-content">
            <p>Notes</p>
          </div>
          <div className="page-number-right">End</div>
        </div>
      ),
    });
  }

  // Back Cover sheet
  sheets.push({
    id: 'sheet-back-cover',
    front: (
      <div className="page-inner ending-page" role="document">
        <h2 className="closing-title">The End</h2>
        <p className="closing-note">
          Words can ignite fires in the coldest of minds, and bring peace in the midst of storms.
        </p>
        <p className="closing-note">— NaKSh</p>
      </div>
    ),
    back: (
      <div className="page-inner back-cover-page" role="document">
        <div className="back-cover-design">
          <h2 className="back-cover-title">My Diary</h2>
          <p className="back-cover-credits">Published by NaKSh</p>
          <button className="btn btn-secondary btn-back-home" onClick={() => window.location.href = '/'}>
            Return Home
          </button>
        </div>
      </div>
    ),
  });

  return (
    <div
      className="book-wrapper"
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
    >
      <div className="book">
        {sheets.map((sheet, index) => {
          const isFlipped = index < currentSheet;
          const isActive = index === currentSheet || index === currentSheet - 1;
          const zIndex = isFlipped ? index : totalSheets - index;

          return (
            <div
              key={sheet.id}
              className={`book-sheet ${isFlipped ? 'flipped' : ''} ${isActive ? 'active-sheet' : ''}`}
              style={{ zIndex }}
            >
              <div className="book-page book-page-front">
                {sheet.front}
                <div className="page-fold-shadow"></div>
              </div>

              <div className="book-page book-page-back">
                {sheet.back}
                <div className="page-fold-shadow"></div>
              </div>
            </div>
          );
        })}

        <div className="book-spine"></div>
      </div>

      <div className="book-controls" role="navigation" aria-label="Desktop page navigation controls">
        <button
          className="control-btn prev-btn"
          onClick={handlePrev}
          disabled={currentSheet === 0}
          aria-label="Go to previous page sheet"
          tabIndex={0}
        >
          ← Previous
        </button>
        <span className="page-indicator" aria-live="polite">
          Sheet {currentSheet + 1} / {totalSheets}
        </span>
        <button
          className="control-btn next-btn"
          onClick={handleNext}
          disabled={currentSheet === totalSheets - 1}
          aria-label="Go to next page sheet"
          tabIndex={0}
        >
          Next →
        </button>
      </div>

      {activeReviewPoem && (
        <PoemInteractions
          poem={activeReviewPoem}
          reader={reader}
          onClose={() => setActiveReviewPoem(null)}
        />
      )}
    </div>
  );
}
