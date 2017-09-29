import h from "snabbdom/h";
import { patch } from "./vdom";
import { VNode } from "snabbdom/vnode";
import { dispatch, Dispatch } from "d3-dispatch";
import { format } from "d3-format"

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
  open: boolean;
  list: Array<GradientLegendState | NominalLegendState>;
}

export type LegendState =
  | GradientLegendState
  | NominalLegendState
  | StackedLegendState;

type Handlers = {
  handleFilter: (ev: UIEvent) => void;
};

const commafy = d => format(",")(parseFloat(d.toFixed(2)))

function rangeStep (domain: [number, number], index: number, bins: number = 9) {
  if (index === 0) {
    return domain[0]
  } else if (index + 1 === bins ){
    return domain[1]
  } else {
    const increment = ((domain[1] - domain[0]) / bins)
    return commafy(domain[0] + (increment * index))
  }
}

function validateNumericalInput (previousValue: number, nextValue: any): number {
  if (isNaN(parseInt(nextValue))) {
    return parseInt(previousValue)
  } else {
    return parseInt(nextValue)
  }
}

function renderTickIcon (state, dispatch) {
  return h(`div.tick${state.open ? ".open" : ""}`, {on: {click: () => dispatch.call("open", this, state.index)}}, [
    h('svg', {attrs: {viewBox: [0, 0, 48, 48]}}, [
      h("g", [
        h('polygon', {attrs: {points: "24,32 36,20 12,20"}})
      ])
    ])
  ]);
}

function renderInput (state: GradientLegendState, domain, dispatch): VNode {

  return h("input", {
    hook: {
      update: (prevNode: VNode, nextNode: VNode) => {
        nextNode.elm.value = domain.value
      }
    },
    props: {
      type:" number", value: domain.value
    },
    on: {
      blur: (e) => {
        const value = validateNumericalInput(domain.value, e.target.value)
        const [min, max] = state.domain
        dispatch.call("input", this, {
          index: state.index,
          domain: domain.index === 0 ? [value, max] : [min, value]
        })
      },
      keydown: (e) => {
        if (e.code === "Enter") {
          e.target.blur()
        }
      }
    }
  })
}

export function renderGradientLegend(
  state: GradientLegendState,
  dispatch
): VNode {
  return h(
    `div.legend.gradient-legend${state.title ? ".with-header" : ""}`, [
      state.title && h("div.header", [state.title, renderTickIcon(state, dispatch)]),
      state.open ? h("div.range", state.range.map((color, index: number) => {
        const isMinMax = index === 0 || index === state.range.length - 1
        const step = rangeStep(state.domain, index, state.range.length)
        const [min, max] = state.domain

        return h("div.block", [
          h("div.color", { style: { background: color } }),
          h(`div.text.${isMinMax ? "extent" : "step"}`,
            [h("span", `${step}`)].concat(
              isMinMax ? [
                renderInput(state, {value: index === 0 ? min : max, index}, dispatch)
              ] : []
            )
          )
        ])
      })) : h("div"),
      state.open ? h("div.lock") : h("div")
  ]);
}

export function renderNominalLegend(
  state: NominalLegendState,
  dispatch
): VNode {
  return h("div.legend.nominal-legend", [
    state.title && h("div.header", [state.title, renderTickIcon(state, dispatch)]),
    state.open ? h(
      "div.body",
      { style: { maxHeight: "100px" } },
      state.domain.map((value, index) =>
        h("div.row", { on: { click: () => dispatch.call("filter", this, value) } }, [
          h("div.color", {
            style: { background: state.range[index] }
          }),
          h("div.text", value)
        ])
      )
    ) : h("div")
  ]);
}

export function renderStackedLegend(state, dispatch, updates): VNode {
  return h("div.stacked-legend", state.list.map((legend, index) => {
    if (legend.type === "gradient") {
      return renderGradientLegend({...legend, index}, dispatch)
    } else if (legend.type === "nominal") {
      return renderNominalLegend({...legend, index}, dispatch)
    } else {
      return h("div")
    }
  }));
}

export default class Legend {
  state: LegendState;
  node: HTMLElement | VNode;
  dispatch: Dispatch<EventTarget>;

  constructor(node: HTMLElement) {
    this.node = node;
    this.dispatch = dispatch("filter", "input", "open");
    this.state = null
  }

  on(event: string, callback: () => void) {
    this.dispatch.on(event, callback);
  }

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
      const vnode = renderNominalLegend(this.state, this.dispatch);
      this.node = patch(this.node, vnode);
      return this.node;
    } else if (this.state.type === "stacked") {
      const vnode = renderStackedLegend(this.state, this.dispatch, {
        handleFilter: this.handleFilter
      });
      this.node = patch(this.node, vnode);
      return this.node;
    } else {
      throw new Error();
    }
  };
}
