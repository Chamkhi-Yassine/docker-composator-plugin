import DockerComposatorPlugin from 'src/models/DockerComposatorPlugin';

describe('DockerComposatorPlugin', () => {
  it('should create a DockerComposatorPlugin instance ', () => {
    const plugin = new DockerComposatorPlugin();
    expect(plugin).not.toBeNull();
    expect(plugin).toBeInstanceOf(DockerComposatorPlugin);
  });
});
