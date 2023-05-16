import {
  DefaultPlugin,
  DefaultData,
} from 'leto-modelizer-plugin-core';
import DockerComposatorPluginDrawer from 'src/draw/DockerComposatorPluginDrawer';
import DockerComposatorPluginMetadata from 'src/metadata/DockerComposatorPluginMetadata';
import DockerComposatorPluginParser from 'src/parser/DockerComposatorPluginParser';
import DockerComposatorPluginRenderer from 'src/render/DockerComposatorPluginRenderer';
import { name, version } from 'package.json';

/**
 * Template of plugin model.
 */
class DockerComposatorPlugin extends DefaultPlugin {
  /**
   * Default constructor.
   */
  constructor() {
    const pluginData = new DefaultData({
      name,
      version,
    });

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
