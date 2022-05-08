import { $, $$, round } from "./utils.js"

const operators = {
    "+": x => y => x + y,
    "-": x => y => x - y,
    "x": x => y => x * y,
    "÷": x => y => !y
        ? division_by_zero || (division_by_zero = Number(prompt("Division by zero? Pfft, how about you define it!")) || 0)
        : x / y,

    "^": x => y => Math.pow(x, y),
    "√": x => y => Math.sqrt(x, y),

    " ": x => x,
}

let total                      // Sum total of operations
let current = 0                // Current number being inputted
let operation = operators[' '] // Current operation in progress
let equals_pressed = false     // Whether equals has just been pressed
let division_by_zero           // User-defined value for division by zero

let history = $`#History`
let display = $`#Display`


function onNumber (number) {
    if (equals_pressed) {
        equals_pressed = false
        current = 0
    }

    if (current) current += number
    else         current  = number
    
    display.value = current
}


function onOperator (operator) {
    equals_pressed = false

    total = operation(Number(current))
    operation = operators[operator](total)

    current = 0
    history.value = `${round(total, 3)} ${operator}`
    display.value = null
}


function onEquals () {
    current = operation(Number(current))
    operation = operators[' ']

    total = null
    history.value = null
    display.value = round(current, 3)
    equals_pressed = true
}

function onDot () {
    if (current.toString().includes('.')) return
    equals_pressed = false

    current += '.'
    display.value = current
}


function onClear () {
    equals_pressed = false
    total = null
    current = 0
    operation = operators[' ']
    history.value = null
    display.value = '...'
}


function onBackspace () {
    equals_pressed = false
    if (!current) return
    
    current = current.slice(0, current.length - 1)
    display.value = current
}


// Set up interface events
$$`#Calculator button`.forEach(button => {
    console.log(button.className)

    switch (button.id) {
        case 'Dot'      : return button.addEventListener('click', onDot)
        case 'Clear'    : return button.addEventListener('click', onClear)
        case 'Equals'   : return button.addEventListener('click', onEquals)
        case 'Backspace': return button.addEventListener('click', onBackspace)
    }

    switch (button.className) {
        case 'number':
            return button.addEventListener('click', function () { onNumber(this.innerText) })
        case 'operator':
            return button.addEventListener('click', function () { onOperator(this.innerText) })
    }
})

// Set up keyboard events
addEventListener('keydown', ({ key }) => {
    if (!isNaN(key)) return onNumber(key)

    switch (key) {
        case '+':
        case '-':
        case '^':
            return onOperator(key)
        case 'x':
        case '*':
            return onOperator('x')
        case '/':
            return onOperator('÷')
        case 'Enter':
            return onEquals()
        case 'Backspace':
            return onBackspace()
        case 'Escape':
            return onClear()
    }
})