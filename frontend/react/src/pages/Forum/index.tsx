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
import { useState } from "react"
import { useParams } from "react-router-dom"

export function Forum() {
  const { name } = useParams<{ name: string }>()

  const initialTopics = [
    {
      id: "q1",
      avatar: "https://avatars.githubusercontent.com/u/62848833?v=4",
      title: "Unit tests in components that use Design System",
      author: "Maicon Domingues",
      time: "today at 11:47",
      amount: "2500,00",
      state: "open",
    },
    {
      id: "q2",
      avatar: "https://avatars.githubusercontent.com/u/62848833?v=4",
      title: "[Tip] Carousel with Keen-Slider",
      author: "Jordane Chaves Ferreira Rocha",
      time: "yesterday at 22:15",
      amount: "1850,00",
      state: "closed",
    },
    {
      id: "q3",
      avatar: "https://avatars.githubusercontent.com/u/62848833?v=4",
      title: "Tests with Jest and React Testing Library",
      author: "Vitor Antonio Danner da Silva",
      time: "yesterday at 19:07",
      amount: "7,00",
      state: "open",
    },
    {
      id: "q4",
      avatar: "https://avatars.githubusercontent.com/u/62848833?v=4",
      title: "I'm facing problems on Github",
      author: "Jhane Doe",
      time: "yesterday at 16:24",
      amount: "2500,00",
      state: "open",
    },
  ]
  const [topics, setTopics] = useState(initialTopics)

  const handleSearch = (searchTerm: string) => {
    if (searchTerm === "") {
      setTopics(initialTopics)
      return
    }

    const filteredTopics = initialTopics.filter((topic) => topic.title.toLowerCase().includes(searchTerm.toLowerCase()))
    setTopics(filteredTopics)
  }

  return (
    <ForumContainer>
      <Header>
        <SearchInput onSearch={handleSearch} />
        <NavLink to={`/forum/${name}/new-question`}>
          <Button>New Question</Button>
        </NavLink>
      </Header>
      <ForumList>
        {topics.map((topic) => (
          <NavLink key={topic.id} to={`/forum/${name}/question/${topic.id}`}>
            <TopicCard>
              <TopicInfo>
                <TopicAvatar src={topic.avatar} alt={topic.author} />
                <div>
                  <TopicTitle>
                    {topic.state === "open" ? (
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
                <span>{topic.amount}</span>
              </TopicFooter>
            </TopicCard>
          </NavLink>
        ))}
      </ForumList>
    </ForumContainer>
  )
}
