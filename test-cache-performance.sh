#!/bin/bash

# 容器化快取系統效能測試腳本
# 在 Docker 環境中執行快取系統的基準測試

echo "🐳 容器化快取系統效能測試"
echo "=================================="

# 檢查容器是否運行
container_name="blog-image-ai-dev"
if ! docker ps | grep -q "$container_name"; then
    echo "❌ 容器 $container_name 未運行，請先啟動開發伺服器"
    echo "執行: ./start-server.sh dev"
    exit 1
fi

echo "✅ 容器 $container_name 運行中"

# 檢查服務是否可用
echo "🔍 檢查服務可用性..."
response=$(curl -s -o /dev/null -w "%{http_code}" http://localhost:3000)
if [ "$response" != "200" ]; then
    echo "❌ 服務不可用，HTTP 狀態碼: $response"
    exit 1
fi
echo "✅ 服務正常運行"

# 記錄初始容器狀態
echo "📊 記錄初始容器狀態..."
initial_stats=$(docker stats --no-stream --format "table {{.MemUsage}}\t{{.CPUPerc}}" $container_name)
echo "初始狀態: $initial_stats"

# 執行記憶體測試
echo "🧠 執行記憶體使用測試..."
for i in {1..5}; do
    mem_usage=$(docker stats --no-stream --format "{{.MemUsage}}" $container_name | cut -d'/' -f1)
    cpu_usage=$(docker stats --no-stream --format "{{.CPUPerc}}" $container_name)
    echo "測試 $i: 記憶體 $mem_usage, CPU $cpu_usage"
    sleep 2
done

# 測試網路連通性
echo "🌐 測試網路效能..."
start_time=$(date +%s%3N)
for i in {1..10}; do
    curl -s -o /dev/null http://localhost:3000 > /dev/null
done
end_time=$(date +%s%3N)
total_time=$((end_time - start_time))
avg_time=$((total_time / 10))
echo "✅ 10 次請求平均回應時間: ${avg_time}ms"

# 檢查容器日誌中的錯誤
echo "📝 檢查容器錯誤日誌..."
error_count=$(docker logs $container_name 2>&1 | grep -i error | wc -l)
warning_count=$(docker logs $container_name 2>&1 | grep -i warning | wc -l)
encoding_errors=$(docker logs $container_name 2>&1 | grep -i "InvalidCharacterError\|btoa\|encoding" | wc -l)
echo "錯誤數量: $error_count, 警告數量: $warning_count, 編碼錯誤: $encoding_errors"

# 建構測試（型別檢查）
echo "🔨 執行容器內建構測試..."
build_start=$(date +%s)
build_result=$(docker exec $container_name npm run build 2>&1)
build_end=$(date +%s)
build_time=$((build_end - build_start))

if echo "$build_result" | grep -q "error"; then
    echo "❌ 建構失敗，發現 TypeScript 錯誤"
    echo "$build_result" | grep "error" | head -5
else
    echo "✅ 建構成功，耗時: ${build_time}s"
fi

# 檢查磁碟使用
echo "💾 檢查容器磁碟使用..."
disk_usage=$(docker exec $container_name df -h /app | tail -1 | awk '{print $3 "/" $2 " (" $5 ")"}')
echo "磁碟使用: $disk_usage"

# 記錄最終狀態
echo "📊 記錄最終容器狀態..."
final_stats=$(docker stats --no-stream --format "table {{.MemUsage}}\t{{.CPUPerc}}" $container_name)
echo "最終狀態: $final_stats"

echo ""
echo "🎯 快取系統效能測試結果摘要"
echo "=================================="
echo "• 服務可用性: ✅"
echo "• 平均回應時間: ${avg_time}ms"
echo "• 容器錯誤: $error_count"
echo "• 建構時間: ${build_time}s"
echo "• 磁碟使用: $disk_usage"

# 效能評分
score=100
if [ $avg_time -gt 300 ]; then score=$((score - 20)); fi
if [ $error_count -gt 0 ]; then score=$((score - 30)); fi
if [ $build_time -gt 60 ]; then score=$((score - 10)); fi
if [ $encoding_errors -gt 0 ]; then score=$((score - 25)); fi

echo ""
if [ $score -ge 90 ]; then
    echo "🏆 效能評級: A+ (優秀) - 分數: $score/100"
elif [ $score -ge 80 ]; then
    echo "🥈 效能評級: A (良好) - 分數: $score/100"
elif [ $score -ge 70 ]; then
    echo "🥉 效能評級: B (普通) - 分數: $score/100"
else
    echo "⚠️ 效能評級: C (需改善) - 分數: $score/100"
fi

echo ""
echo "🔧 建議改善項目:"
if [ $avg_time -gt 300 ]; then
    echo "• 優化網路回應時間 (目標: <300ms)"
fi
if [ $error_count -gt 0 ]; then
    echo "• 修復容器錯誤"
fi
if [ $build_time -gt 60 ]; then
    echo "• 優化建構速度"
fi
if [ $encoding_errors -gt 0 ]; then
    echo "• 修復字符編碼錯誤 (UTF-8 支援)"
fi

echo ""
echo "📝 測試完成時間: $(date)"
echo "🐳 容器化環境測試結束"
