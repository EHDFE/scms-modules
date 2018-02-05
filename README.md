# scms-modules

[![npm](https://img.shields.io/npm/v/scmsmodules.svg)](https://www.npmjs.com/package/scms-modules)
[![npm](https://img.shields.io/npm/dt/scmsmodules.svg)]()


Homepage: [https://ehdfe.github.io/scms-modules/](https://ehdfe.github.io/scms-modules/)

### 简介
scmsmodules 是基于bootstrap、angular1开发的一套后台管理系统UI、模块。是易货嘀前端开发团队在开发SCMS系统中抽取出来的模块，秉着一切皆模块的开发原则，不断完善scmsmodules模块库。

scmsmodules对应的预览平台--[scmsmodules-runner](https://www.npmjs.com/package/scmsmodules-runner) npm包，在scmsmodules中已依赖，只须在scmsmodules中启动预览平台服务。



### 在项目中接入组件

第一步. 在项目中安装scmsmodules包：
```sh
npm install scmsmodules --save
```

第二步. 在项目文件中加载scmsmodules：
```sh
import scmsModules from 'scmsmodules';
/*
 *scmsModules返回的是一个Object数据,如：
 *{
 *  ‘pagination/paginationDirective’：paginationDirective
 *  ‘目录结构’：指令函数
  }
*/
```

第三步. 创建指令（执行指令函数）

两种方式：

一种是：在“angular.module(appName, [..."之后，遍历scmsModules对像， 执行指令函数，把appName传入，如
```sh
    let key;
    for (key in scmsModules) {
        scmsModules[key](appName);
    }
```

还有一种是在依赖时，创建指令。

### 如何进行开发及预览

下载源码：
```sh
    git clone https://github.com/EHDFE/scms-modules.git
```

安装依赖：
```sh
    npm install //或cnpm install
```

启动预览平台服务：
```sh
    npm run server
```

构建预览平台发布代码：
```sh
    npm run build
```


### 开发过程

![](http://image.tf56.com/dfs/group1/M00/48/46/CiFBClpq4ZWAd_-pAACtFnH91l0169.png)





