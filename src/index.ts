import {
	JupyterFrontEnd,
	JupyterFrontEndPlugin
} from '@jupyterlab/application';
import { INotebookTracker, NotebookPanel } from '@jupyterlab/notebook';

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
			const cellList = notebookPanel.content.model?.cells;
			if (cellList !== undefined) {
				for (let i = 0; i < cellList.length; i++) {
					let cell = cellList?.get(i);
					let metadata = cell.metadata;
					if (metadata?.activelearning) {
						// CSS
					}
				}
			};
		}
		)
	}
};

export default plugin;
