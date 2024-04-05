import { BadRequestException } from '@nestjs/common';

import { FieldMetadataDefaultSerializableValue } from 'src/engine/metadata-modules/field-metadata/interfaces/field-metadata-default-value.interface';

import { isFunctionDefaultValue } from 'src/engine/metadata-modules/field-metadata/utils/is-function-default-value.util';
import { serializeFunctionDefaultValue } from 'src/engine/metadata-modules/field-metadata/utils/serialize-function-default-value.util';

// TODO: this should not serialize from the value type itself
// but a type passed in parameter
export const serializeDefaultValue = (
  defaultValue: FieldMetadataDefaultSerializableValue | null | undefined,
) => {
  if (defaultValue === undefined || defaultValue === null) {
    return null;
  }

  // Function default values
  if (isFunctionDefaultValue(defaultValue)) {
    const serializedTypeDefaultValue =
      serializeFunctionDefaultValue(defaultValue);

    if (!serializedTypeDefaultValue) {
      throw new BadRequestException('Invalid default value');
    }

    return serializedTypeDefaultValue;
  }

  // Static default values
  if (typeof defaultValue === 'string') {
    return defaultValue;
  }

  if (typeof defaultValue === 'number') {
    return defaultValue;
  }

  if (typeof defaultValue === 'boolean') {
    return defaultValue;
  }

  if (defaultValue instanceof Date) {
    return defaultValue;
  }

  if (Array.isArray(defaultValue)) {
    return `'{${defaultValue
      .map((value) => value.replace(/'/g, ''))
      .join(',')}}'`;
  }

  if (typeof defaultValue === 'object') {
    return `'${JSON.stringify(defaultValue)}'`;
  }

  throw new BadRequestException(`Invalid default value "${defaultValue}"`);
};
