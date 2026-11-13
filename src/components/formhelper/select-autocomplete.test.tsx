import { TestHarness } from './test/testHarness';
import { Input } from './input';
import { FormProvider, useFormProvider } from './form-provider';
import type { AddNewFormProps } from './select-autocomplete';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';

const statusOptions = [
  { key: 0, text: 'pending' },
  { key: 1, text: 'in progress' },
  { key: 2, text: 'completed' },
  { key: 3, text: 'cancelled' },
];

describe('Formhelper-SelectAutocomplete', () => {
  let user: ReturnType<typeof userEvent.setup>;

  beforeEach(() => {
    user = userEvent.setup();
  });

  it('binds columns to option attributes with headings and searchable:false', async () => {
    const options = [
      { key: 1, text: 'Alice', company: 'Acme', state: 'FL' },
      { key: 2, text: 'Bob', company: 'Globex', state: 'NY' },
    ];
    render(
      <TestHarness item={{}}>
        <Input
          name="person"
          label="Person"
          options={options}
          columns={{
            text: { heading: 'Name', width: '2fr' },
            company: { heading: 'Company' },
            state: { heading: 'State', searchable: false },
            missing: 'Missing',
          }}
          data-testid="person-select"
        />
      </TestHarness>
    );
    const input = screen.getByTestId('person-select').querySelector('input')!;
    await user.click(input);
    expect(await screen.findByText('Company')).toBeInTheDocument();
    expect(screen.getByText('Missing')).toBeInTheDocument();
    expect(screen.getByText('Globex')).toBeInTheDocument();

    await user.type(input, 'NY');
    await waitFor(() => expect(screen.queryByText('Globex')).not.toBeInTheDocument());
    await user.clear(input);
    await user.type(input, 'Glob');
    await waitFor(() => expect(screen.queryByText('Acme')).not.toBeInTheDocument());
    expect(screen.getByText('Globex')).toBeInTheDocument();
  });

  it('renders text2 as a header-less second column and filters on it', async () => {
    const options = [
      { key: 'a', text: 'Alpha', text2: 'first letter' },
      { key: 'b', text: 'Beta', text2: 'second letter' },
    ];
    render(
      <TestHarness item={{}}>
        <Input name="letter" label="Letter" options={options} data-testid="letter-select" />
      </TestHarness>
    );
    const input = screen.getByTestId('letter-select').querySelector('input')!;
    await user.click(input);
    expect(await screen.findByText('first letter')).toBeInTheDocument();
    expect(screen.getByText('second letter')).toBeInTheDocument();

    await user.type(input, 'second');
    await waitFor(() => expect(screen.queryByText('first letter')).not.toBeInTheDocument());
    expect(screen.getByText('Beta')).toBeInTheDocument();
  });

  it('does not render headers or columns for plain { key, text } options', async () => {
    render(
      <TestHarness item={{}}>
        <Input name="status" label="Status" options={statusOptions} data-testid="status-select" />
      </TestHarness>
    );
    await user.click(screen.getByTestId('status-select').querySelector('input')!);
    const option = await screen.findByRole('option', { name: 'pending' });
    expect(option.querySelector('span')).toBeNull();
    expect(document.querySelector('.MuiAutocomplete-paper [role="presentation"]')).toBeNull();
  });

  it('renders no header row when no column has a heading', async () => {
    const options = [{ key: 1, text: 'Alice', company: 'Acme' }];
    render(
      <TestHarness item={{}}>
        <Input
          name="person"
          label="Person"
          options={options}
          columns={{ text: {}, company: {} }}
          data-testid="person-select"
        />
      </TestHarness>
    );
    await user.click(screen.getByTestId('person-select').querySelector('input')!);
    expect(await screen.findByText('Acme')).toBeInTheDocument();
    expect(document.querySelector('.MuiAutocomplete-paper [role="presentation"]')).toBeNull();
  });

  it('applies column widths and alignment to header and rows', async () => {
    const options = [{ key: 1, text: 'Alice', state: 'FL' }];
    render(
      <TestHarness item={{}}>
        <Input
          name="person"
          label="Person"
          options={options}
          columns={{
            text: { heading: 'Name', width: '2fr' },
            state: { heading: 'State', width: 70, align: 'right' },
          }}
          data-testid="person-select"
        />
      </TestHarness>
    );
    await user.click(screen.getByTestId('person-select').querySelector('input')!);
    const state = await screen.findByText('FL');
    expect(state).toHaveStyle({ textAlign: 'right' });
    expect(state.parentElement).toHaveStyle({ gridTemplateColumns: '2fr 70px' });
    const header = screen.getByText('State');
    expect(header).toHaveStyle({ textAlign: 'right' });
    expect(header.parentElement).toHaveStyle({ gridTemplateColumns: '2fr 70px' });
  });

  it('uses column render for custom cell content', async () => {
    const options = [{ key: 1, text: 'Alice', state: 'FL' }];
    render(
      <TestHarness item={{}}>
        <Input
          name="person"
          label="Person"
          options={options}
          columns={{ text: {}, state: { render: o => <b data-testid="custom">{`State: ${o.state}`}</b> } }}
          data-testid="person-select"
        />
      </TestHarness>
    );
    await user.click(screen.getByTestId('person-select').querySelector('input')!);
    expect(await screen.findByTestId('custom')).toHaveTextContent('State: FL');
  });

  it('renders an empty cell for a column whose attribute is missing', async () => {
    const options = [{ key: 1, text: 'Alice' }];
    render(
      <TestHarness item={{}}>
        <Input
          name="person"
          label="Person"
          options={options}
          columns={{ text: 'Name', missing: 'Missing' }}
          data-testid="person-select"
        />
      </TestHarness>
    );
    await user.click(screen.getByTestId('person-select').querySelector('input')!);
    const option = await screen.findByRole('option', { name: /Alice/ });
    expect(option.querySelectorAll('span > span')).toHaveLength(2);
    expect(option.querySelectorAll('span > span')[1]).toHaveTextContent('');
  });

  it('lets columns override the text2 shorthand', async () => {
    const options = [{ key: 1, text: 'Alice', text2: 'shorthand', state: 'FL' }];
    render(
      <TestHarness item={{}}>
        <Input
          name="person"
          label="Person"
          options={options}
          columns={{ text: 'Name', state: 'State' }}
          data-testid="person-select"
        />
      </TestHarness>
    );
    await user.click(screen.getByTestId('person-select').querySelector('input')!);
    expect(await screen.findByText('FL')).toBeInTheDocument();
    expect(screen.queryByText('shorthand')).not.toBeInTheDocument();
  });

  it('selects a multi-column option, shows its text, and keeps disabled options unselectable', async () => {
    const options = [
      { key: 1, text: 'Alice', company: 'Acme' },
      { key: 2, text: 'Bob', company: 'Globex', disabled: true },
    ];
    render(
      <TestHarness item={{}}>
        <Input
          name="person"
          label="Person"
          options={options}
          columns={{ text: 'Name', company: 'Company' }}
          data-testid="person-select"
        />
      </TestHarness>
    );
    const input = screen.getByTestId('person-select').querySelector('input')!;
    await user.click(input);
    expect(await screen.findByRole('option', { name: /Bob/ })).toHaveAttribute('aria-disabled', 'true');
    await user.click(await screen.findByRole('option', { name: /Alice/ }));
    await waitFor(() => expect(input).toHaveValue('Alice'));
  });

  it('loads with initial value', async () => {
    render(
      <TestHarness item={{ status: '3' }}>
        <Input name="status" label="Status" options={statusOptions} data-testid="status-select" />
      </TestHarness>
    );
    const input = screen.getByTestId('status-select').querySelector('input')!;
    await waitFor(() => {
      expect(input).toHaveValue('cancelled');
    }, { timeout: 5000 });
  });

  it('shows placeholder when no value selected', () => {
    render(
      <TestHarness item={{}}>
        <Input name="status" label="Status" options={statusOptions} data-testid="status-select" />
      </TestHarness>
    );
    const input = screen.getByTestId('status-select').querySelector('input')!;
    expect(input).toHaveAttribute('placeholder', 'Please Select');
  });

  it('uses a custom placeholder on the input', () => {
    render(
      <TestHarness item={{}}>
        <Input
          name="status"
          label="Status"
          placeholder="Pick a status"
          options={statusOptions}
          data-testid="status-select"
        />
      </TestHarness>
    );
    const input = screen.getByTestId('status-select').querySelector('input')!;
    expect(input).toHaveAttribute('placeholder', 'Pick a status');
  });

  it('allows selecting a value', async () => {
    render(
      <TestHarness item={{}}>
        <Input name="status" label="Status" options={statusOptions} data-testid="status-select" />
      </TestHarness>
    );
    const input = screen.getByTestId('status-select').querySelector('input')!;
    await user.click(input);
    await user.type(input, 'completed');
    await waitFor(() => {
      const options = screen.getAllByRole('option');
      expect(options.find(o => o.textContent === 'completed')).toBeTruthy();
    });
    const option = screen.getAllByRole('option').find(o => o.textContent === 'completed')!;
    await user.click(option);
    expect(input).toHaveValue('completed');
  });

  it('does not allow selecting a disabled option', async () => {
    render(
      <TestHarness item={{}}>
        <Input
          name="status"
          label="Status"
          options={[{ key: 1, text: 'unavailable', disabled: true }, { key: 2, text: 'available' }]}
          data-testid="status-select"
        />
      </TestHarness>
    );
    const input = screen.getByTestId('status-select').querySelector('input')!;
    await user.click(input);
    const unavailable = await screen.findByRole('option', { name: 'unavailable' });
    expect(unavailable).toHaveAttribute('aria-disabled', 'true');
    expect(unavailable).toHaveStyle({ pointerEvents: 'none' });
    expect(input).toHaveValue('');
  });

  it('allows clearing a value', async () => {
    render(
      <TestHarness item={{ status: '3' }}>
        <Input name="status" label="Status" options={statusOptions} data-testid="status-select" />
      </TestHarness>
    );
    const input = screen.getByRole('combobox', { name: /status/i });
    await user.click(input);

    const clearButton = input.closest('.MuiAutocomplete-root')?.querySelector('button[title="Clear"]') as HTMLElement;
    expect(clearButton).toBeTruthy();
    await user.click(clearButton);
    expect(input).toHaveValue('');
  });

  const AddNewStatusForm = (props: AddNewFormProps & { schema?: yup.AnyObjectSchema }) => {
    const formMethods = useFormProvider(props.schema ? { resolver: yupResolver(props.schema) } : {});
    const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
      e.stopPropagation();
      return formMethods.handleSubmit(values => props.onSubmit?.(values))(e);
    };
    return (
      <FormProvider formMethods={formMethods} formProps={{ onSubmit }}>
        <Input name="statusName" label="Status Name" />
        <button type="submit">Save</button>
      </FormProvider>
    );
  };

  it('submits the addNew form in a modal, closes it, and does not submit the parent form', async () => {
    const outerSubmit = vi.fn();
    const onAddNew = vi.fn((values: Record<string, any>) => ({ key: 99, text: values.statusName }));
    render(
      <TestHarness item={{}} onSubmit={outerSubmit}>
        <Input
          name="status"
          label="Status"
          options={statusOptions}
          data-testid="status-select"
          addNew={<AddNewStatusForm onSubmit={onAddNew} />}
        />
      </TestHarness>
    );

    const input = screen.getByTestId('status-select').querySelector('input')!;
    await user.click(input);
    const addNewOption = await screen.findByRole('option', { name: 'Add New' });
    expect(screen.getAllByRole('option').at(-1)).toBe(addNewOption);
    await user.click(addNewOption);
    const dialog = await screen.findByRole('dialog');
    expect(input).toHaveValue('');
    expect(within(dialog).getByText('Add New')).toBeInTheDocument();

    await user.type(within(dialog).getByRole('textbox', { name: 'Status Name' }), 'on hold');
    await user.click(within(dialog).getByRole('button', { name: 'Save' }));

    await waitFor(() => expect(onAddNew).toHaveBeenCalledWith({ statusName: 'on hold' }));
    await waitFor(() => expect(screen.queryByRole('dialog')).not.toBeInTheDocument());
    expect(outerSubmit).not.toHaveBeenCalled();
    expect(screen.getByTestId('status-select').querySelector('input')).toHaveValue('on hold');

    await user.click(screen.getByRole('button', { name: 'Submit' }));
    await waitFor(() => expect(outerSubmit).toHaveBeenCalledWith({ status: 99 }));
  });

  it('keeps Add New at the bottom while filtering, even with no matches', async () => {
    render(
      <TestHarness item={{}}>
        <Input name="status" label="Status" options={statusOptions} data-testid="status-select" addNew={<AddNewStatusForm />} />
      </TestHarness>
    );
    const input = screen.getByTestId('status-select').querySelector('input')!;
    await user.click(input);
    await user.type(input, 'pend');
    await waitFor(() => expect(screen.getAllByRole('option').map(o => o.textContent)).toEqual(['pending', 'Add New']));
    await user.clear(input);
    await user.type(input, 'zzz');
    await waitFor(() => expect(screen.getAllByRole('option').map(o => o.textContent)).toEqual(['Add New']));
  });

  it('closes the addNew modal when the child has no onSubmit of its own', async () => {
    render(
      <TestHarness item={{}}>
        <Input name="status" label="Status" options={statusOptions} data-testid="status-select" addNew={<AddNewStatusForm />} />
      </TestHarness>
    );

    await user.click(screen.getByTestId('status-select').querySelector('input')!);
    await user.click(await screen.findByRole('option', { name: 'Add New' }));
    await user.click(within(await screen.findByRole('dialog')).getByRole('button', { name: 'Save' }));
    await waitFor(() => expect(screen.queryByRole('dialog')).not.toBeInTheDocument());
  });

  it('keeps the modal open and the parent form unsubmitted when addNew validation fails', async () => {
    const outerSubmit = vi.fn();
    const onAddNew = vi.fn();
    const schema = yup.object({ statusName: yup.string().trim().required('Status name is required') });
    render(
      <TestHarness item={{}} onSubmit={outerSubmit}>
        <Input
          name="status"
          label="Status"
          options={statusOptions}
          data-testid="status-select"
          addNew={<AddNewStatusForm schema={schema} onSubmit={onAddNew} />}
        />
      </TestHarness>
    );

    await user.click(screen.getByTestId('status-select').querySelector('input')!);
    await user.click(await screen.findByRole('option', { name: 'Add New' }));
    const dialog = await screen.findByRole('dialog');
    await user.type(within(dialog).getByRole('textbox', { name: 'Status Name' }), '   ');
    await user.click(within(dialog).getByRole('button', { name: 'Save' }));

    expect(await within(dialog).findByText('Status name is required')).toBeInTheDocument();
    expect(screen.getByRole('dialog')).toBeInTheDocument();
    expect(onAddNew).not.toHaveBeenCalled();
    expect(outerSubmit).not.toHaveBeenCalled();
  });

  it('closes the addNew modal on Escape without submitting', async () => {
    const onAddNew = vi.fn();
    render(
      <TestHarness item={{ status: 1 }}>
        <Input
          name="status"
          label="Status"
          options={statusOptions}
          data-testid="status-select"
          addNew={<AddNewStatusForm onSubmit={onAddNew} />}
        />
      </TestHarness>
    );
    const input = screen.getByTestId('status-select').querySelector('input')!;
    await waitFor(() => expect(input).toHaveValue('in progress'));

    await user.click(input);
    await user.click(await screen.findByRole('option', { name: 'Add New' }));
    await screen.findByRole('dialog');
    await user.keyboard('{Escape}');

    await waitFor(() => expect(screen.queryByRole('dialog')).not.toBeInTheDocument());
    expect(onAddNew).not.toHaveBeenCalled();
    expect(input).toHaveValue('in progress');
  });

  it('opens the addNew modal from the keyboard', async () => {
    render(
      <TestHarness item={{}}>
        <Input name="status" label="Status" options={statusOptions} data-testid="status-select" addNew={<AddNewStatusForm />} />
      </TestHarness>
    );
    await user.click(screen.getByTestId('status-select').querySelector('input')!);
    await screen.findByRole('option', { name: 'Add New' });
    await user.keyboard('{ArrowUp}{Enter}');
    expect(await screen.findByRole('dialog')).toBeInTheDocument();
  });

  it('uses addNewLabel for the option and the modal header', async () => {
    render(
      <TestHarness item={{}}>
        <Input
          name="status"
          label="Status"
          options={statusOptions}
          data-testid="status-select"
          addNewLabel="Create status"
          addNew={<AddNewStatusForm />}
        />
      </TestHarness>
    );
    await user.click(screen.getByTestId('status-select').querySelector('input')!);
    await user.click(await screen.findByRole('option', { name: 'Create status' }));
    expect(within(await screen.findByRole('dialog')).getByRole('heading', { name: 'Create status' })).toBeInTheDocument();
    expect(screen.queryByRole('option', { name: 'Add New' })).not.toBeInTheDocument();
  });

  it('renders Add New below column rows and filters with the column filter', async () => {
    const options = [
      { key: 1, text: 'Alice', company: 'Acme' },
      { key: 2, text: 'Bob', company: 'Globex' },
    ];
    render(
      <TestHarness item={{}}>
        <Input
          name="person"
          label="Person"
          options={options}
          columns={{ text: { heading: 'Name' }, company: { heading: 'Company' } }}
          data-testid="person-select"
          addNew={<AddNewStatusForm />}
        />
      </TestHarness>
    );
    const input = screen.getByTestId('person-select').querySelector('input')!;
    await user.click(input);
    expect(await screen.findByText('Company')).toBeInTheDocument();
    const rows = screen.getAllByRole('option');
    expect(rows.map(o => o.textContent)).toEqual(['AliceAcme', 'BobGlobex', 'Add New']);
    expect(rows[0].querySelector('span')).toHaveStyle({ display: 'grid' });
    expect(rows[2].querySelector('span')).toBeNull();

    await user.type(input, 'Glob');
    await waitFor(() => expect(screen.getAllByRole('option').map(o => o.textContent)).toEqual(['BobGlobex', 'Add New']));
  });

  it('maintains cleared state after blur', async () => {
    render(
      <TestHarness item={{}}>
        <Input name="status" label="Status" options={statusOptions} data-testid="status-select" />
      </TestHarness>
    );
    const input = screen.getByTestId('status-select').querySelector('input')!;
    await user.click(input);
    await user.type(input, 'completed');
    await waitFor(() => {
      expect(screen.getAllByRole('option').find(o => o.textContent === 'completed')).toBeTruthy();
    });
    await user.click(screen.getAllByRole('option').find(o => o.textContent === 'completed')!);

    const clearButton = input.closest('.MuiAutocomplete-root')?.querySelector('button[title="Clear"]') as HTMLElement;
    await user.click(clearButton);
    await user.tab();
    expect(input).toHaveValue('');
  });
});
