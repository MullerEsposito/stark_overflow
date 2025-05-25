import { Check, Coins, CurrencyDollar, Phone, Question } from '@phosphor-icons/react';
import {
  FlowCardContainer,
  StepContainer,
  IconWrapper,
  StepTitle,
  StepDescription,
  StepContent
} from './styles';

interface Step {
  id: number;
  title: string;
  description: string;
  icon: React.ReactNode;
}

interface FlowCardsProps {
  activeStep?: number;
  onStepClick?: (stepId: number) => void;
}

export const FlowCards: React.FC<FlowCardsProps> = ({
  onStepClick,
}) => {
  const steps: Step[] = [
    {
      id: 1,
      title: 'Post Question',
      description: 'Users post a question and lock funds in a smart contract.',
      icon: <Question weight="bold" />,
    },
    {
      id: 2,
      title: 'Boost Reward',
      description: 'Others can increase incentive',
      icon: <CurrencyDollar weight="bold" />,
    },
    {
      id: 3,
      title: 'Expert Answers',
      description: 'Compete for best solution',
      icon: <Phone weight="bold" />,
    },
    {
      id: 4,
      title: 'Choose Best Answer',
      description: 'The question author selects the best response.',
      icon: <Check weight="bold" />,
    },
    {
      id: 5,
      title: 'Transfer Funds',
      description: 'The locked amount is transferred to the expert.',
      icon: <Coins weight="bold" />,
    },
  ];

  const handleStepClick = (stepId: number) => {
    if (onStepClick) {
      onStepClick(stepId);
    }
  };

  return (
    <FlowCardContainer>
      {steps.map((step) => (
        <StepContainer
          key={step.id}
          onClick={() => handleStepClick(step.id)}
        >
          <IconWrapper>{step.icon}</IconWrapper>
          <StepContent>
            <StepTitle>{step.title}</StepTitle>
            <StepDescription>{step.description}</StepDescription>
          </StepContent>
        </StepContainer>
      ))}
    </FlowCardContainer>
  );
};