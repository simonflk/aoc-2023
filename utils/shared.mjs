/**
 * @param {number} start
 * @param {number} end 
 */
export function *range(start, end, step = 1) {
    for (let i = start; i <= end; i += step) {
        yield i;
    }
}