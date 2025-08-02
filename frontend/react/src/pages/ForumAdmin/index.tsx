import { useState, useEffect, useMemo } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useContract } from "@hooks/useContract";
import { useWallet } from "@hooks/useWallet";
import { useAccount } from "@starknet-react/core";
import { CircleNotch, Warning } from "phosphor-react";
import { Button, AlertMessage } from "./style";
import { InputForm } from "@components/InputForm";
import { FormContainer } from "@components/Form";
import { Forum } from "@app-types/index";



export function ForumAdmin() {

  const navigate = useNavigate();
  const params = useParams<{ forumId?: string }>();
  const forumId = params.forumId;
  const isEditMode = !!forumId;


  const [name, setName] = useState("");
  const [iconUrl, setIconUrl] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [isOwner, setIsOwner] = useState(false);
  const [ownershipChecked, setOwnershipChecked] = useState(false);
  const [imageError, setImageError] = useState(false)
  const [imageLoaded, setImageLoaded] = useState(false)
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [forum, setForum] = useState<Forum | null>(null);

  const { isConnected } = useAccount();
  const { openConnectModal } = useWallet();
  const {
    createForum,
    checkIsOwner,
    forumsLoading,
    forumsError,
    contractReady,
    address,
    updateForum,
    fetchForum,
  } = useContract();

  const iconPreview = useMemo(() => {
    if (!iconUrl.trim()) return null

    // Add a timestamp to prevent caching issues
    const urlWithTimestamp = iconUrl.includes("?") ? `${iconUrl}&t=${Date.now()}` : `${iconUrl}?t=${Date.now()}`

    return urlWithTimestamp
  }, [iconUrl]) // This will properly update when iconUrl changes

  // Reset image states when URL changes
  useEffect(() => {
    setImageError(false)
    setImageLoaded(false)
  }, [iconUrl])

  // Check ownership when component mounts or address changes
  useEffect(() => {
    if (isConnected && address && contractReady) {
      const checkOwnership = async () => {
        const ownerResult = await checkIsOwner();
        setIsOwner(ownerResult);
        setOwnershipChecked(true);

        if (!ownerResult) {
          setError("Access denied: Only the contract owner can create forums");
        }
      };
      checkOwnership();
    } else if (!isConnected) {
      setIsOwner(false);
      setOwnershipChecked(true);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isConnected, address, contractReady]);

  // Load forum data if in edit mode
  useEffect(() => {
    if (isEditMode && contractReady && isOwner) {
      const loadForum = async () => {
        try {
          const forumData = await fetchForum(forumId);
          if (forumData) {
            setForum(forumData);
            setName(forumData.name);
            setIconUrl(forumData.icon_url);
          } else {
            setError("Forum not found");
          }
        } catch (error) {
          console.error("Error loading forum:", error);
          setError("Failed to load forum data");
        }
      };
      loadForum();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isEditMode, forumId, contractReady, isOwner]);

  const validateForm = () => {
    const newErrors: Record<string, string> = {}
    if (!name.trim()) newErrors.name = "Name is required"
    else if (name.length < 3) newErrors.name = "Name should be at least 3 characters"
    if (!iconUrl.trim()) newErrors.iconUrl = "Icon URL is required"
    else if (!iconUrl.startsWith('http')) newErrors.iconUrl = "Icon URL must be a valid URL"
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }


  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    if (!isConnected) {
      openConnectModal();
      return;
    }

    if (!isOwner) {
      setError("Access denied: Only the contract owner can create forums");
      return;
    }

    if (!name.trim()) {
      setError("Forum name is required");
      return;
    }

    if (!validateForm()) return

    if (imageError) {
      setError("Please provide a valid image URL")
      return
    }

    setIsLoading(true);

    try {
      const transactionHash = isEditMode ? await updateForum(forumId, name, iconUrl) : await createForum(name, iconUrl);

      if (transactionHash) {
        setSuccess(`Forum ${isEditMode ? 'updated' : 'created'} successfully! Transaction: ${transactionHash}`);
        // Clear form
        if (!isEditMode) {
          setName("");
          setIconUrl("");
        }

        // Redirect to home after 3 seconds
        setTimeout(() => {
          navigate("/");
        }, 3000);
      } else {
        setError(`Failed to ${isEditMode ? 'update' : 'create'} forum. Please try again.`);
      }
    } catch (error) {
      console.error(`Error ${isEditMode ? 'updating' : 'creating'} forum:`, error);
      setError(`Failed to ${isEditMode ? 'update' : 'create'} forum. Please try again.`);
    } finally {
      setIsLoading(false);
    }
  };

  const handleImageLoad = () => {
    setImageError(false)
    setImageLoaded(true)
  }

  const handleImageError = () => {
    setImageError(true)
    setImageLoaded(false)
  }

  if (!ownershipChecked) {
    return (
      <div style={{ padding: "20px", textAlign: "center" }}>
        <p>Checking permissions...</p>
      </div>
    );
  }

  if (!isConnected) {
    return (
      <div style={{ padding: "20px", textAlign: "center" }}>
        <h1>{isEditMode ? "Update Forum" : "Create Forum"}</h1>
        <p>Please connect your wallet to {isEditMode ? "update" : "create"} a forum</p>
      </div>
    );
  }

  if (!isOwner) {
    return (
      <div style={{ padding: "20px", textAlign: "center" }}>
        <h1>Access Denied</h1>
        <p>Only the contract owner can {isEditMode ? "update" : "create"} forums</p>
        <button
          onClick={() => navigate("/")}
          style={{
            padding: "10px 20px",
            backgroundColor: "#6c757d",
            color: "white",
            border: "none",
            borderRadius: "5px",
            cursor: "pointer",
            marginTop: "10px"
          }}
        >
          Go Back to Home
        </button>
      </div>
    );
  }

  return (
    <div style={{ padding: "20px", maxWidth: "600px", margin: "0 auto" }}>
      <h1 style={{ marginBottom: "20px" }}>{isEditMode ? "Edit Forum" : "Create New Forum"}</h1>
      {isEditMode && forum && (
        <div style={{ marginBottom: "20px" }}>
          <p><strong>Current Questions:</strong> {forum.total_questions}</p>
          <p><strong>Total Amount:</strong> ${forum.amount}</p>
        </div>
      )}
      <FormContainer onSubmit={handleSubmit}>
        <InputForm data-cy="InputForm-name"
          id="name"
          label="Name"
          tooltipText="The name of the forum"
          placeholder="Enter forum name (e.g., ReactJS, Python, etc.)"
          error={errors.name}
          value={name}
          validateForm={validateForm}
          setValue={setName}
          maxLength={20}
        />

        <InputForm data-cy="InputForm-icon-url"
          id="iconUrl"
          label="Icon URL"
          tooltipText="The URL of the forum icon"
          placeholder="Enter icon URL (e.g., https://example.com/icon.png)"
          error={errors.iconUrl}
          value={iconUrl}
          validateForm={validateForm}
          setValue={setIconUrl}
        />

        {iconPreview && (
          <div style={{ marginBottom: "20px" }}>
            <span style={{ display: "block", marginBottom: "5px", fontWeight: "bold" }}>Icon Preview:</span>
            <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
              <div style={{ position: "relative" }}>
                <img
                  key={iconPreview} // Force re-render when URL changes
                  src={iconPreview || "/placeholder.svg"}
                  alt="Forum icon preview"
                  style={{ display: imageError ? "none" : "block", width: "50px", height: "50px", objectFit: "cover", borderRadius: "5px" }}
                  onLoad={handleImageLoad}
                  onError={handleImageError}
                />
                {!imageLoaded && !imageError && (
                  <div style={{ width: "50px", height: "50px", display: "flex", alignItems: "center", justifyContent: "center", backgroundColor: "#f0f0f0" }}>
                    <CircleNotch size={24} />
                  </div>
                )}
                {imageError && (
                  <div style={{ width: "50px", height: "50px", display: "flex", alignItems: "center", justifyContent: "center", backgroundColor: "#f0f0f0" }}>
                    <Warning size={24} style={{ color: "#721c24" }} />
                  </div>
                )}
              </div>
              {imageError && <span style={{ fontSize: "13px", color: "#721c24" }}>
                Failed to load image
              </span>}
            </div>
          </div>
        )}

        <div className="buttons">
          <Button variant="cancel" type="button"
            onClick={() => navigate("/")}>
            Cancel
          </Button>
          <Button data-cy="create-forum-button" variant="create" type="submit" disabled={isLoading || forumsLoading}>
            {isLoading ? `${isEditMode ? 'Updating' : 'Creating'} Forum...` : `${isEditMode ? 'Update' : 'Create'} Forum`}
          </Button>
        </div>
      </FormContainer>

      {error && (
        <AlertMessage variant="error">
          {error}
        </AlertMessage>
      )}

      {success && (
        <AlertMessage variant="success">
          {success}
        </AlertMessage>
      )}

      {forumsError && (
        <AlertMessage variant="error">
          Forum creation error: {forumsError}
        </AlertMessage>
      )}
    </div>
  );
} 