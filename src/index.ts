import {
	JupyterFrontEnd,
	JupyterFrontEndPlugin
} from '@jupyterlab/application';
import { INotebookTracker, NotebookPanel } from '@jupyterlab/notebook';
import { mcqOverlay, ppOverlay, fibOverlay, scafOverlay, skelOverlay } from './utils'

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
			// waits for widget to be added. 
			// Connect runs when it receives a signal on added widget and then we fetch the notebook panel
			// Logic for getting cell list
			// ? -> ensures that no errors even if the notebook is empty
			await notebookPanel.revealed;
			const notebook = app.shell.currentWidget as NotebookPanel;
			const cellList = notebookPanel.content.model?.cells;
			if (cellList !== undefined) {
				for (let i = 0; i < cellList.length; i++) {
					let cell = cellList?.get(i);
					let metadata = cell.metadata;
					let activelearning = metadata?.activelearning;
					if (activelearning) {
						const cellElement = notebook.content.widgets.find(widget => {
							return widget.model === cell;
						});
						// CSS
						switch (activelearning) {
							case 'mcq': {
								if (cellElement) {
									mcqOverlay(cell, cellElement.node, cellElement?.model.id);
								}
								console.log("activelearning: ", activelearning);
								break;
							}
							case 'pp': {
								if (cellElement) {
									ppOverlay(cell, cellElement.node, cellElement?.model.id);
								}
								console.log("activelearning:  ", activelearning);
								break;
							}
							case 'fib': {
								if (cellElement) {
									fibOverlay(cell, cellElement.node, cellElement?.model.id);
								}
								console.log("activelearning:  ", activelearning);
								break;
							}
							case 'scaf': {
								if (cellElement) {
									scafOverlay(cell, cellElement?.node, cellElement?.model.id);
								}
								console.log("activelearning:  ", activelearning);
								break;
							}
							case 'skel': {
								if (cellElement) {
									skelOverlay(cell, cellElement?.node, cellElement?.model.id);
								}
								console.log("activelearning:  ", activelearning);
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
