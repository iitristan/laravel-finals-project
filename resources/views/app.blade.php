<!DOCTYPE html>
<html class="h-full">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0" />
    <title inertia>{{ config('app.name', 'Laravel') }}</title>
    @viteReactRefresh
    @vite(['resources/js/app.jsx', 'resources/css/app.css'])
    @inertiaHead
  </head>
  <body class="h-full">
    <div id="app" class="h-full">@inertia</div>
  </body>
</html>
