"use client"

import type React from "react"
import { useState } from "react"
import { PaperPlaneRight, Link as LinkIcon, Tag, CurrencyDollar } from "phosphor-react"
import { Container, Form, Button, TransactionStatus } from "./style"
import { NavLink, useNavigate } from "react-router-dom"
import { useAccount } from "@starknet-react/core"
import { InputForm } from "./InputForm"
import { EditorForm } from "./EditorForm"
import { useWallet } from "@hooks/useWallet"

export function QuestionPage() {
  const [title, setTitle] = useState("")
  const [description, setDescription] = useState("")
  const [amount, setAmount] = useState("")
  const [repository, setRepository] = useState("")
  const [tags, setTags] = useState("")
  const [errors, setErrors] = useState<Record<string, string>>({})
  
  const [transactionStatus, setTransactionStatus] = useState<"idle" | "processing" | "success" | "error">("idle")
  
  const navigate = useNavigate()
  const { isConnected } = useAccount()
  const { openConnectModal } = useWallet()

  
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
      setTransactionStatus("processing")

      // Simulate blockchain transaction
      await new Promise((resolve) => setTimeout(resolve, 2000))

      // Success
      setTransactionStatus("success")

      // Redirect after successful submission
      setTimeout(() => {
        navigate("/forum/reactjs")
      }, 1500)
    } catch (error) {
      console.error("Transaction error:", error)
      setTransactionStatus("error")
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
          <Button variant="publish" type="submit" disabled={transactionStatus === "processing"}>
            {transactionStatus === "processing" ? "Publishing..." : "Publish"}
            {transactionStatus !== "processing" && <PaperPlaneRight size={20} />}
          </Button>
        </div>

        {transactionStatus !== "idle" && (
          <TransactionStatus status={transactionStatus}>
            {transactionStatus === "processing" && "Processing transaction..."}
            {transactionStatus === "success" && "Question published successfully!"}
            {transactionStatus === "error" && "Transaction failed. Please try again."}
          </TransactionStatus>
        )}
      </Form>
    </Container>
  )
}
