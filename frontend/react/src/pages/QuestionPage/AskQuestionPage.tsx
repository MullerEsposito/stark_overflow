import React, { useState, FormEvent, useEffect } from "react";
import { useStarknet } from "../../hooks/useStatusMessage/useStarknet";
import "../../styles/question.css";
import {
  Contract,
  num,
  shortString,
  selector,
  BigNumberish,
  GetTransactionReceiptResponse
} from "starknet";

import {
  STARK_OVERFLOW_CONTRACT_ADDRESS,
  STARK_OVERFLOW_ABI,
} from "../../hooks/useStatusMessage/constants";

const stringToCairoByteArray = (str: string) => {
  return shortString.splitLongString(str);
};

const decodeByteArrayToString = (arr: string[]) => {
  return arr.map(shortString.decodeShortString).join("");
};

const AskQuestionPage: React.FC = () => {
  const { account, isConnected, connectWallet } = useStarknet();
  const [questionText, setQuestionText] = useState<string>("");
  const [stakeValue, setStakeValue] = useState<string>("");
  const [originalQuestionText, setOriginalQuestionText] = useState<string>("");
  const [originalStakeValue, setOriginalStakeValue] =
    useState<BigNumberish>("0");

  const [transactionState, setTransactionState] = useState<
    "idle" | "connecting" | "pending" | "verifying" | "success" | "error"
  >("idle");
  const [transactionHash, setTransactionHash] = useState<string | null>(null);
  const [questionId, setQuestionId] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [verificationStatus, setVerificationStatus] = useState<string | null>(
    null
  );

  const contract =
    STARK_OVERFLOW_CONTRACT_ADDRESS && STARK_OVERFLOW_ABI && account
      ? new Contract(
          STARK_OVERFLOW_ABI,
          STARK_OVERFLOW_CONTRACT_ADDRESS,
          account
        )
      : null;

  type Question = {
    description: string[]; // adjust based on your actual data
    value: string;
    // add other properties if any
  };
  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    setErrorMessage(null);
    setTransactionHash(null);
    setQuestionId(null);
    setVerificationStatus(null);

    if (!isConnected || !account || !contract) {
      setErrorMessage("Please connect your wallet first.");
      setTransactionState("connecting");
      connectWallet();
      return;
    }

    if (!questionText.trim()) {
      setErrorMessage("Question text cannot be empty.");
      return;
    }

    let valueU256: BigNumberish;
    try {
      const parsedValue = BigInt(stakeValue || "0");
      if (parsedValue < 0n) {
        setErrorMessage("Stake value cannot be negative.");
        return;
      }
      valueU256 = parsedValue.toString();
    } catch (_e) {
      console.error(_e);
      setErrorMessage("Invalid stake value. Please enter a valid number.");
      return;
    }

    setTransactionState("pending");
    setOriginalQuestionText(questionText);
    setOriginalStakeValue(valueU256);

    try {
      const descriptionByteArray = stringToCairoByteArray(questionText);
      const tx = await contract.ask_question(descriptionByteArray, valueU256);
      setTransactionHash(tx.transaction_hash);

     alert(`Transaction Sent!\nHash: ${tx.transaction_hash.substring(0, 10)}...`);


      setTransactionState("verifying");
      const receipt: GetTransactionReceiptResponse = await account.waitForTransaction(tx.transaction_hash);


     let questionCreatedEvent = undefined;

if ("events" in receipt && Array.isArray(receipt.events)) {
  questionCreatedEvent = receipt.events.find(
    (e) => e.keys[0] === selector.getSelectorFromName("QuestionCreated")
  );
}

      let retrievedQuestionId: string | null = null;
      if (questionCreatedEvent && questionCreatedEvent.data) {
        retrievedQuestionId = questionCreatedEvent.data[0];
        setQuestionId(retrievedQuestionId);
      } else {
        console.warn("Could not find 'QuestionCreated' event.");
        retrievedQuestionId = "0x" + Date.now().toString(16);
        setQuestionId(retrievedQuestionId);
      }

      if (retrievedQuestionId) {
        setVerificationStatus("Verifying question on chain...");
        try {
          if (!contract)
            throw new Error("Contract not initialized for verification.");
          const retrievedQuestion: Question = await contract.get_question(
            retrievedQuestionId
          );
          const retrievedDescriptionString = decodeByteArrayToString(
            retrievedQuestion.description
          );
          const retrievedValueString = num
            .toBigInt(retrievedQuestion.value)
            .toString();

          if (
            retrievedDescriptionString === originalQuestionText &&
            retrievedValueString === originalStakeValue
          ) {
            setVerificationStatus("Question successfully verified on chain!");
            setTransactionState("success");
           
            setQuestionText("");
            setStakeValue("");
          } else {
            setVerificationStatus("Verification failed: Data mismatch!");
            setErrorMessage("Data on chain does not match submitted data.");
            setTransactionState("error");
          }
        } catch (verifyErr: unknown) {
          let errorMessage = "Verification failed!";

          if (
            verifyErr &&
            typeof verifyErr === "object" &&
            "message" in verifyErr
          ) {
            errorMessage = (verifyErr as { message: string }).message;
          }

          setVerificationStatus(
            "Verification failed: Could not retrieve question from contract."
          );
          setErrorMessage(errorMessage);
          setTransactionState("error");
        }
      } else {
        setVerificationStatus("Verification skipped: No QuestionId retrieved.");
        setErrorMessage("Could not retrieve QuestionId to verify.");
        setTransactionState("error");
      }
    } catch (err: unknown) {
      let errorMessage = "Failed to submit transaction.";

      if (err && typeof err === "object" && "message" in err) {
        errorMessage = (err as { message: string }).message;
      }

      setErrorMessage(errorMessage);
      setTransactionState("error");
     alert(`Transaction Failed!\n\n${errorMessage}`);
    }
  };

  useEffect(() => {
    if (errorMessage && (questionText.length > 0 || stakeValue.length > 0)) {
      setErrorMessage(null);
    }
  }, [questionText, stakeValue]);

 return(
  <form className="form-container" onSubmit={handleSubmit}>
  <h2 className="form-heading">Ask a New Question</h2>

  {!isConnected && (
    <div className="alert warning">
      <span>Please connect your StarkNet wallet to ask a question.</span>
      <button
        type="button"
        className="btn-small"
        onClick={connectWallet}
        disabled={transactionState === "connecting"}
      >
        {transactionState === "connecting" ? "Connecting..." : "Connect Wallet"}
      </button>
    </div>
  )}

  {errorMessage && (
    <div className="alert error">
      <span>{errorMessage}</span>
      <button
        type="button"
        className="close-btn"
        onClick={() => setErrorMessage(null)}
      >
        ×
      </button>
    </div>
  )}

  <label htmlFor="questionText">Your Question</label>
  <textarea
    id="questionText"
    placeholder="Type your question here..."
    value={questionText}
    onChange={(e) => setQuestionText(e.target.value)}
    rows={5}
    disabled={transactionState !== "idle" && transactionState !== "error"}
  />

  <label htmlFor="stakeValue">Value / Stake (in wei)</label>
  <input
    type="number"
    id="stakeValue"
    placeholder="e.g., 1000000000000000000"
    value={stakeValue}
    onChange={(e) => setStakeValue(e.target.value)}
    disabled={transactionState !== "idle" && transactionState !== "error"}
  />
  <small>This value is in wei (smallest Ether unit).</small>

  <button
    type="submit"
    className="btn-primary"
    disabled={
      !isConnected || ["pending", "verifying"].includes(transactionState)
    }
  >
    {transactionState === "connecting"
      ? "Connecting Wallet..."
      : transactionState === "pending"
      ? "Submitting Transaction..."
      : transactionState === "verifying"
      ? "Verifying..."
      : "Ask Question"}
  </button>

  {transactionHash && (
    <div className="transaction-info">
      <strong>Transaction Status:</strong>
      <p>
        Hash:{" "}
        <a
          href={`https://sepolia.starkscan.co/tx/${transactionHash}`}
          target="_blank"
          rel="noopener noreferrer"
        >
          {`${transactionHash.substring(0, 10)}...${transactionHash.slice(-4)}`}
        </a>
      </p>
      {verificationStatus && <p>{verificationStatus}</p>}
    </div>
  )}
</form>

 )
};

export default AskQuestionPage;
