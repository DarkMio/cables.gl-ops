// booleans seem to be transported by 0 | 1 (or more number truthy, this could spell trouble)

// biome-ignore lint/suspicious/noConfusingVoidType: explicitly allowing void, seems less confusing than undefined or never
// biome-ignore lint/suspicious/noExplicitAny: poor typing
type PortValues = void | number | string | Array<any> | object | unknown;
// also maybe too restrictive?
type PortName = string & { __portNameBrand: never };

type PortId = string & { __portIdBrand: never };
type PortDirection = 0 | 1;

type MultiPort = unknown;

type PortType = 0 | 1 | 2 | 3 | 4 | 5;

interface Port<Value extends PortValues> {
  direction: PortDirection;
  id: PortId;
  // assumption: it may be undefined?
  _op: Op | undefined;
  links: Array<Link>;
  value: Value | null;
  type: 0 | 1 | 2 | 3 | 4 | 5;
  name: PortName;
  uiAttribs: UiAttributes;
  defaultValue: Value;
  title: string;
  parent: Port<Value>["_op"];
  op: Port<Value>["_op"];
  val: Value | null;

  // don't care
  anim: unknown;
  // incorrect, don't care
  _oldAnimVal: -5711;
  _valueBeforeLink: unknown;
  _useVariableName: null | unknown;
  _tempLastUiValue: null | unknown;

  _uiActiveState: boolean;
  ignoreValueSerialize: false;
  crashed: boolean;
  _lastAnimFrame: number;
  _animated: boolean;
  _activity: () => void;

  onLinkChanged: null | (() => unknown);
  onValueChanged: null | (() => unknown);
  onTriggered: null | (() => unknown);
  onUiActiveStateChange: null | (() => unknown);
  changeAlways: boolean;
  forceRefChange: boolean;
  activityCounter: number;
  apf: number;
  activityCounterStartFrame: number;

  getName: () => Port<Value>["name"];

  copyLinkedUiAttrib: <Value extends PortValues>(
    which: keyof UiAttributes,
    port: Port<Value>,
  ) => void;
  getValueForDisplay: () => string;
  /** change listener for input value ports, overwrite to react to changes */
  onAnimToggle: () => void;
  remove: () => void;
  setUiAttribs: (newAttribs: Partial<UiAttributes>) => void;
  getUiAttribs: () => UiAttributes;
  getUiAttrib: () => UiAttributes[keyof UiAttributes];

  get: () => Port<Value>["value"];
  setRef: (value: Value) => void;
  set: (value?: Value) => void;

  updateAnim: () => void;
  forceChange: () => void;
  getTypeString: () =>
    | "Number"
    | "Trigger"
    | "Object"
    | "Dynamic"
    | "Array"
    | "String";
  // don't care
  deSerializeSettings: (objPort: unknown) => void;
  // neither do I care here
  getSerialized: () => unknown;
  setInitialValue: (v?: Value) => void;
  shouldLink: () => true;

  addLink: (link: Link) => void;
  getLinkTo: <T>(p2: Port<T>) => Link;
  removeLinkTo: <T>(p2: Port<T>) => Link;
  isLinkedTo: <T>(p2: Port<T>) => boolean;
  removeLinks: () => void;
  removeLink: (link: Link) => void;

  trigger: () => void;
  // unsure if deprecated?
  execute: () => void;
  setVariableName: (name: string) => void;
  getVariableName: () => string;
  setVariable: (v?: Value) => void;
  _handleNoTriggerOpAnimUpdates: (a?: boolean) => void;

  setAnimated: (a?: boolean) => void;
  toggleAnim: () => void;
  getType: () => Port<Value>["type"];
  isLinked: () => boolean;
  isBoundToVar: () => boolean;
  isAnimated: () => boolean;
  isHidden: () => boolean | undefined;

  getUiActiveState: () => Port<Value>["_uiActiveState"];
  setUiActiveState: (onoff: Port<Value>["_uiActiveState"]) => void;

  portTypeNumberToString: (
    type: PortType,
  ) => "value" | "function" | "object" | "array" | "string" | "dynamic";
}
