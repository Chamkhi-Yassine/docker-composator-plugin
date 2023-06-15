import {
  DefaultPlugin,
} from 'leto-modelizer-plugin-core';
import DockerComposatorData from 'src/models/DockerComposatorData';
import DockerComposatorPluginDrawer from 'src/draw/DockerComposatorPluginDrawer';
import DockerComposatorPluginMetadata from 'src/metadata/DockerComposatorPluginMetadata';
import DockerComposatorPluginParser from 'src/parser/DockerComposatorPluginParser';
import DockerComposatorPluginRenderer from 'src/render/DockerComposatorPluginRenderer';
import packageInfo from 'package.json';

class DockerComposatorPlugin extends DefaultPlugin {
  /**
   * Default constructor.
   */

  constructor(props = {
    event: null,
  }) {
    const pluginData = new DockerComposatorData({
      name: packageInfo.name,
      version: packageInfo.version,
    }, props.event);

    super({
      pluginData,
      pluginDrawer: new DockerComposatorPluginDrawer(pluginData),
      pluginMetadata: new DockerComposatorPluginMetadata(pluginData),
      pluginParser: new DockerComposatorPluginParser(pluginData),
      pluginRenderer: new DockerComposatorPluginRenderer(pluginData),
    });
  }
}

export default DockerComposatorPlugin;
