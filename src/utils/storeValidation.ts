import { Store } from '../types';

/**
 * Validates whether a store is suitable for public catalog & grid rendering.
 * Filters out tests, placeholders (e.g. "ASDASD", "ISSO É UM TESTE"),
 * unapproved listings, and stores with descriptions shorter than 20 characters.
 */
export function isValidPublicStore(store: Store): boolean {
  if (!store || !store.id || !store.name) {
    return false;
  }

  // Check approval status (only approved stores in public grid)
  if (store.approvalStatus && store.approvalStatus !== 'approved') {
    return false;
  }

  const nameUpper = store.name.trim().toUpperCase();
  const descUpper = (store.description || '').trim().toUpperCase();

  // Filter test names and placeholders
  if (
    nameUpper.includes('TESTE') ||
    nameUpper.includes('TEST') ||
    nameUpper.includes('ASDASD') ||
    nameUpper.includes('LOREM') ||
    nameUpper.includes('EXEMPLO TESTE')
  ) {
    return false;
  }

  // Must have a real description with at least 20 characters
  if (!store.description || store.description.trim().length < 20) {
    return false;
  }

  // Filter placeholder descriptions
  if (
    descUpper.includes('ASDASD') ||
    descUpper.includes('TESTE') ||
    descUpper.includes('TEST') ||
    descUpper.includes('LOREM IPSUM') ||
    descUpper.includes('QWERTY') ||
    descUpper === 'DESCRICAO' ||
    descUpper === 'LOJA TESTE'
  ) {
    return false;
  }

  return true;
}

/**
 * Filters an array of stores to only include valid public stores.
 */
export function filterValidPublicStores(stores: Store[]): Store[] {
  if (!Array.isArray(stores)) return [];
  return stores.filter(isValidPublicStore);
}
