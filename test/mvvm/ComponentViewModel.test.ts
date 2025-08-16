/**
 * ComponentViewModel 测试
 */

import { describe, it, expect, beforeEach, vi } from 'vitest';
import { ComponentViewModel } from '@/mvvm/viewmodels/ComponentViewModel';
import { ComponentModelFactory } from '@/mvvm/models/ComponentModel';

describe('ComponentViewModel', () => {
  let viewModel: ComponentViewModel;
  let mockListener: ReturnType<typeof vi.fn>;

  beforeEach(() => {
    viewModel = new ComponentViewModel();
    mockListener = vi.fn();
  });

  describe('基础功能', () => {
    it('应该能够创建空的ViewModel', () => {
      expect(viewModel.getComponents()).toEqual([]);
      expect(viewModel.getSelectedComponent()).toBeNull();
    });

    it('应该能够订阅状态变化', () => {
      const unsubscribe = viewModel.subscribe(mockListener);
      
      // 添加组件应该触发通知
      const component = ComponentModelFactory.create('button', '按钮');
      viewModel.addComponent(component);
      
      expect(mockListener).toHaveBeenCalledTimes(1);
      
      // 取消订阅后不应该再收到通知
      unsubscribe();
      viewModel.addComponent(ComponentModelFactory.create('text', '文本'));
      expect(mockListener).toHaveBeenCalledTimes(1);
    });
  });

  describe('组件管理', () => {
    it('应该能够添加组件', () => {
      const component = ComponentModelFactory.create('button', '按钮');
      viewModel.addComponent(component);
      
      const components = viewModel.getComponents();
      expect(components).toHaveLength(1);
      expect(components[0]).toEqual(component);
    });

    it('应该能够删除组件', () => {
      const component = ComponentModelFactory.create('button', '按钮');
      viewModel.addComponent(component);
      
      viewModel.deleteComponent(component.id);
      
      expect(viewModel.getComponents()).toHaveLength(0);
    });

    it('应该能够更新组件属性', () => {
      const component = ComponentModelFactory.create('button', '按钮');
      viewModel.addComponent(component);
      
      const newProperties = { color: 'red', size: 'large' };
      viewModel.updateComponentProperties(component.id, newProperties);
      
      const updatedComponent = viewModel.findComponentById(component.id);
      expect(updatedComponent?.properties).toEqual(
        expect.objectContaining(newProperties)
      );
    });

    it('应该能够复制组件', () => {
      const component = ComponentModelFactory.create('button', '按钮', { x: 10, y: 20 });
      viewModel.addComponent(component);
      
      const duplicated = viewModel.duplicateComponent(component.id);
      
      expect(duplicated).not.toBeNull();
      expect(duplicated?.id).not.toBe(component.id);
      expect(duplicated?.type).toBe(component.type);
      expect(duplicated?.name).toBe(component.name);
      expect(duplicated?.position?.x).toBe(30); // 偏移了20
      expect(duplicated?.position?.y).toBe(40); // 偏移了20
      
      expect(viewModel.getComponents()).toHaveLength(2);
    });
  });

  describe('组件选择', () => {
    it('应该能够选择组件', () => {
      const component = ComponentModelFactory.create('button', '按钮');
      viewModel.addComponent(component);
      
      viewModel.selectComponent(component.id);
      
      const selected = viewModel.getSelectedComponent();
      expect(selected?.id).toBe(component.id);
    });

    it('应该能够取消选择', () => {
      const component = ComponentModelFactory.create('button', '按钮');
      viewModel.addComponent(component);
      viewModel.selectComponent(component.id);
      
      viewModel.selectComponent(null);
      
      expect(viewModel.getSelectedComponent()).toBeNull();
    });
  });

  describe('组件查找', () => {
    it('应该能够根据ID查找组件', () => {
      const component = ComponentModelFactory.create('button', '按钮');
      viewModel.addComponent(component);
      
      const found = viewModel.findComponentById(component.id);
      expect(found).toEqual(component);
    });

    it('查找不存在的组件应该返回null', () => {
      const found = viewModel.findComponentById('non-existent');
      expect(found).toBeNull();
    });

    it('应该能够在嵌套结构中查找组件', () => {
      const parent = ComponentModelFactory.create('container', '容器');
      const child = ComponentModelFactory.create('button', '按钮');
      child.parentId = parent.id;
      parent.children = [child];
      
      viewModel.addComponent(parent);
      
      const found = viewModel.findComponentById(child.id);
      expect(found).toEqual(child);
    });
  });

  describe('组件可见性', () => {
    it('应该能够切换组件可见性', () => {
      const component = ComponentModelFactory.create('button', '按钮');
      component.properties = { visible: true };
      viewModel.addComponent(component);
      
      viewModel.toggleComponentVisibility(component.id);
      
      const updated = viewModel.findComponentById(component.id);
      expect(updated?.properties?.visible).toBe(false);
    });

    it('默认可见的组件切换后应该不可见', () => {
      const component = ComponentModelFactory.create('button', '按钮');
      viewModel.addComponent(component);
      
      viewModel.toggleComponentVisibility(component.id);
      
      const updated = viewModel.findComponentById(component.id);
      expect(updated?.properties?.visible).toBe(false);
    });
  });

  describe('组件分组', () => {
    it('应该能够分组多个组件', () => {
      const component1 = ComponentModelFactory.create('button', '按钮1', { x: 10, y: 10 });
      const component2 = ComponentModelFactory.create('text', '文本1', { x: 50, y: 50 });
      
      viewModel.addComponent(component1);
      viewModel.addComponent(component2);
      
      const group = viewModel.groupComponents([component1.id, component2.id], '我的组');
      
      expect(group).not.toBeNull();
      expect(group?.type).toBe('container');
      expect(group?.name).toBe('我的组');
      expect(group?.properties?.isGroup).toBe(true);
      expect(group?.children).toHaveLength(2);
      
      // 原组件应该从主列表中移除
      const components = viewModel.getComponents();
      expect(components.find(c => c.id === component1.id)).toBeUndefined();
      expect(components.find(c => c.id === component2.id)).toBeUndefined();
      expect(components.find(c => c.id === group!.id)).toBeDefined();
    });

    it('少于2个组件不应该能够分组', () => {
      const component = ComponentModelFactory.create('button', '按钮');
      viewModel.addComponent(component);
      
      const group = viewModel.groupComponents([component.id], '我的组');
      
      expect(group).toBeNull();
    });
  });

  describe('批量操作', () => {
    it('应该能够设置所有组件', () => {
      const components = [
        ComponentModelFactory.create('button', '按钮1'),
        ComponentModelFactory.create('text', '文本1'),
      ];
      
      viewModel.setComponents(components);
      
      expect(viewModel.getComponents()).toEqual(components);
    });

    it('应该能够清空所有组件', () => {
      const component = ComponentModelFactory.create('button', '按钮');
      viewModel.addComponent(component);
      viewModel.selectComponent(component.id);
      
      viewModel.clearComponents();
      
      expect(viewModel.getComponents()).toHaveLength(0);
      expect(viewModel.getSelectedComponent()).toBeNull();
    });
  });

  describe('递归删除', () => {
    it('应该能够递归删除组件及其子组件', () => {
      const parent = ComponentModelFactory.create('container', '容器');
      const child1 = ComponentModelFactory.create('button', '按钮1');
      const child2 = ComponentModelFactory.create('text', '文本1');
      const grandchild = ComponentModelFactory.create('input', '输入框');
      
      child1.parentId = parent.id;
      child2.parentId = parent.id;
      grandchild.parentId = child1.id;
      
      parent.children = [child1, child2];
      child1.children = [grandchild];
      
      viewModel.addComponent(parent);
      
      // 删除父组件应该删除所有子组件
      viewModel.deleteComponent(parent.id);
      
      expect(viewModel.getComponents()).toHaveLength(0);
    });
  });
});