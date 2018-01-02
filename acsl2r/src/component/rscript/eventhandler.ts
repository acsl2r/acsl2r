import { template as loTemplate } from 'lodash';
import { IExpression, ISection } from '../../interface';
import { IIntegAssignment } from './derivative';
import AcslProgram from '../acslscript/acslprogram';
import InfixExpression from '../acslscript/infixexpression';
import AddSubExpression from '../acslscript/addsubexpression';
import IdExpression from '../acslscript/idexpression';
import TExpression from '../acslscript/texpression';
import DiscreteSection from '../acslscript/discretesection';
import FnExpression from '../acslscript/fnexpression';
import MulDivExpression from '../acslscript/muldivexpression';
import FloatExpression from '../acslscript/floatexpression';
import SubExpression from '../acslscript/subexpression';
import { unitIndent, codeBlockToCode } from '../rscript/format';
import { replaceSymbol } from '../acslscript/objectmodel';

let eventHandlerSrc = require<string>("../../template/eventhandler.tmpl");
let tmplEventHandler = loTemplate(eventHandlerSrc);

export interface IIntegratorEventSchedule
{
  schedule: IExpression;
  times: IExpression[];
  tests: IExpression[];
  scheduledBy: IIntegratorEvent;
  eventScheduled: IIntegratorEvent;
}

export interface IIntegratorEvent
{
  name: string;
  schedules: IIntegratorEventSchedule[];
  interval: number;
  codeSource: ISection;
}

interface IDiscreteEvent
{
  discreteSection: DiscreteSection;
  integratorEvent: IIntegratorEvent;
}

export function processDiscreteSections(acslProgram: AcslProgram, messages: string[])
{
  // populate empty event data structures from DISCRETE sections
  let discreteEvents: IDiscreteEvent[] = acslProgram.dynamicSection.discreteSections.map(ds =>
  {
    let discreteSection = ds;
    let name = ds.name;
    let schedules = [];
    let interval = !!ds.intervalAssignment ? +ds.intervalAssignment.computation.toCode("R", 0) : null;
    if (Number.isNaN(interval))
    {
      messages.push("Failed to configure events for DISCRETE " + name + " -- needed numerical value for INTERVAL.")
      interval = null;
    }
    let codeSource = ds;
    let discreteEvent = { discreteSection, integratorEvent: { name, schedules, interval, codeSource } };
    return discreteEvent;
  });

  // for each SCHEDULE triggered from within a DISCRETE section, add an empty schedule data structure to the target event data structure
  discreteEvents.forEach(scheduledBy =>
  {
    scheduledBy.discreteSection.schedules.forEach(schedule =>
    {
      let name = schedule.lhs.toCode("R", 0);
      let eventScheduled = discreteEvents.find(de => de.integratorEvent.name.toLowerCase() == name.toLowerCase());
      if (null == eventScheduled)
      {
        messages.push("Unidentified DISCRETE scheduled: " + name);
        return;
      }
      let integratorEventSchedule: IIntegratorEventSchedule =
        {
          schedule: schedule.rhs,
          times: [],
          tests: [],
          scheduledBy: scheduledBy.integratorEvent,
          eventScheduled: eventScheduled.integratorEvent
        };
      eventScheduled.integratorEvent.schedules.push(integratorEventSchedule);
    });
  });

  let tStop = !!acslProgram.dynamicSection.tStop ? +acslProgram.dynamicSection.tStop.computation.toCode("R", 0) : 0;
  let cintervalName = !!acslProgram.dynamicSection.cinterval ? acslProgram.dynamicSection.cinterval.lvalue : null;
  let withInterval = discreteEvents.filter(de => !!de.integratorEvent.interval && de.integratorEvent.interval > 0);

  // for each DISCRETE section with an INTERVAL set, add a schedule data structure with time points up to stop time
  withInterval.forEach(de =>
  {
    let integratorEventSchedule: IIntegratorEventSchedule =
      {
        schedule: null,
        times: [],
        tests: [],
        scheduledBy: null,
        eventScheduled: de.integratorEvent
      };
    for (let t = 0; t < tStop; t += de.integratorEvent.interval)
    {
      integratorEventSchedule.times.push(new FloatExpression(t));
    }
    integratorEventSchedule.tests.push(intervalToTimePointTest(new FloatExpression(de.integratorEvent.interval), null, cintervalName));
    de.integratorEvent.schedules.push(integratorEventSchedule);
  });

  // for each DISCRETE section with an INTERVAL set, recurse into data structures and add time points to those items
  // with T in their SCHEDULE statements
  withInterval.forEach(wi =>
  {
    discreteEvents.forEach(de =>
    {
      if (wi == de) return;
      let triggerTimes = wi.integratorEvent.schedules[wi.integratorEvent.schedules.length - 1].times;
      let triggerOffset = null;
      configureTimesRec(
        de,
        wi,
        triggerTimes,
        triggerOffset,
        wi.discreteSection.intervalAssignment.computation,
        cintervalName, discreteEvents
      );
    });
  });

  let initialScheduleData = acslProgram.initialSection.schedules.map(
    s => ({ name: s.lhs.toCode("R", 0), time: s.rhs })
  );

  // add scheduling for each SCHEDULE set outside the DISCRETE sections
  discreteEvents.forEach(de =>
  {
    let scheduleData = initialScheduleData.filter(sd => sd.name.toLowerCase() == de.discreteSection.name.toLowerCase());

    scheduleData.forEach(sd =>
    {
      let integratorEventSchedule: IIntegratorEventSchedule = {
        schedule: sd.time,
        times: [],
        tests: [],
        scheduledBy: null,
        eventScheduled: de.integratorEvent
      };
      de.integratorEvent.schedules.push(integratorEventSchedule);
    });

    de.integratorEvent.schedules.forEach(s =>
    {
      if (0 < s.times.length) return;
      if (null == s.schedule) return;

      s.times.push(s.schedule);
      s.tests.push(scheduleToTComparison(s.schedule, cintervalName));
    });
  });

  // replace t in comparison rhs with zero
  discreteEvents.forEach(scheduledBy =>
  {
    scheduledBy.discreteSection.schedules.forEach(schedule =>
    {
      replaceSymbol(schedule.rhs, "t", new FloatExpression(0));
    });
  });

  let integratorEvents = discreteEvents.map(de => de.integratorEvent);
  return integratorEvents;
}

