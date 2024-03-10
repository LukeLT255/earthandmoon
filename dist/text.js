text = [
    'orbit controls',
    'scroll: distance',
    'left click and drag: orientation',
    'right click and drag: camera pan',
    'left, right, down, up keys: camera pan'
];
const TEXT_DELAY = 1000;
const LINE_DELAY_TIME = 500;
const CHAR_DELAY_TIME = 15;

window.addEventListener('load', () => {
    setTimeout(() => {text.forEach(addText)}, TEXT_DELAY);
});


function addText (textElement, lineNum) {
    setTimeout(() => {
        const newLine = document.createElement('p');
        newLine.classList.add(`line-${lineNum+1}`);
        const uiDiv = document.querySelector('#ui-text');
        uiDiv.appendChild(newLine);
        typeEffect(textElement, newLine);
    }, lineNum*LINE_DELAY_TIME);

}

function typeEffect(textToAdd, parent) {
    splitText = textToAdd.split('');
    splitText.forEach((e, index) => {
        let char = document.createElement('span');
        char.innerText = e;
        setTimeout(()=> {
            parent.appendChild(char);
        },index*CHAR_DELAY_TIME)
    });

}