import React, { useState, useEffect } from 'react';
import { PromptTemplate, TemplateVariable } from '../../types/promptTemplates';

interface TemplateEditorProps {
  template: PromptTemplate;
  onGenerate: (prompt: string) => void;
  onCancel?: () => void;
}

export const TemplateEditor: React.FC<TemplateEditorProps> = ({
  template,
  onGenerate,
  onCancel,
}) => {
  const [variables, setVariables] = useState<Record<string, string>>({});
  const [preview, setPreview] = useState<string>('');
  const [errors, setErrors] = useState<Record<string, string>>({});

  // 初始化變數預設值
  useEffect(() => {
    const initialValues: Record<string, string> = {};
    template.variables.forEach(variable => {
      initialValues[variable.name] = variable.defaultValue || '';
    });
    setVariables(initialValues);
  }, [template]);

  // 即時預覽
  useEffect(() => {
    let result = template.template;
    template.variables.forEach(variable => {
      const value = variables[variable.name] || variable.defaultValue || `[${variable.name}]`;
      const placeholder = `{{${variable.name}}}`;
      result = result.replace(new RegExp(placeholder, 'g'), value);
    });
    setPreview(result);
  }, [variables, template]);

  // 驗證輸入
  const validateVariables = (): boolean => {
    const newErrors: Record<string, string> = {};

    template.variables.forEach(variable => {
      const value = variables[variable.name] || '';

      // 必填檢查
      if (variable.required && !value.trim()) {
        newErrors[variable.name] = '此欄位為必填';
        return;
      }

      // 長度檢查
      if (variable.validation) {
        const { minLength, maxLength, pattern } = variable.validation;

        if (minLength && value.length < minLength) {
          newErrors[variable.name] = `最少需要 ${minLength} 個字元`;
        }

        if (maxLength && value.length > maxLength) {
          newErrors[variable.name] = `最多 ${maxLength} 個字元`;
        }

        if (pattern && value && !new RegExp(pattern).test(value)) {
          newErrors[variable.name] = '格式不正確';
        }
      }
    });

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleGenerate = () => {
    if (validateVariables()) {
      onGenerate(preview);
    }
  };

  const handleVariableChange = (variableName: string, value: string) => {
    setVariables(prev => ({
      ...prev,
      [variableName]: value,
    }));

    // 清除該欄位的錯誤
    if (errors[variableName]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[variableName];
        return newErrors;
      });
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-lg max-w-4xl mx-auto">
      {/* 標題列 */}
      <div className="flex items-center justify-between p-6 border-b">
        <div>
          <h2 className="text-xl font-semibold text-gray-900">{template.name}</h2>
          <p className="text-sm text-gray-600 mt-1">{template.description}</p>
        </div>
        {onCancel && (
          <button
            onClick={onCancel}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        )}
      </div>

      <div className="p-6">
        <div className="grid lg:grid-cols-2 gap-6">
          {/* 參數設定區 */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium text-gray-900 mb-4">參數設定</h3>

            {template.variables.map(variable => (
              <VariableInput
                key={variable.name}
                variable={variable}
                value={variables[variable.name] || ''}
                error={errors[variable.name]}
                onChange={value => handleVariableChange(variable.name, value)}
              />
            ))}

            {template.variables.length === 0 && (
              <div className="text-center py-8 text-gray-500">
                <div className="text-2xl mb-2">✅</div>
                <p>此模板不需要參數設定</p>
              </div>
            )}
          </div>

          {/* 預覽區 */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium text-gray-900 mb-4">即時預覽</h3>

            <div className="bg-gray-50 rounded-lg p-4 min-h-[300px]">
              <pre className="whitespace-pre-wrap text-sm text-gray-700 font-mono">{preview}</pre>
            </div>

            <div className="text-xs text-gray-500">預覽長度: {preview.length} 字元</div>
          </div>
        </div>

        {/* 操作按鈕 */}
        <div className="flex justify-end gap-3 mt-6 pt-6 border-t">
          {onCancel && (
            <button
              onClick={onCancel}
              className="px-4 py-2 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
            >
              取消
            </button>
          )}
          <button
            onClick={handleGenerate}
            disabled={Object.keys(errors).length > 0}
            className="px-6 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-300 text-white rounded-lg transition-colors"
          >
            生成提示詞
          </button>
        </div>
      </div>
    </div>
  );
};

// 變數輸入元件
interface VariableInputProps {
  variable: TemplateVariable;
  value: string;
  error?: string;
  onChange: (value: string) => void;
}

const VariableInput: React.FC<VariableInputProps> = ({ variable, value, error, onChange }) => {
  const renderInput = () => {
    const baseClassName = `w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors ${
      error ? 'border-red-300' : 'border-gray-300'
    }`;

    switch (variable.type) {
      case 'multiline':
        return (
          <textarea
            value={value}
            onChange={e => onChange(e.target.value)}
            placeholder={variable.placeholder}
            rows={4}
            className={baseClassName}
          />
        );

      case 'select':
        return (
          <select value={value} onChange={e => onChange(e.target.value)} className={baseClassName}>
            <option value="">請選擇...</option>
            {variable.options?.map(option => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
        );

      case 'number':
        return (
          <input
            type="number"
            value={value}
            onChange={e => onChange(e.target.value)}
            placeholder={variable.placeholder}
            className={baseClassName}
          />
        );

      default:
        return (
          <input
            type="text"
            value={value}
            onChange={e => onChange(e.target.value)}
            placeholder={variable.placeholder}
            className={baseClassName}
          />
        );
    }
  };

  return (
    <div className="space-y-2">
      <label className="block text-sm font-medium text-gray-700">
        {variable.name}
        {variable.required && <span className="text-red-500 ml-1">*</span>}
      </label>

      {variable.description && <p className="text-xs text-gray-500">{variable.description}</p>}

      {renderInput()}

      {error && <p className="text-sm text-red-600">{error}</p>}

      {variable.validation && (
        <div className="text-xs text-gray-500">
          {variable.validation.minLength && variable.validation.maxLength && (
            <span>
              長度: {variable.validation.minLength}-{variable.validation.maxLength} 字元
            </span>
          )}
          {variable.validation.minLength && !variable.validation.maxLength && (
            <span>最少 {variable.validation.minLength} 字元</span>
          )}
          {!variable.validation.minLength && variable.validation.maxLength && (
            <span>最多 {variable.validation.maxLength} 字元</span>
          )}
        </div>
      )}
    </div>
  );
};
