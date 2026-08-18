import './AnnotationToolbar.css';

export default function AnnotationToolbar({ activeTool, setActiveTool, highlightColor, setHighlightColor }) {
  const tools = [
    { id: 'select', label: 'Pointer 🖱️', desc: 'Select or read text' },
    { id: 'highlight', label: 'Highlighter 🖍️', desc: 'Drag-select text to highlight' },
    { id: 'pen', label: 'Margin Pen 📝', desc: 'Click a line to add a margin note' },
    { id: 'erase', label: 'Eraser 🧽', desc: 'Click highlights or note pins to erase' },
  ];

  const colors = [
    { id: 'yellow', value: 'rgba(253, 224, 71, 0.4)', label: 'Yellow' },
    { id: 'green', value: 'rgba(74, 222, 128, 0.4)', label: 'Green' },
    { id: 'blue', value: 'rgba(96, 165, 250, 0.4)', label: 'Blue' },
    { id: 'pink', value: 'rgba(244, 114, 182, 0.4)', label: 'Pink' },
  ];

  return (
    <div className="annotation-toolbar glass animate-fade-in">
      <div className="toolbar-section">
        <span className="toolbar-title">Reader Tools</span>
        <div className="tool-buttons">
          {tools.map((tool) => (
            <button
              key={tool.id}
              className={`tool-btn ${activeTool === tool.id ? 'active' : ''}`}
              onClick={() => setActiveTool(tool.id)}
              title={tool.desc}
            >
              <span className="tool-label">{tool.label}</span>
            </button>
          ))}
        </div>
      </div>

      {activeTool === 'highlight' && (
        <div className="toolbar-section colors-section">
          <span className="toolbar-title">Color</span>
          <div className="color-buttons">
            {colors.map((color) => (
              <button
                key={color.id}
                className={`color-btn ${highlightColor.id === color.id ? 'active' : ''}`}
                style={{ backgroundColor: color.value }}
                onClick={() => setHighlightColor(color)}
                title={color.label}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
