import fs from 'fs';
import DockerComposatorPluginMetadata from 'src/metadata/DockerComposatorPluginMetadata';
import DockerComposatorData from 'src/models/DockerComposatorData';

/**
 * Convert a JSON component definition object to a KubernetesComponentDefinition.
 * @param {string} metadataName - metadata name.
 * @param {string} metadataUrl - path to metadata JSON file.
 * @returns {DockerComposatorPluginMetadata} DockerComposatorPluginMetadata instance containing metadata
 * from specified url.
 */
export function getComposatorMetadata(metadataName, metadataUrl) {
  const metadata = JSON.parse(fs.readFileSync(metadataUrl, 'utf8'));
  const dockerComposatorPluginMetadata = new DockerComposatorPluginMetadata(new DockerComposatorData());
  dockerComposatorPluginMetadata.jsonComponents = metadata;
  return dockerComposatorPluginMetadata;
}
