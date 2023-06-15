import { ComponentAttribute } from 'leto-modelizer-plugin-core';
import DockerComposatorData from 'src/models/DockerComposatorData';
import DockerComposatorPluginComponent from 'src/models/DockerComposatorPluginComponent';
import DockerComposatorPluginMetadata from 'src/metadata/DockerComposatorPluginMetadata';

const pluginData = new DockerComposatorData();
const metadata = new DockerComposatorPluginMetadata(pluginData);
metadata.parse();

const dockerComposeDef = pluginData.definitions.components
  .find(({ type }) => type === 'Docker-Compose');

const dockerCompose = new DockerComposatorPluginComponent({
  id: 'empty-compose',
  path: './empty-compose.yaml',
  definition: dockerComposeDef,
  attributes: [
    new ComponentAttribute({
      name: 'version',
      type: 'String',
      definition: dockerComposeDef.definedAttributes
        .find(({ name }) => name === 'version'),
      value: '3.9',
    }),
  ],
});

pluginData.components.push(dockerCompose);

export default pluginData;
