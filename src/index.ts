import {
	JupyterFrontEnd,
	JupyterFrontEndPlugin
} from '@jupyterlab/application';
import { INotebookTracker, NotebookPanel } from '@jupyterlab/notebook';
import { hideCells, applyStyles, mcqOverlay, ppOverlay, fibOverlay, scafOverlay, skelOverlay, tabsOverlay } from './utils'

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
		notebooktracker.widgetAdded.connect(async (_, notebookPanel: NotebookPanel) => {
			await notebookPanel.revealed;
			const notebook = app.shell.currentWidget as NotebookPanel;
			const cellList = notebookPanel.content.model?.cells;
			requestAnimationFrame(() => {
				console.log('eventlistener');
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
							// hideCells(cellElement.node);
						}
						switch (activelearning) {
							case 'mcq': {
								console.log("activelearning: ", activelearning);
								if (cellElement) {
									// hideCells(cellElement.node);
									mcqOverlay(cell, cellElement.node);
								}
								break;
							}
							case 'fib': {
								console.log("activelearning:  ", activelearning);
								if (cellElement) {
									// hideCells(cellElement.node);
									fibOverlay(cell, cellElement.node);
								}
								break;
							}
							case 'pp': {
								console.log("activelearning:  ", activelearning);
								if (cellElement) {
									ppOverlay(cell, cellElement.node);
								}
								break;
							}
							case 'scaf': {
								console.log("activelearning:  ", activelearning);
								if (cellElement) {
									scafOverlay(cell, cellElement?.node, cellElement?.model.id);
								}
								break;
							}
							case 'skel': {
								console.log("activelearning:  ", activelearning);
								if (cellElement) {
									skelOverlay(cell, cellElement?.node, cellElement?.model.id);
								}
								break;
							}

							case 'tab': {
								console.log("activelearning: ", activelearning);
								if (cellElement) {
									tabsOverlay(cell, cellElement?.node, cellElement.model.id);
								}
								break;
							}
						}

					}
				}
			};
		}
		)
	}
};

export default plugin;
