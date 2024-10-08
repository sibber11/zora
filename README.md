# Zora - Use your Laravel language translations in Javascript packages

With Zora you can add your Laravel language translations to your asset pipeline for use in Javascript packages like Vue or React.

Zora provides two Javascript `__()` or `__trans()` translation helper functions that work like Laravel's, making it easy to use your Laravel translations in Javascript.

The package works similar to Ziggy, but without the Blade directive.

Zora supports all versions of Laravel from `8.x` onwards, and all modern browsers.

- [**Installation**](#installation)
- [**Setup**](#setup)
    - [JavaScript frameworks](#javascript-frameworks)
    - [Vue](#vue)
    - [Svelte](#svelte)
- [**Usage**](#usage)
    - [The `trans()` helper](#the-route-helper)


## Installation

Install zora into your Laravel app via composer:
``` bash
composer require jetstreamlabs/zora --dev
```

## Setup

#### Javascript Frameworks

Ziggy provides an Artisan command to output its config and routes to a file: `php artisan zora:generate`. By default this command stores your translations at `resources/js/zora.js`. 

The file generated by `php artisan zora:generate` will look something like this:

Alternatively, you can compile the translations to resources/js in your dev and build steps in package.json:
``` bash
"build:assets": "php artisan zora:generate",
```

```js
// zora.js

const Zora = {
    translations: {"en": {"php": {}, "json": {}}};
};
if (typeof window !== 'undefined' && typeof window.Zora !== 'undefined') {
  Object.assign(Zora.routes, window.Zora.routes);
}

export { Zora }
```

Create an alias to make importing Zora's core source files easier:

```js
// vite.config.js
export default defineConfig({
    resolve: {
        alias: {
            // for other frameworks
            'zora-js': resolve(__dirname, 'vendor/jetstreamlabs/zora/dist/client.js'),
            // for vue 
            'zora-js': resolve(__dirname, 'vendor/jetstreamlabs/zora/dist/index.js'),
            zora: resolve(__dirname, 'vendor/jetstreamlabs/zora/dist/vue.js'),
        },
    },
});
```
```js
// webpack.mix.js

// Mix v6
const path = require('path');

mix.alias({
    // for other frameworks
    'zora-js': path.resolve(__dirname, 'vendor/jetstreamlabs/zora/dist/client.js'),
    // for Vue  
    'zora-js': path.resolve(__dirname, 'vendor/jetstreamlabs/zora/dist/index.js'),
    zora: path.resolve(__dirname, 'vendor/jetstreamlabs/zora/dist/vue.js'),
});

// Mix v5
const path = require('path');

mix.webpackConfig({
    resolve: {
        alias: {
            // for other frameworks
            'zora-js': path.resolve(__dirname, 'vendor/jetstreamlabs/zora/dist/client.js'),
            // for Vue  
            'zora-js': path.resolve(__dirname, 'vendor/jetstreamlabs/zora/dist/index.js'),
            zora: path.resolve(__dirname, 'vendor/jetstreamlabs/zora/dist/vue.js'),
        },
    },
});
```

Add the following to your app.blade.php so that translation functions will use the current locale.

```js
<script>
    window.locale = '{{ app()->getLocale() }}';
</script>
```


Finally, import and use Zora like any other JavaScript library.

```js
import { ZoraVue } from 'zora'
import { Zora } from '../zora.js'


// ...

__(key: string, replacers: array, locale: string|null = null, config: Zora)

// or

trans(key: string, replacers: array, locale: string|null = null, config: Zora)

```



#### Vue

Zora includes a vue plugin to make it easy to use `trans()` or `__()` helpers throughout your app:

```js
import { ZoraVue } from 'zora'
import { Zora } from '../zora.js'
```

Then use it in your app (register Zora plugin):
```js
...
.use(ZoraVue, Zora)
```

#### Svelte

There is no built in integration for svelte, however to avoid passing in the Zora configuration object you can create translation helper file. 

```svelte
// i18n.svelte

<script context="module">
    import { trans as t } from 'zora-js/'
    import { Zora } from '../zora.js'

    // window.locale = document.documentElement.lang; // optional if not set in app.blade.php

    export function __(key, replace, locale = null, config=Zora){
        return t(key, replace, locale, config);
    }
    export function trans(key, replace, locale = null, config=Zora){
        return t(key, replace, locale, config);
    }

</script>
 

// Dashboard.svelte
<script>
import {__} from "@/i18n.svelte";
</script>

<div>{__("key")}</div>
```

## Usage

#### The `trans()` helper

Both `trans()` or `__()` helper function works like Laravel's - You can pass the key of one of your translations, and a key-pair object for replacing the placeholders as the second argument.

**Basic usage**
```php
// lang/en/messages.php
return [
    'welcome' => 'Welcome to our application!',
]
```

```js
// Dashbaord.js
__("messages.welcome");  // Welcome to our application!
```
**With parameters**
```php
// lang/en/messages.php
return [
    'welcome' => 'Welcome, :name',
]
```
```js
// Dashbaord.js
__("messages.welcome", {"name": "Zora"});  // Welcome, Zora
```

**With multiple parameters**
```php
// lang/en/messages.php
return [
    'welcome' => 'Welcome, :name! There are :count apples.',
]
```
```js
// Dashbaord.js
__("messages.welcome", {"name": "Zora", "count": 8});  // Welcome, Zora! There are 8 apples.
```

**With Locale Override**
```php
// lang/en/messages.php
return [
    'welcome' => 'Welcome, :name! There are :count apples.',
]
```
```php
// lang/bn/messages.php
return [
    'welcome' => 'স্বাগতম, :name!',
]
```
```js
// Dashbaord.js
__("messages.welcome", {"name": "Zora"}, 'bn');  // স্বাগতম, Zora!
```
