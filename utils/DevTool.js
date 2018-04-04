class DevTool {
  constructor(directiveName) {
    this.name = directiveName;
    if (location.hostname === 'localhost' || location.search.includes('scmsdebug=true')) {
      this.env = 'development';
    } else {
      this.env = 'production';
    }
  }
  writeToConsole(type, ...args) {
    if (this.env === 'production') return;
    const style = {
      'font-weight': '700',
    };
    switch (type) {
    case 'info':
      Object.assign(style, {
        color: '#2196f3',
      });
      break;
    case 'warn':
      Object.assign(style, {
        color: '#ff5722',
      });
      break;
    case 'error':
      Object.assign(style, {
        color: '#f44336',
      });
      break;
    case 'log':
    case 'group':
    case 'groupEnd':
      Object.assign(style, {
        color: '#4caf50',
      });
      break;
    }
    const styleConfig = Object.keys(style).map(prop => [prop, style[prop]].join(':')).join(';');
    console[type](`%c${this.name}:`, styleConfig, ...args);
  }
  info(...args) {
    this.writeToConsole('info', ...args);
  }
  log(...args) {
    this.writeToConsole('log', ...args);
  }
  warn(...args) {
    this.writeToConsole('warn', ...args);
  }
  error(...args) {
    this.writeToConsole('error', ...args);
  }
  group(...args) {
    this.writeToConsole('group', ...args);
  }
  groupEnd(...args) {
    this.writeToConsole('groupEnd', ...args);
  }
}

export default DevTool;