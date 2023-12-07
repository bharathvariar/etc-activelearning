import {
	JupyterFrontEnd,
	JupyterFrontEndPlugin
} from '@jupyterlab/application';
import { INotebookTracker, NotebookPanel } from '@jupyterlab/notebook';
import { applyStyles, mcqOverlay, ppOverlay, fibOverlay, tabsOverlay } from './utils'

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
		notebooktracker.widgetAdded.connect((_, notebookPanel: NotebookPanel) => {
			notebookPanel.revealed.then(() => {

				const notebook = app.shell.currentWidget as NotebookPanel;
				const cellList = notebookPanel.content.model?.cells;
				requestAnimationFrame(() => {
					applyStyles();
				});
				if (cellList !== undefined) {
					for (let i = 0; i < cellList.length; i++) {
						let cell = cellList?.get(i);
						let metadata = cell.metadata;
						let activelearning = metadata?.activelearning;
						if (activelearning) {
							const cellElement = notebook.content.widgets.find(widget => {
								return widget.model === cell;
							});
							if (cellElement) {
								cellElement.node.classList.add('activelearning');
							}
							switch (activelearning) {
								case 'mcq': {
									console.log("activelearning:", activelearning);
									if (cellElement) {
										mcqOverlay(cell, cellElement.node);
									}
									break;
								}
								case 'tab': {
									console.log("activelearning:", activelearning);
									console.log("tab:", cellElement);
									if (cellElement) {
										tabsOverlay(cell, cellElement.node);
									}
									break;
								}
								case 'fib': {
									console.log("activelearning:", activelearning);
									if (cellElement) {
										fibOverlay(cell, cellElement.node);
									}
									break;
								}
								case 'pp': {
									console.log("activelearning:", activelearning);
									if (cellElement) {
										ppOverlay(cell, cellElement.node);
									}
									break;
								}

							}


						}
					}
				};
			});
		}
		)
	}
};

export default plugin;
