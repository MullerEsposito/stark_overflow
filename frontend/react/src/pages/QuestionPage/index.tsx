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
import { formatters } from "@utils/formatters"
import { shortenAddress } from "@utils/shortenAddress"

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

  const { sendAsync, data, isPending, error } = useSendTransaction({
    calls: contract && description && amount
        ? [contract.populate("ask_question", [description, formatters.numberToBigInt(Number(amount) * 10**18)])]
        : undefined,
  });

  
  // Form validation
  const validateForm = () => {
    const newErrors: Record<string, string> = {}

    if (!title.trim()) {
      newErrors.title = "Title is required"
    } else if (title.length < 10) {
      newErrors.title = "Title should be at least 10 characters"
    }

    if (!description.trim()) {
      newErrors.description = "Description is required"
    } else if (description.length < 30) {
      newErrors.description = "Description should be at least 30 characters"
    }

    if (!amount.trim()) {
      newErrors.amount = "Amount is required"
    } else if (isNaN(Number(amount)) || Number(amount) <= 0) {
      newErrors.amount = "Amount must be a positive number"
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!validateForm()) {
      return
    }

    if (!isConnected) {
      openConnectModal()
      return
    }

    try {
      const result = await sendAsync();
      if (result.transaction_hash) {
        // Redirect after successful submission
        setTimeout(() => {
          navigate("/forum/reactjs")
        }, 2000)
      }
    } catch (err) {
      console.error("Transaction error:", err)
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
          <Button variant="publish" type="submit" disabled={isPending}>
            {isPending ? "Publishing..." : "Publish"}
            {!isPending && <PaperPlaneRight size={20} />}
          </Button>
        </div>

        {(isPending || data || error) && (
          <TransactionStatus status={isPending ? "processing" : data ? "success" : "error"}>
            {isPending && "Processing transaction..."}
            {data && `Question published successfully! Tx: ${shortenAddress(data.transaction_hash)}`}
            {error && `Transaction failed: ${error.message}`}
          </TransactionStatus>
        )}
      </Form>
    </Container>
  )
}