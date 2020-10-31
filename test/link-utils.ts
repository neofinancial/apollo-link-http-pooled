import ResponseLike from "responselike";
import gql from "graphql-tag";
import { ApolloLink, execute } from "apollo-link";

import { FetchResult } from "@apollo/client/core";

const responseHeaders =  {};
const responseObject = { foo: 'bar' };

class MockResponse extends ResponseLike {
  public async text() {
    return this.body.toString();
  }
}

type FetchType = (input: RequestInfo, init?: RequestInit) => Promise<Response>;
type HeadersType = { [header: string]: string | string[] | undefined };

const createMockFetch = (headers: HeadersType = responseHeaders, body: object = responseObject, url?: string): FetchType => {
  return async (requestInfo: RequestInfo): Promise<Response> => {
    const uri: string = url || (typeof requestInfo === 'string') ? (requestInfo as string) : (requestInfo as Request)?.url;

    return new MockResponse(200, headers, Buffer.from(JSON.stringify(
      {
        data: body
      }
    )), uri) as unknown as Response
  }
}

const MockQuery = gql`
  query {
    foo
  }
`;

const executeRequest = async (link: ApolloLink): Promise<FetchResult> => {
  return new Promise((resolve, reject) => {
      // Apollo uses Observables. 
      execute(link, { query: MockQuery }).subscribe(
        (value) => resolve(value), 
        (error) => reject(error)
      );
  })
}

export {
  MockResponse, MockQuery, createMockFetch, executeRequest
}