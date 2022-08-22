export const customSort = (list, sortBy = 'name') => {
    return list.sort((a, b) => (a[`${sortBy}`] > b[`${sortBy}`]) ? 1 : -1)
}