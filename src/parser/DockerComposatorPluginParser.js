/* eslint-disable object-shorthand */
/* eslint-disable no-restricted-imports */
import { DefaultParser } from 'leto-modelizer-plugin-core';
import { parse as lidyParse } from '../lidy/dcompose';
import DockerComposatorPluginListener from './DockerComposatorPluginListener';

/**
 * Template of plugin parser.
 */
class DockerComposatorPluginParser extends DefaultParser {
  isParsable(fileInformation) {
    /*
     * Implement this to indicate which fileInformation your provider can manage.
     *
     * You just have to return a Boolean to say if your parser can manage the file or not.
     *
     * By default, this function return false only on null/undefined fileInformation.
     */
    return /\.ya?ml$/.test(fileInformation.path);
  }

  /**
   * Convert the content of files into Components.
   * @param {FileInput[]} [inputs=[]] - Data you want to parse.
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
        // console.log(this.pluginData.components);
        this.pluginData.emitEvent({ id, status: 'success' });
      });
  }
}

export default DockerComposatorPluginParser;
