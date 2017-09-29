import { init } from "snabbdom";
import attributesModule from "snabbdom/modules/attributes";
import classModule from "snabbdom/modules/class";
import propsModule from "snabbdom/modules/props";
import styleModule from "snabbdom/modules/style";
import eventlistenersModule from "snabbdom/modules/eventlisteners";

export var patch = init([
  classModule,
  propsModule,
  styleModule,
  attributesModule,
  eventlistenersModule
]);
