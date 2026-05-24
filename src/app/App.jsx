import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Provider } from 'react-redux';
import { store } from './store';

import Layout from './components/Layout';
import AdminLayout from './components/admin/AdminLayout';
import MemberLayout from './components/admin/MemberLayout';
import ProtectedRoute from './components/ProtectedRoute';

import Home from './pages/Home';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Contact from './pages/Contact';
import APropos from './pages/APropos';
import NotFound from './pages/NotFound';
import Books from './pages/Books';
import BookDetail from './pages/BookDetail';
import Members from './pages/Members';
import Loans from './pages/Loans';

import AdminDashboard from './pages/admin/AdminDashboard';
import AdminBooks from './pages/admin/AdminBooks';
import AdminMembers from './pages/admin/AdminMembers';
import AdminLoans from './pages/admin/AdminLoans';

import MemberDashboard from './pages/member/MemberDashboard';
import MemberFavorites from './pages/member/MemberFavorites';
import MemberCart from './pages/member/MemberCart';
import MemberOrders from './pages/member/MemberOrders';

export default function App() {
  return (
    <Provider store={store}>
      <BrowserRouter>
        <Routes>
          {/* Plein écran */}
          <Route path="/connexion" element={<Login />} />
          <Route path="/inscription" element={<Signup />} />

          {/* Espace Admin */}
          <Route path="/admin" element={<ProtectedRoute adminOnly><AdminLayout /></ProtectedRoute>}>
            <Route index element={<AdminDashboard />} />
            <Route path="livres" element={<AdminBooks />} />
            <Route path="membres" element={<AdminMembers />} />
            <Route path="emprunts" element={<AdminLoans />} />
          </Route>

          {/* Espace Membre */}
          <Route path="/espace-membre" element={<ProtectedRoute><MemberLayout /></ProtectedRoute>}>
            <Route index element={<MemberDashboard />} />
            <Route path="favoris" element={<MemberFavorites />} />
            <Route path="panier" element={<MemberCart />} />
            <Route path="commandes" element={<MemberOrders />} />
          </Route>

          {/* Site public */}
          <Route element={<Layout />}>
            <Route path="/" element={<Home />} />
            <Route path="/a-propos" element={<APropos />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/collection" element={<ProtectedRoute><Books /></ProtectedRoute>} />
            <Route path="/collection/:id" element={<ProtectedRoute><BookDetail /></ProtectedRoute>} />
            <Route path="/membres" element={<ProtectedRoute adminOnly><Members /></ProtectedRoute>} />
            <Route path="/emprunts" element={<ProtectedRoute adminOnly><Loans /></ProtectedRoute>} />
            <Route path="*" element={<NotFound />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </Provider>
  );
}
