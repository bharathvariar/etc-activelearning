import {
	JupyterFrontEnd,
	JupyterFrontEndPlugin
} from '@jupyterlab/application';
import { INotebookTracker, NotebookPanel } from '@jupyterlab/notebook';
import { mcqOverlay, ppOverlay, fibOverlay, tabsOverlay } from './utils';

/**
 * Initialization data for the etc_activelearning extension.
 */
const plugin: JupyterFrontEndPlugin<void> = {
	id: 'etc_activelearning:plugin',
	description: 'A JupyterLab extension that enables data-science instructors to improve teaching by including tasks for students to complete during video lecutres on MOOCs',
	autoStart: true,
	requires: [INotebookTracker],
	activate: async (
		app: JupyterFrontEnd,
		notebooktracker: INotebookTracker
	) => {
		console.log('JupyterLab extension etc_activelearning is activated!');

		// Connect to the notebook widget added event
		notebooktracker.widgetAdded.connect((_, notebookPanel: NotebookPanel) => {
			notebookPanel.revealed.then(() => {

				// Access the current notebook and its cell list
				const notebook = app.shell.currentWidget as NotebookPanel;
				const cellList = notebookPanel.content.model?.cells;

				if (cellList !== undefined) {
					// Iterate through each cell in the notebook
					for (let i = 0; i < cellList.length; i++) {
						let cell = cellList?.get(i);
						let metadata = cell.metadata;
						let activelearning = metadata?.activelearning;

						// Check if the cell has an activelearning metadata
						if (activelearning) {
							// Find the corresponding cell element in the notebook
							const cellElement = notebook.content.widgets.find(widget => {
								return widget.model === cell;
							});

							// Add a CSS class to the cell for styling
							if (cellElement) {
								cellElement.node.classList.add('activelearning');
							}

							// Apply overlays based on the activelearning type
							switch (activelearning) {
								case 'mcq': {
									if (cellElement) {
										mcqOverlay(cell, cellElement.node);
									}
									break;
								}
								case 'tab': {
									if (cellElement) {
										tabsOverlay(cell, cellElement.node);
									}
									break;
								}
								case 'fib': {
									if (cellElement) {
										fibOverlay(cell, cellElement.node);
									}
									break;
								}
								case 'pp': {
									if (cellElement) {
										ppOverlay(cell, cellElement.node);
									}
									break;
								}
							}
						}
					}
				}
			});
		});
	}
};

export default plugin;