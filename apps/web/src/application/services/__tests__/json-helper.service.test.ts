import { describe, it, expect } from "vitest";
import { JsonHelperService } from "../json-helper.service";

describe("JsonHelperService", () => {
  describe("validateJson", () => {
    it("应该验证有效的 JSON 字符串", () => {
      const result = JsonHelperService.validateJson(
        '{"name": "test", "value": 123}'
      );
      expect(result.valid).toBe(true);
      expect(result.data).toEqual({ name: "test", value: 123 });
      expect(result.error).toBeUndefined();
    });

    it("应该拒绝无效的 JSON 字符串", () => {
      const result = JsonHelperService.validateJson(
        '{"name": "test", "value": 123'
      );
      expect(result.valid).toBe(false);
      expect(result.error).toBeDefined();
      expect(result.data).toBeUndefined();
    });

    it("应该拒绝空字符串", () => {
      const result = JsonHelperService.validateJson("");
      expect(result.valid).toBe(false);
      expect(result.error).toContain("不能为空");
    });

    it("应该拒绝只包含空格的字符串", () => {
      const result = JsonHelperService.validateJson("   ");
      expect(result.valid).toBe(false);
      expect(result.error).toContain("不能为空");
    });

    it("应该处理数组 JSON", () => {
      const result = JsonHelperService.validateJson('[1, 2, 3, "test"]');
      expect(result.valid).toBe(true);
      expect(result.data).toEqual([1, 2, 3, "test"]);
    });
  });

  describe("formatJson", () => {
    it("应该格式化紧凑的 JSON 字符串", () => {
      const input = '{"name":"test","value":123}';
      const result = JsonHelperService.formatJson(input, 2);
      expect(result).toContain("\n");
      expect(result).toContain("  "); // 缩进
      expect(result).toContain('"name"');
      expect(result).toContain('"value"');
    });

    it("应该支持自定义缩进", () => {
      const input = '{"name":"test"}';
      const result = JsonHelperService.formatJson(input, 4);
      expect(result).toContain("    "); // 4 空格缩进
    });

    it("应该处理无效 JSON（返回原字符串）", () => {
      const input = '{"invalid": json}';
      const result = JsonHelperService.formatJson(input);
      expect(result).toBe(input);
    });
  });

  describe("minifyJson", () => {
    it("应该压缩格式化的 JSON", () => {
      const input = `{
        "name": "test",
        "value": 123
      }`;
      const result = JsonHelperService.minifyJson(input);
      expect(result).not.toContain("\n");
      expect(result).not.toContain("  ");
      expect(result.length).toBeLessThan(input.length);
    });

    it("应该处理无效 JSON（返回原字符串）", () => {
      const input = '{"invalid": json}';
      const result = JsonHelperService.minifyJson(input);
      expect(result).toBe(input);
    });
  });

  describe("analyzeJsonStructure", () => {
    it("应该分析对象结构", () => {
      const data = { name: "test", value: 123 };
      const result = JsonHelperService.analyzeJsonStructure(data);
      expect(result.type).toBe("object");
      expect(result.paths).toContain(".name");
      expect(result.paths).toContain(".value");
      expect(result.structure).toHaveProperty("name");
      expect(result.structure).toHaveProperty("value");
    });

    it("应该分析数组结构", () => {
      const data = [1, 2, 3];
      const result = JsonHelperService.analyzeJsonStructure(data);
      expect(result.type).toBe("array");
      expect(result.paths).toContain("[]");
      // 只有当数组不为空时才会有 [0] 路径
      if (data.length > 0) {
        expect(result.paths).toContain("[0]");
        expect(result.sample).toBe(1);
      }
    });

    it("应该分析嵌套对象结构", () => {
      const data = { user: { name: "test", age: 20 } };
      const result = JsonHelperService.analyzeJsonStructure(data);
      expect(result.type).toBe("object");
      expect(result.paths).toContain(".user");
      expect(result.paths).toContain(".user.name");
      expect(result.paths).toContain(".user.age");
    });

    it("应该处理 null 值", () => {
      const result = JsonHelperService.analyzeJsonStructure(null);
      expect(result.type).toBe("null");
      expect(result.paths).toEqual([]);
    });

    it("应该处理 undefined 值", () => {
      const result = JsonHelperService.analyzeJsonStructure(undefined);
      expect(result.type).toBe("undefined");
      expect(result.paths).toEqual([]);
    });

    it("应该处理原始类型", () => {
      const result = JsonHelperService.analyzeJsonStructure("test");
      expect(result.type).toBe("primitive");
      expect(result.sample).toBe("test");
    });
  });

  describe("analyzeJsonString", () => {
    it("应该从 JSON 字符串分析结构", () => {
      const jsonString = '{"name": "test", "value": 123}';
      const result = JsonHelperService.analyzeJsonString(jsonString);
      expect(result).not.toBeNull();
      expect(result!.type).toBe("object");
      expect(result!.paths).toContain(".name");
      expect(result!.paths).toContain(".value");
    });

    it("应该对无效 JSON 返回 null", () => {
      const result = JsonHelperService.analyzeJsonString('{"invalid": json}');
      expect(result).toBeNull();
    });
  });

  describe("extractPaths", () => {
    it("应该提取对象的所有路径", () => {
      const data = { name: "test", value: 123 };
      const paths = JsonHelperService.extractPaths(data);
      expect(paths).toContain("name");
      expect(paths).toContain("value");
    });

    it("应该提取嵌套对象的路径", () => {
      const data = { user: { name: "test" } };
      const paths = JsonHelperService.extractPaths(data);
      expect(paths).toContain("user");
      expect(paths).toContain("user.name");
    });

    it("应该提取数组的路径", () => {
      const data = [1, 2, 3];
      const paths = JsonHelperService.extractPaths(data);
      expect(paths).toContain("[0]");
    });

    it("应该支持前缀", () => {
      const data = { name: "test" };
      const paths = JsonHelperService.extractPaths(data, "data");
      expect(paths).toContain("data");
      expect(paths).toContain("data.name");
    });

    it("应该处理 null 值", () => {
      const paths = JsonHelperService.extractPaths(null);
      expect(paths).toEqual([]);
    });

    it("应该处理 undefined 值", () => {
      const paths = JsonHelperService.extractPaths(undefined);
      expect(paths).toEqual([]);
    });
  });

  describe("isArrayFormat", () => {
    it("应该识别数组格式", () => {
      expect(JsonHelperService.isArrayFormat("[1, 2, 3]")).toBe(true);
      expect(JsonHelperService.isArrayFormat('["a", "b"]')).toBe(true);
    });

    it("应该拒绝对象格式", () => {
      expect(JsonHelperService.isArrayFormat('{"a": 1}')).toBe(false);
    });

    it("应该对无效 JSON 返回 false", () => {
      expect(JsonHelperService.isArrayFormat("invalid json")).toBe(false);
    });
  });

  describe("isObjectFormat", () => {
    it("应该识别对象格式", () => {
      expect(JsonHelperService.isObjectFormat('{"a": 1}')).toBe(true);
      expect(JsonHelperService.isObjectFormat('{"name": "test"}')).toBe(true);
    });

    it("应该拒绝数组格式", () => {
      expect(JsonHelperService.isObjectFormat("[1, 2, 3]")).toBe(false);
    });

    it("应该对无效 JSON 返回 false", () => {
      expect(JsonHelperService.isObjectFormat("invalid json")).toBe(false);
    });
  });
});
