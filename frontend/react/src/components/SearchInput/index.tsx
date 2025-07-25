import { useState, useEffect, useRef } from 'react';
import { MagnifyingGlass } from "phosphor-react";
import { Input, SearchInputContainer } from "./style";


interface SearchInputProps {
  onSearch: (searchTerm: string) => void;
}

export function  SearchInput({ onSearch }: SearchInputProps){
  const [searchTerm, setSearchTerm] = useState<string>('');
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, []);

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;
    setSearchTerm(value);

    if (value === '') {
      onSearch('');
    } else if (value.length >= 3) {
      onSearch(value);
    }
  };

  return (
    <SearchInputContainer>
      <MagnifyingGlass size={24} color="#b3b3b3" weight="fill" />
      <Input 
      data-cy="search-input"
      placeholder="Enter a term to search..."
      value={searchTerm}
      onChange={handleInputChange}
      ref={inputRef}
       />
    </SearchInputContainer>
  );
}