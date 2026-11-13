import { useStore } from 'zustand';
import type { StateCreator, StoreApi } from 'zustand/vanilla';
import { DEFAULT_GROUP } from './option';
import type { OptionGroup, OptionGroups, Options } from './option';

type OptionState = { options: OptionGroups };
export type OptionsSelector = (state: OptionState) => Options;
export type OptionsGroupSelector = (state: OptionState) => OptionGroup;

const EMPTY_GROUP: OptionGroup = Object.freeze({}) as OptionGroup;
const EMPTY_GROUPS: OptionGroups = Object.freeze({}) as OptionGroups;
const EMPTY_LIST: Options = Object.freeze([]) as unknown as Options;

const groupSelectors = new Map<string, OptionsGroupSelector>();
const listSelectors = new Map<string, OptionsSelector>();

/** Selector for every list in a group. Stable identity per group name. */
export const optionsGroupSelector = (group: string = DEFAULT_GROUP): OptionsGroupSelector => {
    let selector = groupSelectors.get(group);
    if (!selector) {
        selector = (state) => state.options?.[group] ?? EMPTY_GROUP;
        groupSelectors.set(group, selector);
    }
    return selector;
};

/** Selector for one dropdown's list. Stable identity per group+name. */
export const optionsSelector = (name: string, group: string = DEFAULT_GROUP): OptionsSelector => {
    const k = `${group}\u0000${name}`;
    let selector = listSelectors.get(k);
    if (!selector) {
        selector = (state) => state.options?.[group]?.[name] ?? EMPTY_LIST;
        listSelectors.set(k, selector);
    }
    return selector;
};

export const optionsAllSelector = (state: OptionState): OptionGroups => state.options ?? EMPTY_GROUPS;

/**
 * Compose into the parent store (and extend freely). Everything the parent needs is on the state:
 *   const select = useApp((s) => s.optionsSelector);   // then useApp(select('status', 'task'))
 *   useApp((s) => s.optionsInit)
 */
export interface OptionSlice {
    options: OptionGroups;
    /** replace all option data */
    optionsInit: (options: OptionGroups) => void;
    /** merge by group, then by list name */
    optionsMerge: (options: OptionGroups) => void;
    optionsSelector: typeof optionsSelector;
    optionsGroupSelector: typeof optionsGroupSelector;
}

export const createOptionSlice: StateCreator<OptionSlice, [], [], OptionSlice> = (set) => ({
    options: {},
    optionsInit: (options) => set({ options }),
    optionsMerge: (incoming) =>
        set((state) => {
            const next: OptionGroups = { ...state.options };
            for (const [group, lists] of Object.entries(incoming)) {
                next[group] = { ...next[group], ...lists };
            }
            return { options: next };
        }),
    optionsSelector,
    optionsGroupSelector,
});

/** Hooks bound to any store containing the slice (the parent's store, or the default one). */
export const createOptionHooks = (api: StoreApi<OptionSlice>) => ({
    useOptionsAll: (): OptionGroups => useStore(api, optionsAllSelector),
    /** e.g. useOptionsGroup('task').status */
    useOptionsGroup: (group: string = DEFAULT_GROUP): OptionGroup =>
        useStore(api, optionsGroupSelector(group)),
    /** one dropdown; re-renders only when that list changes */
    useOptions: (name: string, group: string = DEFAULT_GROUP): Options =>
        useStore(api, optionsSelector(name, group)),
});

let source: StoreApi<OptionSlice> | null = null;

/**
 * Register the parent's store (which contains the OptionSlice). Call once at startup, like
 * axios.defaults. Formhelper keeps the reference at module level, so it survives page changes.
 */
export const optionsSourceSet = (api: StoreApi<OptionSlice>) => {
    source = api;
};

export const optionsSourceReset = () => {
    source = null;
};

const sourceGet = (): StoreApi<OptionSlice> => {
    if (!source) {
        throw new Error('formhelper: no option store registered. Call optionsSourceSet(store) at startup.');
    }
    return source;
};

/** Hooks bound to the registered store. */
export const useOptionsAll = (): OptionGroups => useStore(sourceGet(), optionsAllSelector);
export const useOptionsGroup = (group: string = DEFAULT_GROUP): OptionGroup =>
    useStore(sourceGet(), optionsGroupSelector(group));
export const useOptions = (name: string, group: string = DEFAULT_GROUP): Options =>
    useStore(sourceGet(), optionsSelector(name, group));