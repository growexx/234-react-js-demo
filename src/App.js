import { BrowserRouter, Route, Routes } from 'react-router-dom';
import Layout from './components/Layout';
import Login from './features/auth/Login';
import Public from './components/Public';
import Welcome from './features/auth/Welcome';
import RequireAuth from './features/auth/RequireAuth';
import BlogList from './features/blogs/List';
import SingleBlog from './features/blogs/SingleBlog';
import EditBlog from './features/blogs/EditBlog';
import AddBlog from './features/blogs/AddBlog';
import StickyHeadTable from './features/blogs/List';
import AlertDialogModal from './components/PopUp';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          {/* public routes */}
          <Route index element={<Public />} />
          <Route path="/login" element={<Login />} />
          <Route path="/table" element={<StickyHeadTable />} />
          <Route path="/popup" element={<AlertDialogModal />} />

          {/* protected routes */}
          <Route path="welcome" element={<RequireAuth />}>
            <Route index element={<Welcome />} />
          </Route>

          <Route path="blog" element={<RequireAuth />}>
            <Route index element={<BlogList />} />
            <Route path="add" element={<AddBlog />} />
            <Route path=":id" element={<SingleBlog />} />
            <Route path="edit/:id" element={<EditBlog />} />
          </Route>

          <Route path="*" index />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
