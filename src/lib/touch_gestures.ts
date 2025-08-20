
import Hammer from 'hammerjs'

export function createSwipeAttachment(handler: HammerListener) {
  return (element: HTMLElement) => {
    let manager = new Hammer.Manager(element);
    let swipe = new Hammer.Swipe();
    manager.add(swipe);

    manager.on('swipe', handler);
  }
}