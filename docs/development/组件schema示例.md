# 主要组件 Schema 示例

## 按钮（Button）

```json
{
  "type": "button",
  "props": {
    "text": "提交",
    "type": "primary",
    "onClick": "submitForm"
  },
  "style": {
    "width": 120,
    "height": 40
  }
}
```

## 输入框（Input）

```json
{
  "type": "input",
  "props": {
    "placeholder": "请输入内容",
    "value": "",
    "onChange": "handleInputChange"
  },
  "style": {
    "width": 200
  }
}
```

## 表单（Form）

```json
{
  "type": "form",
  "props": {
    "fields": [
      { "type": "input", "name": "username", "label": "用户名" },
      { "type": "password", "name": "password", "label": "密码" }
    ],
    "onSubmit": "handleSubmit"
  }
}
```

## 表格（Table）

```json
{
  "type": "table",
  "props": {
    "columns": [
      { "title": "姓名", "dataIndex": "name" },
      { "title": "年龄", "dataIndex": "age" }
    ],
    "dataSource": [
      { "name": "张三", "age": 28 },
      { "name": "李四", "age": 32 }
    ]
  }
}
```
