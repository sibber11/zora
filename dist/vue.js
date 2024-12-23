import { trans, transAttr } from './client.js';
// prettier-ignore
export const ZoraVue = {
	install: (v, options) => v.mixin({
    methods: {
      __: (key, replace, locale = null, config = options) => trans(key, replace, locale, config),
      trans: (key, replace, locale = null, config = options) => trans(key, replace, locale, config),
      transAttr: (key, locale = null, config = options) => transAttr(key, locale, config),
    }
  })
}
