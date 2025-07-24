"use client"

import { NavLink } from "react-router-dom"
import { SearchInput } from "../../components/SearchInput"
import {
  Button,
  ForumContainer,
  ForumList,
  Header,
  TopicAvatar,
  TopicCard,
  TopicFooter,
  TopicInfo,
  TopicMeta,
  TopicTitle,
} from "./style"
import { CheckCircle, CurrencyDollar, Question } from "phosphor-react"
import { useState, useEffect, useMemo } from "react"
import { useParams } from "react-router-dom"
import { useContract } from "@hooks/useContract"
import { ContractProvider } from "@hooks/useContract/contract.provider"
import { LoadingSpinner } from "@components/LoadingSpinner"


interface Topic {
  id: string
  avatar: string
  title: string
  author: string
  time: string
  amount: number
  isOpen: boolean
  stakeLoading?: boolean
  hasQuestion?: boolean
}

export function Forum() {
  return (
    <ContractProvider>
      <ForumContent />
    </ContractProvider>
  )
}

function ForumContent() {
  const { name } = useParams<{ name: string }>()
  const { contractReady, fetchQuestion } = useContract()
  const [loading, setLoading] = useState(true)


  const generateTopics = (): Topic[] => {
    const sampleTitles = [
      "Unit tests in components that use Design System",
      "Carousel with Keen-Slider implementation tips",
      "Tests with Jest and React Testing Library",
      "Debugging Github integration issues",
      "How to optimize React component performance",
      "Best practices for TypeScript in React",
      "State management with Context API vs Redux",
      "Implementing dark mode with styled-components",
      "Web3 integration patterns in React apps",
      "Error handling strategies in async operations"
    ]

    const sampleAuthors = [
      "Maicon Domingues",
      "Jordane Chaves Ferreira Rocha",
      "Vitor Antonio Danner da Silva",
      "Jhane Doe",
      "Alex Rodriguez",
      "Sarah Chen",
      "Michael Thompson",
      "Emma Watson",
      "David Kim",
      "Lisa Johnson"
    ]

    const sampleTimes = [
      "today at 11:47",
      "yesterday at 22:15",
      "yesterday at 19:07",
      "yesterday at 16:24",
      "2 days ago at 14:30",
      "2 days ago at 09:15",
      "3 days ago at 18:45",
      "3 days ago at 12:20",
      "4 days ago at 16:10",
      "5 days ago at 13:35"
    ]

    const sampleAvatars = [
      "https://avatars.githubusercontent.com/u/62848833?v=4",
    ]

    return Array.from({ length: 10 }, (_, index) => ({
      id: (index + 1).toString(),
      avatar: sampleAvatars[index % sampleAvatars.length],
      title: sampleTitles[index],
      author: sampleAuthors[index],
      time: sampleTimes[index],
      amount: 0,
      isOpen: true,
      stakeLoading: true
    }))
  }

  const initialTopics = useMemo(() => generateTopics(), [])

  const [topics, setTopics] = useState<Topic[]>([])

  // Fetch stake amounts for all topics (only once on mount)
  useEffect(() => {
    if (!contractReady) return
    setLoading(true)
    const fetchStakeAmounts = async () => {
      const updatedTopics = await Promise.all(
        initialTopics.map(async (topic) => {
          try {
            const question = await fetchQuestion(Number(topic.id))

            return {
              ...topic,
              title: question?.title || "",
              amount: question?.stakeAmount || 0,
              stakeLoading: false,
              hasQuestion: question ? true : false
            }
          } catch (error) {
            console.error(`Error fetching stake for question ${topic.id}:`, error)
            return {
              ...topic,
              amount: 0,
              stakeLoading: false,
              hasQuestion: false
            }
          }
        })
      )

      setTopics(updatedTopics)
      setLoading(false)
    }

    fetchStakeAmounts()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [contractReady])

  const handleSearch = (searchTerm: string) => {
    if (searchTerm === "") {
      setTopics(initialTopics)
      return
    }

    const filteredTopics = initialTopics.filter((topic) => topic.title.toLowerCase().includes(searchTerm.toLowerCase()))
    setTopics(filteredTopics)
  }

  if (!contractReady || loading) {
    return (
      <ForumContainer>
        <LoadingSpinner message={!contractReady ? "Initializing contract..." : "Loading questions..."} />
      </ForumContainer>
    )
  }

  return (
    <ForumContainer>
      <Header>
        <SearchInput onSearch={handleSearch} />
        <NavLink to={`/forum/${name}/question`}>
          <Button data-cy="new-question-button">New Question</Button>
        </NavLink>
      </Header>
      <ForumList>
        {topics.filter((topic) => topic.hasQuestion).map((topic) => (
          <NavLink key={topic.id} to={`/forum/${name}/question/${topic.id}`}>
            <TopicCard>
              <TopicInfo>
                <TopicAvatar src={topic.avatar} alt={topic.author} />
                <div>
                  <TopicTitle>
                    {topic.isOpen ? (
                      <Question size={18} color="#d4821e" weight="fill" />
                    ) : (
                      <CheckCircle size={18} color="#2e8b57" weight="fill" />
                    )}
                    <h3>{topic.title}</h3>
                  </TopicTitle>
                  <TopicMeta>
                    {topic.author}
                    <time>{topic.time}</time>
                  </TopicMeta>
                </div>
              </TopicInfo>
              <TopicFooter>
                <CurrencyDollar size={24} color="#25c028" weight="fill" />
                <span>{(topic.amount).toFixed(2)}</span>
              </TopicFooter>
            </TopicCard>
          </NavLink>
        ))}
      </ForumList>
    </ForumContainer>
  )
}