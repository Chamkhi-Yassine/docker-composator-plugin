import DockerComposatorPluginComponent from 'src/models/DockerComposatorPluginComponent';

export default class MockPluginData {
  getChildren(id) {
    return [
      new DockerComposatorPluginComponent({
        id,
        definition: {
          type: 'WrongType',
        },
      }),
    ];
  }
}
