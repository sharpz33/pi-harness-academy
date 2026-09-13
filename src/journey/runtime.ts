import { missions } from '../missions'
import { JourneyService } from './service'
import { D1JourneyStore } from './store'

export const createJourneyService = (bindings: CloudflareBindings): JourneyService =>
  new JourneyService(new D1JourneyStore(bindings.DB), missions)
