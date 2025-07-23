import { FacebookLogo, GithubLogo, InstagramLogo, LinkedinLogo, XLogo } from "@phosphor-icons/react";
import { SocialLink, SocialLinksContainer } from "./styles";

interface SocialLinksProps {
  socials: {
    provider: string;
    url: string;
  }[];
  name: string;
}

const SUPPORTED_SOCIALS = [
  "linkedin",
  "facebook",
  "instagram",
  "github",
  "x",
  "twitter",
];

export function SocialLinks({ socials, name }: SocialLinksProps) {
  return (
    <SocialLinksContainer>
      {socials
        .filter((social) =>
          SUPPORTED_SOCIALS.includes(social.provider.toLowerCase())
        )
        .map((social) => (
          <SocialLink
            key={social.url}
            href={social.url}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={`${name}'s ${social} profile`}
          >
            {social.provider === "linkedin" && <LinkedinLogo weight="fill" />}
            {social.provider === "facebook" && <FacebookLogo weight="fill" />}
            {social.provider === "instagram" && <InstagramLogo weight="fill" />}
            {social.provider === "github" && <GithubLogo weight="fill" />}
            {["x", "twitter"].includes(social.provider) && (
              <XLogo weight="fill" />
            )}
          </SocialLink>
        ))}
    </SocialLinksContainer>
  );
}