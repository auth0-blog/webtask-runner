
require-version demonstrates the ability to require a version of the package as an extension to the existing require syntax.

usage:
```
	require('require-version');
	var pkg = require('pkg@version');
```

This expects the versions to be layed out like this:

```
	.../node_ver_modules/pkg/1.0.0/...
	.../node_ver_modules/pkg/2.0.0/...
```
