# API 文档

## REST API 端点

### 组件 API

`POST /api/components`  
创建新组件

**请求体**:

```json
{
  "name": "Button",
  "props": {
    "variant": "primary",
    "size": "md"
  }
}
```

**响应**:

```json
{
  "id": "comp_123",
  "createdAt": "2025-05-08T04:00:02Z"
}
```

### 模板 API

`GET /api/templates`  
获取可用模板列表

**响应**:

```json
[
  {
    "id": "template_1",
    "name": "Dashboard",
    "components": ["Header", "Sidebar", "Chart"]
  }
]
```

## 错误响应

```json
{
  "error": "Invalid request",
  "message": "Missing required fields",
  "statusCode": 400
}
```

## 认证

```http
Authorization: Bearer {token}
```
