import { Form } from "./style";

interface FormProps {
  children: React.ReactNode,
  onSubmit: (e: React.FormEvent<HTMLFormElement>) => void,
}

export function FormContainer({ children, onSubmit }: FormProps) {
  return <Form onSubmit={onSubmit}>{children}</Form>
}