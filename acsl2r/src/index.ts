/// <reference path="../typings/app.d.ts" />

import { assignIn as loAssignIn, template as loTemplate, zip as loZip, remove as loRemove } from 'lodash';
import * as FileSaver from 'file-saver';
import * as JSZip from 'jszip';
import * as PromiseWorker from 'promise-worker';

import CSLFile from './component/cslfile';
import { MessageType } from './enum';
import { IWorkerMessage, IParseACSLPayload } from './interface';
import { version } from './version';
import { handleError } from './component/error';

import '../style/index.css';

function downloadAll(selectedFiles: CSLFile[], scripts: string[])
{
  let items = loZip<CSLFile | string>(selectedFiles, scripts) as [CSLFile, string][];
  let zip = new JSZip();
  items.forEach(i => zip.file(i[0].rScriptName, i[1]));
  zip.generateAsync({ type: "blob" }).then((blob: Blob) => FileSaver.saveAs(blob, "acsl2r_all.zip"));
}

function populateConvertedFiles(selectedFiles: CSLFile[], rScripts: string[], tmplConvertedFile: _.TemplateExecutor)
{
  let items = loZip<CSLFile | string>(selectedFiles, rScripts) as [CSLFile, string][];
  let markups = items.map((i, index) => tmplConvertedFile({ id: i[0].id, index: index, fileName: i[0].rScriptName, code: i[1] }));
  $("#accConvertedFiles").html(markups.join(""));
}

function populateSelectedFiles(selectedFiles: CSLFile[], tmplSelectedFile: _.TemplateExecutor)
{
  let liMarkups = selectedFiles.map(f => tmplSelectedFile({ id: f.id, fileName: f.name }));
  $("#ulSelectedCSLFiles").html(liMarkups.join(""));
}

function resetFileInput($fileInput: JQuery)
{
  let $form = $fileInput.wrap('<form>').closest('form');
  let form = $form.get(0) as HTMLFormElement;
  form.reset();
  $fileInput.unwrap();
}

function processScripts(selectedFiles: CSLFile[], scripts: string[], configureForRVis: boolean)
{
  let items = loZip<CSLFile | string>(selectedFiles, scripts) as [CSLFile, string][];

  let promises: Promise<string>[] = items.map(i =>
  {
    let cslFile = i[0];
    let script = i[1];

    let payload: IParseACSLPayload = {
      fileName: cslFile.name,
      code: script,
      configureForRVis: configureForRVis
    };
    let message: IWorkerMessage = {
      type: MessageType.ParseACSL,
      payload: payload
    };

    let worker = new Worker('./dist/acsl2rworker.min.js');
    let promiseWorker = new PromiseWorker(worker);
    let promise = promiseWorker.postMessage(message);
    return promise;
  });

  return promises;
}

$(document).ready(() =>
{
  let selectedFiles: CSLFile[];
  let rScripts: string[];
  let tmplSelectedFile = loTemplate($("script.selected-csl-file").html());
  let tmplConvertedFile = loTemplate($("script.converted-csl-file").html());

  $("#btnDownloadAll").click(() =>
  {
    downloadAll(selectedFiles, rScripts);
  });

  $("#accConvertedFiles").on("click", "button", (event) =>
  {
    let $this = $(event.target);
    let $card = $this.closest("div.card");
    let cslFileId = $card.data("csl-file-id");
    let items = loZip<CSLFile | string>(selectedFiles, rScripts) as [CSLFile, string][];
    let selectedItem = items.find(i => i[0].id == cslFileId);
    let blob = new Blob([selectedItem[1]], { type: "text/plain;charset=utf-8" });
    FileSaver.saveAs(blob, selectedItem[0].rScriptName, true);
  });

  $("#btnConvert").click((event) =>
  {
    let $this = $(event.target);
    $this.prop("disabled", true);
    $("#imgConverting").show();

    let promises = selectedFiles.map(cf => cf.script);
    let configureForRVis = true;

    Promise.all(promises).then((scripts) =>
    {
      let promises = processScripts(selectedFiles, scripts, configureForRVis);
      Promise.all(promises).then((promised) =>
      {
        rScripts = promised;
        populateConvertedFiles(selectedFiles, rScripts, tmplConvertedFile);

        $("#dvReadMe").hide();
        $("#accConvertedFiles").show();
        $("#btnDownloadAll").toggle(selectedFiles.length > 1);
        $this.prop("disabled", false);
        $("#imgConverting").hide();
      }).catch((error: Error) =>
      {
        $this.prop("disabled", false);
        $("#imgConverting").hide();
        handleError(error);
      });
    }).catch((error: Error) =>
    {
      $this.prop("disabled", false);
      $("#imgConverting").hide();
      handleError(error);
    });;
  });

  $("#ulSelectedCSLFiles").on("click", "button", (event) =>
  {
    rScripts = null;
    $("#accConvertedFiles").empty();
    $("#btnDownloadAll").hide();

    let $btn = $(event.target);
    let $li = $btn.closest("li");
    let cslFileId = $li.data("csl-file-id");
    loRemove(selectedFiles, cf => cf.id == cslFileId);
    $li.remove();
    if (0 == selectedFiles.length)
    {
      $("#btnConvert").hide();
    }
  });

  $("#fiSelectCSLFiles").on('change', (event) =>
  {
    rScripts = null;
    $("#accConvertedFiles").empty();
    $("#btnDownloadAll").hide();

    let $this = $(event.target);
    let input = <any>$this.get(0) as HTMLInputElement;
    if (0 == input.files.length)
    {
      selectedFiles = null;
      $("#ulSelectedCSLFiles").empty();
      $("#btnConvert").hide();
      return;
    }

    let files = Array.apply(null, input.files) as File[];
    selectedFiles = files.map(f => new CSLFile(f));

    populateSelectedFiles(selectedFiles, tmplSelectedFile);
    $("#btnConvert").show();

    setTimeout(() => resetFileInput($this), 50);
  });

  $("#spnVersion").text("Ver " + version);

  //let code = $("script.csl-ex").html()
  //let configureForRVis = true;
  //let payload: IParseACSLPayload = {
  //  fileName: "ex.csl",
  //  code: code,
  //  configureForRVis: configureForRVis
  //};
  //let message: IWorkerMessage = {
  //  type: MessageType.ParseACSL,
  //  payload: payload
  //};

  //let worker = new Worker('./dist/acsl2rworker.min.js');
  //let promiseWorker = new PromiseWorker(worker);
  //promiseWorker.postMessage(message).then(function (response)
  //{
  //  $("#preR").text(response);
  //}).catch(function (error)
  //{
  //  handleError(error);
  //});
});

window.onerror = (message: string, filename?: string, lineno?: number, colno?: number, error?: Error) =>
{
  !!message && console.error("message: " + message);
  !!filename && console.error("file name: " + filename);
  !!lineno && console.error("line no.: " + lineno);
  !!colno && console.error("col no.: " + colno);
  !!error && console.error("error: " + error.toString());
  handleError(error || message);
};
