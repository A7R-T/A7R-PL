import { useAppStore } from '../store/appStore';
import './Header.css';

function Header() {
  const { sidebarOpen, toggleSidebar, activePageId, pages, updatePage } = useAppStore();
  const activePage = pages.find((p) => p.id === activePageId);

  if (!activePage) return null;

  return (
    <header className="app-header">
      <div className="header-left">
        {!sidebarOpen && (
          <button className="header-btn" onClick={toggleSidebar}>
            ☰
          </button>
        )}
        <div className="breadcrumb">
          <span className="page-icon">{activePage.icon}</span>
          <input
            className="page-title-input"
            value={activePage.title}
            onChange={(e) => updatePage(activePage.id, { title: e.target.value })}
          />
        </div>
      </div>
      <div className="header-right">
        <button className="header-btn" title="Share">↗</button>
        <button className="header-btn" title="More options">⋯</button>
      </div>
    </header>
  );
}

export default Header;
