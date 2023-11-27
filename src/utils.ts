export const hideCells = (node: HTMLElement) => {
	const ele = node.querySelector<HTMLElement>('.jp-Cell-inputWrapper');
	if (ele) {
		ele.style.display = 'none';
	}
};

export const applyStyles = () => {

	// Styles for FIB inputs
	let textInputs = document.querySelectorAll('input[type="text"]');
	textInputs.forEach((textInput: Element) => {
		const textInputElement = textInput as HTMLInputElement; // Cast to HTMLInputElement
		textInputElement.style.width = "auto";
		textInputElement.style.textAlign = "center";
	});

	// Styles for PP Blocks and their movements
	console.log('applyStyles');
	let ppBlocks = document.querySelectorAll(".PPblock");
	ppBlocks.forEach((ppBlock: Element) => {
		const ppBlockElement = ppBlock as HTMLElement; // Cast to HTMLElement
		ppBlockElement.style.willChange = "transform";
		ppBlockElement.style.textAlign = "center";
		ppBlockElement.style.borderRadius = "10px";
		ppBlockElement.style.height = "50px";
		ppBlockElement.style.listStyleType = "none";
		ppBlockElement.style.margin = "10px";
		ppBlockElement.style.backgroundColor = "#ccc";
		ppBlockElement.style.width = "250px";
		ppBlockElement.style.lineHeight = "3.2";
		ppBlockElement.style.paddingLeft = "10px";
		ppBlockElement.style.cursor = "move";
		ppBlockElement.style.transition = "all 200ms";
		ppBlockElement.style.userSelect = "none";
		ppBlockElement.style.margin = "10px auto";
		ppBlockElement.style.position = "relative";
		ppBlockElement.style.borderColor = "black";
		ppBlockElement.style.borderWidth = "200px";
	});

	let overElements = document.querySelectorAll(".over");
	overElements.forEach((element: Element) => {
		const overElement = element as HTMLElement; // Cast to HTMLElement
		overElement.style.transform = "scale(1.1, 1.1)";
	});

	// Apply styles to ul
	let ulList = document.querySelectorAll('ul');
	ulList.forEach((ul: Element) => {
		const ulElement = ul as HTMLElement; // Cast to HTMLElement
		ulElement.style.padding = "0px";
	});

	// Styles for tabs
	let tabList = document.querySelectorAll('.tab');
	tabList.forEach((tab: Element) => {
		const tabElement = tab as HTMLElement;
		tabElement.style.overflow = "hidden";
		tabElement.style.border = "1px solid #ccc";
		tabElement.style.backgroundColor = "#f1f1f1";
	});

	let tabLinksList = document.querySelectorAll('.tab .tabLinks');
	tabLinksList.forEach((tabLinks: Element) => {
		const tabLinksElement = tabLinks as HTMLElement;
		tabLinksElement.style.backgroundColor = "";
		tabLinksElement.style.float = "left";
		tabLinksElement.style.border = "none";
		tabLinksElement.style.outline = "none";
		tabLinksElement.style.cursor = "pointer";
		tabLinksElement.style.padding = "14px 16px";
		tabLinksElement.style.transition = "0.3s";
		tabLinksElement.style.fontSize = "17px";
	});

	let tabButtonList = document.querySelectorAll('.tab button');
	tabButtonList.forEach((tabButton: Element) => {
		const tabButtonElement = tabButton as HTMLElement;
		tabButtonElement.addEventListener("mouseover", () => {
			tabButtonElement.style.backgroundColor = "#ddd";
		});
		tabButtonElement.addEventListener("mouseout", () => {
			tabButtonElement.style.backgroundColor = "";
		});
	})
	let activeTabButtonList = document.querySelectorAll('.tab button.active');
	activeTabButtonList.forEach((activeTabButton: Element) => {
		const activeTabButtonElement = activeTabButton as HTMLElement;
		activeTabButtonElement.style.backgroundColor = '#ccc';
	})
};

