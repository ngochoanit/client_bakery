export const formatUUID = (guid: string) => {
  guid = `${guid.slice(0, 8)}-${guid.slice(8, 12)}-${guid.slice(
    12,
    16,
  )}-${guid.slice(16, 20)}-${guid.slice(20, 32)}`.toUpperCase();
  return guid;
};
