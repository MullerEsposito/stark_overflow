import { NavLink } from "react-router-dom";
import { Card, CardsContainer } from "./style";
import { ChatCircleDots, CurrencyDollar } from "phosphor-react";
import { useTranslation } from "react-i18next";
import { ForumsList } from "..";

interface CardsProps {
  forums: ForumsList,
}

export function Cards({ forums }: CardsProps) {
  const { t } = useTranslation('common');

  return (
    <CardsContainer>
      {forums.map((forum, index) => (
        <NavLink to={`/forum/${forum.path}`} key={index}>
          <Card>
            <img src={forum.icon} alt={forum.name} />
            <section>
              <small>{t('forumLabel')}</small>
              <strong>{forum.name}</strong>
              <div>
                <span>
                  <ChatCircleDots size={18} /> {forum.topics}
                  <CurrencyDollar size={18} weight="bold" color="green" /> {forum.amount}
                </span>
              </div>
            </section>
          </Card>
        </NavLink>
      ))}
    </CardsContainer>
  )
}