function createForm(titleContent: string) {
	//Creating form
	const box = document.createElement('fieldset');
	const overlay = document.createElement('form');
	const title = document.createElement('h3');
	title.textContent = titleContent;
	box.appendChild(overlay);
	overlay.appendChild(title);
	return [box, overlay];
};

function mcqRender(cellContent: any) {

	const question = document.createElement('p');
	question.textContent = cellContent[0];
	let optionContainer = document.createElement('div');

	// Rendering  Options
	for (let i = 1; i <= 4; i++) {
		const option = cellContent[i][0];

		let button = document.createElement('input');
		button.setAttribute('type', 'radio');
		button.setAttribute('name', 'mcq');
		button.classList.add('mcq', 'button');

		let label = document.createElement('label');
		label.innerText = cellContent[i].substring(1);
		label.innerText += '\n';
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

	}

	let submitButtonMCQ = document.createElement('button');
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
	console.log('Rendered by mcqRender()');
	return [question, optionContainer, submitButtonMCQ];
};

export const mcqOverlay = (cell: any, node: HTMLElement) => {

	// Creating form
	const [box, overlay] = createForm('Choose the most appropriate option');
	node.appendChild(box);

	// Fetching Question content from cell
	const cellContent = cell.toJSON().source.split('\n');
	const [question, optionContainer, submitButtonMCQ] = mcqRender(cellContent);
	overlay.appendChild(question);
	overlay.appendChild(optionContainer);
	box.appendChild(submitButtonMCQ);
};

function fibRender(cellContent: any) {
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
		question.setAttribute('line-height', '1.5');
	}

	const resultFIB = document.createElement('div');
	resultFIB.setAttribute('id', 'resultFIB');

	const submitButtonFIB = document.createElement('button');
	submitButtonFIB.textContent = "Submit";

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
	});
	console.log('Rendered by fibRender()');
	return [question, resultFIB, submitButtonFIB]
};

export const fibOverlay = (cell: any, node: HTMLElement) => {
	//Creating form
	const [box, overlay] = createForm('Fill in the Blanks');
	node.appendChild(box);

	// Fetching Question content from cell
	const cellContent = cell.toJSON().source.split(" ");
	const [question, resultFIB, submitButtonFIB] = fibRender(cellContent);
	overlay.appendChild(question);
	box.appendChild(resultFIB);
	box.appendChild(submitButtonFIB);
};

export const ppOverlay = (cell: any, node: HTMLElement) => {
	function dragStart(this: HTMLElement, event: DragEvent) {
		this.style.opacity = "0.4";
		dragSrcEl = this;
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
			dragSrcEl.innerHTML = this.innerHTML;
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
		const list = document.querySelectorAll(".PPblock");
		list.forEach(function (item) {
			item.classList.remove("over");
		});
		this.style.opacity = "1";
	}

	function addEventsDragAndDrop(el: HTMLElement) {
		el.addEventListener("dragstart", dragStart, false);
		el.addEventListener("dragenter", dragEnter, false);
		el.addEventListener("dragover", dragOver, false);
		el.addEventListener("dragleave", dragLeave, false);
		el.addEventListener("drop", dragDrop, false);
		el.addEventListener("dragend", dragEnd, false);
	}

	let dragSrcEl: HTMLElement | null;

	//Creating form
	const [box, overlay] = createForm('Reorder the following code blocks by dragging them');
	node.appendChild(box);

	const ppContainer = document.createElement('div');
	ppContainer.setAttribute('id', 'ppContainer');
	overlay.appendChild(ppContainer);
	const ppList = document.createElement('ul');
	ppList.setAttribute('id', 'ppList');
	ppContainer.appendChild(ppList);

	// Fetching Question content from cell
	const cellContent = cell.toJSON().source.split('\n');
	let correctAnswers: { [id: string]: string; } = {};
	let ppID = 1;
	for (let i = 0; i < cellContent.length; i++) {
		let statement = cellContent[i].trim();
		let key: string = `PP${ppID}`;
		correctAnswers[key] = statement;
		ppID++;
	}
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
	let ppBlocks = document.querySelectorAll(".PPblock");
	[].forEach.call(ppBlocks, function (item) {
		addEventsDragAndDrop(item);
	});

	const resultPP = document.createElement('div');
	resultPP.setAttribute('id', 'resultPP');
	box.appendChild(resultPP);

	const submitButtonPP = document.createElement('button');
	submitButtonPP.textContent = "Submit";
	box.appendChild(submitButtonPP);
	submitButtonPP.addEventListener('click', (event) => {
		event.preventDefault();
		let ppBlocks = document.querySelectorAll(".PPblock");
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
	})
}

