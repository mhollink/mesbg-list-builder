import type { SearchCategory, SearchResult } from "../domain/search.types";

export interface SearchRequest {
  query: string;
  normalizedQuery: string;
  limit: number;
}

export interface SearchResponse {
  results: SearchResult[];
  total: number;
}

export interface SearchProvider {
  id: string;
  category: SearchCategory;

  search(request: SearchRequest): SearchResponse | Promise<SearchResponse>;
}
