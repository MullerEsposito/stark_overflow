"use client"

import type React from "react"
import { useState } from "react"
import { PaperPlaneRight, Link as LinkIcon, Tag, CurrencyDollar } from "phosphor-react"
import { Container, Form, Button, TransactionStatus } from "./style"
import { NavLink, useNavigate } from "react-router-dom"
import { useAccount, useSendTransaction } from "@starknet-react/core"
import { InputForm } from "./InputForm"
import { EditorForm } from "./EditorForm"
import { useWallet } from "@hooks/useWallet"
import { useContract } from "@hooks/useContract"
import { shortenAddress } from "@utils/shortenAddress"
import { cairo } from "starknet"
import { formatters } from "@utils/formatters"

export function QuestionPage() {
  const [title, setTitle] = useState("")
  const [description, setDescription] = useState("")
  const [amount, setAmount] = useState("")
  const [repository, setRepository] = useState("")
  const [tags, setTags] = useState("")
  const [errors, setErrors] = useState<Record<string, string>>({})

  const navigate = useNavigate()
  const { isConnected } = useAccount()
  const { openConnectModal } = useWallet()
  const { contract } = useContract();

  const amountInWei = formatters.convertStringDecimalToWei(amount);
  const scaledAmount = cairo.uint256(amountInWei);

  const { sendAsync: askQuestion, isPending: isTransactionPending, data: transactionData, error: transactionError } = useSendTransaction({
    calls: contract && description && amount && Number(scaledAmount.low) > 0
      ? [{
        contractAddress: import.meta.env.VITE_TOKEN_ADDRESS,
        entrypoint: "approve",
        calldata: [contract.address, scaledAmount.low, scaledAmount.high],
      },
      contract.populate("ask_question", [description, scaledAmount])]
      : undefined,
  });

  const validateForm = () => {
    const newErrors: Record<string, string> = {}
    if (!title.trim()) newErrors.title = "Title is required"
    else if (title.length < 10) newErrors.title = "Title should be at least 10 characters"
    if (!description.trim()) newErrors.description = "Description is required"
    else if (description.length < 30) newErrors.description = "Description should be at least 30 characters"
    if (!amount.trim()) newErrors.amount = "Amount is required"
    else if (isNaN(Number(amount)) || Number(amount) <= 0) newErrors.amount = "Amount must be a positive number"
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!validateForm()) return
    if (!isConnected) {
      openConnectModal()
      return
    }
    try {
      const result = await askQuestion()
      if (result.transaction_hash) {
        setTimeout(() => {
          navigate("/forum/reactjs")
        }, 2000)
      }
    } catch (error) {
      console.error("Transaction error:", error)
    }
  }

  return (
    <Container>
      <h2>Create Question</h2>
      <Form onSubmit={handleSubmit}>
        <InputForm
          id="title"
          label="Title"
          tooltipText="Be specific and imagine you're asking a question to another person"
          error={errors.title}
          value={title}
          validateForm={validateForm}
          setValue={setTitle}
        />
        <InputForm id="amount"
          label="Amout to Stake"
          tooltipText="The amount you're willing to pay for a solution"
          placeholder="Amount"
          error={errors.amount}
          value={amount}
          setValue={setAmount}
          validateForm={validateForm}
        >
          <CurrencyDollar size={20} />
        </InputForm>
        <EditorForm
          id="description"
          value={description}
          error={errors.description}
          setValue={setDescription}
          validateForm={validateForm}
        />
        <InputForm id="repository"
          label="Repository Link (Optional)"
          tooltipText="Link to a GitHub repository or code sample"
          placeholder="http://github.com/username/repo"
          error={errors.repository}
          value={repository}
          setValue={setRepository}
          validateForm={validateForm}
        >
          <LinkIcon size={20} />
        </InputForm>
        <InputForm id="tags"
          label="Tags (Optional)"
          tooltipText="Add up to 5 tags to describe what your question is about"
          placeholder="e.g. react hooks typescript"
          error={errors.tags}
          value={tags}
          setValue={setTags}
          validateForm={validateForm}
        >
          <Tag size={20} />
        </InputForm>
        <div className="buttons">
          <NavLink to="/forum/reactjs">
            <Button variant="cancel" type="button">
              Discard
            </Button>
          </NavLink>
          <Button variant="publish" type="submit" disabled={isTransactionPending || scaledAmount.low === 0n}>
            {isTransactionPending ? "Publishing..." : "Publish"}
            {!isTransactionPending && <PaperPlaneRight size={20} />}
          </Button>
        </div>
        {(isTransactionPending || transactionData || transactionError) && (
          <TransactionStatus status={(isTransactionPending) ? "processing" : (transactionData) ? "success" : "error"}>
            {isTransactionPending && "Processing transaction..."}
            {transactionData && `Transaction processed successfully! Tx: ${shortenAddress(String(transactionData?.transaction_hash))}`}
            {transactionError && `Transaction failed: ${(transactionError)?.message}`}
          </TransactionStatus>
        )}
      </Form>
    </Container>
  )
}