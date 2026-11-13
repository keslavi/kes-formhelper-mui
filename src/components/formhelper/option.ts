export interface Option {
    key:string|number;
    text:string;
    /** Shorthand for a two-column, header-less dropdown layout (`text` + `text2`). */
    text2?: string;
    disabled?: boolean;
    /** Any other attribute can be bound to a dropdown column via the `columns` prop. */
    [field: string]: unknown;
}

export type Options = Option[];

/** { status: [...], result: [...] } — one group (e.g. "task") of named option lists */
export type OptionGroup = Record<string, Options>;

/** { task: { status: [...] }, contact: { type: [...] } } — the grouped JSON design */
export type OptionGroups = Record<string, OptionGroup>;

/** Group for options from systems with no group concept */
export const DEFAULT_GROUP = 'all';

/**
 * Resolve a list from grouped options. For systems without a group concept,
 * pass flat options (Record<string, Options>) and omit `group`.
 */
export const getOptions = (
    source: OptionGroups | OptionGroup | undefined,
    name: string,
    group?: string,
): Options => {
    if (!source) return [];
    if (group) {
        return (source as OptionGroups)[group]?.[name] ?? [];
    }
    const defaultList = (source as OptionGroups)[DEFAULT_GROUP]?.[name];
    if (defaultList) return defaultList;
    const direct = (source as OptionGroup)[name];
    if (Array.isArray(direct)) return direct;
    // ungrouped lookup into grouped data: first group containing the name
    for (const g of Object.values(source as OptionGroups)) {
        if (g && !Array.isArray(g) && Array.isArray(g[name])) return g[name];
    }
    return [];
};
