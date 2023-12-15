// Function to create a form with a title
function createForm(titleContent: string) {
	// Creating form elements
	const box = document.createElement('fieldset');
	const overlay = document.createElement('form');
	const title = document.createElement('h3');

	title.textContent = titleContent;

	// Appending elements to the form
	box.appendChild(overlay);
	overlay.appendChild(title);

	// Returning the form elements
	return [box, overlay];
};

// Function to render multiple-choice questions
function mcqRender(cellContent: any) {
	// Creating elements for the question and options
	const question = document.createElement('p');
	const optionContainer = document.createElement('div');

	// Rendering question text
	question.textContent = cellContent[0];

	// Rendering options
	for (let i = 1; i <= 4; i++) {
		const option = cellContent[i][0];
		const button = document.createElement('input');
		const label = document.createElement('label');

		// Setting attributes for radio button
		button.setAttribute('type', 'radio');
		button.setAttribute('name', 'mcq');
		button.classList.add('mcq', 'button');

		// Setting label content
		label.innerText = cellContent[i].substring(1) + '\n';
		label.setAttribute('id', `button-${i}`);

		label.prepend(button);
		optionContainer.appendChild(label);

		// Applying styles based on option type (correct/incorrect)
		switch (option) {
			case '-':
				label.classList.add('mcq', 'correct');
				break;
			case '.':
				label.classList.add('mcq', 'incorrect');
				break;
		}
	}

	// Function to handle MCQ submission
	function submitMCQ(event: Event) {
		event.preventDefault();
		const options = optionContainer.querySelectorAll<HTMLInputElement>('.mcq.button');
		let optionSelected = false;

		// Checking if an option is selected
		for (let i = 0; i < 4; i++) {
			let option = options[i];
			if (option.checked) {
				optionSelected = true;
				break;
			}
		}

		// Alert if no option is selected
		if (!optionSelected) {
			alert("Please select an option");
			return;
		}

		// Get correct and incorrect options
		const correctOptions = optionContainer.querySelectorAll<HTMLInputElement>(".mcq.correct");
		const incorrectOptions = optionContainer.querySelectorAll<HTMLInputElement>(".mcq.incorrect");

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
	}

	// Creating submit button
	const submitButtonMCQ = document.createElement('button');
	submitButtonMCQ.textContent = "Submit";
	submitButtonMCQ.addEventListener('click', submitMCQ);

	// Adding event listener for 'Enter' key
	optionContainer.addEventListener('keypress', (event: KeyboardEvent) => {
		if (event.key === 'Enter') {
			submitMCQ(event);
		}
	});

	// Returning question, option container, and submit button
	return [question, optionContainer, submitButtonMCQ];
};

export const mcqOverlay = (cell: any, node: HTMLElement) => {
	const [box, overlay] = createForm('Choose the most appropriate option');
	node.appendChild(box);

	// Fetching question content from cell
	const cellContent = cell.toJSON().source.split('\n');
	const [question, optionContainer, submitButtonMCQ] = mcqRender(cellContent);
	overlay.appendChild(question);
	overlay.appendChild(optionContainer);
	box.appendChild(submitButtonMCQ);
};

