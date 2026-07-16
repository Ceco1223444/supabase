import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import { LoginGate } from '@/components/auth/LoginGate'
import { AppShell } from '@/components/layout/AppShell'
import { SplashIntro } from '@/components/layout/SplashIntro'
import { HomePage } from '@/pages/home/HomePage'
import { LoginPage } from '@/pages/LoginPage'
import { SignupPage } from '@/pages/SignupPage'
import { InboxPage } from '@/pages/InboxPage'
import { InboxThreadPage } from '@/pages/InboxThreadPage'
import { InboxEmptyState } from '@/pages/InboxEmptyState'
import { AnalyticsPage } from '@/pages/AnalyticsPage'
import { RecommendationsPage } from '@/pages/RecommendationsPage'
import { KnowledgeBasePage } from '@/pages/KnowledgeBasePage'
import { SettingsPage } from '@/pages/SettingsPage'
import { SitesStorefrontPage } from '@/pages/sites/SitesStorefrontPage'
import { SitesPagesPage } from '@/pages/sites/SitesPagesPage'
import { SitesDesignPage } from '@/pages/sites/SitesDesignPage'
import { SitesSettingsPage } from '@/pages/sites/SitesSettingsPage'
import { ScoutTrendingPage } from '@/pages/scout/ScoutTrendingPage'
import { ScoutWatchlistPage } from '@/pages/scout/ScoutWatchlistPage'
import { ScoutAlertsPage } from '@/pages/scout/ScoutAlertsPage'
import { StudioCalendarPage } from '@/pages/studio/StudioCalendarPage'
import { StudioLibraryPage } from '@/pages/studio/StudioLibraryPage'
import { StudioChannelsPage } from '@/pages/studio/StudioChannelsPage'

function App() {
  return (
    <BrowserRouter>
      <SplashIntro />
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignupPage />} />

        {/* One shell for everyone — gating happens inside the content area. */}
        <Route element={<AppShell />}>
          <Route index element={<HomePage />} />

          {/* Inbox module holds real account data: gated when logged out. */}
          <Route element={<LoginGate />}>
            <Route path="inbox" element={<InboxPage />}>
              <Route index element={<InboxEmptyState />} />
              <Route path=":id" element={<InboxThreadPage />} />
            </Route>
            <Route path="analytics" element={<AnalyticsPage />} />
            <Route path="recommendations" element={<RecommendationsPage />} />
            <Route path="knowledge-base" element={<KnowledgeBasePage />} />
            <Route path="settings" element={<SettingsPage />} />
          </Route>

          {/* Preview modules are public demos with example data. */}
          <Route path="sites">
            <Route index element={<SitesStorefrontPage />} />
            <Route path="pages" element={<SitesPagesPage />} />
            <Route path="design" element={<SitesDesignPage />} />
            <Route path="settings" element={<SitesSettingsPage />} />
          </Route>
          <Route path="scout">
            <Route index element={<ScoutTrendingPage />} />
            <Route path="watchlist" element={<ScoutWatchlistPage />} />
            <Route path="alerts" element={<ScoutAlertsPage />} />
          </Route>
          <Route path="studio">
            <Route index element={<StudioCalendarPage />} />
            <Route path="library" element={<StudioLibraryPage />} />
            <Route path="channels" element={<StudioChannelsPage />} />
          </Route>
        </Route>

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
