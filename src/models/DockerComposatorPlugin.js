/* eslint-disable no-restricted-imports */
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

class DockerComposatorPlugin extends DefaultPlugin {
  /**
   * Default constructor.
   */

  constructor(props = {
    event: null,
  }) {
    const pluginData = new DefaultData({
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

  getMeta() {
    return this.pluginData.definition.components;
  }
}

export default DockerComposatorPlugin;
