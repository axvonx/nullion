import { enforce } from '../core/enforce';

export interface ModalOptions {
  id: string;
  title: string;
  /** Optional `data-el` attribute placed on the backdrop (for lookup via `elementsOf`). */
  backdropDataEl?: string;
  /** Extra CSS class(es) on the `.ui-modal` dialog box. */
  dialogClass?: string;
  /** Extra CSS class(es) on the `.ui-modal-backdrop` overlay. */
  backdropClass?: string;
  /** Called right after the modal opens. */
  onOpen?: () => void;
  /** Called right after the modal closes. */
  onClose?: () => void;
  /** Returns the element to focus on open (defaults to the close button). */
  initialFocus?: () => HTMLElement | null;
}

export interface ModalHandle {
  readonly backdrop: HTMLElement;
  readonly dialog: HTMLElement;
  readonly body: HTMLElement;
  readonly closeBtn: HTMLButtonElement;
  isOpen(): boolean;
  setOpen(open: boolean, trigger?: HTMLElement | null): void;
  toggle(trigger?: HTMLElement | null): void;
}

/**
 * Unified Windowed Dark Titlebar Modal (UI-STYLE.md §6).
 * Shared by Settings, How to Play, and future player panels (Achievements, User Profile, Account).
 * Closes on Escape, backdrop click, or `×`; saves and restores trigger focus without touching game timers.
 */
export function createModal(parent: HTMLElement, opts: ModalOptions): ModalHandle {
  enforce(opts.id.trim().length > 0, 'modal: id must be non-empty');

  const backdrop = document.createElement('div');
  backdrop.className = opts.backdropClass ? `ui-modal-backdrop ${opts.backdropClass}` : 'ui-modal-backdrop';
  backdrop.hidden = true;
  if (opts.backdropDataEl) backdrop.dataset.el = opts.backdropDataEl;

  const dialog = document.createElement('section');
  dialog.id = opts.id;
  dialog.className = opts.dialogClass ? `ui-modal ${opts.dialogClass}` : 'ui-modal';
  dialog.setAttribute('role', 'dialog');
  dialog.setAttribute('aria-modal', 'true');
  const titleId = `${opts.id}-title`;
  dialog.setAttribute('aria-labelledby', titleId);

  const bar = document.createElement('header');
  bar.className = 'ui-modal-bar';

  const heading = document.createElement('h2');
  heading.className = 'ui-modal-title';
  heading.id = titleId;
  heading.textContent = opts.title;

  const closeBtn = document.createElement('button');
  closeBtn.type = 'button';
  closeBtn.className = 'ui-key ui-key--icon ui-modal-close';
  closeBtn.setAttribute('aria-label', 'Close');
  closeBtn.textContent = '×';

  bar.append(heading, closeBtn);

  const body = document.createElement('div');
  body.className = 'ui-modal-body';

  dialog.append(bar, body);
  backdrop.append(dialog);
  parent.append(backdrop);

  let returnFocusTo: HTMLElement | null = null;

  const isOpen = () => !backdrop.hidden;

  const setOpen = (open: boolean, trigger?: HTMLElement | null) => {
    const wasOpen = isOpen();
    if (open === wasOpen) return;
    if (open) {
      returnFocusTo = trigger ?? (document.activeElement instanceof HTMLElement ? document.activeElement : null);
      backdrop.hidden = false;
      opts.onOpen?.();
      const target = opts.initialFocus?.() ?? closeBtn;
      target.focus({ preventScroll: true });
    } else {
      backdrop.hidden = true;
      opts.onClose?.();
      if (returnFocusTo && returnFocusTo.isConnected) {
        returnFocusTo.focus({ preventScroll: true });
      }
      returnFocusTo = null;
    }
  };

  closeBtn.addEventListener('click', () => setOpen(false));
  backdrop.addEventListener('pointerdown', (ev) => {
    if (ev.target === backdrop) setOpen(false);
  });
  document.addEventListener('keydown', (ev) => {
    if (ev.key === 'Escape' && isOpen()) {
      ev.preventDefault();
      setOpen(false);
    }
  });

  return {
    backdrop,
    dialog,
    body,
    closeBtn,
    isOpen,
    setOpen,
    toggle: (trigger) => setOpen(!isOpen(), trigger),
  };
}