// Function to render fill in the blanks questions
function fibRender(cellContent: any) {
	// Creating elements for the question and answers
	let question = document.createElement('div');
	let correctAnswers: { [id: string]: string; } = {};
	let blankID = 1;
	question.textContent = "";

	// Looping through each word in the content
	for (let i = 0; i < cellContent.length; i++) {
		let word = cellContent[i];
		if (word[0] === '{') {
			// Creating input field for blank
			let blank = document.createElement('input');
			blank.setAttribute('type', 'text');
			blank.setAttribute('id', `blank${blankID}`);
			blank.setAttribute('placeholder', "_____");
			question.innerHTML += `<input type="text" id=blank${blankID}>`;

			// Getting correct answer for the blank
			let correctAnswer = word.substring(1, word.length - 1);
			let key: string = `blank${blankID}`;
			correctAnswers[key] = correctAnswer;
			blankID++;
		} else {
			// Displaying non-blank words
			question.innerHTML += `${word} `;
		}
		question.setAttribute('line-height', '1.5');
	}

	// Creating element to display result
	const resultFIB = document.createElement('div');
	resultFIB.setAttribute('id', 'resultFIB');

	// Function to handle FIB submission
	function submitFIB(event: Event) {
		event.preventDefault();
		let correct = true;

		// Checking user input against correct answers
		for (const blank in correctAnswers) {
			const inputField = question.querySelector<HTMLElement>(`#${blank}`) as HTMLInputElement;
			const userAnswer = inputField?.value.trim().toLowerCase();
			const correctAnswer = correctAnswers[blank];

			// Styling input fields based on correctness
			if (userAnswer === correctAnswer) {
				inputField.style.boxShadow = "0 0 0 1px green"; // Indicate correct answers
				inputField.disabled = true;
			} else {
				inputField.style.boxShadow = "0 0 0 1px red"; // Indicate incorrect answers
				correct = false;
			}
		}

		// Displaying result message
		if (correct) {
			resultFIB.textContent = "All answers are correct!";
			submitButtonFIB.disabled = true;
		}
	}

	// Creating submit button
	const submitButtonFIB = document.createElement('button');
	submitButtonFIB.textContent = "Submit";
	submitButtonFIB.addEventListener('click', submitFIB);

	// Adding event listener for 'Enter' key
	question.addEventListener('keypress', (event: KeyboardEvent) => {
		if (event.key === 'Enter') {
			submitFIB(event);
		}
	});

	// Returning question, result, and submit button
	return [question, resultFIB, submitButtonFIB];
};

// Exporting fill in the blanks overlay function
export const fibOverlay = (cell: any, node: HTMLElement) => {
	// Creating form
	const [box, overlay] = createForm('Fill in the Blanks');
	node.appendChild(box);

	// Fetching question content from cell
	const cellContent = cell.toJSON().source.split(" ");
	const [question, resultFIB, submitButtonFIB] = fibRender(cellContent);
	overlay.appendChild(question);
	box.appendChild(resultFIB);
	box.appendChild(submitButtonFIB);
};

// Functions to handle drag-and-drop events
function dragStart(this: HTMLElement, event: DragEvent) {
	this.style.opacity = "0.4";
	dragSrcEl = this;

	// Setting up data transfer for drag-and-drop
	if (event.dataTransfer) {
		event.dataTransfer.effectAllowed = "move";
		event.dataTransfer.setData("text/html", this.innerHTML);
	}
}

function dragEnter(this: HTMLElement, event: DragEvent) {
	this.classList.add("over");
}

function dragLeave(this: HTMLElement, event: DragEvent) {
	event.stopPropagation();
	this.classList.remove("over");
}

function dragOver(event: DragEvent) {
	event.preventDefault();
	if (event.dataTransfer) {
		event.dataTransfer.dropEffect = "move";
	}
	return false;
}

function dragDrop(this: HTMLElement, event: DragEvent) {
	if (dragSrcEl != this && dragSrcEl != null) {
		// Swapping content between dragged and dropped elements
		dragSrcEl.innerHTML = this.innerHTML;

		// Updating IDs for dragged and dropped elements
		if (event.dataTransfer && event.currentTarget instanceof HTMLElement) {
			this.innerHTML = event.dataTransfer.getData("text/html");
			let temp = event.currentTarget.id;
			event.currentTarget.id = dragSrcEl.id;
			dragSrcEl.id = temp;
		}
	}
	return false;
}

function dragEnd(this: HTMLElement, event: DragEvent) {
	// Removing 'over' class from all elements
	const list = document.querySelectorAll(".PPblock");
	list.forEach(function (item) {
		item.classList.remove("over");
	});
	this.style.opacity = "1";
}

