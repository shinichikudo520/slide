export type PROPS = {
  update: (value: number) => void;
};

export type SLIDE_CONTROL = {
  /** 刻度步进值 */
  step: number;
  /** 当前刻度 */
  current: number;
  /** 刻度最大值 */
  max: number;
  /** 是否移动 */
  hasMove: boolean;
  /** 是否按下鼠标 */
  isMouseDown: boolean;
  /** 鼠标 x 坐标 */
  mouseDownX: number;
  /** 当前组件距离屏幕左侧的距离 */
  disX: number;
  /** 目标元素 */
  targetEl: HTMLElement;
  /** slide-bar 半径长度(像素) */
  barRadius: number;
  /** 整个 slide 长度(像素) */
  allReactDomWidth: number;
};
