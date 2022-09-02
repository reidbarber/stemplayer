import { useTab, useTabList, useTabPanel } from "react-aria";
import { useTabListState } from "react-stately";
import { useRef } from "react";
import { AriaTabListProps } from "@react-types/tabs";
import { DOMProps, StyleProps, CollectionChildren } from "@react-types/shared";

export function Tabs<T extends object>(props: AriaTabListProps<T>) {
  let state = useTabListState(props);
  let ref = useRef(null);
  let { tabListProps } = useTabList(props, state, ref);
  return (
    <div className="tabs">
      <div {...tabListProps} ref={ref} className="tabList">
        {[...state.collection].map((item) => (
          <Tab key={item.key} item={item} state={state} />
        ))}
      </div>
      <TabPanel key={state.selectedItem?.key} state={state} />
    </div>
  );
}

export function Tab({ item, state }: any) {
  let { key, rendered } = item;
  let ref = useRef(null);
  let { tabProps } = useTab({ key }, state, ref);
  let isSelected = state.selectedKey === key;
  let isDisabled = state.disabledKeys.has(key);
  return (
    <div
      {...tabProps}
      ref={ref}
      className="tab"
      style={{
        backgroundColor: isSelected ? "#77654f" : undefined,
        color: isSelected ? "white" : undefined,
        opacity: isDisabled ? "0.5" : undefined,
      }}
    >
      {rendered}
    </div>
  );
}

export interface TabPanelsProps<T> extends DOMProps, StyleProps {
  children: CollectionChildren<T>;
}

function TabPanel({ state, ...props }: any) {
  let ref = useRef(null);
  let { tabPanelProps } = useTabPanel(props, state, ref);
  return (
    <div {...tabPanelProps} ref={ref} className="tabPanel">
      {state.selectedItem?.props.children}
    </div>
  );
}
