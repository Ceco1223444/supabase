import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import { ProtectedRoute } from '@/auth/ProtectedRoute'
import { AppShell } from '@/components/layout/AppShell'
import { SplashIntro } from '@/components/layout/SplashIntro'
import { LoginPage } from '@/pages/LoginPage'
import { SignupPage } from '@/pages/SignupPage'
import { InboxPage } from '@/pages/InboxPage'
import { InboxThreadPage } from '@/pages/InboxThreadPage'
import { InboxEmptyState } from '@/pages/InboxEmptyState'
import { AnalyticsPage } from '@/pages/AnalyticsPage'
import { RecommendationsPage } from '@/pages/RecommendationsPage'
import { KnowledgeBasePage } from '@/pages/KnowledgeBasePage'
import { SettingsPage } from '@/pages/SettingsPage'

function App() {
  return (
    <BrowserRouter>
      <SplashIntro />
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignupPage />} />

        <Route element={<ProtectedRoute />}>
          <Route element={<AppShell />}>
            <Route index element={<Navigate to="/inbox" replace />} />
            <Route path="inbox" element={<InboxPage />}>
              <Route index element={<InboxEmptyState />} />
              <Route path=":id" element={<InboxThreadPage />} />
            </Route>
            <Route path="analytics" element={<AnalyticsPage />} />
            <Route path="recommendations" element={<RecommendationsPage />} />
            <Route path="knowledge-base" element={<KnowledgeBasePage />} />
            <Route path="settings" element={<SettingsPage />} />
          </Route>
        </Route>

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
