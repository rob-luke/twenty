import React, { useContext, useState } from 'react';
import Skeleton, { SkeletonTheme } from 'react-loading-skeleton';
import { Tooltip } from 'react-tooltip';
import { css, useTheme } from '@emotion/react';
import styled from '@emotion/styled';
import { IconComponent } from 'twenty-ui';

import { FieldContext } from '@/object-record/record-field/contexts/FieldContext';
import { EllipsisDisplay } from '@/ui/field/display/components/EllipsisDisplay';
import { HotkeyScope } from '@/ui/utilities/hotkey/types/HotkeyScope';

import { useInlineCell } from '../hooks/useInlineCell';

import { RecordInlineCellDisplayMode } from './RecordInlineCellDisplayMode';
import { RecordInlineCellButton } from './RecordInlineCellEditButton';
import { RecordInlineCellEditMode } from './RecordInlineCellEditMode';

const StyledIconContainer = styled.div`
  align-items: center;
  color: ${({ theme }) => theme.font.color.tertiary};
  display: flex;
  width: 16px;

  svg {
    align-items: center;
    display: flex;
    height: 16px;
    justify-content: center;
    width: 16px;
  }
`;

const StyledLabelAndIconContainer = styled.div`
  align-items: center;
  color: ${({ theme }) => theme.font.color.tertiary};
  display: flex;
  gap: ${({ theme }) => theme.spacing(1)};
`;

const StyledValueContainer = styled.div`
  display: flex;
  min-width: 0;
`;

const StyledLabelContainer = styled.div<{ width?: number }>`
  color: ${({ theme }) => theme.font.color.tertiary};
  font-size: ${({ theme }) => theme.font.size.sm};
  width: ${({ width }) => width}px;
`;

const StyledClickableContainer = styled.div<{ readonly?: boolean }>`
  display: flex;
  gap: ${({ theme }) => theme.spacing(1)};
  width: 100%;

  ${({ readonly }) =>
    !readonly &&
    css`
      cursor: pointer;
    `};
`;

const StyledInlineCellBaseContainer = styled.div`
  align-items: center;
  box-sizing: border-box;
  width: 100%;
  display: flex;

  gap: ${({ theme }) => theme.spacing(1)};

  user-select: none;
`;

const StyledTooltip = styled(Tooltip)`
  background-color: ${({ theme }) => theme.background.primary};
  box-shadow: ${({ theme }) => theme.boxShadow.light};

  color: ${({ theme }) => theme.font.color.primary};

  font-size: ${({ theme }) => theme.font.size.sm};
  font-weight: ${({ theme }) => theme.font.weight.regular};
  padding: ${({ theme }) => theme.spacing(2)};
`;

const StyledSkeletonDiv = styled.div`
  height: 24px;
`;

const StyledInlineCellSkeletonLoader = () => {
  const theme = useTheme();
  return (
    <SkeletonTheme
      baseColor={theme.background.tertiary}
      highlightColor={theme.background.transparent.lighter}
      borderRadius={4}
    >
      <StyledSkeletonDiv>
        <Skeleton width={154} height={16} />
      </StyledSkeletonDiv>
    </SkeletonTheme>
  );
};

type RecordInlineCellContainerProps = {
  readonly?: boolean;
  IconLabel?: IconComponent;
  label?: string;
  labelWidth?: number;
  showLabel?: boolean;
  buttonIcon?: IconComponent;
  editModeContent?: React.ReactNode;
  editModeContentOnly?: boolean;
  displayModeContent: ({
    isCellSoftFocused,
    cellElement,
  }: {
    isCellSoftFocused: boolean;
    cellElement?: HTMLDivElement;
  }) => React.ReactNode;
  customEditHotkeyScope?: HotkeyScope;
  isDisplayModeContentEmpty?: boolean;
  isDisplayModeFixHeight?: boolean;
  disableHoverEffect?: boolean;
  loading?: boolean;
};

