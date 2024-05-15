import React, { useCallback, useEffect, useRef, useState } from "react";
import { PROPS, SLIDE_CONTROL } from "./type";
import { CONFIG } from "./config";
import { addMask, removeMask } from "./mask";

import "./style.css";

const MASK_ID = "SLIDE_MASK";

export default function Slide(props: PROPS): React.ReactElement {
  const { update } = props;
  const containerElRef: any = useRef<HTMLElement>(null);
  const slideControlRef: { current: SLIDE_CONTROL } = useRef<SLIDE_CONTROL>({
    step: CONFIG.STEP,
    current: CONFIG.DEFAULT,
    max: CONFIG.MAX,
    hasMove: false,
    isMouseDown: false,
    mouseDownX: 0,
    disX: 0,
    targetEl: null as any,
    barRadius: 0,
    allReactDomWidth: 0,
  });

  const updateDomParams = useCallback((): void => {
    if (!containerElRef.current) {
      return;
    }
    const barEl: HTMLElement = containerElRef.current.querySelector(
      '[data-tagitem="slide-bar"]'
    );
    const trackEl: HTMLElement = containerElRef.current.querySelector(
      '[data-tagitem="slide-track"]'
    );
    slideControlRef.current.allReactDomWidth = parseInt(
      window.getComputedStyle(trackEl, null)["width"]
    );
    slideControlRef.current.barRadius =
      parseInt(window.getComputedStyle(barEl, null)["width"]) / 2;
  }, []);

  const updateView = useCallback((ratio: number): void => {
    const setRatio: number = Math.min(
      Math.max(ratio, CONFIG.DEFAULT),
      slideControlRef.current.max
    );
    updateCurrentRatio(setRatio);
    updateRatelineWidth(setRatio);
    updateBarPosition(setRatio);
  }, []);

  const updateCurrentRatio = useCallback((setRatio: number): void => {
    slideControlRef.current.current = setRatio;
    update(setRatio);
  }, []);

  const updateRatelineWidth = useCallback((setRatio: number): void => {
    if (!containerElRef.current) {
      return;
    }
    const ratelineEl: HTMLElement = containerElRef.current.querySelector(
      '[data-tagitem="slide-rateline"]'
    );
    ratelineEl.style.width = `${
      (setRatio / slideControlRef.current.max) * 100
    }%`;
  }, []);

  const updateBarPosition = useCallback((setRatio: number): void => {
    if (!containerElRef.current) {
      return;
    }
    const barEl: HTMLElement = containerElRef.current.querySelector(
      '[data-tagitem="slide-bar"]'
    );
    const dist: number =
      (setRatio / slideControlRef.current.max) *
      slideControlRef.current.allReactDomWidth;
    barEl.style.left = `${dist - slideControlRef.current.barRadius}px`;
  }, []);

  const stepBtnClick = (e: React.MouseEvent): void => {
    const targetEl: HTMLElement = e.currentTarget as HTMLElement;
    const action: string = targetEl.getAttribute("data-action") as string;

    if (action === "sub") {
      updateView(
        slideControlRef.current.current - slideControlRef.current.step
      );
    } else if (action === "add") {
      updateView(
        slideControlRef.current.current + slideControlRef.current.step
      );
    }
  };

  const onBarMouseDownAction = useCallback((e: React.MouseEvent): void => {
    slideControlRef.current.isMouseDown = true;
    slideControlRef.current.hasMove = false;
    slideControlRef.current.mouseDownX = e.clientX;
    slideControlRef.current.targetEl = e.target as HTMLElement;
    slideControlRef.current.disX =
      slideControlRef.current.targetEl.parentElement?.getBoundingClientRect()
        .left as number;
    addMask(MASK_ID);
    document.addEventListener("mousemove", onBarMouseMoveAction);
    document.addEventListener("mouseup", onBarMouseUpAction);
  }, []);

  const onBarMouseMoveAction = useCallback((e: MouseEvent): void => {
    e.stopPropagation();
    e.preventDefault();

    if (e.buttons <= 0) {
      slideControlRef.current.isMouseDown = false;
      document.removeEventListener("mousemove", onBarMouseMoveAction);
      document.removeEventListener("mouseup", onBarMouseUpAction);
      setTimeout((): void => {
        slideControlRef.current.hasMove = false;
      });
      removeMask(MASK_ID);
      return;
    }
    slideControlRef.current.isMouseDown = true;
    slideControlRef.current.hasMove = true;
    const ratioLen: number = e.clientX - slideControlRef.current.disX;
    const ratio: number = ratioLen / slideControlRef.current.allReactDomWidth;
    updateView(ratio * slideControlRef.current.max);
  }, []);
  const onBarMouseUpAction = useCallback((e: MouseEvent): void => {
    slideControlRef.current.isMouseDown = false;
    document.removeEventListener("mousemove", onBarMouseMoveAction);
    document.removeEventListener("mouseup", onBarMouseUpAction);
    setTimeout((): void => {
      slideControlRef.current.hasMove = false;
    });
    removeMask(MASK_ID);
  }, []);

  const onProcessMouseUpAction = useCallback((e: React.MouseEvent): void => {
    if (slideControlRef.current.hasMove) {
      return;
    }

    const targetEl: HTMLElement = e.currentTarget as HTMLElement;
    const ratioLen: number = e.clientX - targetEl.getBoundingClientRect().left;
    const ratio: number = ratioLen / slideControlRef.current.allReactDomWidth;
    updateView(ratio * slideControlRef.current.max);
  }, []);

  useEffect((): void => {
    /** 在组件挂载完成后, 更新组件内部的一些必要参数 */
    updateDomParams();

    window.addEventListener(
      "resize",
      () => {
        /** 在窗口变化话, 需要重新更新组件内部的必要参数, 并且更新滚动条 */
        updateDomParams();
        updateView(slideControlRef.current.current);
      },
      false
    );
  }, []);

  return (
    <>
      <div ref={containerElRef} className="slide-container">
        <div className="slide-wrapper">
          <div className="slide-sub" data-action="sub" onClick={stepBtnClick}>
            <i className="icon-sub"></i>
          </div>
          <div
            data-tagitem="slide-process"
            className="slide-process"
            onMouseUp={onProcessMouseUpAction}
          >
            <div
              data-tagitem="slide-track"
              className="slide-track"
              data-action="track"
            ></div>
            <div
              data-tagitem="slide-bar"
              className="slide-bar"
              data-action="bar"
              onMouseDown={onBarMouseDownAction}
            ></div>
            <div
              data-tagitem="slide-rateline"
              className="slide-rateline"
              data-action="slide-rateline"
            ></div>
          </div>
          <div className="slide-add" data-action="add" onClick={stepBtnClick}>
            <i className="icon-add"></i>
          </div>
        </div>
      </div>
    </>
  );
}
