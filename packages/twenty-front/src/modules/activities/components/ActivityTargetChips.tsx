import styled from '@emotion/styled';

import { ActivityTargetWithTargetRecord } from '@/activities/types/ActivityTargetObject';
import { RecordChip } from '@/object-record/components/RecordChip';
import { ExpandableList } from '@/ui/layout/expandable-list/components/ExpandableList';

type ActivityTargetChipsProps = {
  activityTargetObjectRecords: ActivityTargetWithTargetRecord[];
  anchorElement?: HTMLElement;
  maxWidth?: number;
};

const StyledContainer = styled.div<{ maxWidth?: number }>`
  display: flex;
  flex-wrap: wrap;
  gap: ${({ theme }) => theme.spacing(1)};
  max-width: ${({ maxWidth }) => `${maxWidth}px` || 'none'};
`;

export const ActivityTargetChips = ({
  activityTargetObjectRecords,
  anchorElement,
  maxWidth,
}: ActivityTargetChipsProps) => {
  return (
    <StyledContainer maxWidth={maxWidth}>
      <ExpandableList anchorElement={anchorElement} forceChipCountDisplay>
        {activityTargetObjectRecords.map(
          (activityTargetObjectRecord, index) => (
            <RecordChip
              key={index}
              record={activityTargetObjectRecord.targetObject}
              objectNameSingular={
                activityTargetObjectRecord.targetObjectMetadataItem.nameSingular
              }
            />
          ),
        )}
      </ExpandableList>
    </StyledContainer>
  );
};
