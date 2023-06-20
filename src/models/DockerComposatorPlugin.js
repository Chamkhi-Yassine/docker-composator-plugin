import {
  DefaultPlugin,
} from 'leto-modelizer-plugin-core';
import DockerComposatorData from 'src/models/DockerComposatorData';
import DockerComposatorDrawer from 'src/draw/DockerComposatorDrawer';
import DockerComposatorMetadata from 'src/metadata/DockerComposatorMetadata';
import DockerComposatorParser from 'src/parser/DockerComposatorParser';
import DockerComposatorRenderer from 'src/render/DockerComposatorRenderer';
import DockerComposatorConfiguration from 'src/models/DockerComposatorConfiguration';
import packageInfo from 'package.json';

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
      defaultFileName: 'new_file.yaml',
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
