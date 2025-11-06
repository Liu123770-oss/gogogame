# 🚀 Gitee Pages 发布指南

## 📋 完整步骤（从零开始）

---

## 第一步：构建游戏网页版 🎮

### 1. 打开 Cocos Creator
- 打开你的项目 (NewProject)

### 2. 开始构建
1. 点击菜单栏：**项目 → 构建发布**
2. 构建设置：
   ```
   发布平台：Web Mobile
   构建路径：build
   初始场景：Scene（你的主场景）
   ```
3. 点击 **"构建"** 按钮
4. 等待构建完成（1-3分钟）
5. 构建成功后会生成 `build/web-mobile` 文件夹

### 3. 测试构建结果
1. 点击 **"运行"** 按钮（在构建面板）
2. 浏览器会自动打开游戏
3. 确认游戏能正常运行

> ✅ **检查点**：确保 `D:\NewProject\build\web-mobile` 文件夹存在且里面有文件

---

## 第二步：注册 Gitee 账号 👤

### 1. 访问 Gitee
- 打开浏览器，访问：https://gitee.com

### 2. 注册账号
1. 点击右上角 **"注册"**
2. 填写信息：
   - 邮箱或手机号
   - 用户名（这个很重要，会用在网址里）
   - 密码
3. 验证邮箱/手机
4. 完成注册

> 💡 **提示**：用户名建议用英文，比如：`xiaoming-game`

---

## 第三步：创建 Gitee 仓库 📦

### 1. 新建仓库
1. 登录 Gitee 后，点击右上角 **"+"** → **"新建仓库"**
2. 填写仓库信息：
   ```
   仓库名称：dodge-game（或其他英文名）
   路径：会自动填写（用于网址）
   仓库介绍：躲避障碍物小游戏
   是否开源：选择"公开"
   初始化仓库：不勾选任何选项
   ```
3. 点击 **"创建"** 按钮

### 2. 记录仓库地址
创建完成后，复制仓库地址，类似：
```
https://gitee.com/你的用户名/dodge-game.git
```

---

## 第四步：上传项目到 Gitee 📤

### 方法 A：使用命令行（推荐）

#### 1. 打开终端
- 按 `Win + R`，输入 `cmd`，回车
- 或在项目文件夹空白处按住 `Shift + 右键`，选择"在此处打开 PowerShell 窗口"

#### 2. 进入项目目录
```bash
cd D:\NewProject
```

#### 3. 初始化 Git（首次使用）
```bash
git init
git config user.name "你的名字"
git config user.email "你的邮箱@example.com"
```

#### 4. 添加远程仓库
```bash
git remote add origin https://gitee.com/你的用户名/dodge-game.git
```

#### 5. 添加所有文件
```bash
git add .
```

#### 6. 提交
```bash
git commit -m "首次提交：躲避障碍物游戏"
```

#### 7. 推送到 Gitee
```bash
git push -u origin master
```

> 💡 **提示**：首次推送需要输入 Gitee 的用户名和密码

---

### 方法 B：使用 Gitee 网页上传（简单但慢）

1. 在 Gitee 仓库页面，点击 **"上传文件"**
2. 选择或拖拽项目文件夹
3. 填写提交信息
4. 点击 **"提交"**

> ⚠️ **注意**：这种方法不适合大文件，推荐使用方法 A

---

### 方法 C：使用自动部署脚本（最方便！）

1. 确保已经完成"方法 A"的步骤 1-4
2. 双击运行 `deploy.bat`（Windows）
3. 脚本会自动完成剩余步骤

---

## 第五步：开启 Gitee Pages 🌐

### 1. 进入仓库设置
1. 在你的 Gitee 仓库页面
2. 点击顶部菜单的 **"服务"** → **"Gitee Pages"**

### 2. 配置 Pages
```
部署分支：master
部署目录：build/web-mobile
（非常重要！不要填错！）
强制 HTTPS：勾选（可选）
```

