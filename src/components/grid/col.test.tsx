import { Col, ColPadded } from '.';

const { capturedSizeProps } = vi.hoisted(() => ({
  capturedSizeProps: [] as unknown[],
}));

vi.mock('@mui/material', async (importOriginal) => {
  const actual = await importOriginal<typeof import('@mui/material')>();
  const OriginalGrid = actual.Grid;
  const MockGrid = ({ children, ...props }: React.ComponentProps<typeof OriginalGrid>) => {
    if ('size' in props) capturedSizeProps.push(props.size);
    return <OriginalGrid {...props}>{children}</OriginalGrid>;
  };
  MockGrid.displayName = 'MockGrid';
  return { ...actual, Grid: MockGrid };
});

describe('Col - xs backward compatibility', () => {
  beforeEach(() => {
    capturedSizeProps.length = 0;
  });

  it('renders content when xs is a number', () => {
    render(<Col xs={6}>content</Col>);
    expect(screen.getByText('content')).toBeVisible();
  });

  it('passes size={{ xs }} to Grid when xs is a number', () => {
    render(<Col xs={6}>content</Col>);
    expect(capturedSizeProps).toContainEqual({ xs: 6 });
  });

  it('renders content when xs is "auto"', () => {
    render(<Col xs="auto">content</Col>);
    expect(screen.getByText('content')).toBeVisible();
  });

  it('passes size={{ xs: "auto" }} to Grid when xs is "auto"', () => {
    render(<Col xs="auto">content</Col>);
    expect(capturedSizeProps).toContainEqual({ xs: 'auto' });
  });

  it('size prop takes precedence over xs', () => {
    render(<Col xs={6} size={4}>content</Col>);
    expect(capturedSizeProps).toContainEqual(4);
    expect(capturedSizeProps).not.toContainEqual({ xs: 6 });
  });

  it('ColPadded renders content when xs is a number', () => {
    render(<ColPadded xs={6}>content</ColPadded>);
    expect(screen.getByText('content')).toBeVisible();
  });

  it('ColPadded passes size={{ xs }} to Grid when xs is a number', () => {
    render(<ColPadded xs={8}>content</ColPadded>);
    expect(capturedSizeProps).toContainEqual({ xs: 8 });
  });
});
