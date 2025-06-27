#!/bin/bash

# 快取系統實際錯誤偵測腳本
# 透過模擬 API 呼叫來觸發並捕獲實際錯誤

echo "🔍 快取系統實際錯誤偵測"
echo "=========================="
echo "時間: $(date)"
echo ""

# 檢查容器狀態
CONTAINER_ID=$(docker ps -q --filter "name=blog-image-ai-dev")
if [ -z "$CONTAINER_ID" ]; then
    echo "❌ 容器未運行"
    exit 1
fi
echo "✅ 容器運行中: $CONTAINER_ID"

# 檢查服務可用性
echo ""
echo "🌐 檢查服務可用性..."
HTTP_STATUS=$(curl -s -o /dev/null -w "%{http_code}" http://localhost:3000)
if [ "$HTTP_STATUS" -ne 200 ]; then
    echo "❌ 服務不可用: $HTTP_STATUS"
    exit 1
fi
echo "✅ 服務正常: $HTTP_STATUS"

# 檢查瀏覽器 console 錯誤（透過網頁測試）
echo ""
echo "🧪 執行實際快取測試..."

# 檢查快取測試頁面是否載入
echo "檢查快取測試頁面..."
PAGE_HTML=$(curl -s http://localhost:3000)

if echo "$PAGE_HTML" | grep -q "快取測試"; then
    echo "✅ 快取測試頁面元素存在"
else
    echo "❌ 快取測試頁面元素不存在"
fi

# 檢查相關 JavaScript 檔案是否存在錯誤
echo ""
echo "🔧 檢查容器內即時編譯狀態..."

# 觸發一次熱重載來檢查即時錯誤
echo "觸發熱重載..."
docker exec $CONTAINER_ID touch /app/src/components/CacheTestPanel.tsx

sleep 2

# 檢查最新日誌中的錯誤
echo ""
echo "📝 檢查最新錯誤日誌..."
RECENT_LOGS=$(docker logs $CONTAINER_ID --tail 5 2>&1)

# 檢查是否有編譯錯誤
if echo "$RECENT_LOGS" | grep -q "error"; then
    echo "❌ 發現編譯錯誤:"
    echo "$RECENT_LOGS" | grep "error"
else
    echo "✅ 無編譯錯誤"
fi

# 檢查是否有運行時錯誤
if echo "$RECENT_LOGS" | grep -q "Cannot read properties"; then
    echo "❌ 發現運行時錯誤:"
    echo "$RECENT_LOGS" | grep "Cannot read properties"
else
    echo "✅ 無 'Cannot read properties' 錯誤"
fi

echo ""
echo "🎯 快速測試建議："
echo "1. 開啟 http://localhost:3000"
echo "2. 開啟瀏覽器開發者工具 (F12)"
echo "3. 切換到快取測試頁籤"
echo "4. 執行真實功能測試"
echo "5. 觀察 Console 中的錯誤訊息"
echo ""

# 建立簡單的 curl 測試來模擬前端請求
echo "🔄 模擬前端請求測試..."
echo "注意：這只能測試靜態內容，實際 API 呼叫需要在瀏覽器中進行"

# 檢查主要元件是否正確載入
if curl -s http://localhost:3000 | grep -q "提示詞最佳化助手"; then
    echo "✅ 主要元件載入正常"
else
    echo "⚠️ 主要元件可能有問題"
fi

echo ""
echo "📋 下一步除錯建議："
echo "- 在瀏覽器中執行實際測試"
echo "- 檢查瀏覽器 Console 中的具體錯誤"
echo "- 如果仍有錯誤，請提供具體的錯誤訊息"
echo ""
