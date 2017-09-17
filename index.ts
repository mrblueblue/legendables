import { init } from "snabbdom";
import { VNode } from "snabbdom/vnode";
import h from "snabbdom/h";
import classModule from "snabbdom/modules/class";
import propsModule from "snabbdom/modules/props";
import styleModule from "snabbdom/modules/style";
import eventlistenersModule from "snabbdom/modules/eventlisteners";

type NominalLegendType = {
  type: "nominal";
  title?: string;
  open: boolean;
  range: Array<string>;
  domain: Array<string>;
};

function NominalLegend(state: NominalLegendType): VNode {
  return h("div.dc-legend", [
    h("div.dc-legend-header", "Legend"),
    h(
      "div.dc-legend-body",
      { style: { maxHeight: "100px" } },
      state.domain.map((value, index) =>
        LegendItem({ color: state.range[index], text: value })
      )
    )
  ]);
}

type GradientLegendType = {
  type: "gradient";
  title?: string;
  locked: boolean;
  open: boolean;
  range: Array<string>;
  domain: [number, number];
};

// function GradientLegend (state: GradientLegendType): VNode {
//
// }

// type LegendState = {
//   width: number,
//   height: number,
//   list: Array<NominalLegendType | GradientLegentType>
// }

type LegendState = {
  range: Array<number | string>;
  domain: Array<number | string>;
};

function LegendItem(state) {
  return h("div.dc-legend-item", [
    h("div.legend-item-color", { style: { background: state.color } }),
    h("div.legend-item-text", state.text)
  ]);
}

const patch = init([
  classModule,
  propsModule,
  styleModule,
  eventlistenersModule
]);

export function render(node: HTMLElement, state: LegendState): VNode {
  const vnode = h("div.dc-legend", [
    h("div.dc-legend-header", "Legend"),
    h(
      "div.dc-legend-body",
      { style: { maxHeight: "100px" } },
      state.domain.map((value, index) =>
        LegendItem({ color: state.range[index], text: value })
      )
    )
  ]);
  return patch(node, vnode);
}
