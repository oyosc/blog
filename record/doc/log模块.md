# log模块

***[项目地址：](https://github.com/oyosc/blog)https://github.com/oyosc/blog***

### 这里会贴出两种方法，其实本质都一样，都是生成一个错误，然后获取错误栈上的信息
- 第一种:es5上已被废弃，主要是开展下思路
```
Object.defineProperty(global, '__stack', {
    get: function errName(){
      var orig = Error.prepareStackTrace;
      Error.prepareStackTrace = function(_, stack){ return stack; };
      var err = new Error;
      Error.captureStackTrace(err, arguments.callee);
      var stack = err.stack;
      Error.prepareStackTrace = orig;
      return stack;
    }
  });
Object.defineProperty(global, '__line', {
    get: function(){
        return __stack[1].getLineNumber();
    }
})
```

- 第二种：定义一个全局函数
```
global.__line = function (filePath) {
        let stack = new Error().stack
        let regexp = new RegExp(filePath + ':([0-9]+):([0-9]+)')
        let result = stack.match(regexp)
        return result
    }
```