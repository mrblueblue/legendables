import h from "snabbdom/h";
import { patch } from "./vdom";
import { VNode } from "snabbdom/vnode";
import { dispatch } from "d3-dispatch";
import { Dispatch } from "@types/d3-dispatch";

export interface GradientLegendState {
  type: "gradient";
  index?: number;
  title?: string;
  locked: boolean;
  open: boolean;
  range: Array<string>;
  domain: [number, number];
}

export interface NominalLegendState {
  type: "nominal";
  index?: number;
  title?: string;
  width?: number;
  height?: number;
  open: boolean;
  range: Array<string>;
  domain: Array<string>;
}

export interface StackedLegendState {
  type: "stacked",
  width: number,
  height: number,
  list: Array<GradientLegendState | NominalLegendState>
}

export type LegendState = GradientLegendState | NominalLegendState | StackedLegendState;

type Handlers = {
  handleFilter: (key: string) => void;
};

export function renderGradientLegend(
  state: GradientLegendState,
  dispatch
): VNode {
  return h("div.legend-cont", [
    h(
      "div.legend-group",
      state.range.map((color, index) =>
        h("div.legend-item", [
          h("div.legend-swatch", { style: { background: color } }),
          h("div.legend-label", "000000")
        ])
      )
    )
  ]);
}

export function renderNominalLegend(
  state: NominalLegendState,
  updates: Handlers
): VNode {
  return h("div.dc-legend", [
    h("div.dc-legend-header", "Legend"),
    h(
      "div.dc-legend-body",
      { style: { maxHeight: "100px" } },
      state.domain.map((value, index) =>
        h(
          "div.dc-legend-item",
          { on: { click: [updates.handleFilter, value] } },
          [
            h("div.legend-item-color", {
              style: { background: state.range[index] }
            }),
            h("div.legend-item-text", value)
          ]
        )
      )
    )
  ]);
}

export function renderStackedLegend(state, updates):VNode {
  return h("div.legend")
}

export default class Legend {
  node: HTMLElement | VNode;
  dispatch: Dispatch<EventTarget>;

  constructor(node: HTMLElement) {
    this.node = node;
    this.dispatch = dispatch("filter");
  }

  on(event: string, callback: () => void) {
    this.dispatch.on(event, callback);
  }

  handleFilter = (key: string) => {
    this.dispatch.call("filter", null, key);
  };

  setState = (state: LegendState): HTMLElement | VNode => {
    if (state.type === "gradient") {
      const vnode = renderGradientLegend(state, this.dispatch);
      this.node = patch(this.node, vnode);
      return this.node
    } else if (state.type === "nominal") {
      const vnode = renderNominalLegend(state, {
        handleFilter: this.handleFilter
      });
      this.node = patch(this.node, vnode);
      return this.node
    } else if (state.type === "stacked") {
      const vnode = renderStackedLegend(state, {
        handleFilter: this.handleFilter
      });
      this.node = patch(this.node, vnode);
      return this.node
    } else {
      throw new Error()
    }
  };
}
