import { BrowserRouter, Routes, Route, Link, useLocation } from 'react-router-dom'
import PremiumInvite from './pages/invite/premium'
import AdminPremiumInvitation from './pages/admin/premium-invitation'
import AdminPremiumInvitationPreview from './pages/admin/premium-invitation-preview'

function App() {
    return (
        <BrowserRouter>
            <AppContent />
        </BrowserRouter>
    )
}

function AppContent() {
    // Determine if we should show nav (hide for guest invitation)
    // In a real app, use useLocation inside the Router
    return (
        <div style={{ minHeight: '100vh' }}>
            <NavWrapper />

            {/* Routes */}
            <Routes>
                <Route path="/" element={
                    <div style={{ padding: '2rem', textAlign: 'center' }}>
                        <h1>CopyLove - Wedding Invitations</h1>
                        <p>Use the navigation above to access different pages</p>
                    </div>
                } />

                {/* Premium Invitation Routes */}
                <Route path="/invite/premium" element={<PremiumInvite />} />
                <Route path="/admin/premium-invitation" element={<AdminPremiumInvitation />} />
                <Route path="/admin/premium-invitation-preview" element={<AdminPremiumInvitationPreview />} />
            </Routes>
        </div>
    );
}

function NavWrapper() {
    const location = useLocation();
    const isGuest = location.pathname.startsWith("/invite/premium") || location.pathname.startsWith("/admin/premium-invitation-preview");

    if (isGuest) return null;

    return (
        <nav style={{
            padding: '1rem',
            background: '#333',
            color: 'white',
            display: 'flex',
            gap: '1rem'
        }}>
            <Link to="/" style={{ color: 'white' }}>Home</Link>
            <Link to="/invite/premium" style={{ color: 'white' }}>Premium Invite</Link>
            <Link to="/admin/premium-invitation" style={{ color: 'white' }}>Admin - Premium Invitation</Link>
            <Link to="/admin/premium-invitation-preview" style={{ color: 'white' }}>Admin - Preview</Link>
        </nav>
    );
}

export default App
