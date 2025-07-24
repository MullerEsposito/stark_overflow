"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { PaperPlaneRight, Link as LinkIcon, Tag, CurrencyDollar, Buildings } from "phosphor-react"
import { Container, Form, Button, TransactionStatus } from "./style"
import { NavLink, useNavigate, useParams } from "react-router-dom"
import { useAccount, useSendTransaction } from "@starknet-react/core"
import { InputForm } from "../../components/InputForm"
import { EditorForm } from "./EditorForm"
import { TagInput } from "../../components/TagInput"
import { useWallet } from "@hooks/useWallet"
import { useContract } from "@hooks/useContract"
import { shortenAddress } from "@utils/shortenAddress"
import { cairo } from "starknet"
import { formatters } from "@utils/formatters"
import { validateEnvironment, getEnvironmentDebugInfo } from "@utils/environment"
import { Forum } from "@app-types/index"

export function QuestionPage() {
  const [title, setTitle] = useState("")
  const [description, setDescription] = useState("")
  const [amount, setAmount] = useState("")
  const [repository, setRepository] = useState("")
  const [tags, setTags] = useState<string[]>([])
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [envError, setEnvError] = useState<string | null>(null)

  const navigate = useNavigate()
  const params = useParams<{ name: string }>()
  const forumName = params.name || ""
  const { isConnected } = useAccount()
  const { openConnectModal } = useWallet()
  const { contract, contractReady, fetchForum } = useContract();
  const [forum, setForum] = useState<Forum | null>(null)

  // Validate environment variables on component mount
  useEffect(() => {
    const validation = validateEnvironment()
    if (!validation.isValid) {
      setEnvError(`Missing environment variables: ${validation.missingVars.join(', ')}`)
    } else {
      setEnvError(null)
    }
  }, [])

  useEffect(() => {
    const loadForum = async () => {
      const forum = await fetchForum(forumName)
      setForum(forum)
    }
    loadForum()
  }, [fetchForum, forumName])

  const amountInWei = formatters.convertStringDecimalToWei(amount);
  const scaledAmount = cairo.uint256(amountInWei);

  // Get token address safely
  const tokenAddress = import.meta.env.VITE_TOKEN_ADDRESS

  const { sendAsync: askQuestion, isPending: isTransactionPending, data: transactionData, error: transactionError } = useSendTransaction({
    calls: contract && contractReady && tokenAddress && description && amount && Number(scaledAmount.low) > 0 && title && forum?.id
      ? [{
        contractAddress: tokenAddress,
        entrypoint: "approve",
        calldata: [contract.address, scaledAmount.low, scaledAmount.high],
      },
      contract.populate("ask_question", [
        BigInt(forum.id),
        title,
        description,
        repository,
        tags, // Send tags array directly
        scaledAmount
      ])]
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
    else if (repository && !repository.startsWith('http')) newErrors.repository = "Repository URL must be a valid URL"
    if (tags.length > 5) newErrors.tags = "Maximum 5 tags allowed"
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    // Check for environment errors first
    if (envError || !contractReady) {
      setErrors({ general: envError || "Contract not ready. Please check your environment configuration." })
      return
    }

    if (!validateForm()) return
    if (!isConnected) {
      openConnectModal()
      return
    }
    try {
      const result = await askQuestion()
      if (result.transaction_hash) {
        setTimeout(() => {
          navigate(`/forum/${forumName}`)
        }, 2000)
      }
    } catch (error) {
      console.error("Transaction error:", error)
    }
  }

  // Show environment error state
  if (envError) {
    return (
      <Container>
        <div style={{
          padding: "20px",
          textAlign: "center",
          backgroundColor: "#f8d7da",
          color: "#721c24",
          borderRadius: "5px",
          border: "1px solid #f5c6cb",
          margin: "20px 0"
        }}>
          <h3>Configuration Error</h3>
          <p style={{ margin: "10px 0" }}>{envError}</p>
          <details style={{ marginTop: "15px", textAlign: "left" }}>
            <summary style={{ cursor: "pointer", fontWeight: "bold" }}>Debug Information</summary>
            <div style={{ marginTop: "10px", fontFamily: "monospace", fontSize: "0.9em" }}>
              {Object.entries(getEnvironmentDebugInfo()).map(([key, value]) => (
                <div key={key}>{key}: {value}</div>
              ))}
            </div>
          </details>
          <div style={{ marginTop: "15px" }}>
            <p>Please ensure your <code>.env</code> file exists and contains the required variables.</p>
          </div>
        </div>
      </Container>
    )
  }

  return (
    <Container>
      <h2>Create Question</h2>
      <Form onSubmit={handleSubmit}>
        {errors.general && (
          <div style={{
            backgroundColor: "#f8d7da",
            color: "#721c24",
            padding: "10px",
            borderRadius: "5px",
            margin: "10px 0",
            border: "1px solid #f5c6cb"
          }}>
            {errors.general}
          </div>
        )}

        {forum && (
          <InputForm
            id="forum"
            label="Forum"
            tooltipText="The forum where this question will be posted"
            placeholder="Forum"
            error={errors.forum}
            value={forum.name}
            disabled={true}
            setValue={() => { }}
          >
            <Buildings size={20} />
          </InputForm>
        )}
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
          label="Amount to Stake"
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

        <TagInput
          id="tags"
          label="Tags (Optional)"
          tooltipText="Add up to 5 tags to describe what your question is about. Press space to add a tag."
          placeholder="Type a tag and press space"
          error={errors.tags}
          tags={tags}
          setTags={setTags}
          validateForm={validateForm}
          maxTags={5}
        >
          <Tag size={20} />
        </TagInput>

        <div className="buttons">
          <NavLink to={`/forum/${forumName}`}>
            <Button variant="cancel" type="button">
              Discard
            </Button>
          </NavLink>
          <Button data-cy='publish-button' variant="publish" type="submit" disabled={isTransactionPending || scaledAmount.low === 0n || !contractReady}>
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