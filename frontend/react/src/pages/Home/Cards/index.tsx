import { NavLink } from "react-router-dom";
import { Card, CardsContainer } from "./style";
import { ChatCircleDots, CurrencyDollar, PencilSimple, Trash } from "phosphor-react";
import { Forum } from "@app-types/index";
import { useContract } from "@hooks/useContract";
import { useState } from "react";

interface CardsProps {
  forums: Forum[];
  isOwner: boolean;
  onForumDeleted: (forumId: string) => void;
}

export function Cards({ forums, isOwner, onForumDeleted }: CardsProps) {
  const [deletingForum, setDeletingForum] = useState<string | null>(null);
  const { deleteForum } = useContract();

  const handleDeleteForum = async (e: React.MouseEvent, forumId: string, forumName: string) => {
    e.preventDefault(); // Prevent navigation
    e.stopPropagation();

    if (!confirm(`Are you sure you want to delete the "${forumName}" forum? This action cannot be undone.`)) {
      return;
    }

    setDeletingForum(forumId);
    try {
      const result = await deleteForum(forumId);
      if (result) {
        onForumDeleted(forumId);
      }
    } catch (error) {
      console.error("Error deleting forum:", error);
      alert("Failed to delete forum. Please try again.");
    } finally {
      setDeletingForum(null);
    }
  };

  return (
    <CardsContainer>
        {forums.map((forum, index) => (
          <NavLink to={`/forum/${forum.path}`} key={index}>
      {forums.map((forum) => (
        <div key={forum.id} style={{ position: "relative" }}>
          <NavLink to={`/forum/${forum.id}`}>
            <Card>
              <img src={forum.icon_url} alt={forum.name} />
              <section>
                <small>FÓRUM</small>
                <strong>{forum.name}</strong>
                <div>
                  <span>
                    <ChatCircleDots size={18} /> {forum.total_questions}
                    <CurrencyDollar size={18} weight="bold" color="green" /> ${forum.amount}
                  </span>
                </div>
              </section>
            </Card>
          </NavLink>

          {isOwner && (
            <div style={{
              position: "absolute",
              top: "10px",
              right: "10px",
              display: "flex",
              gap: "5px",
              zIndex: 10
            }}>
              <NavLink
                to={`/admin/edit-forum/${forum.id}`}
                onClick={(e) => e.stopPropagation()}
                style={{ textDecoration: "none" }}
              >
                <button
                  style={{
                    background: "#7c3aed",
                    border: "none",
                    borderRadius: "4px",
                    padding: "6px",
                    color: "white",
                    cursor: "pointer",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center"
                  }}
                  title="Edit Forum"
                >
                  <PencilSimple size={14} />
                </button>
              </NavLink>

              <button
                onClick={(e) => handleDeleteForum(e, forum.id, forum.name)}
                disabled={deletingForum === forum.id}
                style={{
                  background: deletingForum === forum.id ? "#6c757d" : "#dc3545",
                  border: "none",
                  borderRadius: "4px",
                  padding: "6px",
                  color: "white",
                  cursor: deletingForum === forum.id ? "not-allowed" : "pointer",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center"
                }}
                title="Delete Forum"
              >
                <Trash size={14} />
              </button>
            </div>
          )}
        </div>
      ))}
    </CardsContainer>
  )
}