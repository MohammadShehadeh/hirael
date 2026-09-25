import { describe, expect, it } from 'vitest';

import { buildSearchIndex, searchIndex } from '@/lib/search';
import { REGISTRY } from '@/registry/hirael/registry-meta';

const index = buildSearchIndex(REGISTRY);
const names = (query: string) => searchIndex(index, query).map((doc) => doc.entry.name);

describe('searchIndex', () => {
  it('should rank an exact name first', () => {
    expect(names('multi select')[0]).toBe('multi-select');
    expect(names('tag-input')[0]).toBe('tag-input');
  });

  it('should treat "1" and "01" as the same number', () => {
    expect(names('hero 1')[0]).toBe('hero-01');
  });

  it('should resolve aliases to the component they describe', () => {
    expect(names('datepicker')).toContain('date-picker');
    expect(names('wizard')).toContain('stepper');
  });

  it('should rank the real autocomplete component above its combobox alias', () => {
    expect(names('autocomplete')[0]).toBe('autocomplete');
    expect(names('typeahead')).toEqual(expect.arrayContaining(['autocomplete', 'combobox']));
  });

  it('should find the search blocks and the command palette for "search"', () => {
    expect(names('search')).toEqual(
      expect.arrayContaining(['search-01', 'search-02', 'search-03', 'search-04', 'command-palette']),
    );
  });

  it('should find chart blocks and data display charts for "chart" and "graph"', () => {
    const chartBlocks = ['chart-01', 'chart-02', 'chart-03', 'chart-04'];
    expect(names('chart')).toEqual(expect.arrayContaining([...chartBlocks, 'sparkline', 'gauge', 'meter']));
    expect(names('graph')).toEqual(expect.arrayContaining([...chartBlocks, 'sparkline', 'calendar-heatmap']));
  });

  it('should find the survey blocks through survey synonyms', () => {
    for (const query of ['nps', 'questionnaire', 'feedback', 'poll']) {
      expect(names(query)).toEqual(expect.arrayContaining(['survey-01', 'survey-02', 'survey-03', 'survey-04']));
    }
    expect(names('form')).toEqual(expect.arrayContaining(['contact-01', 'survey-02']));
  });

  it('should find chat and inbox blocks through messaging synonyms', () => {
    expect(names('chat')).toEqual(expect.arrayContaining(['ai-chat-01', 'prompt-input', 'message-thread']));
    expect(names('messenger')).toEqual(expect.arrayContaining(['message-thread', 'app-shell-03']));
    expect(names('support')).toContain('contact-04');
  });

  it('should find empty states for "blank" and "zero state"', () => {
    const emptyStates = ['empty-state-01', 'empty-state-02', 'empty-state-03', 'empty-state-04'];
    expect(names('blank').slice(0, 4)).toEqual(expect.arrayContaining(emptyStates));
    expect(names('zero state').slice(0, 4)).toEqual(expect.arrayContaining(emptyStates));
  });

  it('should rank site headers above page headers for "header"', () => {
    expect(names('header').slice(0, 3)).toEqual(expect.arrayContaining(['header-01', 'header-02', 'header-03']));
    expect(names('page header').slice(0, 4)).toEqual(
      expect.arrayContaining(['page-header-01', 'page-header-02', 'page-header-03', 'page-header-04']),
    );
  });

  it('should resolve control synonyms to the component that implements them', () => {
    expect(names('spinbutton')).toContain('number-field');
    expect(names('stepper input')).toContain('number-field');
    expect(names('toggle')[0]).toBe('segmented-control');
    expect(names('tabs')).toContain('segmented-control');
    expect(names('skeleton text')[0]).toBe('text-shimmer');
    expect(names('checkboxes')[0]).toBe('checkbox-group');
    expect(names('select all')).toContain('checkbox-group');
  });

  it('should link gauge, meter, dial and progress to each other', () => {
    expect(names('gauge').slice(0, 2)).toEqual(['gauge', 'meter']);
    expect(names('meter').slice(0, 2)).toEqual(['meter', 'gauge']);
    expect(names('dial')).toContain('gauge');
    expect(names('progress')).toEqual(expect.arrayContaining(['scroll-progress', 'meter', 'gauge']));
  });

  it('should find status pages by their HTTP code', () => {
    expect(names('404').slice(0, 2)).toEqual(expect.arrayContaining(['not-found-01', 'not-found-02']));
    expect(names('500')[0]).toBe('error-01');
  });

  it('should tolerate a one-letter typo in longer words', () => {
    expect(names('steppr')).toContain('stepper');
  });

  it('should return nothing for blank or stopword-only noise', () => {
    expect(names('')).toEqual([]);
    expect(names('   ')).toEqual([]);
    expect(names('zzzzqqqq')).toEqual([]);
  });

  it('should respect the limit', () => {
    expect(searchIndex(index, 'block', 5)).toHaveLength(5);
  });
});
