const Ziggy = {"url":"http:\/\/localhost","port":null,"defaults":{},"routes":{"login":{"uri":"login","methods":["GET","HEAD"]},"register":{"uri":"register","methods":["GET","HEAD"]},"logout":{"uri":"logout","methods":["POST"]},"admin.login":{"uri":"admin\/login","methods":["GET","HEAD"]},"admin.dashboard":{"uri":"admin\/dashboard","methods":["GET","HEAD"]},"admin.logout":{"uri":"admin\/logout","methods":["POST"]},"admin.games":{"uri":"admin\/games","methods":["GET","HEAD"]},"admin.games.create":{"uri":"admin\/games\/create","methods":["GET","HEAD"]},"admin.games.store":{"uri":"admin\/games","methods":["POST"]},"admin.games.edit":{"uri":"admin\/games\/{game}\/edit","methods":["GET","HEAD"],"parameters":["game"]},"admin.games.update":{"uri":"admin\/games\/{game}","methods":["PUT"],"parameters":["game"]},"admin.games.destroy":{"uri":"admin\/games\/{game}","methods":["DELETE"],"parameters":["game"]},"admin.orders":{"uri":"admin\/orders","methods":["GET","HEAD"]},"admin.orders.show":{"uri":"admin\/orders\/{order}","methods":["GET","HEAD"],"parameters":["order"]},"admin.orders.update-status":{"uri":"admin\/orders\/{order}\/status","methods":["PUT"],"parameters":["order"]},"admin.users":{"uri":"admin\/users","methods":["GET","HEAD"]},"admin.users.show":{"uri":"admin\/users\/{user}","methods":["GET","HEAD"],"parameters":["user"]},"admin.users.update-status":{"uri":"admin\/users\/{user}\/status","methods":["PUT"],"parameters":["user"]},"dashboard":{"uri":"dashboard","methods":["GET","HEAD"]},"storage.local":{"uri":"storage\/{path}","methods":["GET","HEAD"],"wheres":{"path":".*"},"parameters":["path"]}}};
if (typeof window !== 'undefined' && typeof window.Ziggy !== 'undefined') {
  Object.assign(Ziggy.routes, window.Ziggy.routes);
}
export { Ziggy };
