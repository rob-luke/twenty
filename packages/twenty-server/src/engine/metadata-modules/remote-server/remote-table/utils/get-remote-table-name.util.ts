import { singular } from 'pluralize';

import { camelCase } from 'src/utils/camel-case';

export const getRemoteTableName = (distantTableName: string) =>
  singular(camelCase(distantTableName));
