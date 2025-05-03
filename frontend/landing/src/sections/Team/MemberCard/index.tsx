import { MemberCardContainer, MemberDescription, MemberImage, MemberName, MemberRole } from "./styles";
import { SocialLinks } from "@components/SocialLinks";

export interface MemberCardProps {
  name: string;
  role: string;
  description: string;
  image: string;
  socials: {
    provider: string
    url: string
  }[];
}

export function MemberCard({ name, role, description, image, socials }: MemberCardProps) {
  return (
    <MemberCardContainer>
      <MemberImage src={image} alt={name} />
      <MemberName>{name}</MemberName>
      <MemberRole>{role}</MemberRole>
      <MemberDescription>{description}</MemberDescription>
      <SocialLinks socials={socials} name={name} />
    </MemberCardContainer>
  )
}