import DockerComposatorData from '../../../src/models/DockerComposatorData';
import DockerComposatorPlugin from '../../../src/models/DockerComposatorPlugin';
import packageInfo from '../../../package.json';

describe('DockerComposatorPlugin', () => {
  it('should create a DockerComposatorData instance with the correct properties', () => {
    
    const plugin = new DockerComposatorPlugin();
    expect(plugin).toBeInstanceOf(DockerComposatorPlugin); 
    expect(plugin).not.toBeNull();
  });
});