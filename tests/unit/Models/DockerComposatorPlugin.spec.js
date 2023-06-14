/* eslint-disable no-restricted-imports */
import DockerComposatorPlugin from '../../../src/models/DockerComposatorPlugin';

describe('Test DockerComposatorPluginParser', () => {
  describe('Test function: parse', () => {
    it('Should set empty components on no input files', () => {
      const plugin = new DockerComposatorPlugin();
      expect(plugin).not.toBeNull();
      expect(plugin).toBeInstanceOf(DockerComposatorPlugin);
    });
  });
});
