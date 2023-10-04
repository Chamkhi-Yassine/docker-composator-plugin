import { DefaultConfiguration, Tag } from 'leto-modelizer-plugin-core';
import syntax from 'src/configuration/syntax';

class DockerComposatorConfiguration extends DefaultConfiguration {
  /**
   * Default constructor.
   * @param {object} [props] - Object that contains all properties to set.
   */
  constructor(props) {
    super({
      ...props,
      editor: {
        ...props.editor,
        syntax,
      },
      tags: [
        new Tag({ type: 'language', value: 'Docker-Compose' }),
        new Tag({ type: 'category', value: 'Container Orchestration' }),
      ],
    });
  }
}

export default DockerComposatorConfiguration;
