import { init } from "snabbdom";
import classModule from "snabbdom/modules/class";
import propsModule from "snabbdom/modules/props";
import styleModule from "snabbdom/modules/style";
import eventlistenersModule from "snabbdom/modules/eventlisteners";

export var patch = init([
  classModule,
  propsModule,
  styleModule,
  eventlistenersModule
]);
