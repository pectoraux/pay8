import styled from "styled-components";
import { useTranslation } from "@pancakeswap/localization";
import { Toggle, Text, NotificationDot } from "../../components";
import { ToggleView, ViewMode } from "../../components/ToggleView";

const ToggleWrapper = styled.div`
  display: flex;
  align-items: center;
  margin-left: 10px;

  ${Text} {
    margin-left: 8px;
  }
`;

const ViewControls = styled.div`
  flex-wrap: wrap;
  justify-content: space-between;
  display: flex;
  align-items: center;
  width: 100%;

  > div {
    padding: 8px 0px;
  }

  ${({ theme }) => theme.mediaQueries.sm} {
    justify-content: flex-start;
    width: auto;

    > div {
      padding: 0;
    }
  }
`;

const Wrapper = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;

  a {
    padding-left: 12px;
    padding-right: 12px;
  }

  ${({ theme }) => theme.mediaQueries.sm} {
    margin-left: 16px;
  }
`;

interface PoolTableButtonsPropsType {
  stakedOnly: boolean;
  setStakedOnly: (s: boolean) => void;
  favoritesOnly: boolean;
  setFavoritesOnly: (s: boolean) => void;
  viewMode: ViewMode;
  setViewMode: (s: ViewMode) => void;
  hasStakeInFinishedPools: boolean;
}

const PoolTabButtons = ({
  stakedOnly,
  setStakedOnly,
  favoritesOnly,
  setFavoritesOnly,
}: // viewMode,
// setViewMode,
any) => {
  // const router = useRouter();

  const { t } = useTranslation();

  // const isExact = router.pathname.includes("affiliate");

  // const viewModeToggle = <ToggleView idPrefix="clickPool" viewMode={viewMode} onToggle={setViewMode} />;

  // const liveOrFinishedSwitch = (
  //   <Wrapper>
  //     <ButtonMenu activeIndex={!isExact ? 0 : 1} scale="sm" variant="subtle">
  //       <ButtonMenuItem as={NextLinkFromReactRouter} to="/businesses" replace>
  //         {t("CanCan")}
  //       </ButtonMenuItem>
  //       <ButtonMenuItem as={NextLinkFromReactRouter} to="/businesses/affiliates" replace>
  //         {t("Affiliates")}
  //       </ButtonMenuItem>
  //     </ButtonMenu>
  //   </Wrapper>
  // );

  const stakedOnlySwitch = (
    <ToggleWrapper>
      <Toggle checked={stakedOnly} onChange={() => setStakedOnly(!stakedOnly)} scale="sm" />
      <Text> {t("Mine only")}</Text>
    </ToggleWrapper>
  );

  const favoritesOnlySwitch = (
    <ToggleWrapper>
      <Toggle checked={favoritesOnly} onChange={() => setFavoritesOnly(!favoritesOnly)} scale="sm" />
      <Text> {t("Favorites")}</Text>
    </ToggleWrapper>
  );

  return (
    <ViewControls>
      {/* {viewModeToggle} */}
      {stakedOnlySwitch}
      {favoritesOnlySwitch}
    </ViewControls>
  );
};

export default PoolTabButtons;
