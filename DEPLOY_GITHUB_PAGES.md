# 发布到 GitHub Pages

## 第一步：创建仓库

1. 登录 GitHub。
2. 点击 `New repository`。
3. 仓库名可以写 `my-website`。
4. 选择 `Public`。
5. 创建仓库。

## 第二步：上传文件

把这个文件夹里的文件上传到仓库根目录：

- `index.html`
- `styles.css`
- `script.js`
- `weather.js`
- `game.html`
- `game.js`
- `README.md`
- `.nojekyll`

注意：要上传文件本身，不要只上传外层文件夹。

## 第三步：打开 GitHub Pages

1. 进入仓库的 `Settings`。
2. 找到 `Pages`。
3. `Source` 选择 `Deploy from a branch`。
4. `Branch` 选择 `main`，文件夹选择 `/root`。
5. 保存。

稍等一会儿，GitHub 会给你一个网址，通常像这样：

```text
https://你的用户名.github.io/my-website/
```

## 绑定自己的域名

等你买好域名后：

1. 在 GitHub Pages 的 `Custom domain` 填写你的域名。
2. 按 GitHub 提示去域名服务商那里添加 DNS 记录。
3. 开启 `Enforce HTTPS`。

绑定域名和 DNS 设置建议让家长一起操作。
