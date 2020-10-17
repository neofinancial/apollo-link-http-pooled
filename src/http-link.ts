/* eslint-disable unicorn/no-nested-ternary */
import fetch from 'cross-fetch';
import { ApolloLink } from 'apollo-link';
import { HttpLink, FetchOptions as DefaultFetchOptions } from 'apollo-link-http';
import HttpAgent, { HttpsAgent, AgentStatus as AgentKeepaliveStatus } from 'agentkeepalive';
import CacheableLookup from 'cacheable-lookup';

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface HttpLinkPooledOpts extends Omit<DefaultFetchOptions, 'uri'> {
  uri: string;
  forceHttps?: boolean;
  enableDnsCache?: boolean;
  enableKeepalive?: boolean;
  freeSocketTimeout?: number;
  dnsCacheTtl?: number;
}

export type AgentStatus = AgentKeepaliveStatus;

class HttpLinkPooled extends HttpLink {
  private agent?: HttpAgent | HttpsAgent;

  constructor(linkOptions: HttpLinkPooledOpts) {
    const agentOptions = linkOptions.fetchOptions?.agent || {};

    if (linkOptions.enableKeepalive) {
      Object.assign(agentOptions, {
        keepAlive: true,
        freeSocketTimeout: linkOptions.freeSocketTimeout || 15000
      });
    } else {
      Object.assign(agentOptions, {
        keepAlive: false
      });
    }

    if (linkOptions.enableDnsCache) {
      Object.assign(agentOptions, {
        lookup: new CacheableLookup({
          maxTtl: linkOptions.dnsCacheTtl || 5 * 60
        }).lookup
      });
    }

    let agent: HttpsAgent | HttpAgent | undefined;

    if (linkOptions.fetchOptions?.agent || linkOptions.enableDnsCache || linkOptions.enableKeepalive) {
      const isHttps = linkOptions.forceHttps || (linkOptions.uri || '').toLowerCase().startsWith('https');

      agent = isHttps ? new HttpsAgent(agentOptions) : new HttpAgent(agentOptions);

      Object.assign(linkOptions, {
        fetchOptions: Object.assign({}, linkOptions.fetchOptions, { agent })
      });
    }

    super(linkOptions);
    this.agent = agent;
  }

  public getAgentStatus(): AgentStatus | undefined {
    return this.agent?.getCurrentStatus();
  }
}

// This is to remain backwards-compatible with apollo-link-http
function createHttpLink(linkOptions?: HttpLinkPooledOpts): ApolloLink {
  const fetchOptions: HttpLinkPooledOpts = linkOptions || { uri: '/graphql' };

  fetchOptions.uri = fetchOptions.uri || '/graphql';
  fetchOptions.fetch = fetchOptions.fetch || fetch;

  return new HttpLinkPooled(fetchOptions);
}

export { HttpLinkPooled, createHttpLink };
