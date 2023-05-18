declare type OnChangeProps<Elm = HTMLInputElement, ValueType = unknown> = {
  onChange: (e: React.ChangeEvent<Elm>) => void;
  value?: ValueType;
};

declare interface RenderFn<Args extends unknown[]> {
  (...args: Args): ReactNode;
}

declare interface VoidFn {
  (): void;
}
