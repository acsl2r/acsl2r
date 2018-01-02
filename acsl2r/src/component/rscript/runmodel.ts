import { template as loTemplate } from 'lodash';
import { IIntegratorEvent } from './eventhandler';
import { IIntegAssignment } from './derivative';

let runModelSrc = require<string>("../../template/runmodel.tmpl");
let tmplRunModel = loTemplate(runModelSrc);

export function generateRunModelRScript(
  tStopParamName: string,
  cIntParamName: string,
  integAssignments: IIntegAssignment[],
  integratorEvents: IIntegratorEvent[]
)
{
  let eventTimes = null;
  if (0 < integratorEvents.length)
  {
    let times = new Set<string>();
    integratorEvents.forEach(ie => ie.schedules.forEach(s => s.times.forEach(t => times.add(t.toCode("R", 0)))));
    eventTimes = Array.from(times).join(", ");
  }

  let runModel = tmplRunModel({
    tStopParamName: tStopParamName,
    cIntParamName: cIntParamName,
    integAssignments: integAssignments,
    eventTimes: eventTimes
  });

  return runModel;
}
