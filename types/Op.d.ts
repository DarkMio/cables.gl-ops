// might be bit too much?
type OpName = string & { __opNameBrand: never };
// these ones make certain sense
type OpShortName = string & { __opShortNameBrand: never };
type OpId = string & { __opIdBrand: never };

interface Op {
	id: OpId;
	_name: OpName;
	name: OpName;
	_objName: OpId;
	objName: OpId;
	// unclear if it's optional
	_shortOpName?: OpShortName;
	shortName?: OpShortName;
	enabled: boolean;
	uiAttribs: UiAttributes;
	patch: unknown; // is of Patch, PRs welcome
	// I'm guesstimating, haven't check these, might be completetly off the mark
	preservedPortTitles: { [k: PortId]: string };
	preservedPortValues: { [k: PortId]: PortValues };
	preservedPortLinks: { [k: PortId]: Op };
	// biome-ignore lint/suspicious/noExplicitAny: no clue, really
	shouldWork: Partial<Record<any, unknown>>;
	hasUiErrors: boolean;
	// I'm guessing here
	_uiErrors: Partial<Record<ErrorId, string>>;
	_hasAnimPort: boolean;

	clearUiAttrib: (name: keyof UiAttributes) => void;
	// calls `this.setUiError`
	checkMainloopExists: () => void;

	getTitle: () => Op["uiAttribs"]["title"] | Op["_name"] | Op["_shortOpName"];
	setTitle: (title: string) => void;
	// no clue
	setStorage: (newAttribs: unknown) => void;
	// storage version || 0
	isSubPatchOp: () => number;
	// deprecated: setUiAttribs: (newAttribs: Partial<UiAttributes>) => void;
	setUiError: (
		id: string,
		message: string | null,
		level?: "warning" | "error",
	) => void;
	getName: () => UiAttributes["name"] | Op["_name"];
	getPortVisibleIndex: <T>(p: Port<T>) => number | undefined;

	hasDynamicPort: () => boolean;

	// all these have multiple names, I've decided to just take the latest
	inTrigger: (name: string) => Port<void>;
	inTriggerButton: (name: string) => Port<void>;
	inUiTriggerButtons: (name: string) => Port<void>;
	inFloat: (name: string, v?: number) => Port<number>;
	// I'm not entirely sure, but the transport value seems to be 1 | 0
	inBool: (name: string, v?: boolean) => Port<1 | 0>;
	// untyped
	inMultiPort: (name: string, type: unknown) => MultiPort;
	inString: (name: string, v?: string) => Port<string>;
	/* create a String value input port displayed as TextArea */
	inValueText: (name: string, v?: number) => Port<string>;
	inTextArea: (name: string, v?: string) => Port<string>;
	// syntax?
	inStringEditor: (
		name: string,
		v: string | undefined,
		syntax: unknown,
		hideFormatButton?: boolean,
	) => Port<string>;
	inValueSelect: <T extends string[]>(
		name: string,
		values: T,
		v?: keyof T,
		noIndex?: boolean,
	) => Port<keyof T>;
	inSwitch: <T extends string[]>(
		name: string,
		values: T,
		v?: keyof T,
		noIndex?: boolean,
	) => Port<keyof T>;
	inValueInt: (name: string, v?: number) => Port<number>;
	inFile: (name: string, v?: string) => Port<string>;
	inUrl: (name: string, v?: string) => Port<string>;
	inTexture: (name: string, v?: Texture) => Port<Texture>;
	inObject: <T>(name: string, v?: T) => Port<T>;
	inGradient: (name: string, v?: number) => Port<number>;
	inArray: <T, TArray = Array<T>>(
		name: string,
		v?: TArray,
		stride?: number,
	) => Port<TArray>;
	inValueSlider: (
		name: string,
		v?: number,
		min?: number,
		max?: number,
	) => Port<number>;

	// same here, multiple names, just the latest ones
	outTrigger: (name: string) => Port<void>;
	outNumber: (name: string, defaultValue?: number) => Port<number>;
	outBool: (name: string, defaultValue?: boolean) => Port<boolean>;
	outBoolNum: (name: string, defaultValue?: boolean) => Port<0 | 1>;
	// untyped
	outMultiPort: (
		name: string,
		type: unknown,
		uiAttribsPort: unknown,
	) => MultiPort;
	outValueString: (name: string, defaultValue?: number) => Port<string>;
	outString: (name: string, defaultValue?: string) => Port<string>;
	outObject: <T>(name: string, defaultValue?: T, type?: string) => Port<T>;
	outArray: <T, TArray = Array<T>>(
		name: string,
		defaultValue?: TArray,
		stride?: number,
	) => Port<TArray>;
	outTexture: (name: string, defaultValue?: Texture) => Port<Texture>;

	removeLinks: () => void;
	getPort: (name: string, lowerCase?: boolean) => Port<unknown>;
	getPortById: (id: PortId) => Port<unknown>;
	updateAnims: () => void;
	error: (...args: Parameters<typeof console.error>) => void;
	logWarn: (...args: Parameters<typeof console.warn>) => void;
	logVerbose: (...args: Parameters<typeof console.debug>) => void;
	profile: () => void;
	findParent: () => Op | null;
	cleanUp: () => void;
	instanced: () => boolean;
	initInstancable: () => void;
	setValues: (props: Record<string, PortValues>) => void;
	hasUiError: (id: ErrorId) => void;
	setEnabled: (enabled: boolean) => void;
	setPortGroup: <T>(name: string, ports: Array<Port<T>>) => void;
	setUiAxisPorts: <X, Y, Z>(px: Port<X>, py: Port<Y>, pz: Port<Z>) => void;
	removePort: <T>(port: Port<T>) => void;
	toWorkNeedsParent: (parentOpName: OpName) => void;
	// not sure what type directly refers to
	toWorkShouldNotBeChild: (parentOpName: OpName, type?: unknown) => void;
	toWorkPortsNeedToBeLinked: () => void;
	toWorkPortsNeedToBeLinkedReset: () => void;
	initVarPorts: () => void;
	refreshParams: () => void;
	isCurrentUiOp: () => void;

	// seems to be a function?
	renderVizLayer: unknown;

	// seems to be a stripped object
	getSerialized: () => unknown;
	// that can be possibly figured out
	getFirstOutPortByType: () => Port<unknown>;
	getFirstInPortByType: () => Port<unknown>;
}
