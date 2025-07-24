import { Route, Routes } from "react-router-dom"
import { Home } from "./pages/Home"
import { Forum } from "./pages/Forum"
import { QuestionPage } from "./pages/QuestionPage"
import { AnswerPage } from "./pages/AnswerPage"
import { ForumAdmin } from "./pages/ForumAdmin"

export function Router() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/forum/:name" element={<Forum />} />
      <Route path="/forum/:name/question" element={<QuestionPage />} />
      <Route path="/forum/:name/question/:questionId" element={<AnswerPage />} />
      <Route path="/admin/create-forum" element={<ForumAdmin />} />
      <Route path="/admin/edit-forum/:forumId" element={<ForumAdmin />} />
    </Routes>
  )
}
