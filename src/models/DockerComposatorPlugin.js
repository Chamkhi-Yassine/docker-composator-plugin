import {
  DefaultPlugin,
  DefaultData,
} from 'leto-modelizer-plugin-core';
import DockerComposatorPluginDrawer from '../draw/DockerComposatorPluginDrawer';
import DockerComposatorPluginMetadata from '../metadata/DockerComposatorPluginMetadata';
import DockerComposatorPluginParser from '../parser/DockerComposatorPluginParser';
import DockerComposatorPluginRenderer from '../render/DockerComposatorPluginRenderer';
import packageInfo from '../../package.json';

/**
 * Template of plugin model.
 */

const PACKAGE_NAME = packageInfo.name
const PACKAGE_VERSION = packageInfo.version
class DockerComposatorPlugin extends DefaultPlugin {
  /**
   * Default constructor.
   */
  constructor() {
    const pluginData = new DefaultData({
      PACKAGE_NAME,
      PACKAGE_VERSION,
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
