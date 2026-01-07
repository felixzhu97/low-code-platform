/**
 * @deprecated 此文件已废弃，请使用新的领域模块导入
 * 为了保持向后兼容，此文件重新导出所有领域的仓库接口
 * 
 * 新的导入方式：
 * - import { IComponentRepository } from '@domain/component'
 * - import { IDataSourceRepository } from '@domain/datasource'
 * - import { ITemplateRepository, Template } from '@domain/template'
 */

export type { IComponentRepository } from "../component/repositories/component.repository";
export type { ITemplateRepository } from "../template/repositories/template.repository";
export type { Template } from "../template/entities/template.entity";
export type { IDataSourceRepository } from "../datasource/repositories/data-source.repository";
