import { CircleWavyCheck } from "@phosphor-icons/react"
import { CollaboratorsContainer, CollaboratorsItens, CollaboratorItem, CollaboratorImage } from "./styles"
import { SocialLinks } from "@components/SocialLinks"
import { useEffect, useState } from "react"
import { Collaborator, getContributors, getUserInfo, getUserSocialAccounts } from "@api/github"

export function Collaborators({ ...props }) {
  const [collaborators, setCollaborators] = useState<Collaborator[]>([])

  const fetchCollaboratorsInfo = async () => {
    const contributors = await getContributors()
    const filteredContributors = contributors.filter(contributor => contributor.login !== 'MullerEsposito' && contributor.login !== 'Arnaelcio')
    const collaboratorsInfo = await Promise.all(
      filteredContributors.map(async (contributor) => {
        const userInfo = await getUserInfo(contributor.login!)
        return {
          id: userInfo.id,
          name: userInfo.name ?? userInfo.login,
          avatar: userInfo.avatar_url,
          socials: [
            { provider: 'github', url: userInfo.html_url },
            ...await getUserSocialAccounts(contributor.login!)
          ],
        }
      })
    )

    setCollaborators(collaboratorsInfo)
  }
  
  useEffect(() => {
    fetchCollaboratorsInfo()
  }, []);
    
  return (<>
    <CollaboratorsContainer {...props}>
      <h2>Collaborators</h2>
      <CollaboratorsItens>
        {collaborators.map(collaborator => (
          <CollaboratorItem key={collaborator.id}>
            {collaborator.avatar 
              ? <CollaboratorImage src={collaborator.avatar} alt={collaborator.name} /> 
              : <CircleWavyCheck size={24} weight="fill" />} 
            <span>{collaborator.name}</span>
            <SocialLinks socials={collaborator.socials} name={collaborator.name} />
          </CollaboratorItem>
        ))}
      </CollaboratorsItens>
    </CollaboratorsContainer>
  </>
  )
}
