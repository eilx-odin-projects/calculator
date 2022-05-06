export const $  = query => document.querySelector(query)
export const $$ = query => document.querySelectorAll(query)

export const round = (num, digits) =>
    Math.round((num + Number.EPSILON) * Math.pow(10, digits)) / Math.pow(10, digits)