export const RecordInlineCellContainer = ({
  readonly,
  IconLabel,
  label,
  labelWidth,
  showLabel,
  buttonIcon,
  editModeContent,
  displayModeContent,
  customEditHotkeyScope,
  isDisplayModeContentEmpty,
  editModeContentOnly,
  isDisplayModeFixHeight,
  disableHoverEffect,
  loading = false,
}: RecordInlineCellContainerProps) => {
  const { entityId, fieldDefinition } = useContext(FieldContext);
  // Used by some fields in ExpandableList as an anchor for the floating element.
  // floating-ui mentions that `useState` must be used instead of `useRef`,
  // see https://floating-ui.com/docs/useFloating#elements
  const [cellElement, setCellElement] = useState<HTMLDivElement | null>(null);
  const [isHovered, setIsHovered] = useState(false);
  const [isCellSoftFocused, setIsCellSoftFocused] = useState(false);

  const handleContainerMouseEnter = () => {
    if (!readonly) {
      setIsHovered(true);
    }
    setIsCellSoftFocused(true);
  };

  const handleContainerMouseLeave = () => {
    if (!readonly) {
      setIsHovered(false);
    }
    setIsCellSoftFocused(false);
  };

  const { isInlineCellInEditMode, openInlineCell } = useInlineCell();

  const handleDisplayModeClick = () => {
    if (!readonly && !editModeContentOnly) {
      openInlineCell(customEditHotkeyScope);
    }
  };

  const showEditButton =
    buttonIcon &&
    !isInlineCellInEditMode &&
    isHovered &&
    !editModeContentOnly &&
    !isDisplayModeContentEmpty;

  const theme = useTheme();
  const labelId = `label-${entityId}-${fieldDefinition?.metadata?.fieldName}`;

  const showContent = () => {
    if (loading) {
      return <StyledInlineCellSkeletonLoader />;
    }
    return !readonly && isInlineCellInEditMode ? (
      <RecordInlineCellEditMode>{editModeContent}</RecordInlineCellEditMode>
    ) : editModeContentOnly ? (
      <StyledClickableContainer readonly={readonly}>
        <RecordInlineCellDisplayMode
          disableHoverEffect={disableHoverEffect}
          isDisplayModeContentEmpty={isDisplayModeContentEmpty}
          isDisplayModeFixHeight={isDisplayModeFixHeight}
          isHovered={isHovered}
          emptyPlaceholder={showLabel ? 'Empty' : label}
        >
          {editModeContent}
        </RecordInlineCellDisplayMode>
      </StyledClickableContainer>
    ) : (
      <StyledClickableContainer
        readonly={readonly}
        onClick={handleDisplayModeClick}
      >
        <RecordInlineCellDisplayMode
          disableHoverEffect={disableHoverEffect}
          isDisplayModeContentEmpty={isDisplayModeContentEmpty}
          isDisplayModeFixHeight={isDisplayModeFixHeight}
          isHovered={isHovered}
          emptyPlaceholder={showLabel ? 'Empty' : label}
        >
          {displayModeContent({
            isCellSoftFocused,
            cellElement: cellElement ?? undefined,
          })}
        </RecordInlineCellDisplayMode>
        {showEditButton && <RecordInlineCellButton Icon={buttonIcon} />}
      </StyledClickableContainer>
    );
  };

  return (
    <StyledInlineCellBaseContainer
      onMouseEnter={handleContainerMouseEnter}
      onMouseLeave={handleContainerMouseLeave}
    >
      {(IconLabel || label) && (
        <StyledLabelAndIconContainer id={labelId}>
          {IconLabel && (
            <StyledIconContainer>
              <IconLabel stroke={theme.icon.stroke.sm} />
            </StyledIconContainer>
          )}
          {showLabel && label && (
            <StyledLabelContainer width={labelWidth}>
              <EllipsisDisplay maxWidth={labelWidth}>{label}</EllipsisDisplay>
            </StyledLabelContainer>
          )}
          {/* TODO: Displaying Tooltips on the board is causing performance issues https://react-tooltip.com/docs/examples/render */}
          {!showLabel && !fieldDefinition?.disableTooltip && (
            <StyledTooltip
              anchorSelect={`#${labelId}`}
              content={label}
              clickable
              noArrow
              place="bottom"
              positionStrategy="fixed"
            />
          )}
        </StyledLabelAndIconContainer>
      )}
      <StyledValueContainer ref={setCellElement}>
        {showContent()}
      </StyledValueContainer>
    </StyledInlineCellBaseContainer>
  );
};
