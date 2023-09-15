import { useTranslation } from "@pancakeswap/localization";
import React, { memo } from "react";
import type { FeeAmount } from "@pancakeswap/v3-sdk";
import { Text, TooltipText } from "../../../../components/Text";
import { Tag, TagProps } from "../../../../components/Tag/index";
import { useTooltip } from "../../../../hooks/useTooltip";
import {
  AutoRenewIcon,
  BlockIcon,
  CommunityIcon,
  RefreshIcon,
  TimerIcon,
  VerifiedIcon,
  VoteIcon,
  LockIcon,
  RocketIcon,
  CheckmarkCircleIcon,
  CurrencyIcon,
  BinanceChainIcon,
  EthChainIcon,
  PrizeIcon,
  AddIcon,
  ListViewIcon,
} from "../../../../components/Svg";
import { formatNumber } from "@pancakeswap/utils/formatBalance";

const CoreTag: React.FC<React.PropsWithChildren<TagProps>> = (props) => {
  const { t } = useTranslation();
  return (
    <Tag
      variant="secondary"
      style={{ background: "none", width: "fit-content" }}
      outline
      startIcon={<VerifiedIcon width="18px" color="secondary" mr="4px" />}
      {...props}
    >
      {t("Core")}
    </Tag>
  );
};

const FarmAuctionTagToolTipContent = memo(() => {
  const { t } = useTranslation();
  return <Text color="text">{t("Farm Auction Winner, add liquidity at your own risk.")}</Text>;
});

const FarmAuctionTag: React.FC<React.PropsWithChildren<TagProps>> = (props) => {
  const { t } = useTranslation();
  const { targetRef, tooltip, tooltipVisible } = useTooltip(<FarmAuctionTagToolTipContent />, { placement: "top" });
  return (
    <>
      {tooltipVisible && tooltip}
      <TooltipText
        ref={targetRef}
        display="flex"
        style={{ textDecoration: "none", justifyContent: "center", alignSelf: "center" }}
      >
        <Tag variant="failure" outline startIcon={<CommunityIcon width="18px" color="failure" mr="4px" />} {...props}>
          {t("Farm Auction")}
        </Tag>
      </TooltipText>
    </>
  );
};

const StableFarmTag: React.FC<React.PropsWithChildren<TagProps>> = (props) => {
  const { t } = useTranslation();
  const { targetRef, tooltip, tooltipVisible } = useTooltip("Fees are lower for stable LP", { placement: "top" });
  return (
    <>
      {tooltipVisible && tooltip}
      <TooltipText
        ref={targetRef}
        display="flex"
        style={{ textDecoration: "none", justifyContent: "center", alignSelf: "center" }}
      >
        <Tag variant="failure" outline startIcon={<CurrencyIcon width="18px" color="failure" mr="4px" />} {...props}>
          {t("Stable LP")}
        </Tag>
      </TooltipText>
    </>
  );
};

const CommunityTag: React.FC<React.PropsWithChildren<TagProps>> = (props) => {
  const { t } = useTranslation();
  return (
    <Tag variant="failure" outline startIcon={<CommunityIcon width="18px" color="failure" mr="4px" />} {...props}>
      {t("Community")}
    </Tag>
  );
};

const DualTag: React.FC<React.PropsWithChildren<TagProps>> = (props) => {
  const { t } = useTranslation();
  return (
    <Tag variant="textSubtle" outline {...props}>
      {t("Dual")}
    </Tag>
  );
};

const ManualPoolTag: React.FC<React.PropsWithChildren<TagProps>> = (props) => {
  const { t } = useTranslation();
  return (
    <Tag variant="secondary" outline startIcon={<RefreshIcon width="18px" color="secondary" mr="4px" />} {...props}>
      {t("Manual")}
    </Tag>
  );
};

const LockedOrAutoPoolTag: React.FC<React.PropsWithChildren<TagProps>> = (props) => {
  const { t } = useTranslation();
  return (
    <Tag variant="success" outline {...props}>
      {t("Auto")}/{t("Locked")}
    </Tag>
  );
};

const LockedPoolTag: React.FC<React.PropsWithChildren<TagProps>> = (props) => {
  const { t } = useTranslation();
  return (
    <Tag variant="success" outline startIcon={<LockIcon width="18px" color="success" mr="4px" />} {...props}>
      {t("Locked")}
    </Tag>
  );
};

const CompoundingPoolTag: React.FC<React.PropsWithChildren<TagProps>> = (props) => {
  const { t } = useTranslation();
  return (
    <Tag variant="success" outline startIcon={<AutoRenewIcon width="18px" color="success" mr="4px" />} {...props}>
      {t("Auto")}
    </Tag>
  );
};

const VoteNowTag: React.FC<React.PropsWithChildren<TagProps>> = (props) => {
  const { t } = useTranslation();
  return (
    <Tag variant="success" startIcon={<VoteIcon width="18px" color="white" mr="4px" />} {...props}>
      {t("Vote Now")}
    </Tag>
  );
};

const VotedTag: React.FC<React.PropsWithChildren<TagProps>> = (props) => {
  const { t } = useTranslation();
  return (
    <Tag
      variant="success"
      style={{ background: "none" }}
      outline
      startIcon={<CheckmarkCircleIcon width="18px" color="success" mr="4px" />}
      {...props}
    >
      {t("Voted")}
    </Tag>
  );
};

const SoonTag: React.FC<React.PropsWithChildren<TagProps>> = (props) => {
  const { t } = useTranslation();
  return (
    <Tag variant="binance" startIcon={<TimerIcon width="18px" color="white" mr="4px" />} {...props}>
      {t("Soon")}
    </Tag>
  );
};

