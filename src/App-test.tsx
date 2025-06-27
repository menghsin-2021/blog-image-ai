// import React from 'react';

function App() {
  console.log('App component is rendering...');
  
  return (
    <div style={{ 
      minHeight: '100vh', 
      background: 'linear-gradient(to bottom right, #dbeafe, #e0e7ff, #f3e8ff)',
      padding: '2rem'
    }}>
      <div style={{ 
        maxWidth: '1200px', 
        margin: '0 auto',
        backgroundColor: 'white',
        padding: '2rem',
        borderRadius: '12px',
        boxShadow: '0 10px 25px rgba(0,0,0,0.1)'
      }}>
        <h1 style={{ 
          fontSize: '3rem', 
          fontWeight: 'bold', 
          color: '#1f2937',
          textAlign: 'center',
          marginBottom: '1rem'
        }}>
          BlogImageAI
        </h1>
        <p style={{ 
          fontSize: '1.2rem', 
          color: '#6b7280',
          textAlign: 'center',
          marginBottom: '2rem'
        }}>
          AI 圖片生成助手正在載入...
        </p>
        
        <div style={{
          backgroundColor: '#f9fafb',
          padding: '1.5rem',
          borderRadius: '8px',
          border: '1px solid #e5e7eb'
        }}>
          <h3 style={{ fontSize: '1.1rem', fontWeight: '600', marginBottom: '0.5rem' }}>
            系統狀態檢查：
          </h3>
          <ul style={{ listStyle: 'none', padding: 0 }}>
            <li style={{ color: '#059669', marginBottom: '0.25rem' }}>✅ React 應用程式已載入</li>
            <li style={{ color: '#059669', marginBottom: '0.25rem' }}>✅ CSS 樣式正常</li>
            <li style={{ color: '#059669', marginBottom: '0.25rem' }}>✅ 基本渲染功能正常</li>
            <li style={{ color: '#d97706', marginBottom: '0.25rem' }}>⚠️  等待完整功能載入...</li>
          </ul>
        </div>
        
        <div style={{ marginTop: '2rem', textAlign: 'center' }}>
          <button 
            style={{
              backgroundColor: '#3b82f6',
              color: 'white',
              padding: '0.75rem 1.5rem',
              borderRadius: '8px',
              border: 'none',
              fontSize: '1rem',
              cursor: 'pointer'
            }}
            onClick={() => alert('基本按鈕功能正常！')}
          >
            測試按鈕
          </button>
        </div>
      </div>
    </div>
  );
}

export default App;
