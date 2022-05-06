import { $, $$, round } from "./utils.js"

const operators = {
    "+": x => y => x + y,
    "-": x => y => x - y,
    "x": x => y => x * y,
    "÷": x => y => x / y,

    "^": x => y => Math.pow(x, y),
    "√": x => y => Math.sqrt(x, y),

    " ": x => x,
}

let total                      // Sum total of operations
let current                    // Current number being inputted
let operation = operators[' '] // Current operation in progress
let equals_pressed = false     // Whether equals has just been pressed

let history = $`#History`
let display = $`#Display`


function onNumber (number) {
    if (equals_pressed) {
        equals_pressed = false
        current = null
    }

    if (current) current += number
    else         current  = number
    
    display.value = current
}


function onOperator (operator) {
    equals_pressed = false

    total = operation(Number(current))
    operation = operators[operator](total)

    current = null
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
    if (current.includes('.')) return
    equals_pressed = false

    current += '.'
    display.value = current
}


function onClear () {
    equals_pressed = false
    total = null
    current = null
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


$$`.number`.forEach(button => {
    button.addEventListener('click', function () { onNumber(this.innerText) })
})


$$`.operator`.forEach(button => {
    button.addEventListener('click', function () { onOperator(this.innerText) })
})


$`#Dot`.addEventListener('click', onDot)
$`#Clear`.addEventListener('click', onClear)
$`#Equals`.addEventListener('click', onEquals)
$`#Backspace`.addEventListener('click', onBackspace)


// Keyboard support
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