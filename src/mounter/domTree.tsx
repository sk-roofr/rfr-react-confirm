import React from 'react';
import { createRoot, type Root } from 'react-dom/client';
import type { Mounter } from '../types';

type ConfirmationEntry = {
  wrapper: HTMLElement;
  root: Root;
};

export function createDomTreeMounter(
  defaultMountNode?: Element | DocumentFragment | HTMLElement
): Mounter {
  const confirms: Record<string, ConfirmationEntry> = {};
  const callbacks: { mounted?: () => void } = {};

  const generateKey = () => Math.floor(Math.random() * (1 << 30)).toString(16);

  const getParentNode = (mountNode?: HTMLElement) =>
    (mountNode || defaultMountNode || document.body) as Element | DocumentFragment;

  function mount(Component: React.ComponentType<any>, props: any, mountNode?: HTMLElement): string {
    const key = generateKey();

    try {
      const parent = getParentNode(mountNode);
      const wrapper = parent.appendChild(document.createElement('div'));
      const root = createRoot(wrapper);

      confirms[key] = { wrapper, root };
      root.render(<Component {...props} />);
      callbacks.mounted?.();

      return key;
    } catch (error) {
      delete confirms[key];
      throw error;
    }
  }

  function unmount(key: string): void {
    const confirmation = confirms[key];
    if (!confirmation) return;

    delete confirms[key];

    try {
      confirmation.root.unmount();
    } catch (error) {
      console.warn('react-confirm: Failed to unmount React root:', error);
    }
    try {
      confirmation.wrapper.remove();
    } catch (error) {
      console.warn('react-confirm: Failed to remove DOM wrapper:', error);
    }
  }

  return {
    mount,
    unmount,
    options: {}, // Keep for backward compatibility
  } as unknown as Mounter;
}
