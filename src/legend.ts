import h from "snabbdom/h";
import { patch } from "./vdom";
import { VNode } from "snabbdom/vnode";
import { dispatch, Dispatch } from "d3-dispatch";
import { format } from "d3-format";

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

const commafy = d => format(",")(parseFloat(d.toFixed(2)));
const formatNumber = (d) => String(d).length > 4 ? format(".2s")(d) : commafy(d)

function rangeStep(domain: [number, number], index: number, bins: number = 9) {
  if (index === 0) {
    return domain[0];
  } else if (index + 1 === bins) {
    return domain[1];
  } else {
    const increment = (domain[1] - domain[0]) / bins;
    return domain[0] + increment * index;
  }
}

function validateNumericalInput(previousValue: number, nextValue: any): number {
  if (isNaN(parseInt(nextValue))) {
    return parseInt(previousValue);
  } else {
    return parseInt(nextValue);
  }
}

function renderTickIcon(state, dispatch) {
  return h(
    `div.tick${state.open ? ".open" : ""}`,
    { on: { click: () => dispatch.call("open", this, state.index) } },
    [
      h("svg", { attrs: { viewBox: [0, 0, 48, 48] } }, [
        h("g", [h("polygon", { attrs: { points: "24,32 36,20 12,20" } })])
      ])
    ]
  );
}

function renderLockIcon(locked, index, dispatch) {
  return h(
    `div.lock${locked ? ".locked" : ".unlocked"}`,
    { on: { click: () => dispatch.call("lock", this, { locked, index }) } },
    [
      h("svg", { attrs: { viewBox: [0, 0, 48, 48] } }, [
        h("g", { style: { stroke: "white" } }, [
          h("path", {
            attrs: {
              d: locked
                ? "M34,20v-4c0-5.5-4.5-10-10-10c-5.5,0-10,4.5-10,10v4H8v20h32V20H34z M18,16c0-3.3,2.7-6,6-6s6,2.7,6,6v4H18V16z"
                : "M18,20v-8c0-3.3,2.7-6,6-6s6,2.7,6,6v2h4v-2c0-5.5-4.5-10-10-10c-5.5,0-10,4.5-10,10v8H8v20h32V20H18z"
            }
          })
        ])
      ])
    ]
  );
}

function renderInput(state: GradientLegendState, domain, dispatch): VNode {
  return h("input", {
    hook: {
      update: (prevNode: VNode, nextNode: VNode) => {
        nextNode.elm.value = domain.value;
      }
    },
    props: {
      type: " number",
      value: domain.value
    },
    on: {
      blur: e => {
        const value = validateNumericalInput(domain.value, e.target.value);
        const [min, max] = state.domain;
        dispatch.call("input", this, {
          index: state.index,
          domain: domain.index === 0 ? [value, max] : [min, value]
        });
      },
      keydown: e => {
        if (e.code === "Enter") {
          e.target.blur();
        }
      }
    }
  });
}

export function renderGradientLegend(
  state: GradientLegendState,
  dispatch
): VNode {
  const stacked = typeof state.index === "number";
  return h(`div.legend.gradient-legend${stacked ? ".with-header" : ".legendables"}`, [
    stacked ?
      h("div.header", [h("div.title-text", [state.title]), renderTickIcon(state, dispatch)]) : h("div"),
    state.open
      ? h("div.range", [
          ...state.range.map((color, index: number) => {
            const isMinMax = index === 0 || index === state.range.length - 1;
            const step = formatNumber(rangeStep(state.domain, index, state.range.length));
            const [min, max] = state.domain;

            return h("div.block", [
              h("div.color", { style: { background: color } }),
              h(
                `div.text.${isMinMax ? "extent" : "step"}`,
                [h("span", `${state.domain.length > 2 ? state.domain[index] : step}`)].concat(
                  isMinMax
                    ? [
                        renderInput(
                          state,
                          { value: state.domain.length === 2 ? state.domain[index === 0 ? 0 : 1] : state.domain[index], index },
                          dispatch
                        )
                      ]
                    : []
                )
              )
            ]);
          }),
          renderLockIcon(state.locked, state.index, dispatch)
        ])
      : h("div")
  ]);
}

export function renderNominalLegend(
  state: NominalLegendState,
  dispatch
): VNode {
  const stacked = typeof state.index === "number";
  return h(`div.legend.nominal-legend${stacked ? "" : ".legendables"}`, [
    state.title &&
      h("div.header", [h("div.title-text", [state.title]), renderTickIcon(state, dispatch)]),
    state.open
      ? h(
          "div.body",
          { style: stacked ? {} : { maxHeight: "100px" } },
          state.domain.map((value, index) =>
            h(
              "div.legend-row",
              { on: { click: () => dispatch.call("filter", this, value) } },
              [
                h("div.color", {
                  style: { background: state.range[index] }
                }),
                h("div.text", value)
              ]
            )
          )
        )
      : h("div")
  ]);
}

export function renderStackedLegend(state, dispatch): VNode {
  return h(
    "div.legendables",
    state.list.map((legend, index) => {
      if (legend.type === "gradient") {
        return renderGradientLegend({ ...legend, index }, dispatch);
      } else if (legend.type === "nominal") {
        return renderNominalLegend({ ...legend, index }, dispatch);
      } else {
        return h("div");
      }
    })
  );
}

export default class Legend {
  state: LegendState;
  node: HTMLElement | VNode;
  dispatch: Dispatch<EventTarget>;

  constructor(node: HTMLElement) {
    this.node = node;
    this.dispatch = dispatch("filter", "input", "open", "lock");
    this.state = null;
  }

  on(event: string, callback: () => void) {
    this.dispatch.on(event, callback);
  }

  setState = (state: Function | LegendState): HTMLElement | VNode => {
    if (typeof state === "function") {
      this.state = state(this.state);
    } else {
      this.state = state;
    }

    let vnode;

    if (this.state.type === "gradient") {
      vnode = renderGradientLegend(this.state, this.dispatch);
    } else if (this.state.type === "nominal") {
      vnode = renderNominalLegend(this.state, this.dispatch);
    } else if (this.state.type === "stacked") {
      vnode = renderStackedLegend(this.state, this.dispatch);
    } else {
      vnode = h("div")
    }

    this.node = patch(this.node, vnode);
    return this.node;
  };
}
