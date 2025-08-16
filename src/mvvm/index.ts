/**
 * MVVM Architecture Index
 * 导出MVVM架构的所有组件和接口
 */

// Models
export * from './models/ComponentModel';
export * from './models/PlatformModel';

// ViewModels
export * from './viewmodels/ComponentViewModel';
export * from './viewmodels/PlatformViewModel';
export * from './viewmodels/HistoryViewModel';

// Hooks
export * from './hooks/usePlatformViewModel';
export * from './hooks/useComponentViewModel';

// Adapters
export * from './adapters/LegacyAdapter';

// Views
export { default as LowCodePlatformView } from './views/LowCodePlatformView';