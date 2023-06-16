import { DefaultConfiguration } from 'leto-modelizer-plugin-core';

/**
 * Terrator configuration.
 */
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
      },
      tags: ['Docker', 'Docker-Compose'],
    });
  }
}

export default DockerComposatorConfiguration;