function configureTimesRec(
  toConfigure: IDiscreteEvent,
  trigger: IDiscreteEvent,
  triggerTimes: IExpression[],
  triggerOffset: IExpression,
  interval: IExpression,
  cintervalName: IExpression,
  discreteEvents: IDiscreteEvent[]
)
{
  toConfigure.integratorEvent.schedules.forEach(s =>
  {
    if (s.scheduledBy != trigger.integratorEvent) return;
    if (0 < s.times.length) return;
    if (!s.schedule.symbols.some(s => s instanceof TExpression)) return;

    triggerTimes.forEach(tt =>
    {
      let time = new AddSubExpression(tt, "+", s.schedule);
      s.times.push(time);
    });

    let offset = !!triggerOffset ? new AddSubExpression(triggerOffset, "+", s.schedule) : s.schedule;
    let timePointTest = intervalToTimePointTest(interval, offset, cintervalName);
    s.tests.push(timePointTest);

    discreteEvents.forEach(de =>
    {
      if (toConfigure == de) return;
      configureTimesRec(de, toConfigure, s.times, offset, interval, cintervalName, discreteEvents);
    });
  });
}

function intervalToTimePointTest(interval: IExpression, offset: IExpression, cintervalName: IExpression)
{
  // (t %% I) < (CINT / 2)
  // ((t - off) %% I) < (CINT / 2)
  let numerator: IExpression = new TExpression();
  if (!!offset)
  {
    if (!(offset instanceof SubExpression || offset instanceof IdExpression || offset instanceof FloatExpression))
    {
      offset = new SubExpression(offset);
    }
    numerator = new SubExpression(new AddSubExpression(numerator, "-", offset));
  }
  let moduloExpression: IExpression = new InfixExpression(numerator, "%%", interval);
  moduloExpression = new SubExpression(moduloExpression);
  let rhs: IExpression = new MulDivExpression(cintervalName, "/", new FloatExpression(2));
  rhs = new SubExpression(rhs);
  let test = new InfixExpression(moduloExpression, "__lt", rhs);
  return test;
}

function scheduleToTComparison(schedule: IExpression, cintervalName: IExpression)
{
  // abs(t - S) < (CINT / 2)
  if (!(schedule instanceof SubExpression || schedule instanceof IdExpression || schedule instanceof FloatExpression))
  {
    schedule = new SubExpression(schedule);
  }
  let tComparison: IExpression = new AddSubExpression(new TExpression(), "-", schedule);
  tComparison = new FnExpression(new IdExpression("abs"), [tComparison]);
  let rhs: IExpression = new MulDivExpression(cintervalName, "/", new FloatExpression(2));
  rhs = new SubExpression(rhs);
  tComparison = new InfixExpression(tComparison, "__lt", rhs);
  return tComparison;
}

export function generateEventHandlerRScript(integAssignments: IIntegAssignment[], integratorEvents: IIntegratorEvent[])
{
  let events = integratorEvents.map(ed =>
  {
    let test: string = null;
    if (0 < ed.schedules.length)
    {
      let scheduleTests = ed.schedules.map(s => s.tests.map(t => t.toCode("R", 0)));
      let tests = scheduleTests.map(st => st.join(" | "));
      test = tests.join(" | ");
    }

    if (null == test || 0 == test.trim().length)
    {
      test = "F";
    }

    let computationData =
      ed.codeSource.codeBlocks.map(c => codeBlockToCode(c, unitIndent + unitIndent + unitIndent, false));

    return { test, computationData };
  });

  let eventHandler = tmplEventHandler({
    integAssignments: integAssignments,
    events: events
  });

  return eventHandler;
}
