import { Route, Routes } from "react-router-dom"
import { Home } from "./pages/Home"
import { Forum } from "./pages/Forum"
import { QuestionPage } from "./pages/QuestionPage"
import { AnswerPage } from "./pages/AnswerPage"

export function Router() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/forum/:name" element={<Forum />} />
      <Route path="/forum/:name/question" element={<QuestionPage />} />
      <Route path="/forum/:name/question/:questionId" element={<AnswerPage />} />
    </Routes>
  )
}
