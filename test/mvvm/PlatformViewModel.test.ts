/**
 * PlatformViewModel 测试
 */

import { describe, it, expect, beforeEach, vi } from 'vitest';
import { PlatformViewModel } from '@/mvvm/viewmodels/PlatformViewModel';
import { ComponentModelFactory } from '@/mvvm/models/ComponentModel';

describe('PlatformViewModel', () => {
  let viewModel: PlatformViewModel;
  let mockListener: ReturnType<typeof vi.fn>;

  beforeEach(() => {
    viewModel = new PlatformViewModel();
    mockListener = vi.fn();
  });

  describe('基础功能', () => {
    it('应该能够创建默认状态的ViewModel', () => {
      const state = viewModel.getState();
      
      expect(state.components).toEqual([]);
      expect(state.selectedComponentId).toBeNull();
      expect(state.activeTab).toBe('components');
      expect(state.previewMode).toBe(false);
      expect(state.projectName).toBe('我的低代码项目');
    });

    it('应该能够订阅状态变化', () => {
      const unsubscribe = viewModel.subscribe(mockListener);
      
      // 改变状态应该触发通知
      viewModel.setPreviewMode(true);
      // 可能会触发多次通知（组件选择变化也会触发）
      expect(mockListener).toHaveBeenCalled();
      
      // 重置mock计数器
      mockListener.mockClear();
      
      // 取消订阅后不应该再收到通知
      unsubscribe();
      viewModel.setPreviewMode(false);
      expect(mockListener).not.toHaveBeenCalled();
    });
  });

  describe('UI状态管理', () => {
    it('应该能够设置活动标签', () => {
      viewModel.setActiveTab('tree');
      expect(viewModel.getActiveTab()).toBe('tree');
      
      viewModel.setActiveTab('data');
      expect(viewModel.getActiveTab()).toBe('data');
    });

    it('应该能够切换预览模式', () => {
      expect(viewModel.isPreviewMode()).toBe(false);
      
      viewModel.setPreviewMode(true);
      expect(viewModel.isPreviewMode()).toBe(true);
      
      viewModel.setPreviewMode(false);
      expect(viewModel.isPreviewMode()).toBe(false);
    });

    it('进入预览模式应该取消组件选择', () => {
      const componentViewModel = viewModel.getComponentViewModel();
      const component = ComponentModelFactory.create('button', '按钮');
      
      componentViewModel.addComponent(component);
      componentViewModel.selectComponent(component.id);
      
      expect(componentViewModel.getSelectedComponent()).not.toBeNull();
      
      viewModel.setPreviewMode(true);
      expect(componentViewModel.getSelectedComponent()).toBeNull();
    });
  });

  describe('视口管理', () => {
    it('应该能够设置视口尺寸', () => {
      viewModel.setViewport({ width: 1920, height: 1080 });
      
      const viewport = viewModel.getViewport();
      expect(viewport.width).toBe(1920);
      expect(viewport.height).toBe(1080);
    });

    it('应该能够设置设备类型', () => {
      viewModel.setViewport({ device: 'mobile' });
      
      const viewport = viewModel.getViewport();
      expect(viewport.device).toBe('mobile');
    });

    it('应该能够部分更新视口', () => {
      const originalViewport = viewModel.getViewport();
      
      viewModel.setViewport({ width: 800 });
      
      const updatedViewport = viewModel.getViewport();
      expect(updatedViewport.width).toBe(800);
      expect(updatedViewport.height).toBe(originalViewport.height);
      expect(updatedViewport.device).toBe(originalViewport.device);
    });
  });

  describe('主题管理', () => {
    it('应该能够设置主题', () => {
      const newTheme = {
        primaryColor: '#ff0000',
        backgroundColor: '#f0f0f0',
      };
      
      viewModel.setTheme(newTheme);
      
      const theme = viewModel.getTheme();
      expect(theme.primaryColor).toBe('#ff0000');
      expect(theme.backgroundColor).toBe('#f0f0f0');
    });

    it('应该能够部分更新主题', () => {
      const originalTheme = viewModel.getTheme();
      
      viewModel.setTheme({ primaryColor: '#00ff00' });
      
      const updatedTheme = viewModel.getTheme();
      expect(updatedTheme.primaryColor).toBe('#00ff00');
      expect(updatedTheme.secondaryColor).toBe(originalTheme.secondaryColor);
    });
  });

  describe('项目管理', () => {
    it('应该能够设置项目名称', () => {
      viewModel.setProjectName('新项目名称');
      expect(viewModel.getProjectName()).toBe('新项目名称');
    });
  });

  describe('数据源管理', () => {
    it('应该能够添加数据源', () => {
      const dataSource = {
        id: 'ds1',
        name: '测试数据源',
        type: 'static' as const,
        data: { test: 'data' },
      };
      
      viewModel.addDataSource(dataSource);
      
      const dataSources = viewModel.getDataSources();
      expect(dataSources).toHaveLength(1);
      expect(dataSources[0]).toEqual(dataSource);
    });

    it('应该能够删除数据源', () => {
      const dataSource = {
        id: 'ds1',
        name: '测试数据源',
        type: 'static' as const,
        data: { test: 'data' },
      };
      
      viewModel.addDataSource(dataSource);
      viewModel.removeDataSource('ds1');
      
      expect(viewModel.getDataSources()).toHaveLength(0);
    });

    it('应该能够更新数据源', () => {
      const dataSource = {
        id: 'ds1',
        name: '测试数据源',
        type: 'static' as const,
        data: { test: 'data' },
      };
      
      viewModel.addDataSource(dataSource);
      viewModel.updateDataSource('ds1', { name: '更新的数据源' });
      
      const dataSources = viewModel.getDataSources();
      expect(dataSources[0].name).toBe('更新的数据源');
    });
  });

  describe('自定义组件管理', () => {
    it('应该能够添加自定义组件', () => {
      const component = ComponentModelFactory.create('custom', '自定义组件');
      
      viewModel.addCustomComponent(component);
      
      const customComponents = viewModel.getCustomComponents();
      expect(customComponents).toHaveLength(1);
      expect(customComponents[0]).toEqual(component);
    });

    it('应该能够删除自定义组件', () => {
      const component = ComponentModelFactory.create('custom', '自定义组件');
      
      viewModel.addCustomComponent(component);
      viewModel.removeCustomComponent(component.id);
      
      expect(viewModel.getCustomComponents()).toHaveLength(0);
    });

    it('应该能够批量导入自定义组件', () => {
      const components = [
        ComponentModelFactory.create('custom1', '自定义组件1'),
        ComponentModelFactory.create('custom2', '自定义组件2'),
      ];
      
      viewModel.importCustomComponents(components);
      
      const customComponents = viewModel.getCustomComponents();
      expect(customComponents).toHaveLength(2);
    });
  });

  describe('历史记录管理', () => {
    it('应该能够撤销操作', () => {
      const componentViewModel = viewModel.getComponentViewModel();
      const component = ComponentModelFactory.create('button', '按钮');
      
      // 添加组件
      componentViewModel.addComponent(component);
      expect(componentViewModel.getComponents()).toHaveLength(1);
      
      // 撤销
      const undoResult = viewModel.undo();
      expect(undoResult).toBe(true);
      expect(componentViewModel.getComponents()).toHaveLength(0);
    });

    it('应该能够重做操作', () => {
      const componentViewModel = viewModel.getComponentViewModel();
      const component = ComponentModelFactory.create('button', '按钮');
      
      // 添加组件并撤销
      componentViewModel.addComponent(component);
      viewModel.undo();
      
      // 重做
      const redoResult = viewModel.redo();
      expect(redoResult).toBe(true);
      expect(componentViewModel.getComponents()).toHaveLength(1);
    });

    it('应该能够检查是否可以撤销/重做', () => {
      const componentViewModel = viewModel.getComponentViewModel();
      
      // 初始状态不能撤销或重做
      expect(viewModel.canUndo()).toBe(false);
      expect(viewModel.canRedo()).toBe(false);
      
      // 添加组件后可以撤销
      const component = ComponentModelFactory.create('button', '按钮');
      componentViewModel.addComponent(component);
      expect(viewModel.canUndo()).toBe(true);
      expect(viewModel.canRedo()).toBe(false);
      
      // 撤销后可以重做
      viewModel.undo();
      expect(viewModel.canUndo()).toBe(false);
      expect(viewModel.canRedo()).toBe(true);
    });
  });

  describe('模板应用', () => {
    it('应该能够应用模板', () => {
      const templateComponents = [
        ComponentModelFactory.create('button', '模板按钮'),
        ComponentModelFactory.create('text', '模板文本'),
      ];
      
      viewModel.applyTemplate(templateComponents);
      
      const componentViewModel = viewModel.getComponentViewModel();
      const components = componentViewModel.getComponents();
      
      expect(components).toHaveLength(2);
      expect(components[0].type).toBe('button');
      expect(components[1].type).toBe('text');
      
      // ID应该是新生成的
      expect(components[0].id).not.toBe(templateComponents[0].id);
      expect(components[1].id).not.toBe(templateComponents[1].id);
    });
  });

  describe('配置导入导出', () => {
    it('应该能够导出配置', () => {
      // 设置一些状态
      viewModel.setProjectName('测试项目');
      viewModel.setTheme({ primaryColor: '#ff0000' });
      
      const componentViewModel = viewModel.getComponentViewModel();
      const component = ComponentModelFactory.create('button', '按钮');
      componentViewModel.addComponent(component);
      
      const config = viewModel.exportConfiguration();
      const parsedConfig = JSON.parse(config);
      
      expect(parsedConfig.projectName).toBe('测试项目');
      expect(parsedConfig.theme.primaryColor).toBe('#ff0000');
      expect(parsedConfig.components).toHaveLength(1);
    });

    it('应该能够导入配置', () => {
      const config = {
        projectName: '导入的项目',
        theme: { primaryColor: '#00ff00' },
        components: [ComponentModelFactory.create('text', '导入的文本')],
        dataSources: [],
        customComponents: [],
      };
      
      viewModel.importConfiguration(JSON.stringify(config));
      
      expect(viewModel.getProjectName()).toBe('导入的项目');
      expect(viewModel.getTheme().primaryColor).toBe('#00ff00');
      
      const componentViewModel = viewModel.getComponentViewModel();
      expect(componentViewModel.getComponents()).toHaveLength(1);
    });

    it('导入无效配置应该抛出错误', () => {
      expect(() => {
        viewModel.importConfiguration('invalid json');
      }).toThrow('配置文件格式错误');
    });
  });

  describe('重置功能', () => {
    it('应该能够重置到初始状态', () => {
      // 修改一些状态
      viewModel.setProjectName('测试项目');
      viewModel.setPreviewMode(true);
      
      const componentViewModel = viewModel.getComponentViewModel();
      const component = ComponentModelFactory.create('button', '按钮');
      componentViewModel.addComponent(component);
      
      // 重置
      viewModel.reset();
      
      const state = viewModel.getState();
      expect(state.projectName).toBe('我的低代码项目');
      expect(state.previewMode).toBe(false);
      expect(state.components).toHaveLength(0);
    });
  });
});