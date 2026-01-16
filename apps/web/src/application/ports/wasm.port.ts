/**
 * WASM 性能优化端口接口
 * 定义应用层需要的 WASM 功能接口，遵循依赖倒置原则
 */

/**
 * Schema 验证结果
 */
export interface SchemaValidationResult {
  valid: boolean;
  errors: string[];
}

/**
 * 位置信息
 */
export interface Position {
  x: number;
  y: number;
}

/**
 * WASM 数据解析端口
 */
export interface IWasmDataParserPort {
  /**
   * 解析 CSV 文本
   */
  parseCsv(csvText: string): Promise<any[]>;

  /**
   * 解析 XML 文本
   */
  parseXml(xmlText: string): Promise<any>;

  /**
   * 验证 JSON 文本
   */
  validateJson(jsonText: string): Promise<boolean>;
}

/**
 * WASM Schema 处理端口
 */
export interface IWasmSchemaProcessorPort {
  /**
   * 序列化项目数据为 Schema JSON
   */
  serializeSchema(projectData: any): Promise<string>;

  /**
   * 反序列化 Schema JSON 为项目数据
   */
  deserializeSchema(schemaJson: string): Promise<any>;

  /**
   * 验证 Schema 格式
   */
  validateSchema(schemaJson: string): Promise<SchemaValidationResult>;

  /**
   * 迁移 Schema 版本
   */
  migrateSchema(
    schemaJson: string,
    fromVersion: string,
    toVersion: string
  ): Promise<string>;
}

/**
 * WASM 数据映射端口
 */
export interface IWasmDataMapperPort {
  /**
   * 生成数据映射
   */
  generateMapping(sourceData: any, targetStructure: any): Promise<any[]>;

  /**
   * 应用映射规则
   */
  applyMapping(data: any, mappings: any[]): Promise<any>;

  /**
   * 转换数据
   */
  transformData(data: any, transformRules: any): Promise<any>;
}

/**
 * WASM 布局计算端口
 */
export interface IWasmLayoutCalculatorPort {
  /**
   * 计算布局
   */
  calculateLayout(components: any[], viewportWidth: number): Promise<any[]>;

  /**
   * 网格对齐
   */
  snapToGrid(x: number, y: number, gridSize: number): Promise<Position>;

  /**
   * 检测碰撞
   */
  detectCollision(component1: any, component2: any): Promise<boolean>;
}

/**
 * WASM 端口聚合接口
 */
export interface IWasmPort {
  dataParser: IWasmDataParserPort;
  schemaProcessor: IWasmSchemaProcessorPort;
  dataMapper: IWasmDataMapperPort;
  layoutCalculator: IWasmLayoutCalculatorPort;
}
