import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import { ThemeProvider } from '@/hooks/useTheme'
import { AdminAuthProvider } from '@/hooks/useAdminAuth'
import { Nav } from '@/components/layout/Nav'
import { AdminLayout } from '@/components/layout/AdminLayout'
import { TopicsHubPage } from '@/pages/TopicsHubPage'
import { TopicCategoryPage } from '@/pages/TopicCategoryPage'
import { TopicDetailPage } from '@/pages/TopicDetailPage'
import { CoursesPage } from '@/pages/CoursesPage'
import { CourseGroupPage } from '@/pages/CourseGroupPage'
import { CourseDetailPage } from '@/pages/CourseDetailPage'
import { HomePage } from '@/pages/HomePage'
import { NotFoundPage } from '@/pages/NotFoundPage'
import { CurateLoginPage } from '@/pages/curate/CurateLoginPage'
import { CurateDashboardPage } from '@/pages/curate/CurateDashboardPage'
import { CurateTopicsPage } from '@/pages/curate/topics/CurateTopicsPage'
import { CurateTopicFormPage } from '@/pages/curate/topics/CurateTopicFormPage'
import { CurateCoursesPage } from '@/pages/curate/courses/CurateCoursesPage'
import { CurateCourseFormPage } from '@/pages/curate/courses/CurateCourseFormPage'
import { CurateProfessorsPage } from '@/pages/curate/professors/CurateProfessorsPage'
import { CurateProfessorFormPage } from '@/pages/curate/professors/CurateProfessorFormPage'
import { CurateClubsPage } from '@/pages/curate/clubs/CurateClubsPage'
import { CurateClubFormPage } from '@/pages/curate/clubs/CurateClubFormPage'

export default function App() {
  return (
    <ThemeProvider>
      <AdminAuthProvider>
        <BrowserRouter>
          <Routes>
            {/* Public site */}
            <Route
              path="/*"
              element={
                <div className="flex min-h-svh flex-col">
                  <Nav />
                  <Routes>
                    <Route path="/" element={<HomePage />} />
                    <Route path="/topics" element={<TopicsHubPage />} />
                    <Route path="/topics/:category" element={<TopicCategoryPage />} />
                    <Route path="/topics/:category/:slug" element={<TopicDetailPage />} />
                    <Route path="/courses" element={<CoursesPage />} />
                    <Route path="/courses/group/:tag" element={<CourseGroupPage />} />
                    <Route path="/courses/:id" element={<CourseDetailPage />} />
                    <Route path="*" element={<NotFoundPage />} />
                  </Routes>
                </div>
              }
            />

            {/* Curate portal — own shell, no main Nav */}
            <Route path="/curate/login" element={<CurateLoginPage />} />
            <Route path="/curate" element={<AdminLayout />}>
              <Route index element={<Navigate to="/curate/dashboard" replace />} />
              <Route path="dashboard" element={<CurateDashboardPage />} />
              <Route path="topics" element={<CurateTopicsPage />} />
              <Route path="topics/new" element={<CurateTopicFormPage />} />
              <Route path="topics/:slug/edit" element={<CurateTopicFormPage />} />
              <Route path="courses" element={<CurateCoursesPage />} />
              <Route path="courses/new" element={<CurateCourseFormPage />} />
              <Route path="courses/:id/edit" element={<CurateCourseFormPage />} />
              <Route path="professors" element={<CurateProfessorsPage />} />
              <Route path="professors/new" element={<CurateProfessorFormPage />} />
              <Route path="professors/:id/edit" element={<CurateProfessorFormPage />} />
              <Route path="clubs" element={<CurateClubsPage />} />
              <Route path="clubs/new" element={<CurateClubFormPage />} />
              <Route path="clubs/:id/edit" element={<CurateClubFormPage />} />
            </Route>
          </Routes>
        </BrowserRouter>
      </AdminAuthProvider>
    </ThemeProvider>
  )
}
