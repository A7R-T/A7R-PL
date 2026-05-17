import { useAppStore } from './store/appStore';
import Sidebar from './components/Sidebar';
import Editor from './components/Editor';
import Header from './components/Header';
import './styles/global.css';
import './App.css';

function App() {
  const { sidebarOpen, activePageId } = useAppStore();

  return (
    <div className="app-container">
      <Sidebar />
      <div className={`main-content ${sidebarOpen ? 'sidebar-open' : 'sidebar-closed'}`}>
        <Header />
        <div className="content-area">
          {activePageId && <Editor pageId={activePageId} />}
        </div>
      </div>
    </div>
  );
}

export default App;
