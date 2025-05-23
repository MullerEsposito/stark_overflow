import { GithubLogo, RocketLaunch } from "@phosphor-icons/react"
import { HeroContainer, HeroContent, Title, Subtitle, ButtonsContainer, SecondaryButton, Card, CardsContainer } from "./styles"
import { HTMLAttributes } from "react"

export function Hero({ ...props }: HTMLAttributes<HTMLDivElement>) {
  return (
    <HeroContainer {...props}>
      <HeroContent>
        <Title>
          The <span>Revolution of Problem</span> <span className="highlight">Solving</span>
        </Title>
        <Subtitle>A decentralized platform that financially rewards those who share
          knowledge. Deposit funds into questions and encourage high-quality
          answers.</Subtitle>
        <ButtonsContainer>
          <SecondaryButton href="https://github.com/MullerEsposito/stark_overflow" target="_blank" rel="noopener noreferrer">
            <GithubLogo size={20} weight="fill" />
            Github Repository
          </SecondaryButton>
          <SecondaryButton href="https://app.starkoverflow.com.br/" target="_blank" rel="noopener noreferrer">
            <RocketLaunch size={20} weight="fill" />
            Launch App
          </SecondaryButton>
        </ButtonsContainer>
      </HeroContent>
      <CardsContainer>
        <Card>
          <h3>Incentive System</h3>
          <p>Accepted answers receive financial rewards, ensuring quality.</p>
        </Card>
        <Card>
          <h3>Web3 and Smart Contracts</h3>
          <p>
            Everything is recorded in smart contracts, bringing transparency.
          </p>
        </Card>
        <Card>
          <h3>Engaged Community</h3>
          <p>A space for developers, enthusiasts, and experts.</p>
        </Card>
        </CardsContainer>
    </HeroContainer>
  )
}

