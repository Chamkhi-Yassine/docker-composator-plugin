import dataGetLinkTestsPluginData from 'tests/resources/models/DataGetLinkTests';

describe('DockerComposatorData', () => {
  describe('Test function:  getLinks', () => {
    it('should return component links based on service link attributes', () => {
      const data = dataGetLinkTestsPluginData;

      const links = data.getLinks();
      expect(links.length).toBe(3);
      expect(links).toContainEqual(
        expect.objectContaining({ source: 'veterinary-ms', target: 'veterinary-config-server' }),
        expect.objectContaining({ source: 'veterinary-ms', target: 'backend' }),
        expect.objectContaining({ source: 'veterinary-ms', target: 'data' }),
      );
    });
  });
});
