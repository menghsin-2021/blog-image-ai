# 修正 Conda 環境預設設定指南

## 問題描述
終端機開啟時顯示 `(dbt-bq)(base)` 或 `(base)(base)` 而不是期望的 `(base)`

## 解決方案

### 1. 確認目前環境狀態
```bash
# 檢查目前環境
conda info --envs

# 應該看到：
# base                  *  /opt/homebrew/anaconda3
```

### 2. 如果不在 base 環境，請退出到 base
```bash
# 退出當前環境直到回到 base
conda deactivate
conda deactivate  # 如果需要多次退出
```

### 3. 確認 conda 設定正確
```bash
# 檢查自動激活設定
conda config --show | grep auto_activate

# 應該顯示：
# auto_activate_base: True
```

### 4. 重新初始化 conda（如果需要）
```bash
# 重新初始化 zsh 的 conda 整合
conda init --reverse
conda init zsh
```

### 5. 清理可能的重複設定
檢查並編輯 ~/.zshrc 檔案，確保沒有重複的 conda 初始化或額外的激活指令：

```bash
# 編輯 zshrc
nano ~/.zshrc

# 尋找並移除任何多餘的：
# conda activate xxx
# 或重複的 conda initialize 區塊
```

### 6. 重新載入設定
```bash
# 重新載入 shell 設定
source ~/.zshrc

# 或者關閉並重新開啟終端機
```

## 驗證步驟

1. 開啟新的終端機視窗
2. 應該只看到 `(base)` 而不是 `(base)(base)` 或其他環境
3. 執行 `conda info --envs` 確認在正確環境

## 如果問題持續存在

### 檢查其他可能的設定檔
```bash
# 檢查是否有其他 shell 設定檔影響
grep -r "conda activate" ~/.bash_profile ~/.bashrc ~/.profile 2>/dev/null

# 檢查 conda 設定
cat ~/.condarc
```

### 完全重置 conda 設定（最後手段）
```bash
# 備份現有設定
cp ~/.condarc ~/.condarc.backup
cp ~/.zshrc ~/.zshrc.backup

# 移除 conda 設定
rm ~/.condarc

# 重新初始化
conda init zsh

# 重新設定基本設定
conda config --set auto_activate_base true
```

## VSCode 終端機環境問題

### 問題描述
VSCode 開啟的新終端機顯示錯誤的環境（如 `(dbt-bq)(base)` 而不是專案期望的環境）

### 解決方案

#### 1. 確保專案環境存在且正確
```bash
# 檢查環境是否存在
conda info --envs

# 如果 blog-image-ai 環境不存在或損壞，重新建立
conda remove --name blog-image-ai --all -y
conda create --name blog-image-ai python=3.11 nodejs=18 -y

# 激活環境
conda activate blog-image-ai

# 確認環境正確
which python
python --version
```

#### 2. 設定 VSCode 工作區 Python 環境
建立或編輯 `.vscode/settings.json` 檔案：

```json
{
    "python.defaultInterpreterPath": "/opt/homebrew/anaconda3/envs/blog-image-ai/bin/python",
    "python.terminal.activateEnvironment": true,
    "terminal.integrated.env.osx": {
        "CONDA_DEFAULT_ENV": "blog-image-ai"
    },
    "terminal.integrated.shell.osx": "/bin/zsh",
    "terminal.integrated.shellArgs.osx": ["-l"]
}
```

#### 3. 重新載入 VSCode 視窗
- 按 `Cmd+Shift+P` 開啟指令面板
- 執行 "Developer: Reload Window" 或 "重新載入視窗"

#### 4. 驗證設定
開啟新的 VSCode 終端機應該顯示：
```bash
(blog-image-ai) username@hostname:~/path/to/project$
```

#### 5. 如果問題持續存在
```bash
# 手動激活正確環境
conda activate blog-image-ai

# 確認環境正確
conda info --envs

# 檢查 Python 路徑是否正確
which python
```

#### 6. 疑難排解
如果 VSCode 仍然開啟錯誤的環境：

1. **檢查全域 Python 解釋器設定**
   - 按 `Cmd+Shift+P`
   - 輸入 "Python: Select Interpreter"
   - 選擇 `/opt/homebrew/anaconda3/envs/blog-image-ai/bin/python`

2. **清理 VSCode 工作區快取**
   ```bash
   # 關閉 VSCode
   # 刪除工作區快取
   rm -rf .vscode/settings.json.bak
   # 重新開啟 VSCode
   ```

3. **檢查 conda 初始化**
   ```bash
   # 確保 conda 在 zsh 中正確初始化
   conda init zsh
   source ~/.zshrc
   ```

---

## 成功設定的確認

當設定正確時，您應該看到：
- 新終端機開啟時顯示 `(base)`
- `conda info --envs` 顯示 base 環境有星號 `*`
- `echo $CONDA_DEFAULT_ENV` 顯示 `base`

---

**注意**: 如果您經常需要使用特定環境，建議使用 `conda activate 環境名稱` 手動激活，而不是設定為預設環境。
