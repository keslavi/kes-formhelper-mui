import {
  cleanGridProps,
  pickColSizing,
  pickColLayoutProps,
  isGridColPropKey,
} from './clean-grid-props';

describe('cleanGridProps', () => {
  describe('pickColSizing — xs/sm/md/lg/xl backward compatibility', () => {
    it('returns only size when size is valid', () => {
      expect(pickColSizing({ size: 4, xs: 6 })).toEqual({ size: 4 });
    });

    it('returns breakpoint map when size is absent', () => {
      expect(pickColSizing({ xs: 6, md: 4 })).toEqual({ xs: 6, md: 4 });
    });

    it('accepts xs="auto"', () => {
      expect(pickColSizing({ xs: 'auto' })).toEqual({ xs: 'auto' });
    });

    it('ignores invalid breakpoint values', () => {
      expect(pickColSizing({ xs: 'not-a-number', sm: 4 })).toEqual({ sm: 4 });
    });
  });

  describe('pickColLayoutProps — form spread onto ColPadded', () => {
    it('extracts sizing only (does not pass data-testid)', () => {
      expect(pickColLayoutProps({ name: 'email', xs: 6, 'data-testid': 'wrap' })).toEqual({ xs: 6 });
    });
  });

  describe('cleanGridProps col target', () => {
    it('extracts sizing for direct Col usage', () => {
      expect(cleanGridProps({ name: 'email', xs: 6, label: 'Email' }, 'col')).toEqual({ xs: 6 });
    });

    it('strips form props from col output', () => {
      const result = cleanGridProps(
        { name: 'email', label: 'Email', options: [{ key: 1, text: 'a' }], xs: 8 },
        'col',
      );
      expect(result).toEqual({ xs: 8 });
      expect(result).not.toHaveProperty('name');
      expect(result).not.toHaveProperty('label');
    });

    it('passes data-testid through to col', () => {
      expect(cleanGridProps({ xs: 6, 'data-testid': 'col-wrap' }, 'col')).toEqual({
        xs: 6,
        'data-testid': 'col-wrap',
      });
    });

    it('includes offset and flex when present', () => {
      expect(cleanGridProps({ xs: 6, offset: 2, flex: true }, 'col')).toEqual({
        xs: 6,
        offset: 2,
        flex: true,
      });
    });

    it('passes event handlers through to col', () => {
      const onClick = vi.fn();
      expect(cleanGridProps({ xs: 6, onClick, name: 'email' }, 'col')).toEqual({
        xs: 6,
        onClick,
      });
    });

    it('passes event handlers through to row', () => {
      const onClick = vi.fn();
      expect(cleanGridProps({ onClick, name: 'email' }, 'row')).toEqual({ onClick });
    });
  });

  describe('isGridColPropKey', () => {
    it('identifies grid col strip keys', () => {
      expect(isGridColPropKey('xs')).toBe(true);
      expect(isGridColPropKey('flex')).toBe(true);
      expect(isGridColPropKey('label')).toBe(false);
    });
  });
});
