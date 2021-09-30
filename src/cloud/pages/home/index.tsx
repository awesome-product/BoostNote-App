import React, { useMemo, useState } from 'react'
import { getSettingsPageData } from '../../api/pages/settings'
import { GetInitialPropsParameters } from '../../interfaces/pages'
import { useGlobalData } from '../../lib/stores/globalData'
import SidebarSpaces from '../../../design/components/organisms/Sidebar/molecules/SidebarSpaces'
import { osName } from '../../../design/lib/platform'
import { buildIconUrl } from '../../api/files'
import { useRouter } from '../../lib/router'
import Button from '../../../design/components/atoms/Button'

const HomePage = () => {
  const {
    globalData: { currentUser, teams },
  } = useGlobalData()
  // const { globalData } = useGlobalData()
  const havingTeam = teams.length > 0
  const { push } = useRouter()
  const [showSpaces, setShowSpaces] = useState(false)
  const [activeBoostHubTeamDomain, setActiveBoostHubTeamDomain] = useState(
    havingTeam ? teams[0].domain : ''
  )
  console.log('Teams', teams, currentUser)

  const spaces = useMemo(() => {
    return teams.map((team, index) => {
      return {
        label: team.name,
        icon: team.icon != null ? buildIconUrl(team.icon.location) : undefined,
        active: activeBoostHubTeamDomain === team.domain,
        tooltip: `${osName === 'macos' ? '⌘' : 'Ctrl'} ${index + 1}`,
        linkProps: {
          onClick: (event: any) => {
            event.preventDefault()
            push(`/app/boosthub/teams/${team.domain}`)
          },
        },
      }
    })
  }, [activeBoostHubTeamDomain, push, teams])

  // we need to auth and render sign in in webview (see how implemented otherwise)
  // probably we need auth before going to sign in page or similar...
  if (currentUser && havingTeam) {
    return (
      <>
        <SidebarSpaces
          className='sidebar__spaces'
          spaces={spaces}
          spaceBottomRows={[]}
          onSpacesBlur={() => setShowSpaces(false)}
        />
        <Button variant={'secondary'} onClick={() => push('/cooperate')}>
          Create space
        </Button>
      </>
    )
    // return <div>User {currentUser.displayName}</div>
  }
  return (
    <div title={'Welcome to Boost Note'}>
      <div>Welcome to Boost Note</div>
      <li className='nav-list__item d-none d-lg-block'>
        <>
          <li className='mobile-popup__list__item'>
            <Button
              variant='secondary'
              onClick={(event) => {
                event.preventDefault()
                push('/signup')
              }}
            >
              Sign Up
            </Button>
          </li>
          <li className='mobile-popup__list__item'>
            <Button
              variant='secondary'
              onClick={(event) => {
                event.preventDefault()
                push('/signin')
              }}
            >
              Sign In
            </Button>
          </li>
        </>
      </li>
    </div>
  )
}

HomePage.getInitialProps = async (params: GetInitialPropsParameters) => {
  const result = await getSettingsPageData(params)
  return result
}

export default HomePage
