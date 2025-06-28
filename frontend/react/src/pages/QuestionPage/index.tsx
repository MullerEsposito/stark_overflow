"use client"

import type React from "react";
import { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useAccount } from "@starknet-react/core";
import { PaperPlaneRight, Link as LinkIcon, Tag, CurrencyDollar } from "phosphor-react";
import { useWallet } from "@hooks/useWallet";
import { Container, Form, Button, TransactionStatus } from "./style";
import { InputForm } from "./InputForm";
import { EditorForm } from "./EditorForm";

export function QuestionPage() {
  const { t } = useTranslation('question');
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [amount, setAmount] = useState("");
  const [repository, setRepository] = useState("");
  const [tags, setTags] = useState("");
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [transactionStatus, setTransactionStatus] = useState<"idle" | "processing" | "success" | "error">("idle");
  const navigate = useNavigate();
  const { isConnected } = useAccount();
  const { openConnectModal } = useWallet();

  
  // Form validation
  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    if (!title.trim()) newErrors.title = t('errorTitleRequired');
    else if (title.length < 10) newErrors.title = t('errorTitleLength');
    if (!description.trim()) newErrors.description = t('errorDescriptionRequired');
    else if (description.length < 30) newErrors.description = t('errorDescriptionLength');
    if (!amount.trim()) newErrors.amount = t('errorAmountRequired');
    else if (isNaN(Number(amount)) || Number(amount) <= 0) newErrors.amount = t('errorAmountPositive');
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;
    if (!isConnected) {
      openConnectModal();
      return;
    }
    try {
      setTransactionStatus("processing");

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
      <h2>{t('title')}</h2>
      <Form onSubmit={handleSubmit}>
        <InputForm
          id="title"
          label={t('formTitle')}
          tooltipText={t('formTitleTooltip')}
          error={errors.title}
          value={title}
          setValue={setTitle}
          validateForm={validateForm}
        />
        <InputForm
          id="amount"
          label={t('formAmount')}
          tooltipText={t('formAmountTooltip')}
          placeholder={t('formAmountPlaceholder')}
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
        <InputForm
          id="repository"
          label={t('formRepo')}
          tooltipText={t('formRepoTooltip')}
          placeholder={t('formRepoPlaceholder')}
          error={errors.repository}
          value={repository}
          setValue={setRepository}
          validateForm={validateForm}
        >
          <LinkIcon size={20} />
        </InputForm>
        <InputForm
          id="tags"
          label={t('formTags')}
          tooltipText={t('formTagsTooltip')}
          placeholder={t('formTagsPlaceholder')}
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
              {t('buttonDiscard')}
            </Button>
          </NavLink>
          <Button variant="publish" type="submit" disabled={transactionStatus === "processing"}>
            {transactionStatus === "processing" ? t('buttonPublishing') : t('buttonPublish')}
            {transactionStatus !== "processing" && <PaperPlaneRight size={20} />}
          </Button>
        </div>
        {transactionStatus !== "idle" && (
          <TransactionStatus status={transactionStatus}>
            {transactionStatus === "processing" && t('statusProcessing')}
            {transactionStatus === "success" && t('statusSuccess')}
            {transactionStatus === "error" && t('statusError')}
          </TransactionStatus>
        )}
      </Form>
    </Container>
  );
}
