import { uniqueId as loUniqueId } from 'lodash';

class CSLFile
{
  constructor(private _file: File)
  {
    let promise = new Promise<string>((resolve, reject) =>
    {
      this._id = loUniqueId("csl-file-");

      let reader = new FileReader();
      reader.onload = (event) =>
      {
        resolve(reader.result);
      };
      reader.onerror = (event) =>
      {
        reject(event);
      };
      reader.readAsText(this._file);
    });
    this._script = promise;
  }

  get id(): string
  {
    return this._id;
  }

  get name(): string
  {
    return this._file.name;
  }

  get script(): Promise<string>
  {
    return this._script;
  }

  get rScriptName(): string
  {
    let name = this.name;
    if (name.toLowerCase().endsWith(".csl"))
    {
      name = name.substring(0, name.length - 4);
    }
    return name + ".R";
  }

  private _id: string;
  private _script: Promise<string>;
}

export default CSLFile;