const PendingTag: React.FC<React.PropsWithChildren<TagProps>> = (props) => {
  const { t } = useTranslation();
  return (
    <Tag variant="binance" startIcon={<TimerIcon width="18px" color="success" mr="4px" />} {...props}>
      {t("Pending")}
    </Tag>
  );
};

const NormalReviewTag: React.FC<{ rating: string }> = ({ rating }) => {
  return (
    <Tag variant="success" startIcon={<VoteIcon width="18px" color="success" mr="4px" />}>
      {Number(rating) >= 5 ? "5" : Math.floor(Math.max(Number(rating), 0))}
    </Tag>
  );
};

const VotingPowerTag: React.FC<any> = ({ votingPower, tagType }) => {
  return (
    <Tag
      variant="binance"
      style={{
        backgroundColor: tagType === 4 ? "binance" : tagType === 3 ? "silver" : tagType === 2 ? "#cd7f32" : "black",
      }}
      startIcon={<VoteIcon width="18px" color="secondary" mr="4px" />}
    >
      {formatNumber(Number(votingPower))}
    </Tag>
  );
};

const VotesTag: React.FC<any> = ({ votingPower, color }) => {
  return (
    <Tag
      variant="binance"
      style={{ backgroundColor: color }}
      startIcon={<VoteIcon width="18px" color="secondary" mr="4px" />}
    >
      {formatNumber(Number(votingPower))}
    </Tag>
  );
};

const OpenedTag: React.FC<TagProps> = (props) => {
  const { t } = useTranslation();
  return (
    <Tag variant="binance" startIcon={<TimerIcon width="18px" color="success" mr="4px" />} {...props}>
      {t("Opened")}
    </Tag>
  );
};

const ClosedTag: React.FC<React.PropsWithChildren<TagProps>> = (props) => {
  const { t } = useTranslation();
  return (
    <Tag variant="textDisabled" startIcon={<BlockIcon width="18px" color="white" mr="4px" />} {...props}>
      {t("Closed")}
    </Tag>
  );
};

const BoostedTag: React.FC<React.PropsWithChildren<TagProps>> = (props) => {
  const { t } = useTranslation();
  return (
    <Tag variant="success" outline startIcon={<RocketIcon width="18px" color="success" mr="4px" />} {...props}>
      {t("Boosted")}
    </Tag>
  );
};

const V2Tag: React.FC<TagProps> = (props) => (
  <Tag variant="textDisabled" outline {...props}>
    V2
  </Tag>
);

const V3Tag: React.FC<TagProps> = (props) => (
  <Tag variant="secondary" {...props}>
    V3
  </Tag>
);

const V3FeeTag: React.FC<TagProps & { feeAmount: FeeAmount }> = ({ feeAmount, ...props }) => (
  <Tag variant="secondary" outline {...props}>
    {feeAmount / 10_000}%
  </Tag>
);

const EthTag: React.FC<React.PropsWithChildren<TagProps>> = (props) => {
  return (
    <Tag style={{ background: "#627EEA" }} startIcon={<EthChainIcon width="10px" mr="4px" />} {...props}>
      ETH
    </Tag>
  );
};

const BscTag: React.FC<React.PropsWithChildren<TagProps>> = (props) => {
  return (
    <Tag style={{ background: "#08060B" }} startIcon={<BinanceChainIcon width="18px" mr="4px" />} {...props}>
      BNB
    </Tag>
  );
};

const ExpiredTag: React.FC<TagProps> = (props) => {
  const { t } = useTranslation();
  return (
    <Tag variant="textDisabled" startIcon={<BlockIcon width="18px" color="textDisabled" mr="4px" />} {...props}>
      {t("Expired")}
    </Tag>
  );
};

const ActiveTag: React.FC<TagProps> = (props) => {
  const { t } = useTranslation();
  return (
    <Tag variant="success" startIcon={<VoteIcon width="18px" color="blue" mr="4px" />} {...props}>
      {t("Active")}
    </Tag>
  );
};

const TypeTag: React.FC<any> = ({ entryType, ...props }) => {
  const { t } = useTranslation();
  let startIcon = <VerifiedIcon width="18px" color="secondary" mr="4px" />;
  if (entryType === "education") {
    startIcon = <PrizeIcon width="18px" color="failure" mr="4px" />;
  } else if (entryType === "professional") {
    startIcon = <CommunityIcon width="18px" color="failure" mr="4px" />;
  } else if (entryType === "healthcare") {
    startIcon = <AddIcon width="18px" color="secondary" mr="4px" />;
  } else if (entryType === "properties") {
    startIcon = <ListViewIcon width="18px" color="secondary" mr="4px" />;
  } else if (entryType === "others") {
    startIcon = <AutoRenewIcon width="18px" color="secondary" mr="4px" />;
  }
  return (
    <Tag variant="secondary" outline startIcon={startIcon} {...props}>
      {t(entryType)}
    </Tag>
  );
};

const Tags = {
  CoreTag,
  FarmAuctionTag,
  DualTag,
  ManualPoolTag,
  CompoundingPoolTag,
  VoteNowTag,
  SoonTag,
  ClosedTag,
  CommunityTag,
  StableFarmTag,
  LockedPoolTag,
  LockedOrAutoPoolTag,
  BoostedTag,
  VotedTag,
  V2Tag,
  V3FeeTag,
  V3Tag,
  EthTag,
  BscTag,
  OpenedTag,
  TypeTag,
  ExpiredTag,
  ActiveTag,
  VotesTag,
  PendingTag,
  VotingPowerTag,
  NormalReviewTag,
};

export default Tags;
