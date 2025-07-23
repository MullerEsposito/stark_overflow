import styled from "styled-components";

export const ForumContainer = styled.div`
  background: ${({ theme }) => theme.background};
  color: ${({ theme }) => theme.text};
  min-height: 100vh;
  padding: 20px;
  max-width: 900px;
  margin: auto;
  width: 100%;

  @media (max-width: 768px) {
    padding: 16px;
  }

  @media (max-width: 480px) {
    padding: 12px;
  }

  @media (max-width: 320px) {
    padding: 8px;
  }
`;

export const Header = styled.header`
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-radius: 8px;
  gap: 16px;
  margin-bottom: 20px;

  @media (max-width: 768px) {
    flex-direction: column;
    align-items: stretch;
    gap: 12px;
  }

  @media (max-width: 480px) {
    gap: 8px;
  }
`;

export const Button = styled.button`
  background: #7c3aed;
  color: #fff;
  padding: 10px 20px;
  border-radius: 8px;
  border: none;
  cursor: pointer;
  font-weight: 600;
  font-size: 0.9rem;
  transition: background 0.2s;
  white-space: nowrap;
  min-width: 120px;

  &:hover {
    background: #6b28d9;
  }

  @media (max-width: 768px) {
    padding: 12px 16px;
    font-size: 1rem;
    min-width: auto;
    width: 100%;
  }

  @media (max-width: 480px) {
    padding: 10px 14px;
    font-size: 0.9rem;
  }
`;

export const ForumList = styled.div`
  margin-top: 20px;
  display: flex;
  flex-direction: column;
  gap: 12px;

  @media (max-width: 480px) {
    gap: 8px;
  }
`;

export const TopicCard = styled.div`
  background: ${({ theme }) => theme.forum.topicCard.background};
  padding: 15px;
  border-radius: 8px;
  margin-bottom: 10px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  transition: background 0.3s, box-shadow 0.2s, border-color 0.2s, transform 0.2s cubic-bezier(0.22, 1, 0.36, 1);
  box-shadow: ${({ theme }) => theme.shadow.sm};
  border: 1.5px solid ${({ theme }) => theme.forum.topicCard.border};
  gap: 12px;

  &:hover {
    background: ${({ theme }) => theme.forum.topicCard.backgroundHover};
    box-shadow: ${({ theme }) => theme.shadow.md};
    border-color: ${({ theme }) => theme.primaryLight};
    transform: translateY(-6px) scale(1.02);
    cursor: pointer;
  }
  &:active {
    transform: translateY(2px) scale(0.98);
  }

  @media (max-width: 768px) {
    flex-direction: column;
    align-items: flex-start;
    gap: 12px;
    padding: 12px;
  }

  @media (max-width: 480px) {
    padding: 10px;
    gap: 8px;
  }
`;

export const TopicInfo = styled.section`
  display: flex;
  align-items: center;
  max-width: 27rem;
  width: 100%;
  gap: 12px;

  @media (max-width: 768px) {
    max-width: none;
    width: 100%;
  }

  @media (max-width: 480px) {
    gap: 8px;
  }
`;

export const TopicAvatar = styled.img`
  width: 3.25rem;
  height: 3.25rem;
  border-radius: 50%;
  margin-right: 1rem;
  flex-shrink: 0;

  @media (max-width: 768px) {
    width: 2.5rem;
    height: 2.5rem;
    margin-right: 0.75rem;
  }

  @media (max-width: 480px) {
    width: 2rem;
    height: 2rem;
    margin-right: 0.5rem;
  }
`;

export const TopicTitle = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  flex: 1;
  min-width: 0;

  h3 {
    width: 100%;
    word-break: break-word;
    font-size: 1rem;
    color: ${({ theme }) => theme.forum.topicCard.text};
    font-weight: bold;
    line-height: 1.19rem;
    margin: 0;
  }

  @media (max-width: 768px) {
    align-items: flex-start;
    gap: 8px;

    h3 {
      font-size: 0.9rem;
      line-height: 1.2rem;
    }
  }

  @media (max-width: 480px) {
    h3 {
      font-size: 0.85rem;
      line-height: 1.1rem;
    }
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

  @media (max-width: 768px) {
    font-size: 0.8rem;
    margin-top: 0.25rem;
    margin-bottom: 0.125rem;

    time {
      font-size: 0.7rem;
    }
  }

  @media (max-width: 480px) {
    font-size: 0.75rem;

    time {
      font-size: 0.65rem;
    }
  }
`;

export const TopicFooter = styled.footer`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 0.5rem;
  margin-left: auto;
  min-width: 100px;

  @media (max-width: 768px) {
    margin-left: 0;
    min-width: auto;
    width: 100%;
    justify-content: flex-end;
  }

  @media (max-width: 480px) {
    gap: 0.25rem;
  }
`;