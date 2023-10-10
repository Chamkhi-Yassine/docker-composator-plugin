import { DefaultParser } from 'leto-modelizer-plugin-core';
import { parse as lidyParse } from '../lidy/dcompose';
import DockerComposatorListener from '../parser/DockerComposatorListener';

/**
 * Class to parse and retrieve components/links from Docker compose files.
 */
class DockerComposatorParser extends DefaultParser {
  /**
   * Default constructor.
   * @param {PluginData} [pluginData] - pluginData - Plugin data with components
   */
  constructor(pluginData) {
    super(pluginData);
    this.listener = new DockerComposatorListener();
  }

  /**
   * Indicate if this parser can parse this file.
   * @param {FileInformation} [fileInformation] - File information.
   * @returns {boolean} Boolean that indicates if this file can be parsed or not.
   */
  isParsable(fileInformation) {
    return /\.ya?ml$/.test(fileInformation.path);
  }

  /**
   * Convert the content of files into Components.
   * @param {FileInformation} diagram - Diagram file information.
   * @param {FileInput[]} [inputs=[]] - Data you want to parse.
   * @param {string} [parentEventId=null] - Parent event id.
   */
  parse(diagram, inputs = [], parentEventId = null) {
    this.pluginData.components = [];
    this.pluginData.parseErrors = [];

    inputs.filter(({ content, path }) => {
      if (diagram.path === path && content && content.trim() !== '') {
        return true;
      }
      this.pluginData.emitEvent({
        parent: parentEventId,
        type: 'Parser',
        action: 'read',
        status: 'warning',
        files: [path],
        data: {
          code: 'no_content',
          global: false,
        },
      });
      return false;
    }).forEach((input) => {
      const id = this.pluginData.emitEvent({
        parent: parentEventId,
        type: 'Parser',
        action: 'read',
        status: 'running',
        files: [input.path],
        data: {
          global: false,
        },
      });
      // const listener = new DockerComposatorListener(input, this.pluginData.definitions.components);
      this.listener.fileInformation = input;
      this.listener.definitions = this.pluginData.definitions.components;
      this.listener.components = this.pluginData.components;
      lidyParse({
        src_data: input.content,
        listener: this.listener,
        path: input.path,
        prog: {
          errors: [],
          warnings: [],
          imports: [],
          alreadyImported: [],
          root: [],
        },
      });
      this.listener.childComponentsByType = {};

      this.pluginData.emitEvent({ id, status: 'success' });
    });
  }
}

export default DockerComposatorParser;
