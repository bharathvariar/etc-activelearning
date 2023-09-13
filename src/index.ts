import {
  JupyterFrontEnd,
  JupyterFrontEndPlugin
} from '@jupyterlab/application';

/**
 * Initialization data for the etc_activelearning extension.
 */
const plugin: JupyterFrontEndPlugin<void> = {
  id: 'etc_activelearning:plugin',
  description: 'A JupyterLab extension that enables data-science instructors to improve teaching by including tasks for students to complete during video lecutres on MOOCs',
  autoStart: true,
  activate: (app: JupyterFrontEnd) => {
    console.log('JupyterLab extension etc_activelearning is activated!');
  }
};

export default plugin;
