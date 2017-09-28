import h from "snabbdom/h";
import { patch } from "./vdom";
import { VNode } from "snabbdom/vnode";
import { dispatch, Dispatch } from "d3-dispatch";

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
  type: "stacked";
  width: number;
  height: number;
  list: Array<GradientLegendState | NominalLegendState>;
}

export type LegendState =
  | GradientLegendState
  | NominalLegendState
  | StackedLegendState;

type Handlers = {
  handleFilter: (ev: UIEvent) => void;
};

function validateNumericalInput (previousValue: number, nextValue: any): number {
  if (isNaN(parseInt(nextValue))) {
    return previousValue
  } else {
    return nextValue
  }
}

function renderInput (state: GradientLegendState, domain, dispatch): VNode {
  console.log(domain.value, "value")
  return h("input", {
    hook: {
      update: (prevNode: VNode, nextNode: VNode) => nextNode.elm.value = domain.value
    },
    props: {
      type:" number", value: domain.value
    },
    on: {
      blur: (e) => dispatch.call("input", this, {value: validateNumericalInput(domain.value, e.target.value)})
    }
  })
}

export function renderGradientLegend(
  state: GradientLegendState,
  dispatch
): VNode {
  return h(
    "div.gradient-legend", [
      h("div.range", state.range.map((color, index) =>
        h("div.block", [
          h("div.color", { style: { background: color } }),
          h(
            "div.text",
            [h("span", "123")].concat(
              index === 0 || index === state.range.length - 1 ? [
                renderInput(state, {value: index === 0 ? state.domain[0] : state.domain[1]}, dispatch)
              ] : []
            )
          )
        ])
      )),
      h("div.lock")
  ]);
}

export function renderNominalLegend(
  state: NominalLegendState,
  updates: Handlers
): VNode {
  return h("div.nominal-legend", [
    h("div.header", "Legend"),
    h(
      "div.body",
      { style: { maxHeight: "100px" } },
      state.domain.map((value, index) =>
        h("div.row", { on: { click: [updates.handleFilter, value] } }, [
          h("div.color", {
            style: { background: state.range[index] }
          }),
          h("div.text", value)
        ])
      )
    )
  ]);
}

export function renderStackedLegend(state, updates): VNode {
  return h("div.legend");
}

export default class Legend {
  state: LegendState;
  node: HTMLElement | VNode;
  dispatch: Dispatch<EventTarget>;

  constructor(node: HTMLElement) {
    this.node = node;
    this.dispatch = dispatch("filter", "input");
    this.state = null
  }

  on(event: string, callback: () => void) {
    this.dispatch.on(event, callback);
  }

  handleFilter = (ev: UIEvent): void => {
    this.dispatch.call("filter", null, ev);
  };

  setState = (state: Function | LegendState): HTMLElement | VNode => {

    if (typeof state === "function") {
      this.state = state(this.state)
    } else {
      this.state = state
    }

    if (this.state.type === "gradient") {
      const vnode = renderGradientLegend(this.state, this.dispatch);
      this.node = patch(this.node, vnode);
      return this.node;
    } else if (this.state.type === "nominal") {
      const vnode = renderNominalLegend(this.state, {
        handleFilter: this.handleFilter
      });
      this.node = patch(this.node, vnode);
      return this.node;
    } else if (this.state.type === "stacked") {
      const vnode = renderStackedLegend(this.state, {
        handleFilter: this.handleFilter
      });
      this.node = patch(this.node, vnode);
      return this.node;
    } else {
      throw new Error();
    }
  };
}
