import { formatters } from "./formatters"
import { Question, Answer, Forum } from "@app-types/index"
import { Question as ContractQuestion, Answer as ContractAnswer, ContractForum } from "../types/contract-types"


const generateMockTimestamp = (): string => {
  const randomHours = Math.floor(Math.random() * 48) // 0-48 hours ago

  if (randomHours < 1) {
    return "Just now"
  } else if (randomHours < 24) {
    return `${randomHours} hours ago`
  } else {
    const days = Math.floor(randomHours / 24)
    return `${days} day${days > 1 ? 's' : ''} ago`
  }
}

const generateMockRepository = (): string => {
  const repos = [
    "https://github.com/starkware-libs/cairo",
    "https://github.com/starknet-community/starknet-js",
    "https://github.com/xJonathanLEI/starkli",
    "https://github.com/MullerEsposito/stark_overflow",
    "",
  ]
  return repos[Math.floor(Math.random() * repos.length)]
}

const generateMockAuthorName = (address: string): string => {
  const names = ["Alice", "Bob", "Charlie", "Diana", "Eve", "Frank", "Grace", "Henry"]
  const surnames = ["Smith", "Johnson", "Williams", "Brown", "Jones", "Garcia", "Miller", "Davis"]

  // Use address to generate consistent name for same address
  const nameIndex = parseInt(address.slice(-2), 16) % names.length
  const surnameIndex = parseInt(address.slice(-4, -2), 16) % surnames.length

  return `${names[nameIndex]} ${surnames[surnameIndex]}`
}

export const contractQuestionToFrontend = (contractQuestion: ContractQuestion): Question => {
  const authorAddress = formatters.bigIntToAddress(contractQuestion.author)
  const status = formatters.formatStatus(contractQuestion.status)
  const authorName = generateMockAuthorName(authorAddress)
  const weiValue = formatters.bigIntToNumber(contractQuestion.value)
  const decimalValue = formatters.convertWeiToDecimal(weiValue)

  return {
    id: contractQuestion.id.toString(),
    title: contractQuestion.description.length > 60
      ? contractQuestion.description.substring(0, 60) + "..."
      : contractQuestion.description,
    content: contractQuestion.description,
    authorAddress: authorAddress,
    authorName,
    timestamp: generateMockTimestamp(),
    stakeAmount: decimalValue,
    tags: contractQuestion?.tags || [],
    repositoryUrl: generateMockRepository(),
    isOpen: status === "Open",
  }
}

export const contractAnswerToFrontend = (contractAnswer: ContractAnswer, isCorrect = false): Answer => {
  const authorAddress = formatters.bigIntToAddress(contractAnswer.author)
  const authorName = generateMockAuthorName(authorAddress)

  return {
    id: contractAnswer.id.toString(),
    authorAddress: authorAddress,
    authorName,
    content: contractAnswer.description,
    timestamp: generateMockTimestamp(),
    isCorrect,
    votes: Math.floor(Math.random() * 10), // Random votes for now
  }
}

export const contractForumToFrontend = (contractForum: ContractForum): Forum => {
  return {
    id: contractForum.id.toString(),
    name: contractForum.name,
    icon_url: contractForum.icon_url,
    amount: formatters.convertWeiToDecimal(Number(contractForum.amount)),
    total_questions: Number(contractForum.total_questions),
  }
}
