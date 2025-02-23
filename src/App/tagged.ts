declare const tags: unique symbol

type Tagged<BaseType, Tag extends PropertyKey> = BaseType & {
  [tags]: { [K in Tag]: true }
}

export type { Tagged }
