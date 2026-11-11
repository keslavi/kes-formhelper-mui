import { forwardRef, useMemo } from 'react';
import type { HTMLAttributes, ReactNode } from 'react';
import { createFilterOptions, Paper } from '@mui/material';
import type { PaperProps } from '@mui/material';
import type { Option, Options } from '../option';

export interface OptionColumn {
  /** Header label. Headers render only when at least one column has a heading. */
  heading?: string;
  /** Number = px; string = CSS grid track ('2fr', '120px', 'minmax(80px, 1fr)'). Default '1fr'. */
  width?: number | string;
  align?: 'left' | 'center' | 'right';
  /** Set false to exclude this column from filtering. Default true. */
  searchable?: boolean;
  /** Custom cell content; defaults to the option's attribute value. */
  render?: (option: Option) => ReactNode;
}

/** Keyed by the option attribute each column binds to. A bare string is shorthand for `{ heading }`. */
export type OptionColumns = Record<string, OptionColumn | string | null | undefined>;

export interface NormalizedColumn extends OptionColumn {
  field: string;
}

const CELL_PADDING = '6px 16px';

/** `text2` on any option is shorthand for a two-column, header-less layout. */
const TEXT2_COLUMNS: OptionColumns = { text: {}, text2: {} };

export const normalizeColumns = (
  columns: OptionColumns | undefined,
  options?: Options,
): NormalizedColumn[] => {
  let source = columns;
  if (!source || Object.keys(source).length === 0) {
    const hasText2 = options?.some(o => o.text2 !== undefined && o.text2 !== null);
    if (!hasText2) return [];
    source = TEXT2_COLUMNS;
  }
  return Object.entries(source).map(([field, def]) => ({
    field,
    ...(typeof def === 'string' ? { heading: def } : def ?? {}),
  }));
};

const trackOf = (column: NormalizedColumn): string => {
  const { width } = column;
  if (typeof width === 'number') return `${width}px`;
  return width || 'minmax(0, 1fr)';
};

export const columnsTemplate = (columns: NormalizedColumn[]): string =>
  columns.map(trackOf).join(' ');

const textOf = (option: Option, field: string): string => {
  const value = option[field];
  return value === undefined || value === null ? '' : String(value);
};

const cellOf = (option: Option, column: NormalizedColumn): ReactNode =>
  column.render ? column.render(option) : textOf(option, column.field);

/** Filter matching every searchable column rather than just `text`. */
export const columnsFilter = (columns: NormalizedColumn[]) =>
  createFilterOptions<Option>({
    stringify: option =>
      columns
        .filter(c => c.searchable !== false)
        .map(c => textOf(option, c.field))
        .join(' '),
  });

const renderColumnsOption = (columns: NormalizedColumn[]) => {
  const template = columnsTemplate(columns);
  return (props: HTMLAttributes<HTMLLIElement> & { key?: string }, option: Option) => {
    const { key, ...rest } = props;
    return (
      <li key={key} {...rest}>
        <span style={{ display: 'grid', gridTemplateColumns: template, columnGap: 16, width: '100%' }}>
          {columns.map(c => (
            <span key={c.field} style={{ textAlign: c.align }}>{cellOf(option, c)}</span>
          ))}
        </span>
      </li>
    );
  };
};

/** Paper slot that adds a header row above the (scrolling) listbox. */
const columnsPaper = (columns: NormalizedColumn[]) => {
  const template = columnsTemplate(columns);
  const ColumnsPaper = forwardRef<HTMLDivElement, PaperProps>(({ children, ...rest }, ref) => (
    <Paper ref={ref} {...rest}>
      <div
        role="presentation"
        style={{
          display: 'grid',
          gridTemplateColumns: template,
          columnGap: 16,
          padding: CELL_PADDING,
          fontWeight: 600,
          borderBottom: '1px solid rgba(0, 0, 0, 0.12)',
        }}
      >
        {columns.map(c => (
          <span key={c.field} style={{ textAlign: c.align }}>{c.heading ?? ''}</span>
        ))}
      </div>
      {children}
    </Paper>
  ));
  ColumnsPaper.displayName = 'OptionColumnsPaper';
  return ColumnsPaper;
};

/**
 * Props to spread onto any MUI Autocomplete to render its options as columns.
 * Returns an empty object when no columns apply, so single-column lists are untouched.
 */
export const useOptionColumns = (options: Options | undefined, columns: OptionColumns | undefined) =>
  useMemo(() => {
    const normalized = normalizeColumns(columns, options);
    if (normalized.length === 0) return {};
    const hasHeadings = normalized.some(c => c.heading);
    return {
      filterOptions: columnsFilter(normalized),
      renderOption: renderColumnsOption(normalized),
      ...(hasHeadings ? { slots: { paper: columnsPaper(normalized) } } : {}),
    };
  }, [options, columns]);
