import { useState } from "react";

import { AnswersContext } from "./answersContext";
import { Answer } from "pages/AnswerPage/types";

// Mock data for answers
const mockAnswers = [
  {
    id: "a1",
    authorAddress: "0x987654321fedcba",
    authorName: "Jhon Doe",
    content: `Good night @Jhane Doe on line 26 of your deploy-docs.yml file there is a command followed by what I believe to be a comment:

\`\`\`yaml
name: Deploy Docs
on:
  push:
    branches: [ main ]
jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - name: Setup Node
        uses: actions/setup-node@v2
        with:
          node-version: '16'
      - run: npm ci
      - run: npm run build:docs # This is causing your issue
      - name: Deploy
        uses: peaceiris/actions-gh-pages@v3
        with:
          github_token: \${{ secrets.GITHUB_TOKEN }}
          publish_dir: ./docs
\`\`\`

Try changing line 26 to \`npm run docs:build\` if that's the correct script in your package.json.`,
    timestamp: "Today at 02:00",
    isCorrect: false,
    votes: 3,
  },
  {
    id: "a2",
    authorAddress: "0xabcdef123456789",
    authorName: "Alex Smith",
    content:
      "Have you tried clearing your cache and running `npm install` again? Sometimes dependencies get corrupted.",
    timestamp: "Today at 09:15",
    isCorrect: false,
    votes: 1,
  },
]

export function AnswersProvider({ children }: { children: React.ReactNode }) {
  const [answers, setAnswers] = useState<Answer[]>(mockAnswers)
  const [isLoading, setIsLoading] = useState(false)

  return (
    <AnswersContext.Provider
      value={{
        answers,
        setAnswers,
        isLoading,
        setIsLoading,
      }}
    >
      {children}
    </AnswersContext.Provider>
  )
}