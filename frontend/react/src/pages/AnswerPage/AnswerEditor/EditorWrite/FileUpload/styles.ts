import styled from "styled-components";

export const FileUploadContainer = styled.div`
`

export const UploadProgress = styled.div<{ value: number }>`
  width: 100%;
  height: 4px;
  background: ${({ theme }) => theme.borderColor};
  border-radius: 4px;
  margin: 16px 0;
  position: relative;
  overflow: hidden;

  > div {
    position: absolute;
    height: 100%;
    background: #7c3aed;
    border-radius: 4px;
    transition: width 0.3s ease-out;
  }

  > span {
    position: absolute;
    top: 8px;
    left: 0;
    width: 100%;
    text-align: center;
    font-size: 0.8rem;
    color: ${({ theme }) => theme.textSecondary};
  }
`

export const FileUploadArea = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 16px;
  border: 2px dashed ${({ theme }) => theme.borderColor};
  border-radius: 4px;
  cursor: pointer;
  margin: 8px 0;
  transition: all 0.2s;

  &:hover {
    background: ${({ theme }) => theme.background};
    border-color: #7c3aed;
  }

  p {
    margin-top: 8px;
    color: ${({ theme }) => theme.textSecondary};
    font-size: 0.9rem;
  }
`

export const UploadedImage = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
`

export const UploadedFilePreview = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
  margin: 16px 0;

  > div {
    position: relative;
    width: 80px;
    height: 80px;
    border-radius: 4px;
    overflow: hidden;
  }
`

export const RemoveFileButton = styled.button`
  position: absolute;
  top: 4px;
  right: 4px;
  width: 20px;
  height: 20px;
  border-radius: 50%;
  background: rgba(0, 0, 0, 0.5);
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  border: none;
  cursor: pointer;
  transition: background 0.2s;

  &:hover {
    background: rgba(0, 0, 0, 0.8);
  }
`