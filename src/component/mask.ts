import { ROOT_ID } from "../config";

export function addMask(id: string): void {
  if (document.getElementById(id)) {
    return;
  }
  const html: string = `
   <div id="${id}" style="z-index: 999; width: 100%; height: 100%; position: absolute; left: 0; top: 0; bottom: 0; right: 0; background: transparent;"></div>
    `;
  const root: HTMLElement = document.getElementById(ROOT_ID) as HTMLElement;
  root.appendChild(document.createRange().createContextualFragment(html));
}

export function removeMask(id: string) {
  const mask: HTMLElement = document.getElementById(id) as HTMLElement;
  if (!mask) {
    return;
  }
  mask.remove();
}
