import type { ServiceId } from '../data/site';

/**
 * A service chosen from a card on another page.
 *
 * `nonce` exists because the same service can be requested twice in a row
 * (open a card, click discuss, leave, click the same card again). The changing
 * number gives `Contact` a fresh effect dependency each time, so the form
 * re-applies the choice instead of ignoring an identical object.
 */
export interface Preselect {
  service: ServiceId;
  nonce: number;
}
