import {
  rankingEngine as rankSnippet,
  searchIndexingEngine as tokenizeSnippet
} from 'engines';
import { determineExpertiseFromTags, stripExpertiseFromTags, uniqueElements } from 'functions/utils';

export default (id, snippetNode, markdownNode) => {
  return {
    id,
    tags: {
      all: snippetNode.attributes.tags,
      primary: snippetNode.attributes.tags[0],
    },
    expertise: determineExpertiseFromTags(snippetNode.attributes.tags),
    title: snippetNode.title,
    code: {
      src: snippetNode.attributes.codeBlocks.code,
      example: snippetNode.attributes.codeBlocks.example,
      style: snippetNode.attributes.codeBlocks.style,
    },
    slug: `/${snippetNode.slugPrefix}${markdownNode.fields.slug}`,
    url: `${snippetNode.repoUrlPrefix}${markdownNode.fields.slug.slice(0, -1)}.md`,
    path: markdownNode.fileAbsolutePath,
    text: {
      full: snippetNode.attributes.text,
      short: snippetNode.attributes.text.slice(0, snippetNode.attributes.text.indexOf('\n\n')),
    },
    archived: snippetNode.archived,
    language: {
      ...snippetNode.language,
      otherLanguages: snippetNode.otherLanguages,
    },
    ranking: rankSnippet(snippetNode),
    recommendationRanking: snippetNode.recommendationRanking,
    searchTokens: uniqueElements([
      snippetNode.language.short,
      snippetNode.language.long,
      snippetNode.title,
      ...snippetNode.attributes.tags.filter(tag => tag !== 'beginner' && tag !== 'intermediate' && tag !== 'advanced'),
      ...tokenizeSnippet(
        snippetNode.attributes.text.slice(0, snippetNode.attributes.text.indexOf('\n\n'))
      ),
    ]).join(' ').toLowerCase(),
  };
};
