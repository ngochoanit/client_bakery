function filterUnique<T>(dataSet: T[] = []): T[] {
  const elementsUnique = new Set<T>(dataSet);
  return Array.from(elementsUnique);
}

export default filterUnique;
