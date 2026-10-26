import type {
  SearchRequest,
  SearchResponse,
} from "../providers/search-provider.types.ts";
import type {
  SearchCategory,
  SearchResult,
  SearchTarget,
} from "./search.types.ts";
import { normalizeSearchText } from "~/utils/normalize.ts";
import { stripHtml } from "~/utils/stripHtml.ts";

export interface SearchDocument {
  key: string;
  category: SearchCategory;
  title: string;
  subtitle?: string;
  keywords: string[];
  description?: string;
  target: SearchTarget;
}

export function searchDocuments(
  documents: SearchDocument[],
  request: SearchRequest,
): SearchResponse {
  const query = normalizeSearchText(request.normalizedQuery || request.query);

  if (!query) {
    return { results: [], total: 0 };
  }

  const terms = query.split(" ");

  const results = documents
    .map((document) => findMatchingResult(document, query, terms))
    .filter((result): result is SearchResult => result !== undefined)
    .sort(compareByRelevance);

  return {
    results: results.slice(0, Math.max(0, request.limit)),
    total: results.length,
  };
}

interface NormalizedDocument {
  title: string;
  keywords: string[];
  description: string;
}

function normalizeDocument(document: SearchDocument): NormalizedDocument {
  return {
    title: normalizeSearchText(document.title),
    keywords: document.keywords.map(normalizeSearchText),
    description: normalizeSearchText(document.description ?? ""),
  };
}

function findMatchingResult(
  document: SearchDocument,
  query: string,
  terms: string[],
): SearchResult | undefined {
  const normalized = normalizeDocument(document);

  if (!matchesAllTerms(normalized, terms)) {
    return undefined;
  }

  return {
    key: document.key,
    category: document.category,
    title: document.title,
    subtitle: document.subtitle,
    matchDescription: getDescriptionSnippet(document.description, query),
    score: calculateRelevanceScore(normalized, query),
    target: document.target,
  };
}

function matchesAllTerms(
  document: NormalizedDocument,
  terms: string[],
): boolean {
  const searchableText = [
    document.title,
    ...document.keywords,
    document.description,
  ].join(" ");

  return terms.every((term) => searchableText.includes(term));
}

function calculateRelevanceScore(
  document: NormalizedDocument,
  query: string,
): number {
  if (document.title === query) {
    return 100;
  }

  if (document.title.startsWith(query)) {
    return 80;
  }

  if (document.title.includes(query)) {
    return 60;
  }

  if (document.keywords.some((keyword) => keyword.includes(query))) {
    return 40;
  }

  return 20;
}

function getDescriptionSnippet(
  originalDescription: string | undefined,
  query: string,
): string | undefined {
  if (!originalDescription) {
    return undefined;
  }

  const plainText = stripHtml(originalDescription);
  const normalizedText = normalizeSearchText(plainText);

  const matchIndex = normalizedText.indexOf(query);

  if (matchIndex === -1) {
    return undefined;
  }

  const start = Math.max(0, matchIndex - 40);

  return plainText.slice(start, start + 140).trim();
}

function compareByRelevance(a: SearchResult, b: SearchResult): number {
  return (
    b.score - a.score ||
    a.title.localeCompare(b.title) ||
    a.key.localeCompare(b.key)
  );
}
