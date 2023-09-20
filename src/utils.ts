export const hideCells = (node: HTMLElement) => {
    const ele = node.querySelector<HTMLElement>('.jp-Cell-inputWrapper');
    if (ele) {
        ele.style.display = 'none';
    }
}

export const mcqOverlay = (cell: any, node: HTMLElement) => {

    //Creating form
    const box = document.createElement('fieldset');
    const overlay = document.createElement('form');
    box.appendChild(overlay);
    node.appendChild(box);

    // Fetching Question content from cell
    const cellContent = cell.toJSON().source.split('\n');
    const question = document.createElement('p');
    question.textContent = cellContent[0];
    overlay.appendChild(question);

    // Rendering  Options
    for (let i = 1; i <= 4; i++) {
        const option = cellContent[i][0];
        let optionContainer = document.createElement('div');

        let button = document.createElement('input');
        button.setAttribute('type', 'radio');
        button.setAttribute('name', 'mcq');
        button.classList.add('mcq', 'button');

        let label = document.createElement('label');
        label.innerText = cellContent[i].substring(1);
        label.setAttribute('id', `button-${i}`);

        label.prepend(button);
        optionContainer.appendChild(label);

        switch (option) {
            case '-': {
                //correct answer
                label.classList.add('mcq', 'correct');
                break;
            }
            case '.': {
                //incorrect answers
                label.classList.add('mcq', 'incorrect');
                break;
            }
        }

        overlay.appendChild(optionContainer);
    }

    let submitButtonMCQ = document.createElement('button');
    box.appendChild(submitButtonMCQ);
    submitButtonMCQ.textContent = "Submit";
    submitButtonMCQ.addEventListener('click', (event) => {
        event.preventDefault();
        const options = document.querySelectorAll<HTMLInputElement>('.mcq.button');
        let optionSelected = false;
        for (let i = 0; i < 4; i++) {
            let option = options[i];
            if (option.checked) {
                optionSelected = true;
                break;
            }
        }

        if (!optionSelected) {
            alert("Please select an option");
            return;
        }

        // Get correct and incorrect options
        const correctOptions = document.querySelectorAll<HTMLInputElement>(".mcq.correct");
        const incorrectOptions = document.querySelectorAll<HTMLInputElement>(".mcq.incorrect");

        // Apply styles to correct options (green) and incorrect options (red)
        correctOptions.forEach(option => {
            option.style.color = 'green';
        });
        incorrectOptions.forEach(option => {
            option.style.color = "red";
        });
        options.forEach(option => {
            option.disabled = true;
        });
        submitButtonMCQ.disabled = true;
    });
}

export const fibOverlay = (cell: any, node: HTMLElement) => {
    //Creating form
    const box = document.createElement('fieldset');
    const overlay = document.createElement('form');
    box.appendChild(overlay);
    node.appendChild(box);
    
    // Fetching Question content from cell
    const cellContent = cell.toJSON().source.split(" ");
    let question = document.createElement('div');
    let correctAnswers: { [id: string]: string; } = {};
    let blankID = 1;
    question.textContent = "";

    for (let i = 0; i < cellContent.length; i++) {
        let word = cellContent[i];
        if (word[0] === '{') {
            //blank
            let blank = document.createElement('input');
            blank.setAttribute('type', 'text');
            blank.setAttribute('id', `blank${blankID}`);
            blank.setAttribute('placeholder', "_____");
            question.innerHTML += `<input type="text" id=blank${blankID}>`;

            let correctAnswer = word.substring(1, word.length - 1);
            let key: string = `blank${blankID}`;
            correctAnswers[key] = correctAnswer;
            blankID++;
        } else {
            question.innerHTML += `${word} `;
        }
    }
    overlay.appendChild(question);
    const resultFIB = document.createElement('div');
    resultFIB.setAttribute('id', 'resultFIB');
    box.appendChild(resultFIB);
    const submitButtonFIB = document.createElement('button');
    submitButtonFIB.textContent = "Submit";
    box.appendChild(submitButtonFIB);
    submitButtonFIB.addEventListener('click', (event) => {
        event.preventDefault();
        let correct = true;
        for (const blank in correctAnswers) {
            console.log("blankID: ", blank);
            const inputField = document.querySelector<HTMLElement>(`#${blank}`) as HTMLInputElement;
            const userAnswer = inputField?.value.trim().toLowerCase();
            const correctAnswer = correctAnswers[blank];
            if (userAnswer === correctAnswer) {
                inputField.style.boxShadow = "0 0 0 1px green"; // Indicate correct answers
                inputField.disabled = true;
            } else {
                inputField.style.boxShadow = "0 0 0 1px red"; // Indicate incorrect answers
                correct = false;
            }
        }
        if (correct) {
            resultFIB.textContent = "All answers are correct!";
            submitButtonFIB.disabled = true;
        }
    })
}

export const ppOverlay = (cell: any, node: HTMLElement, id: string) => {
    return;
}

export const scafOverlay = (cell: any, node: HTMLElement, id: string) => {
    return;
}
export const skelOverlay = (cell: any, node: HTMLElement, id: string) => {
    return;
}