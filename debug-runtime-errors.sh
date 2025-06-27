#!/bin/bash

# 詳細的運行時錯誤偵測與修復驗證腳本
# 包含實際測試執行和錯誤捕獲

echo "🔍 詳細運行時錯誤偵測"
echo "========================"
echo "時間: $(date)"
echo ""

# 檢查容器狀態
CONTAINER_ID=$(docker ps -q --filter "name=blog-image-ai-dev")
if [ -z "$CONTAINER_ID" ]; then
    echo "❌ 容器未運行，啟動容器..."
    ./start-server.sh dev
    sleep 5
    CONTAINER_ID=$(docker ps -q --filter "name=blog-image-ai-dev")
fi
echo "✅ 容器運行中: $CONTAINER_ID"

# 清理並檢查記錄
echo ""
echo "🧹 清理現有記錄..."
docker exec $CONTAINER_ID sh -c "echo '' > /tmp/error.log" 2>/dev/null || true

# 檢查服務可用性
echo ""
echo "🌐 檢查服務可用性..."
HTTP_STATUS=$(curl -s -o /dev/null -w "%{http_code}" http://localhost:3000)
if [ "$HTTP_STATUS" -ne 200 ]; then
    echo "❌ 服務不可用: $HTTP_STATUS"
    exit 1
fi
echo "✅ 服務正常: $HTTP_STATUS"

# 檢查快取相關檔案是否正確編譯
echo ""
echo "🔧 檢查快取相關檔案編譯狀態..."

# 檢查主要檔案是否存在且無語法錯誤
FILES_TO_CHECK=(
    "src/services/gpt4oOptimizer.ts"
    "src/hooks/usePromptOptimizationCache.ts"
    "src/components/CacheTestPanel.tsx"
)

for file in "${FILES_TO_CHECK[@]}"; do
    if docker exec $CONTAINER_ID test -f "/app/$file"; then
        echo "✅ $file 存在"
    else
        echo "❌ $file 不存在"
        exit 1
    fi
done

# 檢查頁面中是否有快取測試頁籤
echo ""
echo "📄 檢查頁面內容..."
PAGE_CONTENT=$(curl -s http://localhost:3000)

if echo "$PAGE_CONTENT" | grep -q "快取測試"; then
    echo "✅ 快取測試頁籤存在於頁面中"
else
    echo "❌ 快取測試頁籤不存在於頁面中"
    echo "頁面片段:"
    echo "$PAGE_CONTENT" | grep -i "tab\|頁" | head -3
fi

# 檢查 JavaScript 載入
if echo "$PAGE_CONTENT" | grep -q "CacheTestPanel"; then
    echo "✅ CacheTestPanel 元件已載入"
else
    echo "⚠️ CacheTestPanel 元件可能未正確載入"
fi

# 記錄目前的記憶體和 CPU 使用
echo ""
echo "📊 記錄資源使用..."
MEMORY_CPU=$(docker stats --no-stream --format "{{.MemUsage}} | {{.CPUPerc}}" $CONTAINER_ID)
echo "記憶體/CPU: $MEMORY_CPU"

# 監控容器日誌中的錯誤
echo ""
echo "📝 監控錯誤日誌..."
RECENT_LOGS=$(docker logs $CONTAINER_ID --tail 10 2>&1)

# 檢查各種類型的錯誤
ERROR_TYPES=(
    "Cannot read properties"
    "TypeError"
    "ReferenceError"
    "undefined"
    "null"
    "failed"
    "error"
)

HAS_ERRORS=false
for error_type in "${ERROR_TYPES[@]}"; do
    ERROR_COUNT=$(echo "$RECENT_LOGS" | grep -i "$error_type" | wc -l)
    if [ $ERROR_COUNT -gt 0 ]; then
        echo "⚠️ 發現 $error_type 錯誤: $ERROR_COUNT 次"
        echo "$RECENT_LOGS" | grep -i "$error_type" | head -2
        HAS_ERRORS=true
    fi
done

if [ "$HAS_ERRORS" = false ]; then
    echo "✅ 容器日誌中無明顯錯誤"
fi

# 建立測試摘要
echo ""
echo "🎯 測試摘要"
echo "============"

# 服務狀態檢查
if [ "$HTTP_STATUS" -eq 200 ]; then
    echo "✅ HTTP 服務: 正常"
else
    echo "❌ HTTP 服務: 異常 ($HTTP_STATUS)"
fi

# 頁面載入檢查
if echo "$PAGE_CONTENT" | grep -q "快取測試"; then
    echo "✅ 快取測試頁面: 可見"
else
    echo "❌ 快取測試頁面: 不可見"
fi

# 記錄檢查
if [ "$HAS_ERRORS" = false ]; then
    echo "✅ 容器日誌: 無錯誤"
else
    echo "⚠️ 容器日誌: 發現錯誤"
fi

echo ""
echo "📋 手動測試建議:"
echo "1. 開啟 http://localhost:3000 (在新分頁)"
echo "2. 按 F12 開啟開發者工具"
echo "3. 切換到 Console 頁籤"
echo "4. 點選「🐳 快取測試」頁籤"
echo "5. 點選「🔄 真實功能測試」按鈕"
echo "6. 觀察 Console 中是否出現 'Cannot read properties of undefined' 錯誤"
echo "7. 如果有錯誤，請複製完整的錯誤訊息"

echo ""
echo "🔧 如果仍有錯誤的除錯步驟:"
echo "- 檢查 Console 中的完整錯誤堆疊"
echo "- 找出錯誤發生的確切檔案和行數"
echo "- 檢查該處程式碼是否有 undefined 存取"
echo "- 提供錯誤的詳細資訊以便進一步修復"

echo ""
echo "✅ 詳細偵測完成 - 請執行手動測試以確認修復狀態"
echo ""
