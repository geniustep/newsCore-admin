import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuthStore } from './store/auth';
import Layout from './components/Layout';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Articles from './pages/Articles';
import ArticleEditor from './pages/ArticleEditor';
import ArticleWorkflow from './pages/ArticleWorkflow';
import Pages from './pages/Pages';
import PageEditor from './pages/PageEditor';
import Categories from './pages/Categories';
import Tags from './pages/Tags';
import Media from './pages/Media';
import Users from './pages/Users';
import Settings from './pages/Settings';
import Menus from './pages/Menus';
import ThemeSettings from './pages/ThemeSettings';
import BreakingNews from './pages/BreakingNews';
import ScheduledPosts from './pages/ScheduledPosts';
import Analytics from './pages/Analytics';
// New Core System Pages
import ThemeManager from './pages/ThemeManager';
import ModuleManager from './pages/ModuleManager';
import TranslationManager from './pages/TranslationManager';

function PrivateRoute({ children }: { children: React.ReactNode }) {
  const { isAuthenticated } = useAuthStore();
  return isAuthenticated ? <>{children}</> : <Navigate to="/login" replace />;
}

function App() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route
        path="/"
        element={
          <PrivateRoute>
            <Layout />
          </PrivateRoute>
        }
      >
        <Route index element={<Dashboard />} />
        <Route path="articles" element={<Articles />} />
        <Route path="articles/new" element={<ArticleEditor />} />
        <Route path="articles/:id/edit" element={<ArticleEditor />} />
        <Route path="articles/:id/workflow" element={<ArticleWorkflow />} />
        <Route path="pages" element={<Pages />} />
        <Route path="pages/new" element={<PageEditor />} />
        <Route path="pages/:id/edit" element={<PageEditor />} />
        <Route path="categories" element={<Categories />} />
        <Route path="tags" element={<Tags />} />
        <Route path="media" element={<Media />} />
        <Route path="users" element={<Users />} />
        <Route path="menus" element={<Menus />} />
        <Route path="breaking-news" element={<BreakingNews />} />
        <Route path="scheduled-posts" element={<ScheduledPosts />} />
        <Route path="analytics" element={<Analytics />} />
        <Route path="settings" element={<Settings />} />
        <Route path="theme" element={<ThemeSettings />} />
        {/* Core System Routes */}
        <Route path="themes" element={<ThemeManager />} />
        <Route path="modules" element={<ModuleManager />} />
        <Route path="translations" element={<TranslationManager />} />
      </Route>
    </Routes>
  );
}

export default App;

