import {
  DefaultPlugin,
} from 'leto-modelizer-plugin-core';
import DockerComposatorData from '../models/DockerComposatorData';
import DockerComposatorDrawer from '../draw/DockerComposatorDrawer';
import DockerComposatorMetadata from '../metadata/DockerComposatorMetadata';
import DockerComposatorParser from '../parser/DockerComposatorParser';
import DockerComposatorRenderer from '../render/DockerComposatorRenderer';
import DockerComposatorConfiguration from '../models/DockerComposatorConfiguration';
import packageInfo from '../../package.json';

/**
 * Docker compose plugin.
 */
class DockerComposatorPlugin extends DefaultPlugin {
  /**
   * Default constructor.
   * @param {object} props - Plugin properties.
   * @param {string} props.event - Event data.
   */
  constructor(props = {
    event: null,
  }) {
    const configuration = new DockerComposatorConfiguration({
      defaultFileName: 'docker-compose.yaml',
      defaultFileExtension: 'yaml',
    });

    const pluginData = new DockerComposatorData(configuration, {
      name: packageInfo.name,
      version: packageInfo.version,
    }, props.event);

    super({
      pluginData,
      pluginDrawer: new DockerComposatorDrawer(pluginData),
      pluginMetadata: new DockerComposatorMetadata(pluginData),
      pluginParser: new DockerComposatorParser(pluginData),
      pluginRenderer: new DockerComposatorRenderer(pluginData),
      configuration,
    });
  }
}

export default DockerComposatorPlugin;
