const { createNamespace, getNamespace } = require('cls-hooked');

module.exports = class CLSContext {
  constructor(namespace = 'zipkin') {
    this._session = getNamespace(namespace) || createNamespace(namespace);
    const defaultContext = this._session.createContext();
    this._session.enter(defaultContext);
  }

  setContext(ctx) {
    this._session.set('zipkin', ctx);
  }

  getContext() {
    const currentCtx = this._session.get('zipkin');
    if (currentCtx != null) {
      return currentCtx;
    }
    return null; // explicitly return null (not undefined)

  }

  scoped(callable) {
    let result;
    this._session.run(() => {
      result = callable();
    });
    return result;
  }

  letContext(ctx, callable) {
    return this.scoped(() => {
      this.setContext(ctx);
      return callable();
    });
  }
};

