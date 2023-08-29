import Trans from 'components/Trans'
import styled from 'styled-components'
import { Link } from '@pancakeswap/uikit'

const InlineLink = styled(Link)`
  display: inline;
`

const config = [
  {
    title: <Trans>What are Future Collaterals ?</Trans>,
    description: [
      <Trans>
        The concept of "Future Collaterals" introduces an innovative mechanism to enhance borrowing capabilities while
        maintaining a layer of security for lenders. By using a predefined table of values and collateral pricing, this
        approach offers affordable rates for borrowers while ensuring lenders have a safeguard in place. Here's an
        overview of the key features and benefits of Future Collaterals:
      </Trans>,
      <br></br>,
      <>
        <InlineLink ml="4px">
          <Trans>Enhanced Borrowing Capacity: </Trans>
        </InlineLink>
        <Trans>
          Future Collaterals allow users to access loans even if they don't currently possess the full collateral value.
          This feature expands borrowing opportunities, especially for those who lack immediate high-value assets.
        </Trans>
      </>,
      <br></br>,
      <>
        <InlineLink ml="4px">
          <Trans>Collateral Value Appreciation: </Trans>
        </InlineLink>
        <Trans>
          The value of the collateral increases over time according to the table of values. This appreciation aligns
          with the loan duration, allowing borrowers to secure loans with assets that will appreciate in value by the
          time repayment is due.
        </Trans>
      </>,
      <br></br>,
      <>
        <InlineLink ml="4px">
          <Trans>Affordable Rates: </Trans>
        </InlineLink>
        <Trans>
          By using assets that will appreciate in value, borrowers can secure loans at more affordable rates compared to
          traditional loans where immediate high-value collateral is required.
        </Trans>
      </>,
      <br></br>,
      <>
        <InlineLink ml="4px">
          <Trans>Secure Lending Environment: </Trans>
        </InlineLink>
        <Trans>
          Lenders are still protected due to the collateral's eventual increased value. This serves as a safety net in
          case borrowers default on their loans.
        </Trans>
      </>,
      <br></br>,
      <>
        <InlineLink ml="4px">
          <Trans>Layered Risk Management: </Trans>
        </InlineLink>
        <Trans>
          While Future Collaterals offer a layer of security, lenders are still expected to conduct due diligence and
          assess borrowers' risk profiles before lending.
        </Trans>
      </>,
      <br></br>,
      <>
        <InlineLink ml="4px">
          <Trans>Lowering Borrowing Barriers: </Trans>
        </InlineLink>
        <Trans>
          This mechanism lowers barriers to entry for borrowing, making loans accessible to a broader range of
          individuals who may not have substantial assets upfront.
        </Trans>
      </>,
      <br></br>,
      <>
        <InlineLink ml="4px">
          <Trans>Dynamic Collateral Pricing: </Trans>
        </InlineLink>
        <Trans>
          The predefined table of values ensures that the collateral's pricing is dynamic and linked to its projected
          appreciation, aligning with the loan term.
        </Trans>
      </>,
      <br></br>,
      <>
        <InlineLink ml="4px">
          <Trans>Encouraging Borrower Responsibility: </Trans>
        </InlineLink>
        <Trans>
          Borrowers have an incentive to ensure they can repay the loan, as they risk losing an asset that will increase
          in value.
        </Trans>
      </>,
      <br></br>,
      <>
        <InlineLink ml="4px">
          <Trans>Financial Inclusion: </Trans>
        </InlineLink>
        <Trans>
          Future Collaterals promote financial inclusion by providing opportunities for individuals who might otherwise
          be excluded from borrowing due to lack of immediate collateral.
        </Trans>
      </>,
      <br></br>,
      <>
        <InlineLink ml="4px">
          <Trans>Transparency and Predictability: </Trans>
        </InlineLink>
        <Trans>
          The use of a predefined table of values ensures transparency and predictability in collateral value
          appreciation.
        </Trans>
      </>,
      <br></br>,
      <>
        <InlineLink ml="4px">
          <Trans>Balancing Risk and Reward: </Trans>
        </InlineLink>
        <Trans>
          Lenders can offer lower rates due to the increased security provided by Future Collaterals, enabling them to
          take more calculated risks on certain borrowers.
        </Trans>
      </>,
      <br></br>,
      <Trans>
        In summary, "Future Collaterals" offer a creative solution to make borrowing more accessible and affordable
        while maintaining security for both lenders and borrowers. By linking collateral value to a predefined table of
        values that appreciates over time, this concept strikes a balance between financial inclusion and responsible
        lending practices.
      </Trans>,
    ],
  },
]
export default config
