/** 'Chronogolf (Lightspeed)' → 'xp-chronogolf-lightspeed': the id of a mission, linked from the client strip and the services. */
export const anchor = (company: string) => 'xp-' + company.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/-$/, '')
