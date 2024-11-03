export function getTotalPages(totalItems: number, pageSize: number) {
  return pageSize ? Math.ceil(totalItems / pageSize) : 0;
}
