import { DefaultParser } from 'leto-modelizer-plugin-core';
import { parse as lidyParse } from 'src/lidy/dcompose';
import DockerComposatorPluginListener from 'src/parser/DockerComposatorPluginListener';

/**
 * Template of plugin parser.
 */
class DockerComposatorPluginParser extends DefaultParser {
  /**
   * Check if the file is parsable by this parser.
   * @param {FileInput} fileInformation - Information about the file.
   * @returns {boolean} True if the file is parsable, false otherwise.
   */
  isParsable(fileInformation) {
    return /\.ya?ml$/.test(fileInformation.path);
  }

  /**
   * Parse the content of files into Components.
   * @param {FileInput[]} [inputs=[]] - Data to parse.
   * @param {string} [parentEventId=null] - Parent event id.
   */
  parse(inputs = [], parentEventId = null) {
    this.pluginData.components = [];
    this.pluginData.parseErrors = [];

    inputs
      .filter(({ content, path }) => {
        if (content && content.trim() !== '') {
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
      })
      .forEach((input) => {
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
        const listener = new DockerComposatorPluginListener(
          input,
          this.pluginData.definitions.components,
        );

        lidyParse({
          src_data: input.content,
          listener,
          path: input.path,
          prog: {
            errors: [],
            warnings: [],
            imports: [],
            alreadyImported: [],
            root: [],
          },
        });

        this.pluginData.components.push(...listener.components);
        this.pluginData.emitEvent({ id, status: 'success' });
      });
  }
}

export default DockerComposatorPluginParser;
