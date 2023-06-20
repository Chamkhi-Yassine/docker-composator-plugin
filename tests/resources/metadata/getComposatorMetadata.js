import fs from 'fs';
import DockerComposatorMetadata from 'src/metadata/DockerComposatorMetadata';
import DockerComposatorData from 'src/models/DockerComposatorData';

/**
 * Create metadata from a specific metadata JSON file.
 * @param {string} metadataName - metadata name.
 * @param {string} metadataUrl - path to metadata JSON file.
 * @returns {DockerComposatorMetadata} DockerComposatorMetadata instance containing metadata
 * from specified url.
 */
export function getComposatorMetadata(metadataName, metadataUrl) {
  const metadata = JSON.parse(fs.readFileSync(metadataUrl, 'utf8'));
  const dockerComposatorPluginMetadata = new DockerComposatorMetadata(new DockerComposatorData());
  dockerComposatorPluginMetadata.jsonComponents = metadata;
  return dockerComposatorPluginMetadata;
}
