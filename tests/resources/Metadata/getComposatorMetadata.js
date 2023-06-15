import fs from 'fs';
import DockerComposatorPluginMetadata from '../../../src/metadata/DockerComposatorPluginMetadata';
import  DockerComposatorData  from '../../../src/models/DockerComposatorData';


export function getComposatorMetadata(metadataName, metadataUrl) {
  const metadata = JSON.parse(fs.readFileSync(metadataUrl, 'utf8'));
  const dockerComposatorPluginMetadata = new DockerComposatorPluginMetadata(new DockerComposatorData());
  dockerComposatorPluginMetadata.jsonComponents = metadata;
  return dockerComposatorPluginMetadata;
}