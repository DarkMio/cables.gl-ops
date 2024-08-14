declare const op: Op;

interface UiAttributes {
  name: string;
  title: string;
  warning: string;
  error: string;
  extendTitle: string;
}

type Link = unknown;
type Texture = unknown;
type ErrorId = string & { __errorIdBrand: never };
