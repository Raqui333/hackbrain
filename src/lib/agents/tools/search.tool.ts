import { TavilySearch } from '@langchain/tavily'

export function createSearchTool() {
  console.log('[SearchTool] Running search tool')
  return new TavilySearch({
    maxResults: 6,
    // You can set other constructor parameters here, e.g.:
    // topic: "general",
    // includeAnswer: false,
    // includeRawContent: false,
    // includeImages: false,
    // searchDepth: "basic",
  })
}
