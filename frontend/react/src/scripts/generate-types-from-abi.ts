/* eslint-disable @typescript-eslint/no-explicit-any */
import fs from "fs";
import path from "path";
import { StarkOverflowABI } from "../types/abi.ts";

// === CONFIGURAÇÃO ===
const OUTPUT_PATH = path.resolve("./src/types/contract-types.ts");

// === MAPEAMENTO Cairo → TS customizado ===
function mapType(cairoType: string): string {
  if (cairoType.startsWith("core::array::Array::<")) {
    const inner = cairoType.slice("core::array::Array::<".length, -1);
    return `${mapType(inner)}[]`;
  }

  const typeMap: Record<string, string> = {
    "core::integer::u256": "bigint | number | Uint256",
    "core::integer::u128": "BigNumberish",
    "core::integer::u64": "BigNumberish",
    "core::integer::u32": "number",
    "core::felt252": "string",
    "core::starknet::contract_address::ContractAddress": "bigint",
    "core::byte_array::ByteArray": "string",
    "core::bytes_31::bytes31": "string",
    "stark_overflow::structs::QuestionStatus": "CairoCustomEnum"
  };

  return typeMap[cairoType] || cairoType.split("::").pop()!;
}

// === GERAÇÃO ===
function generateTypes(abi: any[]) {
  let output = `// Auto-gerado a partir da ABI - NÃO EDITAR MANUALMENTE\n\n`;
  output += `import { BigNumberish, CairoCustomEnum } from "starknet";\n\n`;

  // Enums
  const enums = abi.filter((x) => x.type === "enum");
  for (const en of enums) {
    const name = en.name.split("::").pop();
    const variants = en.variants.map((v: any) => `  | "${v.name}"`).join("\n");
    output += `export type ${name} =\n${variants};\n\n`;
  }

  // Structs
  const structs = abi.filter((x) => x.type === "struct");
  for (const st of structs) {
    const rawName = st.name.split("::").pop();
    const name = rawName === "u256" ? "Uint256" : rawName;
    output += `export interface ${name} {\n`;
    for (const member of st.members) {
      output += `  ${member.name}: ${mapType(member.type)};\n`;
    }
    output += `}\n\n`;
  }

  fs.writeFileSync(OUTPUT_PATH, output.trim() + "\n");
  console.log(`✅ Tipos gerados com sucesso em: ${OUTPUT_PATH}`);
}

// === Execução ===
const abi = JSON.parse(JSON.stringify(StarkOverflowABI));
generateTypes(abi);
