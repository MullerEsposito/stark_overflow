import styled from "styled-components"

export const CollaboratorsContainer = styled.div`
  margin-top: 100px;
  margin-bottom: 60px;
  display: flex;
  flex-direction: column;
  align-items: center;

  h2 {
    color: ${({ theme }) => theme.primary};
    margin-bottom: 40px;
    text-align: center;
    width: 100%;
  }
`

export const CollaboratorsItens = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
  gap: 32px;
  width: 100%;
  max-width: 900px;
  justify-items: center;
`

export const CollaboratorItem = styled.div`
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 12px;
  transition: transform 0.3s;
  background: ${({ theme }) => theme.backgroundSecondary || "#fff"};
  border-radius: 16px;
  box-shadow: 0 2px 12px rgba(0,0,0,0.06);
  width: 180px;
  min-height: 220px;
  max-width: 200px;
  padding: 32px 16px 24px 16px;
  box-sizing: border-box;

  &:hover {
    transform: scale(1.07);
  }

  // Show social links always, not just on hover
  & > div {
    position: static;
    opacity: 1;
    bottom: auto;
    z-index: 1;
    transition: none;
    margin-top: 8px;
  }
  
  span {
    font-size: 14px;
    color: ${({ theme }) => theme.textSecondary};
    font-weight: 500;
    margin-top: 12px;
    text-align: center;
    word-break: break-word;
  }
`

export const CollaboratorImage = styled.img`
  width: 64px;
  height: 64px;
  border-radius: 50%;
  z-index: 10;
  object-fit: cover;
`