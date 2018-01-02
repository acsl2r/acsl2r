export function implementsProperty(obj: Object, name: string)
{
  if (null == obj) return false;
  let proto = Object.getPrototypeOf(obj);
  if (null == proto) return false; // obj===Object
  let desc = Object.getOwnPropertyDescriptor(proto, name);
  return !!desc || implementsProperty(proto, name);
}
