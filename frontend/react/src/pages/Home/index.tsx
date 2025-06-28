import reactjsLogo from "@logos/reactjs.webp";
import nodejsLogo from "@logos/nodejs.webp";
import pythonLogo from "@logos/python.svg";
import javaLogo from "@logos/java.webp";
import { Cards } from "./Cards";
import { HomeContainer } from "./style";
import { useState } from "react";
import { SearchInput } from "../../components/SearchInput";
import { useTranslation } from "react-i18next";

const initialForumsList = [
  { name: "ReactJS", icon: reactjsLogo, topics: 15, amount: "2500,00", path: "reactjs" },
  { name: "Node.js", icon: nodejsLogo, topics: 11, amount: "1850,00", path: "nodejs" },
  { name: "Python", icon: pythonLogo, topics: 3, amount: "700,00", path: "python" },
  { name: "Java", icon: javaLogo, topics: 3, amount: "2700,00", path: "java" },
];

export type ForumsList = typeof initialForumsList;

export function Home() {
  const [forumsList, setForumsList] = useState<ForumsList>(initialForumsList);
  const { t } = useTranslation(['common', 'home']);
  
  const handleSearch = (searchTerm: string) => {
    if (searchTerm === '') {
      setForumsList(initialForumsList);
      return;
    }

    const filteredForums = initialForumsList.filter(forum =>
      forum.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setForumsList(filteredForums);
  };

  return (
    <HomeContainer>
      <h1>{t('common:forums')}</h1>
      {forumsList.length > 6 && <SearchInput onSearch={handleSearch} /> }
      <Cards forums={forumsList} />
    </HomeContainer>
  );
}