export const scafOverlay = (cell: any, node: HTMLElement, id: string) => {
	return;
};

export const skelOverlay = (cell: any, node: HTMLElement, id: string) => {
	return;
};

export const tabsOverlay = (cell: any, node: HTMLElement, id: string) => {

	function openTab(event: Event, tabID: string) {
		// event.preventDefault();
		let tabContent = document.querySelectorAll(".tabContent");
		if (tabContent) {
			for (let i = 0; i < tabContent.length; i += 1) {
				const tabContentElement = tabContent[i] as HTMLElement;
				tabContentElement.style.display = "none";
			}
		}
		let tabLinks = document.querySelectorAll(".tabLinks");
		for (let i = 0; i < tabLinks.length; i += 1) {
			tabLinks[i].classList.remove("active");
		}
		let tab = document.getElementById(tabID);
		if (tab) {
			tab.style.display = "block";
		}
		if (event.target) {
			const eventElem = event.target as HTMLElement;
			eventElem.classList.add('active');
		}
	}

	function createTabButton(id: string, title: string) {
		let btn = document.createElement('button');
		btn.setAttribute('id', id);
		btn.classList.add('tabLinks');
		btn.innerHTML = title;
		btn.addEventListener('click', (event) => {
			openTab(event, id);
		});
		return btn;
	}

	function creatTabDiv(id: string) {
		const tabDiv = document.createElement('div');
		tabDiv.setAttribute('id', id);
		tabDiv.classList.add('tabContent');
		return tabDiv;
	}

	const tab = document.createElement('div');
	node.appendChild(tab);
	tab.classList.add('tab');

	const tabLinkNames = ['MCQTabLink', 'FIBTabLink', 'PPTabLink'];
	const tabDivNames = ['MCQTabDiv', 'FIBTabDiv', 'PPTabDiv']
	const qTypes = ['Multiple Choice Questions', 'Fill in the Blanks', "Parson's Problems"];
	for (let i = 0; i < qTypes.length; i++) {
		const btn = createTabButton(tabLinkNames[i], qTypes[i]);
		tab.appendChild(btn);
	}
	for (let i = 0; i < qTypes.length; i++) {
		const tabDiv = creatTabDiv(tabDivNames[i]);
		node.appendChild(tabDiv);
	}


	const cellContent = cell.toJSON().source.split('---');
	for (let i = 1; i < cellContent.length; i++) {
		let questionType = cellContent[i].substring(0, 2);
		let questionContent = cellContent[i].substring(3);
		console.log(questionContent);

		switch (questionType) {
			case 'mc': {
				const tabDiv = document.querySelector('#MCQTabDiv');
				const [box, overlay] = createForm('Choose the most appropriate option');
				tabDiv?.appendChild(box);
				const [question, optionContainer, submitButtonMCQ] = mcqRender(questionContent.split('\n'));
				overlay.appendChild(question);
				overlay.appendChild(optionContainer);
				box.appendChild(submitButtonMCQ);
				break;
			}
			case 'fb': {
				break;
			}
			case 'pp': {
				break;
			}
		}
	}
	return;
};