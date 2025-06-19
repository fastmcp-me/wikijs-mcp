import { GraphQLClient } from 'graphql-request';
import { getSdk, Sdk } from	'./generated/graphql.js';

export class WikiJSClient {
  private sdk: Sdk;

  constructor(endpoint: string, authToken: string) {
    const defaultHeaders = {
      Authorization: `Bearer ${authToken}`
    };

    const endpointWithGraphql = `${endpoint}/graphql`;
    
    const client = new GraphQLClient(endpointWithGraphql, {
      headers: defaultHeaders
    });

    this.sdk = getSdk(client);
  }


  async searchPages(query: string, path?: string, locale?: string) {
    const result = await this.sdk.SearchPages({ query, path, locale });
    return result.pages?.search || { results: [], suggestions: [], totalHits: 0 };
  }

  async getAllPages({limit, locale, tags}: {limit?: number, locale?: string, tags?: string[]} = {}) {
    const result = await this.sdk.GetAllPages({ limit, locale, tags });
    return result.pages?.list || [];
  }

  async getPageById(id: number) {
    const result = await this.sdk.GetPageById({ id });
    return result.pages?.single || null;
  }

  async getPageByPath(path: string, locale: string) {
    const result = await this.sdk.GetPageByPath({ path, locale });
    return result.pages?.singleByPath || null;
  }
} 
