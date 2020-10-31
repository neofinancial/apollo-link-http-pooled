
import { createHttpLink } from "../src/http-link";
import { createMockFetch, executeRequest } from './link-utils';

describe('Apollo Link Http Pooled', () => {
  it("behaves as a Http Link", async () => {
    const url = 'http://localhost';
    const pooledLink = createHttpLink({
      uri: url,
      enableDnsCache: true,
      enableKeepalive: true,
      fetch: createMockFetch({}, { foo: 'bar' }, url)
    })
  
    const value = await executeRequest(pooledLink);

    expect(value.data?.foo).toBe('bar');
  });
});