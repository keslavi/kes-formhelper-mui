import { act, renderHook } from '@testing-library/react';
import { createStore } from 'zustand/vanilla';
import { useStore } from 'zustand';
import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import {
    createOptionHooks,
    createOptionSlice,
    optionsGroupSelector,
    optionsSelector,
    optionsSourceReset,
    optionsSourceSet,
    useOptions,
    useOptionsGroup,
} from './option-slice';
import type { OptionSlice } from './option-slice';

type Parent = OptionSlice & { page: string };

const makeParent = () =>
    createStore<Parent>()((...a) => ({
        ...createOptionSlice(...a),
        page: 'home',
    }));

let parent: ReturnType<typeof makeParent>;

beforeEach(() => {
    parent = makeParent();
    optionsSourceSet(parent);
});

afterEach(() => optionsSourceReset());

describe('option-slice', () => {
    it('formhelper hooks read the registered parent store and persist across mounts', () => {
        parent.getState().optionsInit({ task: { status: [{ key: 1, text: 'a' }] } });
        renderHook(() => useOptions('status', 'task')).unmount();
        const second = renderHook(() => useOptions('status', 'task'));
        expect(second.result.current).toEqual([{ key: 1, text: 'a' }]);
    });

    it('throws a clear error when no store is registered', () => {
        optionsSourceReset();
        expect(() => renderHook(() => useOptions('status', 'task'))).toThrow(/optionsSourceSet/);
    });

    it('defaults to the "all" group and merges', () => {
        parent.getState().optionsInit({ all: { yesNo: [{ key: 1, text: 'Yes' }] } });
        parent.getState().optionsMerge({ all: { prio: [{ key: 1, text: 'Low' }] } });
        const { result } = renderHook(() => useOptionsGroup());
        expect(Object.keys(result.current)).toEqual(['yesNo', 'prio']);
    });

    it('returns stable references and memoized selectors', () => {
        parent.getState().optionsInit({ task: { status: [] } });
        const { result, rerender } = renderHook(() => useOptionsGroup('task'));
        const before = result.current;
        rerender();
        expect(result.current).toBe(before);
        expect(optionsGroupSelector('task')).toBe(optionsGroupSelector('task'));
        expect(optionsSelector('status', 'task')).toBe(optionsSelector('status', 'task'));
    });

    it('updates subscribers on change', () => {
        const { result } = renderHook(() => useOptions('status', 'task'));
        expect(result.current).toEqual([]);
        act(() => parent.getState().optionsInit({ task: { status: [{ key: 1, text: 'x' }] } }));
        expect(result.current).toHaveLength(1);
    });

    it('parent can use selectors from its own state or bound hooks', () => {
        parent.getState().optionsInit({ task: { status: [{ key: 9, text: 'p' }] } });
        const viaState = renderHook(() => {
            const select = useStore(parent, (s) => s.optionsSelector);
            return useStore(parent, select('status', 'task'));
        });
        expect(viaState.result.current).toEqual([{ key: 9, text: 'p' }]);
        const hooks = createOptionHooks(parent);
        expect(renderHook(() => hooks.useOptions('status', 'task')).result.current).toHaveLength(1);
    });
});
