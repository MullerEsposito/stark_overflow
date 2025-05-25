import { FlowCards } from './FlowCards'
import { InfoCards } from './InfoCards'
import { Section, Title } from './style'

export function ProblemAndSolution({ ...props }){
  return (   
    <Section {...props}>
      <InfoCards />
      <Title>How it <span>Works</span> Step-by-Step Guide</Title>
      <FlowCards />
    </Section> 
  )
}