// Function to add drag-and-drop events to an PP element
function addEventsDragAndDrop(el: HTMLElement) {
	el.addEventListener("dragstart", dragStart, false);
	el.addEventListener("dragenter", dragEnter, false);
	el.addEventListener("dragover", dragOver, false);
	el.addEventListener("dragleave", dragLeave, false);
	el.addEventListener("drop", dragDrop, false);
	el.addEventListener("dragend", dragEnd, false);
}

// Variable to store the dragged element
let dragSrcEl: HTMLElement | null;

// Function to render Parson's Problems
function ppRender(cellContent: any) {
	// Creating container for Parson's Problems
	const ppContainer = document.createElement('div');
	ppContainer.setAttribute('id', 'ppContainer');
	const ppList = document.createElement('ul');
	ppList.setAttribute('id', 'ppList');
	ppContainer.appendChild(ppList);

	let correctAnswers: { [id: string]: string; } = {};
	let ppID = 1;

	for (let i = 0; i < cellContent.length; i++) {
		let statement = cellContent[i].trim();
		let key: string = `PP${ppID}`;
		correctAnswers[key] = statement;
		ppID++;
	}

	// Randomizing order of Parson's Problem statements
	const keys = Object.keys(correctAnswers);
	for (let i = keys.length; i > 0; i--) {
		let randIndex = Math.floor(Math.random() * keys.length);
		const val = correctAnswers[keys[randIndex]];
		let ppElem = document.createElement("li");
		ppElem.id = keys[randIndex];
		ppElem.classList.add("PPblock");
		ppElem.draggable = true;
		ppElem.textContent = val;
		ppList.append(ppElem);
		keys.splice(randIndex, 1);
	}

	const resultPP = document.createElement('div');
	resultPP.setAttribute('id', 'resultPP');

	function submitPP(event: Event) {
		event.preventDefault();
		let ppBlocks = ppContainer.querySelectorAll(".PPblock");

		// Checking order of Parson's Problem statements
		for (let i = 0; i < ppBlocks.length; i++) {
			let element = ppBlocks[i];

			if (Number(element.id[2]) !== i + 1) {
				resultPP.textContent = "Try Again";
				return;
			}
		}

		resultPP.textContent = "All answers are correct!";
		submitButtonPP.disabled = true;
		ppContainer.style.pointerEvents = "none";
	}

	const submitButtonPP = document.createElement('button');
	submitButtonPP.textContent = "Submit";
	submitButtonPP.addEventListener('click', submitPP);

	// Adding event listener for 'Enter' key
	ppContainer.addEventListener('keypress', (event: KeyboardEvent) => {
		if (event.key === 'Enter') {
			submitPP(event);
		}
	});

	// Returning Parson's Problem container, result, and submit button
	return [ppContainer, resultPP, submitButtonPP];
}

export const ppOverlay = (cell: any, node: HTMLElement) => {
	const [box, overlay] = createForm('Reorder the following code blocks by dragging them');
	node.appendChild(box);

	// Fetching question content from cell
	const cellContent = cell.toJSON().source.split('\n');
	const [ppContainer, resultPP, submitButtonPP] = ppRender(cellContent);
	overlay.appendChild(ppContainer);
	box.appendChild(resultPP);
	box.appendChild(submitButtonPP);

	// Adding drag-and-drop events to Parson's Problem blocks
	let ppBlocks = document.querySelectorAll(".PPblock");
	[].forEach.call(ppBlocks, function (item) {
		addEventsDragAndDrop(item);
	});
}

