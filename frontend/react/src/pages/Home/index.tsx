import { Cards } from "./Cards";
import { HomeContainer } from "./style";
import { useState, useEffect } from "react";
import { SearchInput } from "../../components/SearchInput";
import { useContract } from "@hooks/useContract";
import { Forum } from "@app-types/index";
import { Link } from "react-router-dom";
import { LoadingSpinner } from "@components/LoadingSpinner";

export function Home() {
  const [forumsList, setForumsList] = useState<Forum[]>([]);
  const [filteredForums, setFilteredForums] = useState<Forum[]>([]);
  const [isOwner, setIsOwner] = useState(false);
  const {
    fetchForums,
    checkIsOwner,
    forumsLoading,
    forumsError,
    contractReady,
    isConnected,
    address
  } = useContract();

  // Fetch forums on mount
  useEffect(() => {
    if (contractReady) {
      const loadForums = async () => {
        const forums = await fetchForums();
        setForumsList(forums);
        setFilteredForums(forums);
      };
      loadForums();
    }
  }, [contractReady, fetchForums]);

  // Check if user is owner when address changes
  useEffect(() => {
    if (isConnected && address && contractReady) {
      const checkOwnership = async () => {
        const ownerResult = await checkIsOwner();
        setIsOwner(ownerResult);
      };
      checkOwnership();
    } else {
      setIsOwner(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isConnected, address, contractReady]);

  const handleSearch = (searchTerm: string) => {
    if (searchTerm === '') {
      setFilteredForums(forumsList);
      return;
    }

    const filtered = forumsList.filter(forum =>
      forum.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredForums(filtered);
  };

  const handleForumDeleted = (deletedForumId: string) => {
    // Remove the deleted forum from both lists
    setForumsList(prev => prev.filter(forum => forum.id !== deletedForumId));
    setFilteredForums(prev => prev.filter(forum => forum.id !== deletedForumId));
  };

  if (forumsLoading) {
    return (
      <HomeContainer>
        <h1>Fóruns</h1>
        <LoadingSpinner message={!contractReady ? "Initializing contract..." : "Loading forums..."} />
      </HomeContainer>
    );
  }

  if (forumsError) {
    return (
      <HomeContainer>
        <h1>Fóruns</h1>
        <div style={{ padding: "20px", textAlign: "center" }}>
          <p>Error loading forums: {forumsError}</p>
        </div>
      </HomeContainer>
    );
  }

  return (
    <HomeContainer>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px", width: "100%" }}>
        <h1>Fóruns</h1>
        {isOwner && (
          <Link to="/admin/create-forum">
            <button data-cy="create-forum" style={{
              padding: "10px 20px",
              backgroundColor: "#7c3aed",
              color: "white",
              border: "none",
              borderRadius: "5px",
              cursor: "pointer"
            }}>
              Create Forum
            </button>
          </Link>
        )}
      </div>
      {filteredForums.length > 6 && <SearchInput onSearch={handleSearch} />}
      <Cards
        forums={filteredForums}
        isOwner={isOwner}
        onForumDeleted={handleForumDeleted}
      />
    </HomeContainer>
  );
}
