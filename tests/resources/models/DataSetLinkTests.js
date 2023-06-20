import { ComponentLinkDefinition } from 'leto-modelizer-plugin-core';
import DockerComposatorData from 'src/models/DockerComposatorData';
import DockerComposatorMetadata from 'src/metadata/DockerComposatorMetadata';

const pluginData = new DockerComposatorData();
const metadata = new DockerComposatorMetadata(pluginData);
metadata.parse();

const linkDefinition1 = new ComponentLinkDefinition({
  attributeRef: 'LinkAttribute1',
  sourceRef: 'Service',
  targetRef: 'Service',
  type: 'LinkType1',
});

const linkDefinition2 = new ComponentLinkDefinition({
  attributeRef: 'LinkAttribute2',
  sourceRef: 'Service',
  targetRef: 'Network',
  type: 'LinkType2',
  color: 'blue',
});

pluginData.definitions.links.push(linkDefinition1);
pluginData.definitions.links.push(linkDefinition2);

export default pluginData;
