import Trans from 'components/Trans'
import styled from 'styled-components'
import { Link } from '@pancakeswap/uikit'

const InlineLink = styled(Link)`
  display: inline;
`

const config = [
  {
    title: <Trans>What are Leviathans ?</Trans>,
    description: [
      <Trans>
        The concept of Leviathans presents an ambitious and innovative approach to addressing various aspects of human
        life and society. This model envisions decentralized communities working together to provide essential utilities
        and resources to their members and ultimately to a global population. Here's an overview of the key components
        and principles:
      </Trans>,
      <br></br>,
      <>
        <InlineLink ml="4px">
          <Trans>Leviathans as Mission-Driven Communities: </Trans>
        </InlineLink>
        <Trans>
          Leviathans are communities united by a shared mission, pooling resources to advance that mission. Each
          Leviathan focuses on a specific utility, such as housing, food, energy, transportation, etc.
        </Trans>
      </>,
      <br></br>,
      <>
        <InlineLink ml="4px">
          <Trans>Eleven Leviathans, Eleven Utilities: </Trans>
        </InlineLink>
        <Trans>
          There are in total 11 Leviathans, one for each of the following utilities: housing, food, beverage, security,
          healthcare, energy, telecommunication & internet, transportation, apparels & cosmetics, entertainment &
          culture and finally mining.
        </Trans>
      </>,
      <br></br>,
      <>
        <InlineLink ml="4px">
          <Trans>Goal of Universal Access: </Trans>
        </InlineLink>
        <Trans>
          The overarching goal of each Leviathan is to develop processes and systems that make the associated utility
          accessible to every human being on Earth, beginning with its own members. This aims to create a more equitable
          and inclusive world where basic needs are met.
        </Trans>
      </>,
      <br></br>,
      <>
        <InlineLink ml="4px">
          <Trans>Free Tokens: </Trans>
        </InlineLink>
        <Trans>
          Each Leviathan has an associated token, referred to as a "free token." These tokens serve as a form of value
          exchange within the community, facilitating access to utilities and resources.
        </Trans>
      </>,
      <br></br>,
      <>
        <InlineLink ml="4px">
          <Trans>Leviats and Leviathanism: </Trans>
        </InlineLink>
        <Trans>
          Members of all 11 Leviathans are known as Leviats. To maintain the collaborative and mission-focused nature of
          the communities, Leviats adhere to a set of rules and principles known as Leviathanism. These principles
          likely guide behaviors and actions in line with the community's objectives.
        </Trans>
      </>,
      <br></br>,
      <>
        <InlineLink ml="4px">
          <Trans>Governance through Voting: </Trans>
        </InlineLink>
        <Trans>
          Leviathans operate under a democratic governance model where decisions are made through votes. These votes
          take place within{' '}
        </Trans>
        <InlineLink ml="4px" external href="/valuepools">
          <Trans>the valuepools </Trans>
        </InlineLink>
        <Trans>
          {' '}
          of each Leviathan. This allows members to have a say in shaping the direction and priorities of their
          respective communities.
        </Trans>
      </>,
      <br></br>,
      <>
        <InlineLink ml="4px">
          <Trans>Creating a Global Network: </Trans>
        </InlineLink>
        <Trans>
          Collectively, the Leviathans form a network that aims to address a wide array of human needs. Each Leviathan
          contributes its expertise to the larger vision of a global community, combining efforts to create a better
          world for all.
        </Trans>
      </>,
      <br></br>,
      <>
        <InlineLink ml="4px">
          <Trans>Societal Impact: </Trans>
        </InlineLink>
        <Trans>
          The Leviathan model has the potential to revolutionize traditional systems by redistributing resources,
          providing essential utilities, and empowering individuals through collaborative decision-making.
        </Trans>
      </>,
      <br></br>,
      <Trans>
        In summary, the Leviathans and valuepools model presents a complex and forward-thinking approach to building
        interconnected communities that focus on providing essential utilities for their members and beyond. The
        program's success would rely on collaboration, shared values, and a commitment to the betterment of human
        society as a whole.
      </Trans>,
    ],
  },
]
export default config