// Function to handle tab switching and content display
export const tabsOverlay = (cell: any, node: HTMLElement) => {

	// Function to open a specific tab and hide others
	function openTab(event: Event, tabID: string) {
		// Hide all tab content
		let tabContent = node.querySelectorAll(".tabContent");
		if (tabContent) {
			for (let i = 0; i < tabContent.length; i += 1) {
				const tabContentElement = tabContent[i] as HTMLElement;
				tabContentElement.style.display = "none";
			}
		}

		// Deactivate all tab links
		let tabLinks = node.querySelectorAll(".tabLinks");
		for (let i = 0; i < tabLinks.length; i += 1) {
			tabLinks[i].classList.remove("active");
		}

		// Show the selected tab and activate its link
		let tab = node.querySelector(`#${tabID}`) as HTMLElement;
		if (tab) {
			tab.style.display = "block";
		}
		if (event.target) {
			const eventElem = event.target as HTMLElement;
			eventElem.classList.add('active');
		}
	}

	// Function to create a tab button
	function createTabButton(id: string, title: string, tabID: string) {
		let btn = document.createElement('button');
		btn.classList.add('tabLinks');
		btn.innerHTML = title;
		btn.addEventListener('click', (event) => {
			openTab(event, tabID);
		});
		return btn;
	}

	// Function to create a tab content div
	function createTabDiv(id: string, hide: boolean) {
		const tabDiv = document.createElement('div');
		tabDiv.setAttribute('id', id);
		tabDiv.classList.add('tabContent');
		if (hide) { tabDiv.style.display = "none"; }
		return tabDiv;
	}

	// Create a container for tabs
	const tab = document.createElement('div');
	node.appendChild(tab);
	tab.classList.add('tab');

	// Names for tab links and tab content divs
	const tabLinkNames = ['MCQTabLink', 'FIBTabLink', 'PPTabLink'];
	const tabDivNames = ['MCQTabDiv', 'FIBTabDiv', 'PPTabDiv'];

	// Types of questions corresponding to each tab
	const qTypes = ['Multiple Choice Questions', 'Fill in the Blanks', "Parson's Problems"];

	// Create tab buttons and append them to the container
	for (let i = 0; i < qTypes.length; i++) {
		const btn = createTabButton(tabLinkNames[i], qTypes[i], tabDivNames[i]);
		tab.appendChild(btn);
	}

	// Create tab content divs and append them to the container
	const tabDiv = createTabDiv(tabDivNames[0], false);
	node.appendChild(tabDiv);

	for (let i = 1; i < qTypes.length; i++) {
		const tabDiv = createTabDiv(tabDivNames[i], true);
		node.appendChild(tabDiv);
	}

	// Split the cell content by '---' to get each queston
	const cellContent = cell.toJSON().source.split('---');

	// Iterate through each question type in the cell content
	for (let i = 1; i < cellContent.length; i++) {
		let questionType = cellContent[i].substring(0, 2);
		let questionContent = cellContent[i].substring(3);

		// Switch based on question type
		switch (questionType) {
			case 'mc': {
				// Create and append Multiple Choice question form
				const [box, overlay] = createForm('Choose the most appropriate option');
				const tabDiv = node.querySelector('#MCQTabDiv');
				tabDiv?.appendChild(box);
				const [question, optionContainer, submitButtonMCQ] = mcqRender(questionContent.split('\n'));
				overlay.appendChild(question);
				overlay.appendChild(optionContainer);
				box.appendChild(submitButtonMCQ);
				break;
			}
			case 'fb': {
				// Create and append Fill in the Blanks question form
				const [box, overlay] = createForm('Fill in the Blanks');
				const tabDiv = node.querySelector('#FIBTabDiv');
				tabDiv?.appendChild(box);
				const [question, resultFIB, submitButtonFIB] = fibRender(questionContent.split(' '));
				overlay.appendChild(question);
				box.appendChild(resultFIB);
				box.appendChild(submitButtonFIB);
				break;
			}
			case 'pp': {
				// Create and append Parson's Problems question form
				const [box, overlay] = createForm('Reorder the following code blocks by dragging them');
				const tabDiv = node.querySelector('#PPTabDiv');
				tabDiv?.appendChild(box);
				// Fetching Question content from cell
				const [ppContainer, resultPP, submitButtonPP] = ppRender(questionContent.split('\n'));
				overlay.appendChild(ppContainer);
				box.appendChild(resultPP);
				box.appendChild(submitButtonPP);
				let ppBlocks = node.querySelectorAll(".PPblock");
				[].forEach.call(ppBlocks, function (item) {
					addEventsDragAndDrop(item);
				});
				break;
			}
		}
	}
	return;
};	