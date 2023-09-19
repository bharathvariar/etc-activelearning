export const mcqOverlay = (cell: any, node: HTMLElement, id: string) => {
    const box = document.createElement('fieldset');
    const overlay = document.createElement('form');
    box.appendChild(overlay);
    // If overlay already exists or cell is already revealed, return
    if (document.getElementById(`hint-overlay-${id}`) || cell.metadata.revealed) {
        return;
    }
    overlay.id = `mcq-overlay-${id}`;
    node.appendChild(box);
    const cellContent = cell.toJSON().source.split('\n');
    const question = document.createElement('p');
    question.textContent = cellContent[0];
    overlay.appendChild(question);
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

export const ppOverlay = (cell: any, node: HTMLElement, id: string) => {
    return;
}
export const fibOverlay = (cell: any, node: HTMLElement, id: string) => {
    return;
}
export const scafOverlay = (cell: any, node: HTMLElement, id: string) => {
    return;
}
export const skelOverlay = (cell: any, node: HTMLElement, id: string) => {
    return;
}