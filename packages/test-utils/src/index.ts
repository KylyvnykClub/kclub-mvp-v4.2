let nextSequence = 1;

export const createTestId = (prefix: string): string => `${prefix}-${nextSequence++}`;

export const resetFactorySequences = (): void => {
  nextSequence = 1;
};
