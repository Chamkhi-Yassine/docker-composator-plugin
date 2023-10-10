import dataGetLinkTestsPluginData from 'tests/resources/models/DataGetLinkTests';

describe('DockerComposatorData', () => {
  describe('Test function:  getLinks', () => {
    it('should return component links based on depends_on attribute', () => {
      const data = dataGetLinkTestsPluginData;

      const links = data.getLinks();
      expect(links.length).toBe(2);
      expect(links).toContainEqual(
        expect.objectContaining({ source: 'veterinary-ms', target: 'veterinary-config-server' }),
      );
    });

    it('should return component links based on attribute values', () => {
      const data = dataGetLinkTestsPluginData;

      const links = data.getLinks();
      expect(links.length).toBe(2);
      expect(links).toContainEqual(
        expect.objectContaining({ source: 'veterinary-config-server', target: 'backend' }),
      );
    });
  });
});
