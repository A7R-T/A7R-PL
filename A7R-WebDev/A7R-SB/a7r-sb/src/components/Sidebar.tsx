import { useAppStore, type Page } from '../store/appStore';
import './Sidebar.css';

function SidebarItem({ page, depth = 0 }: { page: Page; depth?: number }) {
  const { activePageId, setActivePage, pages, addPage, deletePage } = useAppStore();
  const children = pages.filter((p) => p.parentId === page.id);
  const isActive = page.id === activePageId;

  return (
    <div className="sidebar-item">
      <div
        className={`sidebar-item-content ${isActive ? 'active' : ''}`}
        style={{ paddingLeft: `${depth * 17 + 8}px` }}
        onClick={() => setActivePage(page.id)}
      >
        <span className="page-icon">{page.icon}</span>
        <span className="page-title">{page.title}</span>
        <div className="page-actions">
          <button
            className="action-btn"
            onClick={(e) => {
              e.stopPropagation();
              addPage(page.id);
            }}
            title="Add subpage"
          >
            +
          </button>
          {page.id !== 'welcome' && page.id !== 'tasks' && page.id !== 'calendar' && page.id !== 'notes' && (
            <button
              className="action-btn delete"
              onClick={(e) => {
                e.stopPropagation();
                deletePage(page.id);
              }}
              title="Delete page"
            >
              ×
            </button>
          )}
        </div>
      </div>
      {children.length > 0 && (
        <div className="sidebar-children">
          {children.map((child) => (
            <SidebarItem key={child.id} page={child} depth={depth + 1} />
          ))}
        </div>
      )}
    </div>
  );
}

function Sidebar() {
  const { sidebarOpen, toggleSidebar, pages, addPage, toggleCommandPalette } = useAppStore();
  const rootPages = pages.filter((p) => p.parentId === null);

  if (!sidebarOpen) {
    return (
      <button className="sidebar-toggle" onClick={toggleSidebar}>
        ☰
      </button>
    );
  }

  return (
    <aside className="sidebar">
      <div className="sidebar-header">
        <img src="/A7R-T.png" alt="A7R" className="sidebar-logo" />
        <button className="sidebar-toggle" onClick={toggleSidebar}>
          ◀
        </button>
      </div>
      <div className="sidebar-search" onClick={toggleCommandPalette}>
        <span>🔍 Search pages...</span>
        <kbd>⌘K</kbd>
      </div>
      <nav className="sidebar-nav">
        {rootPages.map((page) => (
          <SidebarItem key={page.id} page={page} />
        ))}
      </nav>
      <button className="add-page-btn" onClick={() => addPage()}>
        + New Page
      </button>
    </aside>
  );
}

export default Sidebar;
