import { columnsFilter, columnsTemplate, normalizeColumns } from './option-columns';

const people = [
  { key: 1, text: 'Alice', company: 'Acme', state: 'FL' },
  { key: 2, text: 'Bob', company: 'Globex', state: 'NY' },
];

describe('option-columns helper', () => {
  describe('normalizeColumns', () => {
    it('returns no columns when neither columns nor text2 are present', () => {
      expect(normalizeColumns(undefined, people)).toEqual([]);
      expect(normalizeColumns({}, people)).toEqual([]);
      expect(normalizeColumns(undefined, undefined)).toEqual([]);
    });

    it('treats a bare string as a heading and keeps attribute order', () => {
      expect(normalizeColumns({ text: { heading: 'Name' }, state: 'State' })).toEqual([
        { field: 'text', heading: 'Name' },
        { field: 'state', heading: 'State' },
      ]);
    });

    it('accepts null/undefined definitions as header-less columns', () => {
      expect(normalizeColumns({ text: null, company: undefined })).toEqual([
        { field: 'text' },
        { field: 'company' },
      ]);
    });

    it('falls back to a header-less text + text2 layout when any option has text2', () => {
      const options = [{ key: 1, text: 'a' }, { key: 2, text: 'b', text2: 'second' }];
      expect(normalizeColumns(undefined, options)).toEqual([{ field: 'text' }, { field: 'text2' }]);
    });

    it('lets explicit columns override the text2 shorthand', () => {
      const options = [{ key: 1, text: 'a', text2: 'second', state: 'FL' }];
      expect(normalizeColumns({ state: 'State' }, options)).toEqual([{ field: 'state', heading: 'State' }]);
    });
  });

  describe('columnsTemplate', () => {
    it('defaults to equal flexible tracks', () => {
      expect(columnsTemplate(normalizeColumns({ text: {}, company: {} }))).toBe(
        'minmax(0, 1fr) minmax(0, 1fr)',
      );
    });

    it('converts numbers to px and passes strings through', () => {
      const columns = normalizeColumns({
        text: { width: '2fr' },
        company: { width: 120 },
        state: { width: 'minmax(80px, 1fr)' },
      });
      expect(columnsTemplate(columns)).toBe('2fr 120px minmax(80px, 1fr)');
    });
  });

  describe('columnsFilter', () => {
    const filter = (columnsDef: Parameters<typeof normalizeColumns>[0], inputValue: string) =>
      columnsFilter(normalizeColumns(columnsDef))(people, {
        inputValue,
        getOptionLabel: o => o.text,
      });

    it('matches any column', () => {
      expect(filter({ text: {}, company: {} }, 'glob')).toEqual([people[1]]);
    });

    it('ignores columns with searchable: false', () => {
      expect(filter({ text: {}, state: { searchable: false } }, 'ny')).toEqual([]);
      expect(filter({ text: {}, state: {} }, 'ny')).toEqual([people[1]]);
    });

    it('treats missing attributes as empty text', () => {
      expect(filter({ text: {}, missing: {} }, 'alice')).toEqual([people[0]]);
      expect(filter({ text: {}, missing: {} }, 'undefined')).toEqual([]);
    });
  });
});
