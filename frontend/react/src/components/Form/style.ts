import styled from "styled-components";

export const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 20px;

  .buttons {
    display: flex;
    justify-content: flex-end;
    gap: 12px;
    margin-top: 12px;
    flex-wrap: wrap;
  }

  @media (max-width: 768px) {
    gap: 16px;

    .buttons {
      flex-direction: column;
      gap: 8px;
      margin-top: 8px;
    }
  }

  @media (max-width: 480px) {
    gap: 12px;

    .buttons {
      gap: 6px;
      margin-top: 6px;
    }
  }
`