### 3. 启动 Pages
1. 点击 **"启动"** 或 **"更新"** 按钮
2. 等待部署完成（1-3 分钟）
3. 部署成功后会显示访问地址

### 4. 获取游戏链接
部署成功后，你的游戏地址是：
```
https://你的用户名.gitee.io/dodge-game
```

---

## 第六步：分享给朋友 🎉

### 1. 测试链接
- 复制上面的链接
- 在浏览器打开
- 确认游戏能正常运行

### 2. 分享方式
- **发微信/QQ**：直接发链接
- **生成二维码**：用草料二维码等工具
- **发朋友圈**：配上游戏截图和链接

---

## 🔄 如何更新游戏？

### 每次修改游戏后：

1. **重新构建**
   - Cocos Creator → 项目 → 构建发布
   - 点击"构建"

2. **上传到 Gitee**
   ```bash
   cd D:\NewProject
   git add .
   git commit -m "更新游戏内容"
   git push
   ```

3. **更新 Pages**
   - 访问 Gitee 仓库
   - 服务 → Gitee Pages → 点击"更新"

4. **等待生效**
   - 1-3 分钟后，刷新游戏链接即可看到更新

---

## ❓ 常见问题

### Q1: 找不到 build/web-mobile 文件夹
**A:** 你还没有构建项目，回到第一步重新构建。

### Q2: 上传时提示 "fatal: not a git repository"
**A:** 你还没有初始化 Git，运行：
```bash
cd D:\NewProject
git init
```

### Q3: 推送时要求输入密码
**A:** 输入你的 Gitee 账号密码即可。如果每次都要输入，可以配置 SSH 密钥。

### Q4: Pages 显示 404
**A:** 检查部署目录是否填写正确：`build/web-mobile`（不要加前后斜杠）

### Q5: 游戏打开是空白页
**A:** 
- 检查浏览器控制台错误（F12）
- 确认构建时选择的是 Web Mobile 平台
- 尝试在本地运行测试

### Q6: 推送时提示"文件太大"
**A:** 
- 确保 `.gitignore` 文件存在
- 不要上传 `temp/`、`library/` 文件夹
- 只上传源代码和构建后的 `build/web-mobile`

### Q7: Gitee Pages 无法访问
**A:**
- 确认仓库是"公开"状态
- 等待 3-5 分钟，Gitee Pages 部署需要时间
- 清除浏览器缓存重试

---

## 🎯 快速命令速查表

```bash
# 首次设置
cd D:\NewProject
git init
git config user.name "你的名字"
git config user.email "你的邮箱"
git remote add origin https://gitee.com/你的用户名/仓库名.git

# 首次上传
git add .
git commit -m "首次提交"
git push -u origin master

# 之后每次更新
git add .
git commit -m "更新说明"
git push
```

---

## 📱 手机访问优化

你的游戏已经是 Web Mobile 版本，自动适配手机！

**建议朋友用手机访问时：**
- 使用微信/QQ/浏览器打开链接
- 横屏或竖屏都能玩
- 点击屏幕左右两侧移动

---

## 🎊 完成！

恭喜你！现在你的游戏已经发布到网上了！

**你的游戏链接：**
```
https://你的用户名.gitee.io/仓库名
```

分享给朋友，让他们挑战一下能坚持多少秒吧！🚀🎮

---

## 💡 进阶技巧

### 1. 自定义域名
- Gitee Pages 支持绑定自己的域名
- 在 Pages 设置里配置 CNAME

### 2. 使用 GitHub Pages（国际版）
- 流程类似，但访问地址是 `github.io`
- 国外访问更快

### 3. 添加统计
- 接入百度统计/Google Analytics
- 查看有多少人玩了你的游戏

### 4. 添加排行榜
- 使用 LeanCloud 等后端服务
- 记录最高分

---

## 📞 需要帮助？

如果遇到问题：
1. 查看上面的"常见问题"部分
2. 检查 Git 和 Gitee 的文档
3. 向开发者社区求助

祝你发布顺利！🎉


