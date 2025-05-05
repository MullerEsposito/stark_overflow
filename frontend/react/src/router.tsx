import { Route, Routes } from "react-router-dom"
import { Home } from "./pages/Home"
import { Forum } from "./pages/Forum"
import { NewQuestion } from "./pages/NewQuestion"
import { QuestionDetail } from "./pages/QuestionDetail"

export function Router() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/forum/:name" element={<Forum />} />
      <Route path="/forum/:name/new-question" element={<NewQuestion />} />
      <Route path="/forum/:name/question/:questionId" element={<QuestionDetail />} />
    </Routes>
  )
}
