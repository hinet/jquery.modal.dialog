# jquery.modal.dialog
jquery.modal.dialog是一个非常好用的轻量级的jQuery模态对话框插件,基于https://github.com/dei79/jquery-modal-rails
#为什么要使用这个插件
大多数模态对话框插件我发现想做的太多，并有照片画廊，iframes和视频。但HTML和CSS的产生往往是臃肿且难以定制。
相比之下，这个插件可以处理我遇到的最常见的情况：
* 显示现有的DOM元素
* 支持Ajax加载页面
* 轻量级的容易定制的Html和CSS
* 代码压缩后仅5kb

# 安装
首先引用jQuery库(`http://cdn.bootcss.com/jquery/1.11.2/jquery.js`)和 `jquery.modal.dialog.js `插件脚本
```html
<script src="http://cdn.bootcss.com/jquery/1.11.2/jquery.js" type="text/javascript" charset="utf-8"></script>
<script src="jquery.modal.dialog.min.js" type="text/javascript" charset="utf-8"></script>
```

包含  `jquery.modal.css` 默认样式表文件:
```html
<link rel="stylesheet" href="jquery.modal.dialog.css" type="text/css" media="screen" />
```

#使用
#### 自动附加到链接
最简单的方法是添加rel="`dialog：open`"到链接和使用`href`属性指定打开模态窗口。
打开一个现有的DOM元素的ID：
```html
<form id="login-form" class="dialog">
  ...
</form>

<a href="#login-form" rel="dialog:open">Login</a>
```

使用AJAX加载远程URL:

```html
<a href="login.html" rel="dialog:open">Login</a>
```
更多使用方法请下载参考实例
