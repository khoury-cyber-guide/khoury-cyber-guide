import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import { Nav } from '@/components/layout/Nav'
import { TopicsHubPage } from '@/pages/TopicsHubPage'
import { TopicCategoryPage } from '@/pages/TopicCategoryPage'
import { TopicDetailPage } from '@/pages/TopicDetailPage'
import { CoursesPage } from '@/pages/CoursesPage'
import { CourseGroupPage } from '@/pages/CourseGroupPage'
import { CourseDetailPage } from '@/pages/CourseDetailPage'
import { NotFoundPage } from '@/pages/NotFoundPage'

export default function App() {
  return (
    <BrowserRouter>
      <div className="flex min-h-svh flex-col">
        <Nav />
        <Routes>
          <Route path="/" element={<Navigate to="/topics" replace />} />
          <Route path="/topics" element={<TopicsHubPage />} />
          <Route path="/topics/:category" element={<TopicCategoryPage />} />
          <Route path="/topics/:category/:slug" element={<TopicDetailPage />} />
          <Route path="/courses" element={<CoursesPage />} />
          <Route path="/courses/group/:tag" element={<CourseGroupPage />} />
          <Route path="/courses/:id" element={<CourseDetailPage />} />
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </div>
    </BrowserRouter>
  )
}
