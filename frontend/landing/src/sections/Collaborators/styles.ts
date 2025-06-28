import styled from "styled-components"

export const CollaboratorsContainer = styled.div`
  margin-top: 100px;
  margin-bottom: 60px;
  text-align: center;

  h2 {
    color: ${({ theme }) => theme.primary};
    margin-bottom: 40px;
  }
`

export const CollaboratorsItens = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(120px, 1fr));
  gap: 32px;
  justify-items: center;
  align-items: start;
  max-width: 800px;
  margin: 0 auto;
`

export const CollaboratorItem = styled.div`
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
  margin: 16px;
  transition: transform 0.3s;

  &:hover {
    transform: scale(130%);

    & > div {
      bottom: -30px;
      opacity: 1;
    }
  }
  
  span {
    font-size: 14px;
    color: ${({ theme }) => theme.textSecondary};
  }

  & > div {
    position: absolute;
    opacity: 0;
    bottom: 50%;
    z-index: 0;
    transition: all 0.3s;
  }
`

export const CollaboratorImage = styled.img`
  width: 64px;
  height: 64px;
  border-radius: 50%;
  z-index: 10;

`