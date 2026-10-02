'use client';

import * as React from 'react';

export const DEFAULT_DATA_TABLE_LABELS = {
  noResults: 'No results.',
  rowsSelected: (selected: number, total: number) => `${selected} of ${total} row(s) selected.`,
  rowsPerPage: 'Rows per page',
  page: (page: number, count: number) => `Page ${page} of ${count}`,
  firstPage: 'Go to first page',
  previousPage: 'Go to previous page',
  nextPage: 'Go to next page',
  lastPage: 'Go to last page',
  sortAscending: 'Asc',
  sortDescending: 'Desc',
  resetSorting: 'Reset',
  hideColumn: 'Hide',
  resetFilters: 'Reset',
  resetFiltersLabel: 'Reset filters',
  clearFilter: (title: string) => `Clear ${title} filter`,
  clearFilters: 'Clear filters',
  clearRange: 'Clear',
  selectedCount: (count: number) => `${count} selected`,
  noOptions: 'No results found.',
  selectDate: 'Select date',
  selectDateRange: 'Select date range',
  rangeFrom: 'From',
  rangeTo: 'to',
  rangeSlider: (title: string) => `${title} slider`,
  view: 'View',
  toggleColumns: 'Toggle columns',
  searchColumns: 'Search columns...',
  noColumns: 'No columns found.',
};

export type DataTableLabels = typeof DEFAULT_DATA_TABLE_LABELS;

export const DataTableLabelsContext = React.createContext<DataTableLabels>(DEFAULT_DATA_TABLE_LABELS);

/** The table's text, as set by `<DataTable labels>`; English outside a table. */
export const useDataTableLabels = () => React.useContext(DataTableLabelsContext);
