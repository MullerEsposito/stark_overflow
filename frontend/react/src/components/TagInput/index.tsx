import React, { useState, KeyboardEvent } from "react";
import { X } from "phosphor-react";
import { TagInputGroupContainer, TagInputContainer, TagChip, TagsContainer, Input, RemoveButton } from "./style.ts";
import { Label } from "@components/Label";

interface TagInputProps {
  id: string;
  label: string;
  tooltipText?: string;
  placeholder?: string;
  error?: string | null;
  tags: string[];
  setTags: (tags: string[]) => void;
  validateForm?: () => void;
  maxTags?: number;
  children?: React.ReactElement;
}

export function TagInput({
  id,
  label,
  tooltipText,
  placeholder = "Type a tag and press space",
  error,
  tags,
  setTags,
  validateForm,
  maxTags = 5,
  children
}: TagInputProps) {
  const [inputValue, setInputValue] = useState("");

  const addTag = (tag: string) => {
    const trimmedTag = tag.trim();
    if (trimmedTag && !tags.includes(trimmedTag) && tags.length < maxTags) {
      setTags([...tags, trimmedTag]);
      setInputValue("");
      if (validateForm) validateForm();
    }
  };

  const removeTag = (indexToRemove: number) => {
    setTags(tags.filter((_, index) => index !== indexToRemove));
    if (validateForm) validateForm();
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === " " || e.key === "Enter") {
      e.preventDefault();
      addTag(inputValue);
    } else if (e.key === "Backspace" && inputValue === "" && tags.length > 0) {
      removeTag(tags.length - 1);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    // Prevent adding spaces directly, use them to trigger tag addition
    if (value.endsWith(" ")) {
      addTag(value);
    } else {
      setInputValue(value);
    }
  };

  return (
    <TagInputGroupContainer>
      <Label
        inputId={id}
        inputValue={tags.join(", ")}
        labelText={label}
        tooltipText={tooltipText}
        error={error}
      />
      <TagInputContainer $hasError={!!error}>
        {children}
        <TagsContainer data-testid="tags-container">
          {tags.map((tag, index) => (
            <TagChip key={index}>
              {tag}
              <RemoveButton
                onClick={() => removeTag(index)}
                type="button"
                aria-label={`Remove ${tag} tag`}
              >
                <X size={12} />
              </RemoveButton>
            </TagChip>
          ))}
          <Input
            id={id}
            type="text"
            placeholder={tags.length >= maxTags ? `Max ${maxTags} tags` : placeholder}
            value={inputValue}
            onChange={handleInputChange}
            onKeyDown={handleKeyDown}
            disabled={tags.length >= maxTags}
          />
        </TagsContainer>
      </TagInputContainer>
      {error && <div style={{ color: "#dc3545", fontSize: "0.875rem", marginTop: "5px" }}>{error}</div>}
      {tags.length > 0 && (
        <div style={{ fontSize: "0.75rem", color: "#6c757d", marginTop: "5px" }}>
          {tags.length}/{maxTags} tags
        </div>
      )}
    </TagInputGroupContainer>
  );
} 