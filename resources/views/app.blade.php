<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0" />
    <title>{{ config('app.name', 'Laravel') }}</title>
    @viteReactRefresh
    @vite('resources/js/app.tsx')
    @inertiaHead
</head>
<body class="font-sans antialiased">
    @inertia
</body>
</html>