import { trans } from './server.js'
// prettier-ignore
export const ZoraSSR = {
	install: (v, options) => v.mixin({
    methods: {
      __: (key, replace, locale = null, config = options) => trans(key, replace, locale, config),
      trans: (key, replace, locale = null, config = options) => trans(key, replace, locale, config)
    }
  })
}
