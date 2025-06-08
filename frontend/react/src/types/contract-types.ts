// Auto-gerado a partir da ABI - NÃO EDITAR MANUALMENTE

import { BigNumberish, CairoCustomEnum } from "starknet";

export type QuestionStatus =
  | "Open"
  | "Resolved";

export interface ByteArray {
  data: string[];
  pending_word: string;
  pending_word_len: number;
}

export interface Uint256 {
  low: BigNumberish;
  high: BigNumberish;
}

export interface Question {
  id: bigint | number | Uint256;
  author: bigint;
  description: string;
  value: bigint | number | Uint256;
  status: CairoCustomEnum;
}

export interface Answer {
  id: bigint | number | Uint256;
  author: bigint;
  description: string;
  question_id: bigint | number | Uint256;
}
