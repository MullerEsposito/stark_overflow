import { rgba } from "polished";
import styled from "styled-components";

export const ForumContainer = styled.div`
  background: ${({ theme }) => theme.background};
  color: ${({ theme }) => theme.text};
  min-height: 100vh;
  padding: 20px;
  max-width: 900px;
  margin: auto;
`;

export const Header = styled.header`
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-radius: 8px;
`;

export const Button = styled.button`
  background: #7c3aed;
  color: #fff;
  padding: 10px 20px;
  border-radius: 8px;
  border: none;
  cursor: pointer;
  &:hover {
    background: #6b28d9;
  }
`;

export const ForumList = styled.div`
  margin-top: 20px;
`;

export const TopicCard = styled.div`
  background: ${({ theme }) => theme.forum.topicCard.background};
  padding: 15px;
  border-radius: 8px;
  border: ${({ theme }) => theme.forum.topicCard.border};
  margin-bottom: 10px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  transition: background 0.3s;

  &:hover {
    background: ${({ theme }) => rgba(theme.forum.topicCard.background, 0.5)};
    cursor: pointer;
  }
`;

export const TopicInfo = styled.section`
  display: flex;
  align-items: center;
  max-width: 27rem;
  width: 100%;
`;

export const TopicAvatar = styled.img`
  width: 3.25rem;
  height: 3.25rem;
  border-radius: 50%;
  margin-right: 1rem;
`;

export const TopicTitle = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;

  h3 {
    width: 100%;
    word-break: break-word;
    font-size: 1rem;
    color: ${({ theme }) => theme.forum.topicCard.text};
    font-weight: bold;
    line-height: 1.19rem;
  }
`;

export const TopicMeta = styled.span`
  display: flex;
  flex-direction: column;
  margin-top: 0.5rem;
  margin-bottom: 0.25rem;
  color: ${({ theme }) => theme.forum.topicCard.meta};
  font-size: 0.9rem;
  font-weight: bold;

  time {
    font-size: 0.8rem;
    font-weight: normal;
  }
`;

export const TopicFooter = styled.footer`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 0.5rem;
  margin-left: auto;
  min-width: 100px;
`;